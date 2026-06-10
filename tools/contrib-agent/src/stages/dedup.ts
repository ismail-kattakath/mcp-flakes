import { promises as fs } from 'node:fs';
import * as yaml from 'yaml';
import { repoPath } from '../lib/paths.js';

/**
 * Dedup classifies a candidate against the existing flakes/<name>/ folder.
 *
 * The four kinds gate the release pipeline:
 *  - `new`        — no existing flake. Normal PR; human merge required.
 *  - `identical`  — same upstream + same SHA. Skip; nothing to do.
 *  - `upgrade`    — same upstream, new SHA. May be auto-merge-eligible when
 *                   tools form a non-strict superset and license is unchanged.
 *                   This is the ONLY classification that unlocks auto-merge.
 *  - `conflict`   — flake name exists but points at a different upstream repo.
 *                   Hard-stop; needs a human to rename or reject.
 *
 * Designed to be called either pre-synth (with a minimal candidate) for cheap
 * skipping of identical SHAs, or post-synth (with full manifest) for the
 * auto-merge eligibility decision.
 */

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

export interface DedupInput {
  name: string;
  upstream: {
    repo: string;
    commit: string;
    license: string;
  };
  /**
   * Optional. When omitted, an `upgrade` classification will set
   * `tools_superset: false` and therefore `auto_merge_eligible: false` —
   * conservative by design, so pre-synth callers never accidentally trigger
   * auto-merge.
   */
  tools?: string[];
}

interface ExistingManifest {
  upstream: {
    repo: string;
    commit: string;
    license: string;
  };
  tools?: string[];
}

export async function dedup(candidate: DedupInput): Promise<DedupResult> {
  const existingPath = repoPath('flakes', candidate.name, 'flake.yaml');
  let existing: ExistingManifest;
  try {
    const raw = await fs.readFile(existingPath, 'utf8');
    existing = yaml.parse(raw) as ExistingManifest;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return { kind: 'new' };
    throw e;
  }

  const existingRepo = normalizeRepo(existing.upstream.repo);
  const candidateRepo = normalizeRepo(candidate.upstream.repo);
  if (existingRepo !== candidateRepo) {
    return {
      kind: 'conflict',
      reason: 'flake name collision with different upstream repo',
      existing_repo: existing.upstream.repo,
      candidate_repo: candidate.upstream.repo,
    };
  }

  if (existing.upstream.commit === candidate.upstream.commit) {
    return { kind: 'identical', existing_commit: existing.upstream.commit };
  }

  const existingTools = existing.tools ?? [];
  const candidateTools = candidate.tools;
  const candidateToolSet = new Set(candidateTools ?? []);
  // Superset check: every previously-shipped tool must still be present.
  // If the candidate omitted tools (pre-synth call), refuse the superset
  // claim — we don't have evidence either way.
  const tools_superset =
    candidateTools !== undefined &&
    existingTools.length > 0 &&
    existingTools.every((t) => candidateToolSet.has(t));
  const license_unchanged =
    existing.upstream.license === candidate.upstream.license;
  const auto_merge_eligible = tools_superset && license_unchanged;

  return {
    kind: 'upgrade',
    existing_commit: existing.upstream.commit,
    existing_license: existing.upstream.license,
    tools_superset,
    license_unchanged,
    auto_merge_eligible,
  };
}

function normalizeRepo(url: string): string {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/\.git$/, '')
    .replace(/\/$/, '')
    .toLowerCase();
}
