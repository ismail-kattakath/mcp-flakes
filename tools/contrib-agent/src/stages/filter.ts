import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);

export interface FilterResult {
  pass: boolean;
  reason?: string;
  license?: string;
  description?: string;
  stars?: number;
  default_branch?: string;
}

/**
 * Pre-LLM gate. Cheap rejections only — no agent involvement.
 * - Rejects if the GitHub URL can't be parsed into owner/name.
 * - Rejects if the repo is archived or has no SPDX-detected license.
 * - Records license/description/stars/branch for downstream stages.
 *
 * Existing-flake detection lives in the dedup stage now (see stages/dedup.ts).
 */
export async function filter(
  repo: string,
  _subpath?: string,
): Promise<FilterResult> {
  const slug = repo.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
  const [, name] = slug.split('/');
  if (!name) return { pass: false, reason: 'unparseable-url' };

  let meta: {
    description: string | null;
    stargazers_count: number;
    archived: boolean;
    license: { spdx_id: string | null } | null;
    default_branch: string;
  };
  try {
    const { stdout } = await execFileP('gh', [
      'api',
      `repos/${slug}`,
      '--jq',
      '{description, stargazers_count, archived, license, default_branch}',
    ]);
    meta = JSON.parse(stdout);
  } catch {
    return { pass: false, reason: 'repo-not-accessible' };
  }

  if (meta.archived) return { pass: false, reason: 'archived' };
  const spdx = meta.license?.spdx_id;
  if (!spdx || spdx === 'NOASSERTION') {
    return { pass: false, reason: 'no-license' };
  }

  return {
    pass: true,
    license: spdx,
    description: meta.description ?? undefined,
    stars: meta.stargazers_count,
    default_branch: meta.default_branch,
  };
}
