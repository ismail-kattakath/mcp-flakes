import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { FlakeManifest } from '../agent/schema.js';
import type { DedupResult } from './dedup.js';

const execFileP = promisify(execFile);

export interface PrInput {
  manifest: FlakeManifest;
  flakeDir: string;
  smokeOutput?: string;
  needsHuman?: boolean;
  needsHumanReason?: string;
  /** Dedup classification of this candidate vs the existing flake (if any). */
  dedup?: DedupResult;
}

export interface PrResult {
  url: string;
  branch: string;
}

export async function openPr(input: PrInput): Promise<PrResult> {
  const branch = `agent/flake-${input.manifest.name}-${Date.now()}`;
  await git(['checkout', '-b', branch]);
  await git(['add', input.flakeDir]);
  const subject = renderSubject(input);
  await git(['commit', '-m', subject]);
  await git(['push', '-u', 'origin', branch]);

  const body = renderBody(input);
  const labels = renderLabels(input);

  const { stdout } = await execFileP('gh', [
    'pr',
    'create',
    '--title',
    subject,
    '--body',
    body,
    '--label',
    labels.join(','),
  ]);
  return { url: stdout.trim(), branch };
}

async function git(args: string[]): Promise<void> {
  await execFileP('git', args);
}

function renderSubject(input: PrInput): string {
  const name = input.manifest.name;
  const isUpgrade = input.dedup?.kind === 'upgrade';
  // needsHuman wins the suffix: a validate-failed upgrade still says needs-human.
  if (input.needsHuman) {
    return isUpgrade
      ? `agent: upgrade flake ${name} (needs-human)`
      : `agent: draft flake for ${name} (needs-human)`;
  }
  if (isUpgrade) {
    const eligible = (input.dedup as { auto_merge_eligible: boolean })
      .auto_merge_eligible;
    return eligible
      ? `agent: upgrade flake ${name} (auto-merge-eligible)`
      : `agent: upgrade flake ${name} (needs-human)`;
  }
  return `agent: add flake for ${name}`;
}

function renderLabels(input: PrInput): string[] {
  const labels = ['agent-generated'];
  const isUpgrade = input.dedup?.kind === 'upgrade';
  if (isUpgrade) {
    labels.push('upgrade');
    const eligible =
      !input.needsHuman &&
      (input.dedup as { auto_merge_eligible: boolean }).auto_merge_eligible;
    if (eligible) {
      labels.push('auto-merge-eligible');
    } else {
      labels.push('needs-human');
    }
    return labels;
  }
  if (input.needsHuman) labels.push('needs-human');
  return labels;
}

function renderBody(input: PrInput): string {
  const m = input.manifest;
  const toolsPreview = m.tools.slice(0, 10).join(', ');
  const toolsMore = m.tools.length > 10 ? `, … (${m.tools.length} total)` : '';
  const lines: string[] = [
    `## Agent-generated flake: \`${m.name}\``,
    '',
    `- **Upstream:** ${m.upstream.repo}`,
    `- **Commit:** \`${m.upstream.commit}\``,
    `- **License:** ${m.upstream.license}`,
    `- **Runner:** ${m.runner}`,
    `- **Transport:** ${m.transport}`,
    `- **Publish image:** ${m.publish_image}`,
    `- **Tools:** ${toolsPreview}${toolsMore}`,
  ];
  if (input.dedup) {
    lines.push('', '## Dedup classification', ...renderDedupBlock(input.dedup));
  }
  if (input.needsHuman) {
    lines.push(
      '',
      `## :warning: needs-human`,
      input.needsHumanReason ?? 'review required',
    );
  }
  if (input.smokeOutput) {
    lines.push('', '## Smoke test', '```', input.smokeOutput.slice(0, 4000), '```');
  }
  lines.push(
    '',
    '---',
    'Opened by `tools/contrib-agent`. Per repo policy, agent PRs do not auto-merge for new upstreams. Upgrade-only PRs (same `upstream.repo`, SHA bump, tools superset, license unchanged) may auto-merge as part of an upgrade-only release batch — see CLAUDE.md "Auto-merge carve-out".',
  );
  return lines.join('\n');
}

function renderDedupBlock(d: DedupResult): string[] {
  switch (d.kind) {
    case 'new':
      return ['- **kind:** new'];
    case 'identical':
      return [
        '- **kind:** identical',
        `- **existing_commit:** \`${d.existing_commit}\``,
      ];
    case 'upgrade':
      return [
        '- **kind:** upgrade',
        `- **existing_commit:** \`${d.existing_commit}\``,
        `- **tools_superset:** ${d.tools_superset}`,
        `- **license_unchanged:** ${d.license_unchanged}`,
        `- **auto_merge_eligible:** ${d.auto_merge_eligible}`,
      ];
    case 'conflict':
      return [
        '- **kind:** conflict',
        `- **reason:** ${d.reason}`,
        `- **existing_repo:** ${d.existing_repo}`,
        `- **candidate_repo:** ${d.candidate_repo}`,
      ];
  }
}
