import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as yaml from 'yaml';
import { filter, type FilterResult } from './stages/filter.js';
import { triage } from './stages/triage.js';
import { synthesize, cleanupWorkdir } from './stages/synthesize.js';
import { validate } from './stages/validate.js';
import { openPr } from './stages/pr.js';
import { expand } from './stages/expand.js';
import { dedup, type DedupResult } from './stages/dedup.js';
import { append, makeId, type LedgerRecord, type Status } from './state/ledger.js';
import { log } from './lib/log.js';

const execFileP = promisify(execFile);

export type Outcome =
  | { kind: 'pr-opened'; url: string }
  | { kind: 'dry-run'; tokensUsed: number }
  | { kind: 'skipped'; reason: string }
  | { kind: 'needs-human'; reason: string; pr_url?: string }
  | { kind: 'failed'; stage: string; error: string }
  | { kind: 'expanded'; subpaths: string[] };

export interface PipelineOpts {
  /** Skip validate + pr; print manifest YAML to stdout. Cost-only path: synthesize. */
  dryRun?: boolean;
  /** Run synthesize + validate but skip pr (no branch/commit/push). For local iteration. */
  noPr?: boolean;
  /** Bypass pre-LLM filter. Useful for testing the agent against known-skip URLs. */
  skipFilter?: boolean;
  /** Subpath inside the repo when this candidate covers one server of a monorepo. */
  subpath?: string;
}

const SKIP_SMOKE = process.env.CONTRIB_AGENT_SKIP_SMOKE === '1';

export async function runPipeline(
  repo: string,
  id: string,
  opts: PipelineOpts = {},
): Promise<Outcome> {
  log.info('pipeline.start', {
    repo,
    subpath: opts.subpath,
    skipFilter: !!opts.skipFilter,
  });

  let filterResult: FilterResult | undefined;
  if (!opts.skipFilter) {
    const f = await filter(repo, opts.subpath);
    if (!f.pass) {
      await write(id, repo, {
        status: 'skipped',
        reason: f.reason,
        subpath: opts.subpath,
      });
      return { kind: 'skipped', reason: f.reason ?? 'filter' };
    }
    filterResult = f;
  }

  // Monorepo expansion: only run when we haven't already been scoped to a
  // subpath. Re-enqueues children and bails — children will be picked up by
  // a subsequent `process` invocation.
  if (!opts.subpath) {
    const exp = await expand(repo);
    if (exp.kind === 'monorepo') {
      const ts = new Date().toISOString();
      for (const sp of exp.subpaths) {
        const childId = makeId(repo, sp);
        await append({
          id: childId,
          repo,
          subpath: sp,
          source: 'expanded',
          status: 'queued',
          ts,
        });
      }
      await write(id, repo, {
        status: 'skipped',
        reason: `expanded into ${exp.subpaths.length} subpath candidates`,
      });
      log.info('pipeline.expanded', { repo, count: exp.subpaths.length });
      return { kind: 'expanded', subpaths: exp.subpaths };
    }
  }

  // Pre-synth dedup: short-circuit identical/conflict BEFORE paying ~50k
  // synthesis tokens. Only runs when we have a filter result (need license)
  // and the candidate is concretely scoped (subpath set, or expand returned
  // 'single' just above). The post-synth call replaces the conservative
  // auto_merge_eligible=false with the real verdict once tools are known.
  let dedupPre: DedupResult | undefined;
  if (filterResult) {
    const preName = flakeNameFor(repo, opts.subpath);
    try {
      const commit = await resolveCommit(repo, filterResult.default_branch);
      dedupPre = await dedup({
        name: preName,
        upstream: {
          repo,
          commit,
          license: filterResult.license!,
        },
        // tools omitted — pre-synth. auto_merge_eligible will be false on
        // upgrade until the post-synth call.
      });
    } catch (e) {
      log.warn('pipeline.dedup_pre_failed', {
        repo,
        error: (e as Error).message,
      });
    }

    if (dedupPre?.kind === 'identical') {
      const shortSha = dedupPre.existing_commit.slice(0, 7);
      await write(id, repo, {
        status: 'skipped',
        reason: `identical-sha:${shortSha}`,
        subpath: opts.subpath,
      });
      return { kind: 'skipped', reason: 'identical-sha' };
    }
    if (dedupPre?.kind === 'conflict') {
      await write(id, repo, {
        status: 'needs-human',
        stage: 'dedup',
        reason: dedupPre.reason,
        subpath: opts.subpath,
      });
      return { kind: 'needs-human', reason: dedupPre.reason };
    }
  }

  const t = await triage(repo);
  if (!t.pass) {
    await write(id, repo, {
      status: 'skipped',
      reason: t.reason,
      subpath: opts.subpath,
    });
    return { kind: 'skipped', reason: t.reason ?? 'triage' };
  }

  const s = await synthesize(repo, opts.subpath);
  try {
    if (!s.ok || !s.manifest) {
      await write(id, repo, {
        status: 'needs-human',
        stage: 'synthesize',
        reason: s.error ?? 'no-manifest',
      });
      return { kind: 'needs-human', reason: s.error ?? 'no-manifest' };
    }

    if (opts.dryRun) {
      const label = opts.subpath ? `${repo}#${opts.subpath}` : repo;
      process.stdout.write(
        `\n--- generated flake.yaml for ${label} ---\n` +
          yaml.stringify(s.manifest) +
          `--- tokens used: ${s.tokensUsed} ---\n\n`,
      );
      return { kind: 'dry-run', tokensUsed: s.tokensUsed };
    }

    // Post-synth dedup: re-run with the resolved tools list to compute the
    // real auto_merge_eligible. A conflict at this point means the agent
    // picked a name colliding with a different upstream — rare; treat as
    // needs-human and do NOT auto-merge.
    let dedupPost: DedupResult | undefined;
    try {
      dedupPost = await dedup({
        name: s.manifest.name,
        upstream: s.manifest.upstream,
        tools: s.manifest.tools,
      });
    } catch (e) {
      log.warn('pipeline.dedup_post_failed', {
        name: s.manifest.name,
        error: (e as Error).message,
      });
    }

    let conflictNeedsHuman = false;
    let conflictReason: string | undefined;
    if (dedupPost?.kind === 'conflict') {
      log.warn('pipeline.dedup_post_conflict', {
        name: s.manifest.name,
        reason: dedupPost.reason,
      });
      conflictNeedsHuman = true;
      conflictReason = `dedup conflict: ${dedupPost.reason}`;
    }

    const v = await validate(s.manifest, { skipSmoke: SKIP_SMOKE });
    const validateFailed = !v.ok;
    const needsHuman = validateFailed || conflictNeedsHuman;
    const needsHumanReason = validateFailed
      ? `validate failed at ${v.stage}: ${(v.errors ?? []).join('; ')}`
      : conflictReason;

    if (opts.noPr) {
      log.info('pipeline.no_pr', {
        flakeDir: v.flakeDir,
        validateOk: v.ok,
        stage: v.stage,
      });
      return needsHuman
        ? { kind: 'needs-human', reason: needsHumanReason ?? 'validate failed' }
        : { kind: 'dry-run', tokensUsed: s.tokensUsed };
    }

    let pr_url: string | undefined;
    try {
      const pr = await openPr({
        manifest: s.manifest,
        flakeDir: v.flakeDir,
        smokeOutput: v.smokeOutput,
        needsHuman,
        needsHumanReason,
        dedup: dedupPost,
      });
      pr_url = pr.url;
    } catch (e) {
      await write(id, repo, {
        status: 'failed',
        stage: 'pr',
        reason: (e as Error).message,
      });
      return { kind: 'failed', stage: 'pr', error: (e as Error).message };
    }

    await write(id, repo, {
      status: needsHuman ? 'needs-human' : 'pr-opened',
      reason: needsHumanReason,
      pr_url,
    });
    return needsHuman
      ? {
          kind: 'needs-human',
          reason: needsHumanReason ?? 'unknown',
          pr_url,
        }
      : { kind: 'pr-opened', url: pr_url! };
  } finally {
    await cleanupWorkdir(s.workdir).catch(() => undefined);
  }
}

/**
 * Compute the flake name the way filter.ts used to: subpath leaf if scoped to
 * one server of a monorepo, otherwise the repo's name segment. Lowercased.
 */
function flakeNameFor(repo: string, subpath?: string): string {
  const slug = repo.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
  const [, name] = slug.split('/');
  return (subpath ? subpath.split('/').pop()! : name).toLowerCase();
}

/** Resolve the HEAD commit SHA of `branch` via gh api. */
async function resolveCommit(repo: string, branch?: string): Promise<string> {
  const slug = repo.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
  const ref = branch ?? 'HEAD';
  const { stdout } = await execFileP('gh', [
    'api',
    `repos/${slug}/commits/${ref}`,
    '--jq',
    '.sha',
  ]);
  return stdout.trim();
}

async function write(
  id: string,
  repo: string,
  patch: Partial<LedgerRecord> & { status: Status },
): Promise<void> {
  await append({
    id,
    repo,
    ts: new Date().toISOString(),
    ...patch,
  } as LedgerRecord);
}
