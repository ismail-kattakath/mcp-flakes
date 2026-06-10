# mcp-flakes — Research Findings & Execution Plan

**Working name:** `mcp-flakes` (was "Awesome-MCP-Blocks" / "MDPA" in the brainstorm)
**One-liner:** A community library of self-contained, deterministic "flakes" — Docker Compose recipes that turn *any* MCP server (npx/uvx packages, unbuilt GitHub repos, raw scripts) into an isolated, prebuilt, instantly runnable container — composable into per-project bundles behind a single gateway endpoint.

---

## Part 1 — Fact-Check of the Brainstorm

The Gemini conversation got the *vision* right and several load-bearing technical details wrong. These corrections change the architecture, so they come first.

### 1.1 `dockerfile` + `dockerfile_inline` are mutually exclusive ❌

The final "Master Blueprint" blocks specify both `dockerfile: Dockerfile.mcp-runner` and `dockerfile_inline:` in the same `build` section. The Compose specification explicitly rejects any file that sets both — Compose will refuse to parse it. ([Compose Build Spec](https://docs.docker.com/reference/compose-file/build/))

**Fix:** each block gets its own real `Dockerfile` in its own folder (recommended), or uses `dockerfile_inline` alone with `FROM ghcr.io/mcp-flakes/runner-node:<digest>`. A real per-block Dockerfile is better anyway: readable diffs in PRs, works with `docker buildx bake`, and — critically for you — works on Podman (see 1.6).

### 1.2 The `docker/mcp-gateway` compose setup was largely fabricated ❌

There is no `MCP_CONFIG_PATH` env var, no `/etc/mcp/catalog.yaml` convention, and the gateway does not "discover" already-running compose services. How it actually works (verified against docker/mcp-gateway docs, 2026):

- It's a Docker CLI plugin: `docker mcp gateway run --catalog <ref> --transport streaming --port 8811`.
- Catalogs are now **OCI artifacts** (`docker mcp catalog create/push/pull myorg/catalog:latest`), with YAML server entries of the form `registry: <name>: { image: ..., type: server, secrets, env, ... }`. File-based catalogs still work via `file://` refs and `docker mcp catalog add <cat> <server> ./my-server.yaml`.
- **The gateway launches MCP server containers itself** (via the mounted docker socket) from the catalog's `image:` entries, on demand. Compose services running alongside it are invisible to it unless registered as *remote* (HTTP/SSE) servers.
- There are also **profiles** (`docker mcp profile create`, `--server catalog://...`) for grouping servers — Docker's native equivalent of your "bundles."

**Consequence — two valid integration patterns:**

| | Pattern A: gateway-managed (recommended v1) | Pattern B: compose-managed services |
|---|---|---|
| Block's job | `build`/publish an **image**; catalog entry references it | Run a long-lived compose **service** |
| Transport | stdio inside container, gateway bridges to HTTP | Server must speak streamable HTTP/SSE (native, or wrapped with `supergateway`/`mcp-proxy`) |
| Lifecycle | Gateway starts/stops containers on demand | `docker compose up -d`, always-on |
| Secrets | Gateway/Desktop secrets store or env | `.env` per bundle |
| Best for | 90% of stdio servers | Stateful/long-lived servers, DB-backed servers, non-Docker-Desktop clients |

Pattern A means the compose layer's real job is **building and tagging images**, not running servers. That simplification is a gift: blocks become "image recipes," and the gateway (or ToolHive, or raw `docker run -i`, or a generated `claude mcp add` config) consumes them. Pattern B stays as an opt-in flag per block.

### 1.3 "Reproduction guaranteed by hash" — only if you pin inputs ⚠️

An image digest guarantees *consumers* get identical bytes. It does **not** make the *build* reproducible: `git clone <repo>` on a branch, `npm install`, and `:latest` base images all float. Two CI runs a day apart produce different images with different digests.

**Fix — determinism rules for every block:**
- Pin the upstream to a **commit SHA** (`git clone --depth=1 ... && git checkout <sha>`, or `ADD https://github.com/o/r/archive/<sha>.tar.gz`).
- Pin base/runner images **by digest**.
- Prefer lockfile installs: `npm ci`, `pnpm install --frozen-lockfile`, `uv sync --frozen`. Fall back to `npm install` only when no lockfile exists (record that in the manifest).
- CI publishes `image@sha256:` digests into a generated `flake.lock`-style file. Version bumps = a bot PR that moves the pinned SHA, rebuilds, re-tests, and updates the lock.

(Yes, this is exactly the Nix flakes mental model — the name earns itself.)

### 1.4 Registry cache-streaming is the wrong tool; ship images ⚠️

`--cache-from type=registry,mode=max` is real, but end users running `docker compose up` don't get it without per-service `cache_from` config and a buildx driver — fragile. The simpler, strictly better mechanism is already in the Compose spec: **when a service has both `image:` and `build:`, the default behavior is pull-first, build-from-source only if the pull fails.** ([compose-spec/build.md](https://github.com/compose-spec/compose-spec/blob/main/build.md))

So every block declares:

```yaml
image: ghcr.io/mcp-flakes/<block>:<version>   # prebuilt by CI — instant pull
build: { context: . }                          # automatic fallback + local-hack path
```

Users get the 4-second experience by default, and forks/air-gapped users still build from source. Registry cache (`type=gha` + `type=registry`) stays as an *internal CI* optimization only.

### 1.5 `include` works as described ✅ (with caveats)

Compose `include` (v2.20+) resolves paths relative to the included file, so bundles can pull blocks from `../../mcp-blocks/...`. Caveats to design around: each included file is its own namespace (name collisions across blocks must be prevented by convention — `mcp-<block>` service names), and `include` doesn't support per-include variable overrides — bundle-level `.env` is the override mechanism, so **all block env vars must be `${VAR:-default}` pass-throughs**.

### 1.6 Your local stack is Podman — this matters 🔴

You migrated to Podman on macOS (applehv). Known issues: `podman-compose` **ignores `dockerfile_inline`** (containers/podman-compose#1332), and the official `docker/mcp-gateway` assumes a Docker socket and Docker Desktop conventions. Plan accordingly:
- Use the **docker compose CLI pointed at the Podman socket** (`DOCKER_HOST=unix://$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')`) rather than podman-compose.
- Prefer real per-block Dockerfiles over `dockerfile_inline` (works everywhere).
- Treat "works on Podman" as a first-class CI check — it's also a differentiator, since Docker's MCP Toolkit is Docker-Desktop-only and that exclusivity annoys people.

### 1.7 Runner-image realities ⚠️

- `node:20-alpine` + `apk add python3` breaks on **native modules** (musl vs glibc: sharp, better-sqlite3, onnxruntime…). Default runner should be **debian-slim** based; keep an alpine variant for size where it works.
- Some servers need heavyweight deps (Playwright/Chromium, ffmpeg). One universal runner can't cover them — the block manifest needs a `runner:` field (`node`, `python`, `node-python`, `playwright`, `custom`).
- Build-time `git clone` in a `RUN` layer caches by string — fine once SHAs are pinned (the SHA in the command *is* the cache key).

---

## Part 2 — Prior Art (the "am I first?" answer, properly researched)

You're not first to any single piece — but **nobody ships your exact combination**. Know the neighbors:

| Project | What it does | Gap mcp-flakes fills |
|---|---|---|
| **Docker MCP Catalog / Toolkit / Gateway** (official) | 220+ Docker-built, signed images; OCI catalogs; profiles; gateway with interceptors/secrets | Curated & slow; image-only — no answer for unbuilt repos; Toolkit tied to Docker Desktop |
| **ToolHive** (Stacklok) — *closest competitor* | Runs any MCP server in containers incl. from source packages (`uvx://`, `npx://`, `go://`); curated registry; K8s operator; enterprise (Okta/Entra, audit) | New runtime + CLI + daemon to adopt; enterprise-flavored; recipes aren't transparent compose files you can read and hack |
| **metorial/mcp-containers** | Hundreds of prebuilt images, auto-rebuilt daily via Nixpacks, on GHCR | Images only — no composition story, no bundles, no gateway integration, no pinned/reproducible recipes (explicitly criticized for unpinned `latest` builds) |
| **mcp-servers-nix / mcps.nix** | Actual Nix flakes for MCP servers; reproducible, pinned, modules for Home Manager/devenv | Requires Nix; tiny audience overlap with Docker users |
| **Smithery / mcp.so / registries** | Discovery + hosted install | Quality problems you already hit; not self-host infrastructure |

**Positioning that survives this table:** *"Everything is a compose file."* No new daemon, no new CLI required, no SaaS. Human-readable, AI-writable, git-reviewable recipes; prebuilt images with automatic source fallback; per-project bundles; and an agent that converts any GitHub repo into a flake in one shot. Plus a judo move the incumbents can't make: **CI auto-publishes the whole library as a `docker mcp` OCI catalog and a ToolHive-format registry**, so their users become your users instead of your competitors' moat.

⚠️ **Licensing landmine the brainstorm missed:** redistributing *built images* of upstream code is distribution under copyright law. CI must record each upstream's license; push images only for permissive/compatible licenses (MIT/Apache/BSD…); for GPL, comply (include source ref + license in image); for **no-license repos, ship recipe-only blocks** (user builds locally — the `build:` fallback already makes this seamless).

---

## Part 3 — Corrected Architecture

```
mcp-flakes/
├── runners/                          # shared base images, built & pushed by CI
│   ├── node/Dockerfile               #   debian-slim + node20 + git
│   ├── python/Dockerfile             #   debian-slim + python3.12 + uv + git
│   ├── node-python/Dockerfile        #   the kitchen-sink polyglot runner
│   └── playwright/Dockerfile         #   for browser-needing servers
│
├── flakes/                           # one folder per MCP server  ← "blocks"
│   └── <name>/
│       ├── flake.yaml                # MANIFEST (source of truth, see schema)
│       ├── Dockerfile                # pinned-SHA build recipe
│       ├── compose.yaml              # image: ghcr.io/… + build: fallback
│       └── README.md                 # env vars, tools list, license note
│
├── bundles/                          # per-project compositions
│   └── <project>/
│       ├── compose.yaml              # include: [../../flakes/a, …] + gateway
│       ├── catalog.yaml              # generated docker-mcp catalog for bundle
│       └── .env.example
│
├── generated/                        # CI output, committed or released
│   ├── flake.lock                    # name → {commit_sha, image@digest, version}
│   ├── catalog/                      # docker mcp OCI catalog source
│   └── toolhive-registry/           # ToolHive-format mirror
│
├── tools/
│   ├── flake                         # tiny CLI: add/rm/up/lock/new (bash or go)
│   └── smoke/                        # MCP handshake + tools/list test harness
│
└── .github/workflows/                # bake-matrix build, test, publish, drift-watch
```

### flake.yaml manifest (the contract everything else is generated from)

```yaml
name: postgres-unbuilt
upstream:
  repo: https://github.com/user/unbuilt-postgres-mcp
  commit: 4f2a91c…                  # pinned; bumped by bot PRs
  license: MIT                      # detected; gates image publication
runner: node                        # selects base image
build:
  install: npm ci                   # or npm install if no lockfile (flagged)
  build: npm run build
  entrypoint: ["node", "dist/index.js"]
transport: stdio                    # or http { port: 3000, path: /mcp }
env:
  - { name: DATABASE_URL, required: true, secret: true }
tools: [query, list_schemas]        # captured by smoke test
publish_image: true                 # false for recipe-only (license/no-license)
```

`Dockerfile`, `compose.yaml`, catalog entries, ToolHive registry entries, and client configs (`claude mcp add`, Cursor JSON) are all **generated** from this manifest — single source of truth, which is also exactly what makes the contribution agent's job tractable and reviewable.

### Consumption paths (in order of priority)

1. **`docker mcp gateway run --catalog ghcr.io/mcp-flakes/catalog`** — zero-install for Docker Desktop users; gateway runs the prebuilt images on demand.
2. **Bundles** — `cd bundles/myproject && docker compose up -d`: gateway + chosen flakes; the per-project workflow you actually wanted.
3. **Direct** — generated `docker run -i --rm ghcr.io/mcp-flakes/<name>` client config snippets for Claude Code/Desktop, Cursor, etc. (no gateway at all).
4. **ToolHive users** — point `thv` at the generated registry.

---

## Part 4 — Execution Plan

### Phase 0 — Spike (1–2 days) · *kill risks before writing the framework*

| # | Task | Pass criteria |
|---|---|---|
| 0.1 | Build ONE hard-mode flake by hand (a real unbuilt TS repo): pinned-SHA Dockerfile → GHCR push → run via `docker mcp gateway run` with a file-based custom catalog entry | `tools/list` returns from Claude Code through the gateway |
| 0.2 | Verify pull-first/build-fallback: fresh machine, `compose up` pulls image; delete image+registry access, `compose up` builds from source | Both paths work without YAML edits |
| 0.3 | Podman path on your Mac: docker compose CLI → Podman socket, build + run the same flake; try gateway, document what breaks | Written compatibility matrix |
| 0.4 | Test gateway "remote server" registration for one HTTP-wrapped stdio server (supergateway) → validates Pattern B | Documented; go/no-go for v1 inclusion |
| 0.5 | Decide final name & grab the namespace (GitHub org `mcp-flakes`, GHCR). Note: no existing project uses the name (verified), but it *will* evoke Nix — lean into it ("flake = pinned, reproducible unit") in the README's first paragraph | Org + repo created |

### Phase 1 — Core framework + seed library (week 1)

1. `runners/*` images built, digest-pinned, pushed to GHCR.
2. Finalize `flake.yaml` schema (JSON Schema for validation) + generator script (`flake gen <name>`: manifest → Dockerfile/compose/README).
3. `flake` CLI: `flake new <repo-url>` (scaffold), `flake up/down <bundle>`, `flake lock`, `flake test <name>`.
4. **10 seed flakes** deliberately spanning archetypes: 2× npx-published, 2× uvx-published, 3× unbuilt-TS-repo, 2× unbuilt-Python-repo, 1× HTTP-native. These are your test fixtures *and* your launch content.
5. One example bundle wired to the gateway; end-to-end demo from Claude Code.
6. Secrets convention: `${VAR}` pass-through only, `.env.example` generated from manifest, never a default for `secret: true` vars.

### Phase 2 — CI / the factory (week 2)

1. **Build matrix from manifests:** workflow globs `flakes/*/flake.yaml` → `docker buildx bake` matrix → multi-arch (amd64+arm64) → push `:vN` + record digest in `generated/flake.lock`. GHA cache + registry cache internally.
2. **Smoke harness as merge gate:** spin image, speak MCP over stdio (initialize → tools/list), assert tool names match manifest. No green, no merge. *This is the moat — every flake in the library provably runs.*
3. **Drift watcher:** nightly job diffs upstream HEAD vs pinned SHA → opens bump PR → smoke test decides auto-merge vs human review. (Run on your self-hosted box once GH minutes hurt — you know this drill already.)
4. **License detection** (e.g. `licensee`/`askalono`) gating `publish_image`.
5. **Catalog publication:** generate + `docker mcp catalog push ghcr.io/mcp-flakes/catalog` and the ToolHive registry mirror on every merge to main.

### Phase 3 — Contribution agent (weeks 3–4)

1. **Converter:** input repo URL → agent (Claude via API) reads README + package manifests → emits `flake.yaml` only (never raw Dockerfiles — constrained output = reviewable + safe). Deterministic generator turns it into the rest.
2. **Sandbox validation loop:** build + smoke test in an isolated runner (no secrets, egress-restricted, network allowlist: registries + the upstream host only); agent iterates on failures up to N attempts.
3. **PR bot:** on success, opens PR with manifest + generated files + smoke-test transcript; labels by archetype; you review the ~30-line manifest, not 300 lines of YAML.
4. Surfaces: GitHub Action (`/flake <repo-url>` issue comment), HF Space or simple web UI later. Your existing GPT-manager/Claude-engineer fleet plugs in here — the manifest schema is the interface contract; keep token rotation + staggered PRs as planned.
5. **Security policy (non-negotiable, write it down):** agent-generated PRs never auto-merge for net-new upstreams; human skim of the manifest + upstream repo reputation; pinned SHA means a later upstream compromise can't silently flow in.

### Phase 4 — Launch & growth (week 5+)

1. README that leads with the 30-second demo GIF: messy repo URL → `/flake` comment → merged → `docker mcp gateway run --catalog …` → tool call in Claude Code.
2. Positioning (sharpened from the brainstorm, minus the swipes): *"Any MCP server. One compose file. Pinned, prebuilt, yours."* Explicit comparison table vs Toolkit/ToolHive/metorial (you already have it — Part 2).
3. The Docker-catalog judo as a headline feature: "Already on Docker Desktop? Add one catalog and get the whole library."
4. Contributor loop: PR badge bot, CONTRIBUTING.md that is literally "paste a repo URL in an issue."
5. Distribution: r/mcp, MCP Discord, Hacker News (the licensing + reproducibility rigor is the HN-credibility angle metorial lacks), awesome-mcp-servers PR, lobehub/mcp.so listings.
6. Defer the bespoke `mcp-add` IDE tool — generated client-config snippets per flake cover 80% at 5% of the effort; revisit after traction.

---

## Part 5 — Risks & Open Questions

| Risk | Severity | Mitigation |
|---|---|---|
| **ToolHive/Docker ship "build from any repo" first** | High | Speed + the compose-native/no-new-tool wedge + catalog interop (be their content, not their competitor) |
| Supply chain: you're now a distributor of arbitrary code | High | Pinned SHAs, license gate, no-auto-merge policy, image signing (cosign) + SBOM in Phase 2.5 |
| Maintenance burn as library grows | Med | Drift watcher + smoke gate keeps broken flakes visibly broken; archive policy for dead upstreams |
| GH Actions quota | Med | Self-hosted runner (your Ubuntu box) for bake matrix; GHCR cache |
| Nix-name confusion | Low | Address in README line 1; the connotation (pinned/reproducible/composable) is genuinely accurate |
| docker.sock in gateway container = root-equivalent | Med | Document it loudly; offer socket-proxy variant (e.g. tecnativa/docker-socket-proxy) in bundles |
| Gemini-style claims leaking into docs | Low | Everything in this plan above was verified against current docs/repos; keep a "verified against" date in README |

**Open questions to settle in Phase 0:** (a) does the current gateway handle long-lived/stateful servers well enough that Pattern B can wait? (b) multi-arch from day one or amd64-first? (c) is the CLI bash/just or a small Go binary (Go wins if `flake new` should work without the repo cloned)? (d) monorepo for flakes forever, or split `mcp-flakes/library` from `mcp-flakes/framework` once contributions scale?

---

## Immediate next actions (today)

1. Reserve `mcp-flakes` GitHub org + GHCR namespace.
2. Run spike 0.1 with one real "nightmare" repo from your own MCP wishlist (the ones Docker's catalog couldn't accommodate — they're your best fixtures).
3. Draft `flake.yaml` JSON Schema — it's the keystone every later phase (CI, agent, catalogs) builds on.
