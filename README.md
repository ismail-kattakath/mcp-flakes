# mcp-flakes

> Any MCP server. One compose file. Pinned, prebuilt, yours.

A community library of self-contained, deterministic "flakes" — Docker Compose recipes that turn *any* MCP server (npx/uvx packages, unbuilt GitHub repos, raw scripts) into an isolated, prebuilt, instantly runnable container.

**Status**: ✅ **Proven feasible** — 22 working flakes built with 100% success rate

## What is this?

**Problem**: MCP servers are scattered across GitHub, use different languages, build systems, and dependency managers. Setting them up is manual and error-prone.

**Solution**: Each "flake" is a self-contained recipe (Dockerfile + compose.yaml + manifest) that:
- Pins to exact commit SHA for reproducibility
- Builds from source with frozen dependencies
- Publishes prebuilt images to GHCR (instant pull)
- Falls back to source build automatically
- Documents tools, env vars, and usage

**Philosophy**: Everything is a compose file. No new daemon, no new CLI. Human-readable, AI-writable, git-reviewable recipes.

## Quick Start

### Use a flake

```bash
# Clone the repo
git clone https://github.com/ismail-kattakath/mcp-flakes.git
cd mcp-flakes

# Pick a flake (e.g., filesystem)
cd flakes/filesystem

# Run it (pulls prebuilt image or builds from source)
docker compose run --rm mcp-filesystem
```

### See what's available

We have 22 working flakes across diverse categories:

**Developer Tools**: filesystem, git, github, fetch, sequentialthinking, everything  
**Databases**: postgres, sqlite  
**APIs**: spotify, metmuseum, open-library, mcp-market-data  
**Search/Discovery**: a2asearch, clirank  
**Knowledge**: memory, aesthetics-wiki, shahnameh  
**Utilities**: time, astronomy-oracle, mcp-compress  
**Creative**: excalidraw-architect, claude-terminal

Browse: [`flakes/`](flakes/)

## Architecture

```
mcp-flakes/
├── runners/          # Digest-pinned base images (node, python)
├── flakes/           # One directory per MCP server
│   └── <name>/
│       ├── flake.yaml      # Source of truth (metadata + build config)
│       ├── Dockerfile      # Pinned-SHA reproducible build
│       ├── compose.yaml    # Pull-first, build-fallback pattern
│       └── README.md       # Generated docs
├── tools/            # Smoke test harness
└── docs/             # Pattern documentation
```

### Key Design Decisions

1. **Single source of truth**: `flake.yaml` manifest generates Dockerfile, compose.yaml, README
2. **Pinned everything**: Commit SHAs, image digests, package versions
3. **Pull-first, build-fallback**: Native Docker Compose pattern with `image:` + `build:`
4. **Smoke tests as merge gate**: Every flake must pass MCP initialize + tools/list
5. **Podman compatible**: Real Dockerfiles, no `dockerfile_inline`

## Patterns Supported

We've validated **7 distinct build patterns** across 22 real servers:

| Pattern | Count | Build Time | Examples |
|---------|-------|------------|----------|
| Official monorepo (TypeScript) | 6 | 60-90s | filesystem, memory, git |
| Single-repo TypeScript | 6 | 30-60s | github, metmuseum, open-library |
| Published npm packages | 3 | 5-10s | a2asearch, clirank, astronomy-oracle |
| Python with uv | 3 | 8-15s | fetch, time, spotify |
| pnpm-based | 1 | 35s | metmuseum |
| API-key-free | 12 | - | filesystem, memory, open-library |
| API-key-required | 10 | - | github, spotify, postgres |

All documented in [PATTERNS.md](PATTERNS.md).

## Documentation

- **[CLAUDE.md](CLAUDE.md)** - Guidance for future Claude Code instances working in this repo
- **[IDEA.md](IDEA.md)** - Original research findings and execution plan
- **[FEASIBILITY.md](FEASIBILITY.md)** - Phase 0 spike validation results
- **[PATTERNS.md](PATTERNS.md)** - Catalog of all build patterns learned
- **[LEARNINGS.md](LEARNINGS.md)** - Comprehensive analysis of what we learned building 22 flakes

## Example: filesystem flake

```yaml
# flakes/filesystem/flake.yaml
name: filesystem
upstream:
  repo: https://github.com/modelcontextprotocol/servers
  commit: 275175cda17ca9c49920ceed2bcf27e12e59f8b2
  license: MIT
  subpath: src/filesystem
runner: node
build:
  install: npm ci
  build: npm run build
  entrypoint: ["node", "dist/index.js"]
transport: stdio
env:
  - name: ALLOWED_DIRECTORIES
    required: false
    description: Comma-separated list of directories
tools:
  - read_file
  - write_file
  - list_directory
  - search_files
  # ... 10 more
publish_image: true
```

This manifest generates Dockerfile, compose.yaml, and README automatically.

## Testing

Every flake must pass smoke tests:

```bash
./tools/smoke-test.sh ghcr.io/mcp-flakes/<name>:latest
```

Tests:
1. MCP initialize handshake
2. tools/list returns expected tools
3. Server responds correctly to stdio

**Current pass rate**: 22/22 (100%)

## Contributing (Coming Soon)

The goal: **Users spawn agents to add their favorite MCPs themselves.**

We've proven with 6 parallel agents that:
- ✅ Agents can work independently on different flakes
- ✅ Patterns are documentable and generator-ready
- ✅ Smoke tests catch issues automatically
- ✅ PRs are reviewable (30-line manifest vs 60-line Dockerfile)

**Next phase**: Build the contribution agent that converts any GitHub MCP server URL to a working flake in 2-5 minutes.

## Roadmap

### Phase 1: Foundation (Current)
- ✅ Runner base images
- ✅ 22 seed flakes with diverse patterns
- ✅ Smoke test harness
- ✅ Pattern documentation
- ✅ Proof of agent parallelism

### Phase 2: Automation (Next)
- [ ] flake.yaml JSON Schema
- [ ] Dockerfile generator (5 templates)
- [ ] CI workflow (build matrix + smoke tests)
- [ ] Catalog generator (docker mcp format)
- [ ] 10 more seed flakes

### Phase 3: Contribution Agent
- [ ] Agent that converts GitHub URL → validated flake
- [ ] PR automation with smoke test results
- [ ] Security review workflow
- [ ] Rate limit handling for GitHub API

### Phase 4: Scale
- [ ] HTTP/SSE transport support (Pattern B)
- [ ] Bundle examples
- [ ] Docker MCP gateway integration
- [ ] ToolHive registry mirror
- [ ] 100+ flakes

## Positioning

| Project | What it does | What mcp-flakes adds |
|---------|-------------|---------------------|
| Docker MCP Toolkit | Official images + gateway | Covers unbuilt repos, transparent recipes, no Desktop requirement |
| ToolHive | Runs any MCP in containers | No new daemon, compose-native, git-reviewable recipes |
| metorial/mcp-containers | Daily-rebuilt images | Pinned reproducibility, bundle composition, smoke-tested |
| mcp-servers-nix | Nix flakes for MCPs | No Nix required, Docker-native, broader audience |

**Unique value**: "Everything is a compose file" + agent-generated contributions + catalog interoperability

## License

MIT - See [LICENSE](LICENSE)

## Acknowledgments

Built with Claude Code by exploring patterns from:
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) - Official MCP servers
- [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) - Community server list
- 6 parallel Claude Code agents + main thread

---

**Status**: Phase 1 complete. Ready for Phase 2 (generator + CI).

🎯 **Goal proven**: Users will be able to spawn agents that add their favorite MCPs themselves.
