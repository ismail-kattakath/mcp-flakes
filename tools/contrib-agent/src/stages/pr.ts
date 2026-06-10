import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { FlakeManifest } from '../agent/schema.js';

const execFileP = promisify(execFile);

export interface PrInput {
  manifest: FlakeManifest;
  flakeDir: string;
  smokeOutput?: string;
  needsHuman?: boolean;
  needsHumanReason?: string;
}

export interface PrResult {
  url: string;
  branch: string;
}

export async function openPr(input: PrInput): Promise<PrResult> {
  const branch = `agent/flake-${input.manifest.name}-${Date.now()}`;
  await git(['checkout', '-b', branch]);
  await git(['add', input.flakeDir]);
  const subject = input.needsHuman
    ? `agent: draft flake for ${input.manifest.name} (needs-human)`
    : `agent: add flake for ${input.manifest.name}`;
  await git(['commit', '-m', subject]);
  await git(['push', '-u', 'origin', branch]);

  const body = renderBody(input);
  const labels = ['agent-generated'];
  if (input.needsHuman) labels.push('needs-human');

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
