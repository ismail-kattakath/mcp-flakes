# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**mcp-flakes** is a community library of self-contained, deterministic "flakes" — Docker Compose recipes that turn any MCP server (npx/uvx packages, unbuilt GitHub repos, raw scripts) into an isolated, prebuilt, instantly runnable container, composable into per-project bundles behind a single gateway endpoint.

**Core Philosophy:** Everything is a compose file. No new daemon, no new CLI required. Human-readable, AI-writable, git-reviewable recipes with prebuilt images and automatic source fallback.

## Architecture

The project is organized into distinct layers:

```
runners/          # Base images (node, python, node-python, playwright)
flakes/           # One folder per MCP server - the core library
  <name>/
    flake.yaml    # Source of truth manifest
    Dockerfile    # Pinned-SHA build recipe
    compose.yaml  # image: + build: fallback pattern
    README.md     # Usage docs
bundles/          # Per-project compositions via include:
generated/        # CI outputs (flake.lock, catalogs)
tools/            # flake CLI and smoke test harness
```

### Key Architectural Principles

1. **Single source of truth:** `flake.yaml` manifest generates Dockerfile, compose.yaml, catalogs, and client configs
2. **Pull-first, build-fallback:** Every service declares both `image: ghcr.io/...` (instant pull) and `build:` (automatic fallback)
3. **Determinism:** Pin upstream commits to SHA, pin base images by digest, use lockfile installs (`npm ci`, `pnpm install --frozen-lockfile`, `uv sync --frozen`)
4. **Gateway-managed (Pattern A) by default:** Build/publish images consumed by `docker mcp gateway run`; compose layer is for building images, not running services
5. **Podman compatibility is first-class:** Use real Dockerfiles, not `dockerfile_inline`; test on both Docker and Podman

### flake.yaml Manifest Schema

The manifest is the contract everything else is generated from:

```yaml
name: <flake-name>
upstream:
  repo: <github-url>
  commit: <sha>        # Pinned; bumped by bot PRs
  license: <spdx>      # Gates image publication
runner: node|python|node-python|playwright|custom
build:
  install: <command>   # npm ci, pnpm install --frozen-lockfile, uv sync --frozen
  build: <command>
  entrypoint: [...]
transport: stdio|http
env:
  - { name: VAR, required: bool, secret: bool }
tools: [...]           # Captured by smoke test
publish_image: bool    # false for recipe-only (GPL/no-license)
```

All generated artifacts (Dockerfile, compose.yaml, catalog entries) derive from this manifest.

## Development Commands

### Building and Testing

Since this is an early-stage project being scaffolded, the following commands will be relevant once the tooling is built:

```bash
# Build runner images (digest-pinned, pushed to GHCR)
# Implementation: cd runners/<type> && docker buildx build --platform linux/amd64,linux/arm64 ...

# Generate flake artifacts from manifest
# Implementation: flake gen <name>  # manifest → Dockerfile/compose/README

# Create new flake from upstream repo
# Implementation: flake new <repo-url>

# Run smoke tests (MCP handshake + tools/list verification)
# Implementation: flake test <name>

# Update lockfile with current digests
# Implementation: flake lock

# Bring up/down a bundle
# Implementation: cd bundles/<project> && docker compose up -d
# Implementation: flake up <bundle>
```

### Consumption Paths (Priority Order)

1. **Docker MCP Gateway:** `docker mcp gateway run --catalog ghcr.io/mcp-flakes/catalog`
2. **Bundles:** `cd bundles/myproject && docker compose up -d`
3. **Direct:** `docker run -i --rm ghcr.io/mcp-flakes/<name>` with client config
4. **ToolHive:** Point `thv` at generated registry

## Critical Design Constraints

### Dockerfile + dockerfile_inline are Mutually Exclusive
Docker Compose will refuse to parse a build section with both. Always use real per-block Dockerfiles.

### docker/mcp-gateway Integration
- Gateway is a Docker CLI plugin: `docker mcp gateway run --catalog <ref>`
- Catalogs are OCI artifacts: `docker mcp catalog create/push/pull`
- **Gateway launches MCP server containers itself** from catalog `image:` entries on demand
- Compose services running alongside gateway are invisible unless registered as remote (HTTP/SSE) servers

### Reproducibility Requirements
- Pin upstream to commit SHA (not branch)
- Pin base/runner images by digest
- Use lockfile installs with frozen flags
- CI publishes `image@sha256:` digests into `generated/flake.lock`

### Podman Compatibility
- `podman-compose` ignores `dockerfile_inline` (use real Dockerfiles)
- Use docker compose CLI pointed at Podman socket: `DOCKER_HOST=unix://$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')`
- "Works on Podman" is a first-class CI check

### License and Distribution
- Redistributing built images is distribution under copyright law
- CI must record upstream license
- Push images only for permissive licenses (MIT/Apache/BSD)
- For GPL: comply (include source ref + license in image)
- **For no-license repos: ship recipe-only blocks** (`publish_image: false`)

### Runner Image Selection
- Default: debian-slim (not alpine - breaks native modules due to musl vs glibc)
- Keep alpine variant for size where it works
- Heavyweight deps (Playwright/Chromium, ffmpeg) need specialized runners
- Manifest `runner:` field selects base image

### Secrets Convention
- All block env vars must be `${VAR:-default}` pass-throughs
- Bundle-level `.env` is the override mechanism
- Never default values for `secret: true` vars
- Generate `.env.example` from manifest

## CI/CD Architecture (Phase 2)

When implemented, CI will:

1. **Build matrix:** Glob `flakes/*/flake.yaml` → `docker buildx bake` matrix → multi-arch (amd64+arm64)
2. **Smoke test as merge gate:** Spin image, MCP initialize → tools/list, assert tool names match manifest
3. **Drift watcher:** Nightly diff upstream HEAD vs pinned SHA → bump PR → smoke test decides auto-merge
4. **License detection:** Gates `publish_image` (e.g. `licensee`/`askalono`)
5. **Catalog publication:** Generate + `docker mcp catalog push ghcr.io/mcp-flakes/catalog` + ToolHive registry mirror

## Contribution Agent (Phase 3)

The agent that converts repos to flakes will:

1. Input: repo URL → output: **`flake.yaml` only** (never raw Dockerfiles)
2. Deterministic generator turns manifest into Dockerfile/compose/README
3. Sandbox validation: build + smoke test in isolated runner (no secrets, egress-restricted)
4. PR bot: Opens PR with manifest + generated files + smoke-test transcript
5. **Security policy:** Agent PRs never auto-merge for new upstreams; human review of manifest + repo reputation

## Positioning vs. Alternatives

| Project | Gap mcp-flakes Fills |
|---|---|
| Docker MCP Toolkit/Gateway | Curated & slow; no unbuilt repos; Desktop-only |
| ToolHive | New runtime to adopt; recipes aren't transparent |
| metorial/mcp-containers | No bundles/gateway integration/pinned builds |
| mcp-servers-nix | Requires Nix |

**Differentiation:** "Any MCP server. One compose file. Pinned, prebuilt, yours." No new daemon. Compose-native. Catalogs interoperable with Docker MCP and ToolHive.

## Phase 0 Spike Validation Criteria

Before building the framework, validate:

1. Build one hard-mode flake (unbuilt TS repo): pinned-SHA Dockerfile → GHCR → `docker mcp gateway run` → `tools/list` from Claude Code
2. Verify pull-first/build-fallback works without YAML edits
3. Podman compatibility on macOS: docker compose CLI → Podman socket
4. Test gateway "remote server" registration (Pattern B validation)
5. Reserve namespace (GitHub org + GHCR)

## Security and Supply Chain

- Pinned SHAs prevent silent upstream compromise
- License gates image publication
- No auto-merge for agent-generated PRs
- Image signing (cosign) + SBOM planned
- Smoke test as merge gate ensures every flake provably runs
- Document docker.sock = root-equivalent; offer socket-proxy variant

## Open Questions to Settle

- Pattern B (HTTP-wrapped servers) v1 inclusion vs defer?
- Multi-arch from day one or amd64-first?
- CLI: bash/just or Go binary?
- Monorepo forever or split library from framework later?
