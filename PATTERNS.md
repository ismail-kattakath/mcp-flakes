# MCP Flake Build Patterns

This document catalogs all the build patterns we've learned from implementing 16+ real MCP servers.

## Pattern Summary

| Pattern | Count | Examples | Key Learnings |
|---------|-------|----------|---------------|
| Official monorepo | 6 | filesystem, fetch, memory, time, git, sequentialthinking, everything | Shared root package-lock.json, build subpackage |
| Third-party single-repo | 6 | github, postgres, sqlite, spotify, metmuseum, open-library | Each has own lockfile or no lockfile |
| Published npm packages | 3 | a2asearch, clirank, astronomy-oracle | `npm install -g <package>`, fastest builds |
| Python (pending) | ? | agents working | uvx packages vs pip install patterns |
| No-build JS (pending) | ? | agents working | Pure JS, just npm install |

## Detailed Patterns

### 1. Official Monorepo Pattern (TypeScript)

**Repos**: https://github.com/modelcontextprotocol/servers

**Structure:**
```
repo/
├── package.json (workspace root)
├── package-lock.json (SHARED)
└── src/
    ├── filesystem/
    │   ├── package.json
    │   └── src/index.ts
    └── memory/
        ├── package.json
        └── src/index.ts
```

**Dockerfile pattern:**
```dockerfile
FROM node@sha256:<digest>
RUN apt-get update && apt-get install -y git ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /repo
RUN git clone --depth=1 <repo> . && \
    git fetch --depth=1 origin <sha> && \
    git checkout <sha>
RUN npm ci  # Uses root package-lock.json
RUN cd src/<subpackage> && npm run build
WORKDIR /repo/src/<subpackage>
ENTRYPOINT ["node", "dist/index.js"]
```

**Key points:**
- Clone ENTIRE repo, don't try to extract subpackage
- Run `npm ci` at root (installs all workspace dependencies)
- Build specific subpackage with `cd src/X && npm run build`
- Set WORKDIR to subpackage for entrypoint

**Tools discovered from:**
- filesystem: 14 file operations
- fetch: HTTP requests
- memory: Knowledge graph
- time: Timezone operations
- git: Git repository operations
- sequentialthinking: Structured reasoning
- everything: Multi-capability aggregator

### 2. Published NPM Package Pattern

**Examples**: a2asearch, clirank, astronomy-oracle

**Dockerfile pattern:**
```dockerfile
FROM node@sha256:<digest>
RUN npm install -g <package-name>@<version>
WORKDIR /app
ENTRYPOINT ["npx", "<package-name>"]
```

**Key points:**
- FASTEST pattern - no git clone, no build
- Pin version: `<package>@x.y.z`
- Use `npx` as entrypoint (finds globally installed packages)
- Can also use `npx -y <package>` to ensure latest

**flake.yaml additions:**
```yaml
upstream:
  package: <npm-package-name>
  package_version: x.y.z
build:
  type: npm-package
  install: npm install -g <package>@x.y.z
  entrypoint: ["npx", "<package>"]
```

**Validation:**
- ✅ a2asearch - 3 tools (search_agents, get_agent, list_agents)
- ✅ clirank - 9 tools (API intelligence)
- ✅ astronomy-oracle - 3 tools (astronomical catalog)

All passed smoke tests on first try!

### 3. Single-Package TypeScript Repo

**Examples**: github, spotify (if TS), open-library, metmuseum

**Structure:**
```
repo/
├── package.json
├── package-lock.json (MAY OR MAY NOT EXIST)
├── tsconfig.json
└── src/
    └── index.ts
```

**Dockerfile pattern (with lockfile):**
```dockerfile
FROM node@sha256:<digest>
RUN apt-get update && apt-get install -y git ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /repo
RUN git clone --depth=1 <repo> . && \
    git fetch --depth=1 origin <sha> && \
    git checkout <sha>
RUN npm ci
RUN npm run build
ENTRYPOINT ["node", "dist/index.js"]
```

**Dockerfile pattern (NO lockfile):**
```dockerfile
# Same as above but:
RUN npm install  # Not npm ci
```

**Key points:**
- If package-lock.json exists → `npm ci` (deterministic)
- If NO lockfile → `npm install` (non-deterministic, flag in manifest)
- Build usually just `npm run build` (runs tsc)
- Check package.json "bin" field for entrypoint

### 4. Database Servers Pattern

**Examples**: postgres, sqlite

**Key differences:**
- Require environment variables (DATABASE_URL, connection strings)
- May need database client libraries
- Usually API-key-free but need accessible database

**flake.yaml:**
```yaml
env:
  - name: DATABASE_URL
    required: true
    secret: true
    description: PostgreSQL connection string
```

**compose.yaml:**
```yaml
environment:
  - DATABASE_URL=${DATABASE_URL:-postgresql://localhost:5432/mydb}
```

### 5. API Wrapper Pattern

**Examples**: github, spotify, metmuseum, open-library

**Characteristics:**
- Usually need API keys/tokens (except free public APIs)
- flake.yaml marks env vars as `secret: true`
- README documents how to get API keys
- Server should respond to initialize even without keys (may have limited/no tools until configured)

**Environment pattern:**
```yaml
env:
  - name: GITHUB_TOKEN
    required: false  # or true
    secret: true
    description: GitHub personal access token
  - name: API_BASE_URL
    required: false
    secret: false
    description: Override default API endpoint
```

### 6. Python Patterns (In Progress - Agent 5)

**Expected patterns:**

**Published to PyPI (uvx):**
```dockerfile
FROM python@sha256:<digest>
RUN pip install <package>
# or
RUN uvx install <package>
ENTRYPOINT ["python", "-m", "<module>"]
```

**Source build:**
```dockerfile
FROM python@sha256:<digest>
RUN apt-get update && apt-get install -y git ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /repo
RUN git clone ... && git checkout <sha>
RUN pip install -r requirements.txt
# or
RUN uv sync --frozen
ENTRYPOINT ["python", "src/main.py"]
```

### 7. No-Build JavaScript Pattern (In Progress - Agent 6)

**Expected pattern:**
```dockerfile
FROM node@sha256:<digest>
RUN apt-get update && apt-get install -y git ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /repo
RUN git clone ... && git checkout <sha>
RUN npm ci
# NO BUILD STEP
ENTRYPOINT ["node", "index.js"]
```

**Identifying characteristics:**
- No tsconfig.json
- package.json has no "build" script or build is optional
- Main file is .js not .ts
- Rare but good to support

## Edge Cases & Lessons

### Monorepo Detection

**Problem:** Can't assume package.json is in same dir as code

**Solution:**
1. Check if repo root has package-lock.json but subpackages don't
2. If yes → monorepo pattern (npm ci at root)
3. If no → single-package pattern

**Manifest field to add:**
```yaml
upstream:
  repo_type: monorepo | single-package
  monorepo_subpath: src/filesystem  # if monorepo
```

### No Lockfile Handling

**Problem:** Some repos have no package-lock.json, pnpm-lock.yaml, or requirements.txt

**Solution:**
- Fall back to `npm install` / `pip install -r requirements.txt`
- Flag in manifest as non-deterministic
- Document that builds may vary over time

**Manifest field:**
```yaml
build:
  deterministic: false  # No lockfile
  lockfile: null
```

### API Keys & Credentials

**Problem:** Many servers need API keys but should still be buildable

**Solution:**
- Document all env vars clearly
- Mark as `required: false` when server can start without them
- Mark as `secret: true` for sensitive values
- Generate `.env.example` from manifest

### Transport Types

**All servers so far:** stdio

**Need to test:** HTTP, SSE, WebSocket (Pattern B from IDEA.md)

## Generator Script Implications

Based on these patterns, the flake generator needs:

1. **Repo type detection:**
   - Check for root package.json + subdirectory package.json → monorepo
   - Check for tsconfig.json → needs build
   - Check for package-lock.json vs none → npm ci vs npm install

2. **Three Dockerfile templates:**
   - Monorepo (official MCP servers style)
   - Single-package with build
   - No-build pure JS

3. **Language detection:**
   - package.json → Node
   - requirements.txt / pyproject.toml → Python
   - go.mod → Go (future)

4. **Package vs source:**
   - If published to npm/pypi → use package install pattern
   - If not → use git clone pattern

## Success Rate

**Built so far:** 16 flakes  
**Smoke test pass rate:** 100% (16/16)

**Breakdown:**
- Official monorepo: 6/6 ✅
- Third-party single-repo: 6/6 ✅
- Published packages: 3/3 ✅
- Python: Pending
- No-build JS: Pending

## Next Patterns to Test

1. ✅ Published packages (npm) - Done
2. 🚧 Published packages (pypi/uvx) - Agent working
3. 🚧 No-build JavaScript - Agent working
4. ⏳ pnpm monorepo
5. ⏳ HTTP transport (Pattern B)
6. ⏳ Go binary builds
7. ⏳ Rust binary builds
8. ⏳ C#/.NET builds

## Common Gotchas

1. **Always check for monorepo** - Can't assume package-lock.json is local
2. **Pin everything** - Commit SHAs, image digests, package versions
3. **Don't guess tool names** - Read README or smoke test to get actual tool list
4. **API keys are optional for build** - Server should respond to initialize without keys
5. **Use debian-slim not alpine** - Native modules break on musl
6. **npm ci fails without lockfile** - Fall back to npm install
7. **Workspace roots matter** - In monorepo, install from root before building subpackage

## Documentation from Patterns

Every flake now includes:
- `flake.yaml` - Single source of truth
- `Dockerfile` - Pinned, reproducible build
- `compose.yaml` - Image + build fallback
- `README.md` - Tools, env vars, usage

This makes every flake self-documenting and reviewable.
