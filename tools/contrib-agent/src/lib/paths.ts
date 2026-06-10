import { execSync } from 'node:child_process';
import * as path from 'node:path';

let cachedRoot: string | undefined;

/** Resolve the repo root once via `git rev-parse`. Cached. */
export function repoRoot(): string {
  if (cachedRoot) return cachedRoot;
  try {
    cachedRoot = execSync('git rev-parse --show-toplevel', {
      encoding: 'utf8',
    }).trim();
  } catch {
    cachedRoot = process.cwd();
  }
  return cachedRoot;
}

/** Build an absolute path relative to the repo root. */
export function repoPath(...segments: string[]): string {
  return path.join(repoRoot(), ...segments);
}
