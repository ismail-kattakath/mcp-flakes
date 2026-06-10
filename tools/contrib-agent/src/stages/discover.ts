import { awesomeMcp } from '../sources/awesome-mcp.js';
import type { Source } from '../sources/index.js';
import { append, latest } from '../state/ledger.js';
import { log } from '../lib/log.js';

const SOURCES: Source[] = [awesomeMcp];

export interface DiscoverResult {
  added: number;
  total: number;
}

export async function discover(): Promise<DiscoverResult> {
  const known = await latest();
  let added = 0;
  const ts = new Date().toISOString();
  for (const src of SOURCES) {
    let candidates;
    try {
      candidates = await src.fetch();
    } catch (e) {
      log.warn('source.fetch_failed', {
        source: src.name,
        error: (e as Error).message,
      });
      continue;
    }
    log.info('source.fetched', { source: src.name, count: candidates.length });
    for (const c of candidates) {
      if (known.has(c.id)) continue;
      await append({
        id: c.id,
        repo: c.repo,
        source: c.source,
        status: 'queued',
        ts,
      });
      known.set(c.id, {
        id: c.id,
        repo: c.repo,
        source: c.source,
        status: 'queued',
        ts,
      });
      added++;
    }
  }
  return { added, total: known.size };
}
