import { query } from '@qwen-code/sdk';
import type { AnalysisResult, EnvVar } from '../stages/analyze.js';
import { log } from '../lib/log.js';

const QWEN_TIMEOUT_MS = 60_000;
const QWEN_MAX_TURNS = 5;

export interface FallbackResult {
  tools: string[];
  envVars: EnvVar[];
  entrypoint: string[];
  ok: boolean;
  error?: string;
}

const FALLBACK_SYSTEM_PROMPT = `You are a code analysis assistant. You analyze MCP (Model Context Protocol) server repositories.
Your ONLY job is to extract structured facts. No opinions, no suggestions, no prose.

You will be asked to find:
1. MCP tool names — the tools this server exposes (from source code tool registrations, README docs, or both)
2. Environment variables — all env vars the server references (process.env.X, os.environ, os.getenv, .env.example)
3. Entry point — the command to start the server (from package.json scripts, bin, or main)

Return ONLY a JSON object with these fields:
{
  "tools": ["tool_name_1", "tool_name_2"],
  "envVars": [{"name": "VAR_NAME", "required": true, "secret": false, "description": "short desc"}],
  "entrypoint": ["node", "dist/index.js"]
}

Rules:
- tools: lowercase_underscore names only. Derived from actual source code or docs. Do NOT invent.
- envVars: include ALL referenced env vars. Mark secret: true for keys/tokens/passwords/credentials.
- entrypoint: the exact command array to start the MCP server.
- If you cannot determine a field, use an empty array [].
- Return ONLY the JSON object. No markdown, no explanation.`;

export async function qwenFallback(
  analysis: AnalysisResult,
): Promise<FallbackResult> {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), QWEN_TIMEOUT_MS);

  const gaps: string[] = [];
  if (analysis.confidence.tools === 'none') gaps.push('tool names');
  if (analysis.confidence.envVars === 'none') gaps.push('environment variables');
  if (analysis.confidence.entrypoint === 'none') gaps.push('entry point command');

  const prompt = `Analyze the repository at ${analysis.workdir}.

The following could not be determined by static analysis and need your help:
${gaps.map((g) => `- ${g}`).join('\n')}

Read the README.md and relevant source files to extract the missing information.
Return a JSON object with tools, envVars, and entrypoint arrays.`;

  try {
    log.info('qwen_fallback.start', { workdir: analysis.workdir, gaps });

    let resultText = '';
    for await (const message of query({
      prompt,
      options: {
        cwd: analysis.workdir,
        systemPrompt: FALLBACK_SYSTEM_PROMPT,
        permissionMode: 'default',
        allowedTools: ['Read', 'Glob', 'Grep'],
        maxSessionTurns: QWEN_MAX_TURNS,
        abortController: abort,
        canUseTool: async (toolName: string, input: Record<string, unknown>) => {
          if (['Read', 'Glob', 'Grep'].includes(toolName)) {
            return { behavior: 'allow' as const, updatedInput: input };
          }
          return { behavior: 'deny' as const, message: 'Only read-only tools allowed' };
        },
      },
    })) {
      const msg = message as any;
      if (msg.type === 'result' && msg.subtype === 'success') {
        resultText = msg.result ?? '';
      }
    }

    clearTimeout(timer);

    const parsed = extractJson(resultText);
    if (!parsed) {
      log.warn('qwen_fallback.no_json', { result: resultText.slice(0, 300) });
      return { tools: [], envVars: [], entrypoint: [], ok: false, error: 'no JSON in response' };
    }

    const tools = Array.isArray(parsed.tools) ? parsed.tools.filter((t: unknown) => typeof t === 'string') : [];
    const envVars = Array.isArray(parsed.envVars)
      ? parsed.envVars.filter((v: any) => v && typeof v.name === 'string').map((v: any) => ({
          name: v.name,
          required: !!v.required,
          secret: !!v.secret,
          description: v.description || undefined,
        }))
      : [];
    const entrypoint = Array.isArray(parsed.entrypoint) ? parsed.entrypoint.filter((e: unknown) => typeof e === 'string') : [];

    log.info('qwen_fallback.done', { toolCount: tools.length, envCount: envVars.length, hasEntrypoint: entrypoint.length > 0 });

    return { tools, envVars, entrypoint, ok: true };
  } catch (e) {
    clearTimeout(timer);
    const msg = (e as Error).message;
    log.warn('qwen_fallback.error', { error: msg });
    return { tools: [], envVars: [], entrypoint: [], ok: false, error: msg };
  }
}

function extractJson(text: string): any | undefined {
  const fence = text.match(/```(?:json)?\s*\n([\s\S]*?)\n```/i);
  const candidates: string[] = [];
  if (fence) candidates.push(fence[1]);
  const braceStart = text.indexOf('{');
  const braceEnd = text.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd > braceStart) {
    candidates.push(text.slice(braceStart, braceEnd + 1));
  }
  for (const c of candidates) {
    try {
      return JSON.parse(c);
    } catch {
      // try next
    }
  }
  return undefined;
}

export function mergeAnalysisWithFallback(
  analysis: AnalysisResult,
  fallback: FallbackResult,
): AnalysisResult {
  const merged = { ...analysis };

  if (analysis.confidence.tools === 'none' && fallback.tools.length > 0) {
    merged.tools = fallback.tools;
    merged.confidence = { ...merged.confidence, tools: 'low' };
  }

  if (analysis.confidence.envVars === 'none' && fallback.envVars.length > 0) {
    merged.envVars = fallback.envVars;
    merged.confidence = { ...merged.confidence, envVars: 'low' };
  }

  if (analysis.confidence.entrypoint === 'none' && fallback.entrypoint.length > 0) {
    merged.entrypoint = fallback.entrypoint;
    merged.confidence = { ...merged.confidence, entrypoint: 'low' };
  }

  return merged;
}
