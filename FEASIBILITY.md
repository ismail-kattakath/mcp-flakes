# Phase 0 Feasibility Test Results

**Date:** 2026-06-09  
**Test Subject:** Building MCP server flakes with pinned-SHA reproducibility and pull-first/build-fallback pattern

## Summary

✅ **FEASIBLE** - All core architectural patterns work as designed. The concept of "flakes" (pinned, prebuilt, instantly runnable MCP server containers) is validated.

## What We Tested

1. **Runner base images** - Digest-pinned Debian-slim images for Node and Python
2. **First real flake** - `filesystem` server from official modelcontextprotocol/servers repo
3. **Pinned-SHA builds** - Git clone with exact commit checkout
4. **Pull-first/build-fallback** - Docker Compose pattern with `image:` + `build:` 
5. **MCP protocol validation** - Initialize + tools/list handshake over stdio

## Test Results

### ✅ 1. Runner Base Images

Created two digest-pinned base images:
- `node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df` (node:20-slim)
- `python@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203` (python:3.12-slim)

Both include git and ca-certificates for cloning repos during build.

### ✅ 2. Pinned-SHA Dockerfile Build

Successfully built the `filesystem` flake from commit `275175cda17ca9c49920ceed2bcf27e12e59f8b2`.

**Key learning:** The official MCP servers repo is a **monorepo** with:
- Root `package.json` + `package-lock.json` 
- Subpackages in `src/*/`
- Build requires installing from root, then building specific subpackage

Solution: Clone entire repo, use root lockfile for `npm ci`, then build subpackage.

### ✅ 3. MCP Protocol Validation

Smoke test script successfully validated:
- **Initialize request** → Response with `protocolVersion: "2024-11-05"`
- **Tools/list request** → Response with 14 tools including:
  - read_file, read_text_file, read_media_file
  - write_file, edit_file
  - list_directory, search_files
  - create_directory, move_file
  - get_file_info, list_allowed_directories

The server speaks proper MCP protocol over stdio.

### ✅ 4. Pull-First/Build-Fallback Pattern

Docker Compose configuration:
```yaml
services:
  mcp-filesystem:
    image: ghcr.io/mcp-flakes/filesystem:latest
    build:
      context: .
      dockerfile: Dockerfile
```

**Verified behaviors:**
1. When image exists locally → Uses existing image (no build)
2. When image doesn't exist → Builds from source automatically
3. No YAML changes needed for either path

This is **exactly** what we need for "instant pull, automatic source fallback."

### ✅ 5. Manifest-Driven Architecture

Created `flake.yaml` manifest with:
- Upstream repo URL + pinned commit SHA
- License (MIT)
- Runner type (node)
- Build commands (install, build, entrypoint)
- Transport (stdio)
- Environment variables
- Tool list (for validation)
- Publish flag

The Dockerfile and compose.yaml can be **generated** from this manifest.

## Architecture Validations

### What Works Perfectly

1. **Digest-pinned base images** - Reproducible across builds ✅
2. **Monorepo handling** - Can build subpackages with shared lockfile ✅
3. **MCP stdio transport** - Works in containers without network ✅
4. **Compose pull/build pattern** - Native Docker Compose behavior ✅
5. **Smoke testing** - Can validate servers with JSON-RPC over stdio ✅

### Real-World Issues Encountered

1. **Monorepo detection required**
   - Can't assume `package-lock.json` exists in subpackage
   - Need to check for root lockfile and adapt Dockerfile
   - Solution: Generator script checks repo structure before creating Dockerfile

2. **No lockfile at all**
   - Some repos won't have `package-lock.json` / `pnpm-lock.yaml` / `requirements.txt.lock`
   - Need fallback: `npm install`, `pnpm install`, `pip install -r requirements.txt`
   - **Should flag in manifest:** `deterministic: false` for these cases

3. **Build warnings**
   - Upstream had 8 vulnerabilities (6 moderate, 2 critical) in dependencies
   - Not our problem to fix, but **should surface in CI/docs**
   - Users building from source get same warnings

## Architectural Adjustments Needed

### 1. Flake Manifest Schema Additions

Add fields to `flake.yaml`:
```yaml
upstream:
  repo_type: monorepo | single-package | no-lockfile
  lockfile: package-lock.json | pnpm-lock.yaml | null
  monorepo_subpath: src/filesystem  # if monorepo
build:
  deterministic: true | false  # false if no lockfile
```

### 2. Dockerfile Generation Templates

Need three Dockerfile templates:
- **Monorepo template** - Clone root, install from root lockfile, build subpackage
- **Single-package template** - Clone repo, install in place
- **No-lockfile template** - Use `npm install` with warning comment

### 3. Smoke Test as CI Gate

The smoke test script (`tools/smoke-test.sh`) works perfectly and should be:
1. Run on every PR that adds/changes a flake
2. Block merge if initialize or tools/list fails
3. Compare tool list against manifest's `tools:` array

### 4. Image Naming Convention

Current: `ghcr.io/mcp-flakes/<name>:latest`

Should also support:
- `ghcr.io/mcp-flakes/<name>:<version>` (from upstream package.json)
- `ghcr.io/mcp-flakes/<name>@sha256:<digest>` (for lockfile)

## What's Next (Phase 1)

Based on this feasibility test, proceed with:

1. **Finalize flake.yaml JSON Schema** - Add monorepo/lockfile detection fields
2. **Write Dockerfile generator** - Three templates, monorepo-aware
3. **Build 10 seed flakes** - Mix of:
   - ✅ Monorepo (filesystem - done)
   - Single-package TS repos
   - Single-package Python repos
   - No-lockfile repos
   - npx-published packages
   - uvx-published packages
4. **CI workflow** - Build matrix from `flakes/*/flake.yaml`
5. **Bundle example** - Compose file that includes multiple flakes

## Risks Validated or Mitigated

| Risk | Status |
|------|--------|
| MCP protocol over stdio in containers | ✅ **Works perfectly** |
| Pull-first/build-fallback pattern | ✅ **Native Compose behavior** |
| Pinned SHA reproducibility | ✅ **Git clone + checkout works** |
| Monorepo builds | ✅ **Handled with root lockfile** |
| Smoke testing feasibility | ✅ **JSON-RPC over stdin/stdout works** |
| Podman compatibility | ✅ **Used Podman for all tests** |

## Podman Notes

All tests run on **Podman** (not Docker Desktop) with:
- `docker` CLI pointed at Podman socket
- `docker compose` (not `podman-compose`)
- `docker build` via Podman buildx instance

No issues encountered. Podman compatibility is **first-class**.

## Files Created in This Test

```
mcp-flakes/
├── runners/
│   ├── node/Dockerfile          # Digest-pinned node:20-slim
│   └── python/Dockerfile        # Digest-pinned python:3.12-slim
├── flakes/
│   └── filesystem/
│       ├── flake.yaml           # Manifest source of truth
│       ├── Dockerfile           # Monorepo-aware build
│       ├── compose.yaml         # Pull-first pattern
│       └── README.md            # Usage docs
├── tools/
│   └── smoke-test.sh            # MCP protocol validator
└── FEASIBILITY.md               # This document
```

## Conclusion

The architecture from IDEA.md is **100% feasible** with minor adjustments for monorepo detection and no-lockfile handling.

**Ready to proceed to Phase 1:** Seed library of 10 flakes + generator tooling.

## Example Usage (What Works Right Now)

```bash
# Build a flake
cd flakes/filesystem
docker build -t ghcr.io/mcp-flakes/filesystem:latest .

# Test it speaks MCP
../../tools/smoke-test.sh ghcr.io/mcp-flakes/filesystem:latest

# Run it directly
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | \
  docker run -i --rm -e ALLOWED_DIRECTORIES=/tmp ghcr.io/mcp-flakes/filesystem:latest

# Use with Compose
docker compose up --no-start  # Creates container with env vars
docker compose run --rm mcp-filesystem  # Interactive stdio session
```

All of this works **today** with the files created in this test.
