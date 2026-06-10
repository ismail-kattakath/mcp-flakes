import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);

export type ExpandResult =
  | { kind: 'single' }
  | { kind: 'monorepo'; subpaths: string[] };

interface TreeNode {
  path: string;
  type: 'blob' | 'tree';
}

interface TreeResponse {
  tree: TreeNode[];
  truncated: boolean;
}

const MONOREPO_PATTERN =
  /^(src|packages)\/([^/]+)\/(package\.json|pyproject\.toml)$/;

/**
 * Detect whether a repo is a monorepo of MCP servers. Cheap path: a single
 * `gh api git/trees/...?recursive=1` call. If we find >=2 subdirectories under
 * src/ or packages/ each with a package.json or pyproject.toml, treat it as a
 * monorepo and return those subpaths (sorted).
 *
 * Fail-open: any error returns 'single' so the pipeline still proceeds with
 * the parent candidate. Better to over-process one weird repo than to stall
 * the whole queue on a flaky API call.
 */
export async function expand(
  repo: string,
  branch = 'HEAD',
): Promise<ExpandResult> {
  const slug = repo
    .replace(/^https?:\/\/github\.com\//, '')
    .replace(/\/$/, '');

  let tree: TreeResponse;
  try {
    const { stdout } = await execFileP('gh', [
      'api',
      `repos/${slug}/git/trees/${branch}?recursive=1`,
    ]);
    tree = JSON.parse(stdout) as TreeResponse;
  } catch {
    return { kind: 'single' };
  }

  if (tree.truncated) {
    // For very large repos the tree API truncates. Skip expansion — the agent
    // can still handle it via its own scan.
    return { kind: 'single' };
  }

  const subpaths = new Set<string>();
  for (const node of tree.tree) {
    if (node.type !== 'blob') continue;
    const m = node.path.match(MONOREPO_PATTERN);
    if (m) subpaths.add(`${m[1]}/${m[2]}`);
  }
  if (subpaths.size >= 2) {
    return { kind: 'monorepo', subpaths: [...subpaths].sort() };
  }
  return { kind: 'single' };
}
