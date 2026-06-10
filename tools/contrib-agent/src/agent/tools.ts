export const ALLOWED_TOOLS = ['Read', 'Glob', 'Grep', 'Bash', 'WebFetch'] as const;

/**
 * Bash allowlist. The agent should only need to:
 * - Resolve a commit SHA
 * - Read files cat-style as a fallback when Read can't open binary-ish paths
 * - Query GitHub API for repo metadata it didn't get from filter()
 *
 * Any other shell capability would expand the blast radius — keep this list small.
 */
const BASH_ALLOW_PREFIXES = [
  'git -C',
  'git ls-remote',
  'git log',
  'git show',
  'git rev-parse',
  'gh api repos/',
  'gh api /repos/',
  'cat ',
  'head ',
  'tail ',
  'wc ',
  'find ',
  'ls ',
  'pwd',
];

export function isBashCommandAllowed(cmd: string): boolean {
  const trimmed = cmd.trim();
  if (!trimmed) return false;
  // Reject pipelines and chains outright — single command only.
  if (/[;&|]/.test(trimmed) && !trimmed.includes('--jq')) return false;
  return BASH_ALLOW_PREFIXES.some((p) => trimmed.startsWith(p));
}
