import * as yaml from 'yaml';
import { filter } from './stages/filter.js';
import { triage } from './stages/triage.js';
import { synthesize, cleanupWorkdir } from './stages/synthesize.js';
import { validate } from './stages/validate.js';
import { openPr } from './stages/pr.js';
import { expand } from './stages/expand.js';
import { append, makeId, type LedgerRecord, type Status } from './state/ledger.js';
import { log } from './lib/log.js';

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

    const v = await validate(s.manifest, { skipSmoke: SKIP_SMOKE });
    const needsHuman = !v.ok;
    const needsHumanReason = needsHuman
      ? `validate failed at ${v.stage}: ${(v.errors ?? []).join('; ')}`
      : undefined;

    let pr_url: string | undefined;
    try {
      const pr = await openPr({
        manifest: s.manifest,
        flakeDir: v.flakeDir,
        smokeOutput: v.smokeOutput,
        needsHuman,
        needsHumanReason,
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
