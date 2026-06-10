// Loose `object` accepts both Record<string,unknown> and typed result objects
// from stages without forcing every caller to widen its type.
type Extra = object;

function emit(level: string, msg: string, extra?: Extra): void {
  const line = JSON.stringify({
    level,
    msg,
    ...(extra ?? {}),
    ts: new Date().toISOString(),
  });
  // Stderr so subcommand stdout stays pure JSON for piping in workflow steps.
  process.stderr.write(line + '\n');
}

export const log = {
  info: (msg: string, extra?: Extra) => emit('info', msg, extra),
  warn: (msg: string, extra?: Extra) => emit('warn', msg, extra),
  error: (msg: string, extra?: Extra) => emit('error', msg, extra),
};
