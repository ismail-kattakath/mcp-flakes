/**
 * Stdin/stdout JSON helpers for per-stage subcommands.
 *
 * Contract:
 *  - readStdinJson() reads stdin to EOF and parses as JSON.
 *  - writeStdoutJson() writes one JSON line to stdout.
 *  - Logs use src/lib/log.ts (stderr).
 *
 * Workflow steps chain stages with `<` and `>` redirection or pipes.
 */

export async function readStdinJson<T = unknown>(): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) {
    throw new Error('stdin: empty input (expected JSON object)');
  }
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    throw new Error(`stdin: invalid JSON — ${(e as Error).message}`);
  }
}

export function writeStdoutJson(value: unknown): void {
  process.stdout.write(JSON.stringify(value) + '\n');
}
