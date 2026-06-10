import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { promisify } from 'node:util';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { FlakeManifest } from '../agent/schema.js';
import { buildSystemPrompt } from '../agent/system-prompt.js';
import { ALLOWED_TOOLS, isBashCommandAllowed } from '../agent/tools.js';
import { Budget } from '../agent/budget.js';
import { log } from '../lib/log.js';

const execFileP = promisify(execFile);

const TOKEN_BUDGET = parseInt(
  process.env.SYNTHESIZE_TOKEN_BUDGET ?? '50000',
  10,
);
const MAX_TURNS = parseInt(process.env.SYNTHESIZE_MAX_TURNS ?? '30', 10);

export interface SynthesisResult {
  ok: boolean;
  manifest?: FlakeManifest;
  workdir: string;
  error?: string;
  tokensUsed: number;
}

export async function synthesize(
  repo: string,
  subpath?: string,
): Promise<SynthesisResult> {
  const workdir = await fs.mkdtemp(path.join(os.tmpdir(), 'contrib-agent-'));
  try {
    await execFileP('git', ['clone', '--depth', '50', repo, workdir]);
  } catch (e) {
    return {
      ok: false,
      workdir,
      error: `clone failed: ${(e as Error).message}`,
      tokensUsed: 0,
    };
  }

  const systemPrompt = await buildSystemPrompt();
  const schema = zodToJsonSchema(FlakeManifest, { $refStrategy: 'none' });
  const budget = new Budget(TOKEN_BUDGET);

  const subpathBlock = subpath
    ? `

## Scope
This is a monorepo. Focus EXCLUSIVELY on the MCP server at:
  ${workdir}/${subpath}

- Set upstream.subpath: "${subpath}".
- Name the flake after the subpath leaf: "${subpath.split('/').pop()}".
- Do NOT inspect sibling subpaths. Do NOT produce manifests for other servers.
- Read package.json or pyproject.toml at ${workdir}/${subpath}/, not the repo root.`
    : '';

  const prompt = `Analyze the repository cloned at ${workdir} and produce a flake.yaml manifest for the MCP server it contains.

Use Read/Glob/Grep against ${workdir}. For Bash, prefer commands like:
- git -C ${workdir} log -1 --format=%H   (resolve commit SHA)
- cat ${workdir}/LICENSE                 (license text fallback)
${subpathBlock}

Return ONLY a JSON object matching the schema. No prose.`;

  let manifest: FlakeManifest | undefined;
  let tokensUsed = 0;
  let lastError: string | undefined;
  const verbose = process.env.CONTRIB_AGENT_VERBOSE === '1';

  try {
    for await (const message of query({
      prompt,
      options: {
        systemPrompt,
        allowedTools: [...ALLOWED_TOOLS],
        cwd: workdir,
        maxTurns: MAX_TURNS,
        outputFormat: { type: 'json_schema', schema },
        canUseTool: async (
          tool: string,
          input: Record<string, unknown>,
        ) => {
          if (budget.exceeded) {
            return { behavior: 'deny', message: 'token budget exceeded' };
          }
          // Hard deny anything outside our allowlist. Discovered the hard
          // way: the SDK lets Task (sub-agent spawn) through unless we
          // explicitly say no, which can explode turn count on monorepos.
          if (!ALLOWED_TOOLS.includes(tool as any)) {
            if (verbose) log.warn('synthesize.tool_denied', { tool });
            return {
              behavior: 'deny',
              message: `Tool ${tool} is not allowed in this session. Allowed: ${ALLOWED_TOOLS.join(', ')}.`,
            };
          }
          if (tool === 'Bash') {
            const cmd = String(input.command ?? '');
            if (!isBashCommandAllowed(cmd)) {
              if (verbose) log.warn('synthesize.bash_denied', { cmd: cmd.slice(0, 120) });
              return {
                behavior: 'deny',
                message: `Bash command not in allowlist: ${cmd.slice(0, 80)}`,
              };
            }
          }
          if (verbose) log.info('synthesize.tool_allowed', { tool });
          return { behavior: 'allow', updatedInput: input };
        },
      } as any, // SDK option types vary by version; cast until pinned
    })) {
      const msg = message as any;
      if (verbose) {
        log.info('synthesize.msg', {
          type: msg.type,
          subtype: msg.subtype,
          // Tool name when assistant emits a tool_use block
          toolName: msg.message?.content?.find?.((b: any) => b.type === 'tool_use')?.name,
        });
      }
      if (msg.type === 'result') {
        if (msg.usage) {
          tokensUsed =
            (msg.usage.input_tokens ?? 0) + (msg.usage.output_tokens ?? 0);
          budget.add(msg.usage.output_tokens ?? 0);
        }
        // Surface error subtypes explicitly — silently dropping them is what
        // produced the "no manifest returned" mystery in v0.
        if (msg.subtype && msg.subtype !== 'success') {
          lastError = `result.${msg.subtype}: ${(msg.errors ?? []).join('; ') || 'no error message'}`;
          log.warn('synthesize.result_error', {
            subtype: msg.subtype,
            errors: msg.errors,
            num_turns: msg.num_turns,
            permission_denials: msg.permission_denials?.length ?? 0,
          });
        }
        // Prefer SDK-enforced structured output, fall back to parsing text.
        // Bedrock's Anthropic adapter doesn't always honor outputFormat,
        // so we have to do schema validation ourselves on msg.result text.
        let candidate = msg.structured_output;
        let candidateSource: 'structured_output' | 'text' | undefined;
        if (candidate !== undefined && candidate !== null) {
          candidateSource = 'structured_output';
        } else if (msg.subtype === 'success' && typeof msg.result === 'string') {
          const extracted = extractJsonFromText(msg.result);
          if (extracted !== undefined) {
            candidate = extracted;
            candidateSource = 'text';
          }
        }

        if (candidate !== undefined) {
          const parsed = FlakeManifest.safeParse(candidate);
          if (parsed.success) {
            manifest = parsed.data;
            if (candidateSource === 'text') {
              log.info('synthesize.text_fallback_ok', {});
            }
          } else {
            lastError = `schema mismatch (${candidateSource}): ${parsed.error.issues
              .slice(0, 3)
              .map((i) => `${i.path.join('.')}: ${i.message}`)
              .join('; ')}`;
            log.warn('synthesize.schema_mismatch', {
              source: candidateSource,
              error: lastError,
              raw: JSON.stringify(candidate).slice(0, 800),
            });
          }
        } else if (msg.subtype === 'success') {
          lastError = `success but no JSON found in result: ${String(msg.result ?? '').slice(0, 200)}`;
          log.warn('synthesize.no_json_in_result', {
            result_preview: String(msg.result ?? '').slice(0, 500),
          });
        }
      }
    }
  } catch (e) {
    return {
      ok: false,
      workdir,
      error: `query failed: ${(e as Error).message}`,
      tokensUsed,
    };
  }

  if (!manifest) {
    return {
      ok: false,
      workdir,
      error: lastError ?? 'no manifest returned',
      tokensUsed,
    };
  }
  return { ok: true, manifest, workdir, tokensUsed };
}

export async function cleanupWorkdir(workdir: string): Promise<void> {
  await fs.rm(workdir, { recursive: true, force: true });
}

/**
 * Extract a JSON value from a model text response. Handles three common shapes:
 *   - bare JSON object
 *   - ```json ... ``` fenced block
 *   - JSON embedded between explanatory prose
 * Returns undefined if no parseable JSON is found.
 */
function extractJsonFromText(text: string): unknown | undefined {
  // Try fenced block first
  const fence = text.match(/```(?:json)?\s*\n([\s\S]*?)\n```/i);
  const candidates: string[] = [];
  if (fence) candidates.push(fence[1]);
  // Then try the first {...} run as fallback
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
