# Contributing to mcp-flakes

Thank you for your interest in contributing! This project aims to make MCP servers easily accessible through Docker containers.

## Quick Start

1. **Pick an MCP server** from [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)
2. **Check if it exists** - Browse [`flakes/`](flakes/) to avoid duplicates
3. **Verify license** - Must be open source (see [License Policy](#license--attribution))
4. **Create flake** - See [Creating a Flake](#creating-a-flake) below

## Creating a Flake

### Manual Method (Current)

1. **Create directory**: `mkdir -p flakes/<name>`

2. **Create flake.yaml**:
```yaml
name: <name>
upstream:
  repo: https://github.com/owner/repo
  commit: <sha>  # Pin to exact commit
  license: MIT  # Verify from upstream
runner: node  # or python
build:
  install: npm ci  # or pip install
  build: npm run build  # if needed
  entrypoint: ["node", "dist/index.js"]
transport: stdio
env:
  - name: API_KEY
    required: false
    secret: true
    description: Your API key
tools:
  - tool_name_1
  - tool_name_2
publish_image: true
```

3. **Create Dockerfile** - See [patterns in PATTERNS.md](PATTERNS.md)

4. **Create compose.yaml**:
```yaml
services:
  mcp-<name>:
    image: ghcr.io/mcp-flakes/<name>:latest
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - API_KEY=${API_KEY:-}
    stdin_open: true
    tty: false
```

5. **Create README.md** - Document tools, env vars, usage

6. **Build and test**:
```bash
cd flakes/<name>
docker build --load -t ghcr.io/mcp-flakes/<name>:latest .
../../tools/smoke-test.sh ghcr.io/mcp-flakes/<name>:latest
```

### Agent Method (Coming Soon)

```bash
# Future: One command to create flake
./tools/create-flake.sh https://github.com/owner/repo
```

## License & Attribution

**Every flake MUST include proper attribution.** This is non-negotiable.

### Required Files

1. **ATTRIBUTION.md** in flake directory:
```markdown
# Attribution

This flake packages the [Server Name] MCP server.

## Original Work
- **Repository**: [github-url]
- **Commit**: [sha]
- **Authors**: [names from package.json]
- **License**: [license type]
- **Copyright**: [from LICENSE file]

## License Compliance
Full license text: [link to upstream]

## Modifications
This flake adds Docker containerization only.
No modifications to original server code.

## Credits
1. Original authors: [names] - [repo]
2. This packaging: mcp-flakes
```

2. **README.md** must start with:
```markdown
# 🎯 [Server Name]

> Originally created by [Author](profile-url) · Licensed under [License]  
> Packaged by [mcp-flakes](https://github.com/ismail-kattakath/mcp-flakes)

---
```

3. **Dockerfile** must include labels:
```dockerfile
FROM node@sha256:...

# Labels for attribution
LABEL org.opencontainers.image.source="[upstream-url]"
LABEL org.opencontainers.image.authors="[authors]"
LABEL org.opencontainers.image.licenses="[license]"
LABEL ai.mcp.flake.upstream.repo="[url]"
LABEL ai.mcp.flake.upstream.commit="[sha]"
```

4. **flake.yaml** must include:
```yaml
compliance:
  license_verified: true
  authors: ["Author Name"]
  copyright: "© 2024 Author Name"
  last_checked: 2024-06-09
```

### License Types

See [LICENSE_POLICY.md](LICENSE_POLICY.md) for full details.

**Allowed for image publishing:**
- ✅ MIT, Apache-2.0, BSD-2/3-Clause, ISC

**Recipe-only (no image publishing):**
- ⚠️ GPL-2.0, GPL-3.0, AGPL-3.0, LGPL
- ⚠️ No license / Proprietary

Set `publish_image: false` for recipe-only flakes.

### Automated Checks

PR checks will fail if:
- ❌ No ATTRIBUTION.md
- ❌ README missing credits
- ❌ Dockerfile missing labels
- ❌ License not verified
- ❌ flake.yaml missing compliance section

## Testing

Every flake must pass smoke tests:

```bash
./tools/smoke-test.sh ghcr.io/mcp-flakes/<name>:latest
```

Tests verify:
1. MCP protocol initialization
2. tools/list returns expected tools
3. Server responds correctly

## Code Standards

### Dockerfile Best Practices

1. **Pin everything**:
   - Base images by digest: `FROM node@sha256:...`
   - Upstream commit: `git checkout <sha>`
   - Package versions: `npm install pkg@x.y.z`

2. **Use multi-stage builds** for size:
```dockerfile
FROM node@sha256:... AS builder
RUN npm ci && npm run build

FROM node@sha256:...
COPY --from=builder /app/dist /app/dist
```

3. **Clean up** to reduce image size:
```dockerfile
RUN apt-get update && apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*
```

### flake.yaml Standards

- Use lowercase kebab-case for `name`
- Always pin `commit` to exact SHA (not branch)
- List ALL tools (for validation)
- Document ALL environment variables
- Mark secrets with `secret: true`

## Pull Request Process

1. **Fork** the repository
2. **Create branch**: `git checkout -b add-flake-<name>`
3. **Create flake** with all required files
4. **Build and test** locally
5. **Commit** with descriptive message
6. **Push** and open PR

### PR Template

```markdown
## Adding flake: <name>

**Upstream**: [repo-url]
**License**: MIT (verified)
**Pattern**: [monorepo/single-repo/npm-package/python]

### Checklist
- [ ] flake.yaml created with all fields
- [ ] Dockerfile pins all dependencies
- [ ] compose.yaml follows standard pattern
- [ ] README.md has attribution header
- [ ] ATTRIBUTION.md created
- [ ] Dockerfile has OCI labels
- [ ] Smoke test passes locally
- [ ] License verified and compatible

### Test Results
```bash
$ ./tools/smoke-test.sh ghcr.io/mcp-flakes/<name>:latest
✅ Initialize succeeded
✅ Tools list succeeded
Available tools:
  - tool1
  - tool2
```

## Community Guidelines

- **Be respectful** - Credit original authors prominently
- **Be accurate** - Verify licenses, don't guess
- **Be helpful** - Document clearly for others
- **Be responsive** - Address PR feedback promptly

## Questions?

- **General questions**: Open a [Discussion](../../discussions)
- **Bug reports**: Open an [Issue](../../issues)
- **Feature requests**: Open an [Issue](../../issues)

## Recognition

Contributors are recognized in:
- Git commit history
- GitHub contributors page
- Project acknowledgments

Thank you for helping make MCP servers more accessible!

---

**Need help?** Check:
- [PATTERNS.md](PATTERNS.md) - Build pattern examples
- [LICENSE_POLICY.md](LICENSE_POLICY.md) - License handling
- [LEARNINGS.md](LEARNINGS.md) - Project insights
