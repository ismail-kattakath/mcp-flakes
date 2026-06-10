export interface Candidate {
  id: string;        // owner/name OR owner/name#subpath (lowercased)
  repo: string;      // canonical https URL (no subpath fragment)
  subpath?: string;  // populated by stages/expand when applicable
  source: string;    // Source.name
}

export interface Source {
  name: string;
  fetch(): Promise<Candidate[]>;
}

const GH_RE = /github\.com[/:]([\w.-]+)\/([\w.-]+)/i;

/**
 * Parse a GitHub URL into {id, repo, subpath?}. Accepts optional `#subpath`
 * fragment so callers can pass `https://github.com/owner/name#src/foo` to
 * target a specific monorepo subpath.
 */
export function parseGithubRepo(
  input: string,
): { id: string; repo: string; subpath?: string } | null {
  const [base, frag] = input.split('#', 2);
  const m = base.match(GH_RE);
  if (!m) return null;
  const owner = m[1].toLowerCase();
  const name = m[2].toLowerCase().replace(/\.git$/, '');
  if (!owner || !name || owner.length > 39 || name.length > 100) return null;
  const repo = `https://github.com/${owner}/${name}`;
  const subpath = frag?.trim() || undefined;
  const id = subpath ? `${owner}/${name}#${subpath}` : `${owner}/${name}`;
  return { id, repo, subpath };
}
