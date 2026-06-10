import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { repoPath } from '../lib/paths.js';

export type Status =
  | 'queued'
  | 'pr-opened'
  | 'skipped'
  | 'needs-human'
  | 'failed';

export interface LedgerRecord {
  id: string;          // owner/name OR owner/name#subpath (lowercased)
  repo: string;        // https://github.com/owner/name
  subpath?: string;    // when this record covers one subpath of a monorepo
  source?: string;     // which Source surfaced it
  status: Status;
  stage?: string;
  reason?: string;
  pr_url?: string;
  ts: string;          // ISO 8601
}

/** Compose the canonical ledger id for a repo (+ optional subpath). */
export function makeId(repoOrId: string, subpath?: string): string {
  // repoOrId can be "owner/name" or full URL
  const slug = repoOrId
    .replace(/^https?:\/\/github\.com\//, '')
    .replace(/\/$/, '')
    .toLowerCase();
  return subpath ? `${slug}#${subpath}` : slug;
}

const LEDGER_PATH = repoPath('tools/contrib-agent/.state/ledger.jsonl');

async function readAll(): Promise<LedgerRecord[]> {
  try {
    const raw = await fs.readFile(LEDGER_PATH, 'utf8');
    return raw
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as LedgerRecord);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw e;
  }
}

export async function append(rec: LedgerRecord): Promise<void> {
  await fs.mkdir(path.dirname(LEDGER_PATH), { recursive: true });
  await fs.appendFile(LEDGER_PATH, JSON.stringify(rec) + '\n', 'utf8');
}

/** Latest record per repo id ("latest write wins"). */
export async function latest(): Promise<Map<string, LedgerRecord>> {
  const all = await readAll();
  const m = new Map<string, LedgerRecord>();
  for (const r of all) m.set(r.id, r);
  return m;
}

export async function queued(limit: number): Promise<LedgerRecord[]> {
  const m = await latest();
  return [...m.values()].filter((r) => r.status === 'queued').slice(0, limit);
}
