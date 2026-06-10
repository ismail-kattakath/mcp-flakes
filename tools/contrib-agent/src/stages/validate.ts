import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { promisify } from 'node:util';
import * as yaml from 'yaml';
import type { FlakeManifest } from '../agent/schema.js';
import { log } from '../lib/log.js';
import { repoPath, repoRoot } from '../lib/paths.js';

const execFileP = promisify(execFile);

const VALIDATE_SCRIPT = repoPath('tools/validate-flake.sh');
const GENERATE_SCRIPT = repoPath('tools/generate-dockerfile.py');
const SMOKE_SCRIPT = repoPath('tools/smoke-test.sh');

// All three scripts expect to run from repo root and use relative `flakes/<name>` paths.
const SHELL_CWD = { cwd: repoRoot() };

export type ValidateStage = 'write' | 'schema' | 'generate' | 'smoke';

export interface ValidationResult {
  ok: boolean;
  stage: ValidateStage;
  flakeDir: string;
  errors?: string[];
  smokeOutput?: string;
}

/**
 * Writes the manifest, then hands off to the project's existing Python/Bash tools.
 * Each step is best-effort: if a tool isn't present yet (Phase 0), we log and continue,
 * so a working manifest still flows through to a PR for human review.
 */
export async function validate(
  manifest: FlakeManifest,
  opts: { skipSmoke?: boolean } = {},
): Promise<ValidationResult> {
  const flakeDir = repoPath('flakes', manifest.name);
  await fs.mkdir(flakeDir, { recursive: true });
  const manifestPath = path.join(flakeDir, 'flake.yaml');
  try {
    await fs.writeFile(manifestPath, yaml.stringify(manifest), 'utf8');
  } catch (e) {
    return {
      ok: false,
      stage: 'write',
      flakeDir,
      errors: [(e as Error).message],
    };
  }

  // Generator runs FIRST — it produces the artifacts (Dockerfile, compose.yaml,
  // README.md, ATTRIBUTION.md) that validate-flake.sh then checks for.
  if (await scriptExists(GENERATE_SCRIPT)) {
    try {
      await execFileP(
        'python3',
        [GENERATE_SCRIPT, path.join('flakes', manifest.name)],
        SHELL_CWD,
      );
    } catch (e) {
      return {
        ok: false,
        stage: 'generate',
        flakeDir,
        errors: [errStderr(e) ?? (e as Error).message],
      };
    }
  } else {
    log.warn('validate.script_missing', { script: GENERATE_SCRIPT });
  }

  if (await scriptExists(VALIDATE_SCRIPT)) {
    try {
      await execFileP('bash', [VALIDATE_SCRIPT, manifest.name], SHELL_CWD);
    } catch (e) {
      return {
        ok: false,
        stage: 'schema',
        flakeDir,
        errors: [errStderr(e) ?? (e as Error).message],
      };
    }
  } else {
    log.warn('validate.script_missing', { script: VALIDATE_SCRIPT });
  }

  if (!opts.skipSmoke && (await scriptExists(SMOKE_SCRIPT))) {
    try {
      const { stdout } = await execFileP(
        'bash',
        [SMOKE_SCRIPT, manifest.name],
        SHELL_CWD,
      );
      return { ok: true, stage: 'smoke', flakeDir, smokeOutput: stdout };
    } catch (e) {
      const stderr = errStderr(e);
      const stdout = errStdout(e);
      return {
        ok: false,
        stage: 'smoke',
        flakeDir,
        errors: [stderr ?? (e as Error).message],
        smokeOutput: stdout,
      };
    }
  }

  return { ok: true, stage: 'smoke', flakeDir };
}

async function scriptExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function errStderr(e: unknown): string | undefined {
  const v = (e as { stderr?: unknown }).stderr;
  return typeof v === 'string' ? v : v ? String(v) : undefined;
}
function errStdout(e: unknown): string | undefined {
  const v = (e as { stdout?: unknown }).stdout;
  return typeof v === 'string' ? v : v ? String(v) : undefined;
}
