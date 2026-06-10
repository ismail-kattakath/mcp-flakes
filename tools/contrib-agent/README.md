# contrib-agent

Autonomous contribution agent for `mcp-flakes`. Discovers MCP server repos from upstream sources, synthesizes a `flake.yaml` manifest with the Claude Agent SDK, runs the deterministic generator and smoke test, and opens a PR.

## Pipeline

```
discover → filter → triage → synthesize → validate → pr
   ▲        (gh)    (stub)    (SDK)     (Python    (gh)
   │                          │          generator
   │                          │          + smoke)
   sources/awesome-mcp.ts     │
                       agent/{schema,system-prompt,tools,budget}.ts
```

Only the **synthesize** stage uses the LLM. Everything else is plain code. The LLM's tool surface is restricted to `Read | Glob | Grep | Bash | WebFetch`, with a Bash command allowlist enforced via `canUseTool`. Output is forced into the `flake.yaml` schema (`zod` → JSON Schema → SDK `outputFormat`).

## Commands

```bash
# Pull candidates from sources into the ledger (queued)
npm run discover

# Drain N queued candidates through the pipeline
npm run process -- --limit 5

# Show counts by status
npm run status
```

## State

Single JSONL ledger at `.state/ledger.jsonl`. Append-only; latest record per repo wins. Statuses: `queued | pr-opened | skipped | needs-human | failed`.

## Environment

| Var | Default | Effect |
|---|---|---|
| `SYNTHESIZE_TOKEN_BUDGET` | `50000` | Per-repo token cap; exceeding it denies further tool use |
| `SYNTHESIZE_MAX_TURNS` | `30` | Max agent turns per repo |
| `CONTRIB_AGENT_SKIP_SMOKE` | unset | Skip smoke step in `validate` (useful before smoke harness exists) |
| `ANTHROPIC_API_KEY` | — | Required for the Agent SDK call |

`gh` CLI must be authenticated for `filter` (repo metadata) and `pr` (PR creation).

## v0 cutpoints

| Stage | Status |
|---|---|
| `discover` | Real — `awesome-mcp` only; add more sources as needed |
| `filter` | Real — license + archived check via `gh api` |
| `triage` | Stub — always passes; wire up Haiku gating when volume warrants |
| `synthesize` | Real — SDK call with structured output |
| `validate` | Half-real — shells out to `tools/{validate-flake.sh,generate-dockerfile.py,smoke-test.sh}`; missing scripts are logged-and-skipped |
| `pr` | Real — `gh pr create` |

## Where multi-agent sub-loops will land

Don't build these in v0:

1. **synthesize → inspect-then-decide** for polyglot repos
2. **validate → diagnose-and-repair** with one retry budget on smoke fail
3. **discover → parallel source fan-out** once there are 4+ sources
4. Separate **drift watcher** pipeline for pinned-SHA bumps

## Safety

Per repo policy in `CLAUDE.md`: agent PRs **never auto-merge** for new upstreams. Every PR is labeled `agent-generated`; failed validation adds `needs-human`.
