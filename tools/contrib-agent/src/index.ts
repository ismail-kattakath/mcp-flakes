#!/usr/bin/env node
import 'dotenv/config';
import { discover } from './stages/discover.js';
import { runPipeline } from './pipeline.js';
import { latest, queued } from './state/ledger.js';
import { log } from './lib/log.js';
import { parseGithubRepo } from './sources/index.js';

interface ProcessArgs {
  limit: number;
  repo?: string;
  dryRun: boolean;
  skipFilter: boolean;
}

async function main(): Promise<void> {
  const [verb, ...rest] = process.argv.slice(2);
  switch (verb) {
    case 'discover':
      await cmdDiscover();
      return;
    case 'process':
      await cmdProcess(parseProcessArgs(rest));
      return;
    case 'status':
      await cmdStatus();
      return;
    default:
      console.error(
        'Usage:\n' +
          '  contrib-agent discover\n' +
          '  contrib-agent process [--limit N] [--repo URL] [--dry-run]\n' +
          '  contrib-agent status',
      );
      process.exit(1);
  }
}

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
  console.log(
    JSON.stringify(
      { total: m.size, by_status: counts },
      null,
      2,
    ),
  );
}

function parseProcessArgs(args: string[]): ProcessArgs {
  let limit = 10;
  let repo: string | undefined;
  let dryRun = false;
  let skipFilter = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--limit') limit = parseInt(args[++i] ?? '10', 10);
    else if (a === '--repo') repo = args[++i];
    else if (a === '--dry-run') dryRun = true;
    else if (a === '--skip-filter') skipFilter = true;
  }
  return { limit, repo, dryRun, skipFilter };
}

main().catch((e) => {
  log.error('fatal', { error: (e as Error).message, stack: (e as Error).stack });
  process.exit(1);
});
