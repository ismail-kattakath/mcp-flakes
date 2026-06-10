import { promises as fs } from 'node:fs';
import * as yaml from 'yaml';
import { repoPath } from '../lib/paths.js';

export interface DedupInput {
  name: string;
  upstream: {
    repo: string;
    commit: string;
    license: string;
  };
  tools?: string[];
}

export type DedupResult =
  | { kind: 'new' }
  | { kind: 'identical'; existing_commit: string }
  | {
      kind: 'upgrade';
      existing_commit: string;
      existing_license: string;
      tools_superset: boolean;
      license_unchanged: boolean;
      auto_merge_eligible: boolean;
    }
  | {
      kind: 'conflict';
      reason: string;
      existing_repo: string;
      candidate_repo: string;
    };

interface ExistingManifest {
  name?: string;
  upstream?: {
    repo?: string;
    commit?: string;
    license?: string;
  };
  tools?: string[];
}

/**
 * Compare a candidate flake against any existing `flakes/<name>/flake.yaml`.
 *
 * - No existing flake: 'new'.
 * - Same repo + same commit: 'identical' (skip; nothing to do).
 * - Same repo + different commit: 'upgrade'. Eligible for auto-merge ONLY when
 *   the candidate tools list is a superset of the existing one AND the license
 *   is unchanged.
 * - Different repo at the same flake name: 'conflict' (needs human triage).
 *
 * When `tools` is omitted (pre-synthesis pass), upgrade is reported with
 * `auto_merge_eligible: false` and `tools_superset: false`. The post-synth
 * call re-runs with the resolved tools list to produce the real verdict.
 */
export async function dedup(input: DedupInput): Promise<DedupResult> {
  const manifestPath = repoPath('flakes', input.name, 'flake.yaml');
  let raw: string;
  try {
    raw = await fs.readFile(manifestPath, 'utf8');
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      return { kind: 'new' };
    }
    throw e;
  }

  const existing = yaml.parse(raw) as ExistingManifest;
  const existingRepo = normalizeRepo(existing.upstream?.repo ?? '');
  const candidateRepo = normalizeRepo(input.upstream.repo);

  if (!existingRepo) {
    return {
      kind: 'conflict',
      reason: 'existing manifest missing upstream.repo',
      existing_repo: existing.upstream?.repo ?? '',
      candidate_repo: input.upstream.repo,
    };
  }

  if (existingRepo !== candidateRepo) {
    return {
      kind: 'conflict',
      reason: `flake name "${input.name}" already maps to a different upstream`,
      existing_repo: existing.upstream?.repo ?? '',
      candidate_repo: input.upstream.repo,
    };
  }

  const existingCommit = existing.upstream?.commit ?? '';
  if (existingCommit && existingCommit === input.upstream.commit) {
    return { kind: 'identical', existing_commit: existingCommit };
  }

  const existingLicense = existing.upstream?.license ?? '';
  const licenseUnchanged = existingLicense === input.upstream.license;
  const existingTools = existing.tools ?? [];
  const toolsSuperset =
    input.tools !== undefined && isSuperset(input.tools, existingTools);
  const autoMergeEligible = toolsSuperset && licenseUnchanged;

  return {
    kind: 'upgrade',
    existing_commit: existingCommit,
    existing_license: existingLicense,
    tools_superset: toolsSuperset,
    license_unchanged: licenseUnchanged,
    auto_merge_eligible: autoMergeEligible,
  };
}

function normalizeRepo(repo: string): string {
  return repo
    .replace(/^https?:\/\//, '')
    .replace(/^github\.com\//, '')
    .replace(/\.git$/, '')
    .replace(/\/$/, '')
    .toLowerCase();
}

function isSuperset(candidate: string[], existing: string[]): boolean {
  const set = new Set(candidate);
  for (const t of existing) {
    if (!set.has(t)) return false;
  }
  return true;
}
