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
  console.log(line);
}

export const log = {
  info: (msg: string, extra?: Extra) => emit('info', msg, extra),
  warn: (msg: string, extra?: Extra) => emit('warn', msg, extra),
  error: (msg: string, extra?: Extra) => emit('error', msg, extra),
};
