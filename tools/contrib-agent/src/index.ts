#!/usr/bin/env node
import 'dotenv/config';
import { discover } from './stages/discover.js';
import { filter } from './stages/filter.js';
import { expand } from './stages/expand.js';
import { triage } from './stages/triage.js';
import { synthesize, cleanupWorkdir } from './stages/synthesize.js';
import { validate } from './stages/validate.js';
import { openPr } from './stages/pr.js';
import { dedup, type DedupInput } from './stages/dedup.js';
import { runPipeline } from './pipeline.js';
import { latest, queued } from './state/ledger.js';
import { log } from './lib/log.js';
import { readStdinJson, writeStdoutJson } from './lib/io.js';
import { parseGithubRepo } from './sources/index.js';
import { FlakeManifest } from './agent/schema.js';

interface ProcessArgs {
  limit: number;
  repo?: string;
  dryRun: boolean;
  noPr: boolean;
  skipFilter: boolean;
}

async function main(): Promise<void> {
  const [verb, ...rest] = process.argv.slice(2);
  switch (verb) {
    // Orchestrator commands — used for local iteration / dev runs.
    case 'discover':
      await cmdDiscover();
      return;
    case 'process':
      await cmdProcess(parseProcessArgs(rest));
      return;
    case 'status':
      await cmdStatus();
      return;

    // Per-stage subcommands — each reads JSON on stdin, writes one JSON line
    // to stdout. Workflow steps chain them via redirection or pipes.
    case 'filter':
      await cmdFilter();
      return;
    case 'expand':
      await cmdExpand();
      return;
    case 'dedup':
      await cmdDedup();
      return;
    case 'triage':
      await cmdTriage();
      return;
    case 'synthesize':
      await cmdSynthesize();
      return;
    case 'validate':
      await cmdValidate();
      return;
    case 'pr':
      await cmdPr();
      return;
    case 'cleanup':
      await cmdCleanup();
      return;

    default:
      console.error(
        'Usage:\n' +
          '  contrib-agent discover\n' +
          '  contrib-agent process [--limit N] [--repo URL] [--dry-run] [--no-pr] [--skip-filter]\n' +
          '  contrib-agent status\n' +
          '\n' +
          'Per-stage (stdin: JSON, stdout: JSON):\n' +
          '  contrib-agent filter      < {"repo":"https://github.com/owner/name","subpath":"src/foo"}\n' +
          '  contrib-agent expand      < {"repo":"https://github.com/owner/name","branch":"main"}\n' +
          '  contrib-agent dedup       < {"name":"foo","upstream":{"repo":"...","commit":"...","license":"MIT"},"tools":["..."]}\n' +
          '  contrib-agent triage      < {"repo":"https://github.com/owner/name"}\n' +
          '  contrib-agent synthesize  < {"repo":"https://github.com/owner/name","subpath":"src/foo"}\n' +
          '  contrib-agent validate    < {"manifest":{...},"skipSmoke":true}\n' +
          '  contrib-agent pr          < {"manifest":{...},"flakeDir":"flakes/foo","smokeOutput":"...","needsHuman":false}\n' +
          '  contrib-agent cleanup     < {"workdir":"/tmp/contrib-agent-XXX"}\n',
      );
      process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Orchestrator commands
// ---------------------------------------------------------------------------

async function cmdDiscover(): Promise<void> {
  const r = await discover();
  log.info('discover.done', r);
}

async function cmdProcess(args: ProcessArgs): Promise<void> {
  if (args.repo) {
    const parsed = parseGithubRepo(args.repo);
    if (!parsed) {
      log.error('process.bad_repo', { repo: args.repo });
      process.exit(1);
    }
    log.info('process.start', { mode: 'direct', repo: parsed.repo, dryRun: args.dryRun });
    try {
      const outcome = await runPipeline(parsed.repo, parsed.id, {
        dryRun: args.dryRun,
        noPr: args.noPr,
        skipFilter: args.skipFilter,
        subpath: parsed.subpath,
      });
      log.info('process.item', {
        repo: parsed.repo,
        subpath: parsed.subpath,
        outcome,
      });
    } catch (e) {
      log.error('process.item.error', {
        repo: parsed.repo,
        error: (e as Error).message,
      });
      process.exit(1);
    }
    return;
  }
  const items = await queued(args.limit);
  log.info('process.start', {
    mode: 'queue',
    count: items.length,
    limit: args.limit,
    dryRun: args.dryRun,
  });
  for (const item of items) {
    try {
      const outcome = await runPipeline(item.repo, item.id, {
        dryRun: args.dryRun,
        noPr: args.noPr,
        skipFilter: args.skipFilter,
        subpath: item.subpath,
      });
      log.info('process.item', {
        repo: item.repo,
        subpath: item.subpath,
        outcome,
      });
    } catch (e) {
      log.error('process.item.error', {
        repo: item.repo,
        error: (e as Error).message,
      });
    }
  }
}

async function cmdStatus(): Promise<void> {
  const m = await latest();
  const counts: Record<string, number> = {};
  for (const r of m.values()) {
    counts[r.status] = (counts[r.status] ?? 0) + 1;
  }
  // status writes its payload to stdout for piping / scripting.
  writeStdoutJson({ total: m.size, by_status: counts });
}

// ---------------------------------------------------------------------------
// Per-stage subcommands
// ---------------------------------------------------------------------------

async function cmdFilter(): Promise<void> {
  const input = await readStdinJson<{ repo: string; subpath?: string }>();
  requireString(input.repo, 'repo');
  const r = await filter(input.repo, input.subpath);
  writeStdoutJson(r);
}

async function cmdExpand(): Promise<void> {
  const input = await readStdinJson<{ repo: string; branch?: string }>();
  requireString(input.repo, 'repo');
  const r = await expand(input.repo, input.branch);
  writeStdoutJson(r);
}

async function cmdDedup(): Promise<void> {
  const input = await readStdinJson<DedupInput>();
  requireString(input.name, 'name');
  requireString(input.upstream?.repo, 'upstream.repo');
  requireString(input.upstream?.commit, 'upstream.commit');
  requireString(input.upstream?.license, 'upstream.license');
  const r = await dedup(input);
  writeStdoutJson(r);
}

async function cmdTriage(): Promise<void> {
  const input = await readStdinJson<{ repo: string }>();
  requireString(input.repo, 'repo');
  const r = await triage(input.repo);
  writeStdoutJson(r);
}

async function cmdSynthesize(): Promise<void> {
  const input = await readStdinJson<{ repo: string; subpath?: string }>();
  requireString(input.repo, 'repo');
  const r = await synthesize(input.repo, input.subpath);
  // Caller is responsible for `cleanup` of r.workdir. We don't auto-clean
  // because validate/pr might still need the working tree later.
  writeStdoutJson(r);
}

async function cmdValidate(): Promise<void> {
  const input = await readStdinJson<{ manifest: unknown; skipSmoke?: boolean }>();
  const parsed = FlakeManifest.safeParse(input.manifest);
  if (!parsed.success) {
    throw new Error(
      `validate: input.manifest failed schema — ${parsed.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ')}`,
    );
  }
  const r = await validate(parsed.data, { skipSmoke: !!input.skipSmoke });
  writeStdoutJson(r);
}

async function cmdPr(): Promise<void> {
  const input = await readStdinJson<{
    manifest: unknown;
    flakeDir: string;
    smokeOutput?: string;
    needsHuman?: boolean;
    needsHumanReason?: string;
  }>();
  const parsed = FlakeManifest.safeParse(input.manifest);
  if (!parsed.success) {
    throw new Error(
      `pr: input.manifest failed schema — ${parsed.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ')}`,
    );
  }
  requireString(input.flakeDir, 'flakeDir');
  const r = await openPr({
    manifest: parsed.data,
    flakeDir: input.flakeDir,
    smokeOutput: input.smokeOutput,
    needsHuman: input.needsHuman,
    needsHumanReason: input.needsHumanReason,
  });
  writeStdoutJson(r);
}

async function cmdCleanup(): Promise<void> {
  const input = await readStdinJson<{ workdir: string }>();
  requireString(input.workdir, 'workdir');
  // Defensive: only remove paths that look like our tmp workdirs. Prevents
  // a hand-crafted JSON from blowing away an unrelated directory if this
  // ever runs with elevated permissions.
  if (!/contrib-agent-/.test(input.workdir)) {
    throw new Error(
      `cleanup: refusing to remove ${input.workdir} — does not look like a contrib-agent workdir`,
    );
  }
  await cleanupWorkdir(input.workdir);
  writeStdoutJson({ ok: true, removed: input.workdir });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function requireString(value: unknown, name: string): asserts value is string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`missing or empty input field: ${name}`);
  }
}

function parseProcessArgs(args: string[]): ProcessArgs {
  let limit = 10;
  let repo: string | undefined;
  let dryRun = false;
  let noPr = false;
  let skipFilter = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--limit') limit = parseInt(args[++i] ?? '10', 10);
    else if (a === '--repo') repo = args[++i];
    else if (a === '--dry-run') dryRun = true;
    else if (a === '--no-pr') noPr = true;
    else if (a === '--skip-filter') skipFilter = true;
  }
  return { limit, repo, dryRun, noPr, skipFilter };
}

main().catch((e) => {
  log.error('fatal', { error: (e as Error).message, stack: (e as Error).stack });
  process.exit(1);
});
