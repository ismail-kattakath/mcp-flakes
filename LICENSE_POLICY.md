# License Policy

This document defines how mcp-flakes handles licensing and attribution for packaged MCP servers.

## Core Principles

1. **Respect upstream licenses** - We honor all original license terms
2. **Give proper credit** - Original authors always credited prominently
3. **Transparency** - License info visible in all artifacts
4. **Compliance by default** - Automated checks enforce attribution

## License Types & Handling

### ✅ Permissive Licenses (Image Publishing Allowed)

We can build and publish Docker images for these licenses:

- **MIT License** - Most common, very permissive
- **Apache License 2.0** - Patent grant included
- **BSD 2-Clause** - Simple permissive
- **BSD 3-Clause** - Adds non-endorsement clause
- **ISC License** - Similar to MIT, simpler wording
- **CC0-1.0** - Public domain dedication

**Our compliance**:
- Include full LICENSE file in image
- Credit authors in README, Dockerfile, and labels
- Link to upstream repository

### ⚠️ Copyleft Licenses (Recipe-Only Distribution)

For these licenses, we provide **build recipes only** (Dockerfile + compose.yaml). Users build the image themselves:

- **GPL-2.0** - Strong copyleft
- **GPL-3.0** - Updated GPL with anti-TiVo clause
- **AGPL-3.0** - Network copyleft (server use = distribution)
- **LGPL-2.1** - Library GPL, linking allowed
- **LGPL-3.0** - Updated LGPL

**Our compliance**:
- Provide complete build instructions
- Link to full source code
- Include LICENSE file reference
- Document GPL obligations for users
- Set `publish_image: false` in flake.yaml

**Why recipe-only?**  
Publishing pre-built images of GPL code makes us distributors, requiring us to provide source and comply with GPL. Recipe-only lets users build directly from source.

### 🔴 Problematic Licenses (Special Handling)

- **No license / All Rights Reserved** - Recipe-only + warning
- **Proprietary licenses** - Contact author for permission
- **Custom licenses** - Manual review required
- **Dual licenses** - Choose compatible option

**Handling no-license repos**:
```yaml
# flake.yaml
upstream:
  license: "No license (all rights reserved)"
publish_image: false
notes: |
  This repository has no license file. Under copyright law,
  no license means all rights reserved. We provide build
  instructions only. Contact the author for licensing terms.
```

## Attribution Requirements

Every flake MUST include:

### 1. ATTRIBUTION.md File

```markdown
# Attribution

Original work: [repo-url]
Authors: [names]
License: [license]
Copyright: [copyright notice]

Full credits: [link to upstream]
This packaging: mcp-flakes
```

### 2. README.md Header

```markdown
# 🎯 [Server Name]

> Originally created by [Author](profile) · Licensed under [License]  
> Packaged by [mcp-flakes](repo-url)
```

### 3. Dockerfile Comments

```dockerfile
# Original work: [repo-url]
# Authors: [names]
# License: [license]
# This flake adds Docker packaging only
```

### 4. OCI Image Labels

```dockerfile
LABEL org.opencontainers.image.source="[upstream-url]"
LABEL org.opencontainers.image.authors="[authors]"
LABEL org.opencontainers.image.licenses="[license]"
LABEL ai.mcp.flake.upstream.repo="[url]"
LABEL ai.mcp.flake.upstream.commit="[sha]"
```

### 5. Docker Compose Labels

```yaml
labels:
  - "org.opencontainers.image.source=[url]"
  - "org.opencontainers.image.licenses=[license]"
```

## Verification Process

### Automated Checks (CI)

Every PR must pass:

1. **License detection** - Using `licensee` or similar tool
2. **Attribution presence** - ATTRIBUTION.md exists and is complete
3. **README credits** - Top section has author credit
4. **Dockerfile labels** - OCI labels present
5. **flake.yaml compliance** - License field matches upstream

### Manual Review

Human reviewer checks:

1. **License accuracy** - Matches upstream LICENSE file
2. **Author names correct** - From package.json or AUTHORS file
3. **Copyright years** - Accurate based on git history
4. **Special terms** - Any non-standard license conditions

## License Change Detection

We monitor upstream for license changes:

1. **Monthly check** - Automated job fetches current LICENSE
2. **Diff comparison** - Compare against recorded license
3. **Alert on change** - Open issue if license changes
4. **Update process** - Review new license, update flake

```yaml
# .github/workflows/license-watch.yml
schedule:
  - cron: '0 0 1 * *'  # Monthly
```

## Special Cases

### Monorepos with Multiple Licenses

Example: Official MCP servers repo

```yaml
# flake.yaml
upstream:
  license: MIT  # Root license
  subpackage_license: MIT  # Specific package license
notes: |
  This monorepo has a root MIT license. The specific
  subpackage (src/filesystem) also uses MIT.
```

### Dependencies with Different Licenses

We document the full dependency tree:

```markdown
# ATTRIBUTION.md

## Dependencies

- @modelcontextprotocol/sdk - MIT License
- zod - MIT License
- [full list...]

All dependencies checked: [date]
```

### Upstream Without LICENSE File

```yaml
# flake.yaml
upstream:
  license: "Unspecified (assumed all rights reserved)"
publish_image: false
compliance:
  license_verified: false
  notes: "No LICENSE file found at commit [sha]. Recipe-only distribution."
```

## User Obligations

When using mcp-flakes:

### If Using Pre-Built Images

✅ You can use directly - we've handled compliance  
✅ Credit original authors if you redistribute  
✅ Check individual flake license for any restrictions

### If Building from Recipes

⚠️ You are building directly from upstream source  
⚠️ You must comply with upstream license terms  
⚠️ Check LICENSE file in upstream repo  
⚠️ For GPL: You become the distributor if you share images

## Contributing Flakes

When adding a new flake:

1. **Check license** - `curl -L [repo]/blob/[commit]/LICENSE`
2. **Verify compatibility** - Use decision matrix above
3. **Set publish_image** - Based on license type
4. **Generate attribution** - Run compliance agent
5. **Add all credits** - README, Dockerfile, labels

Our automated checks will enforce this.

## Questions?

- **"Can I use mcp-flakes commercially?"** - Yes, for images we publish. Check individual licenses for terms.
- **"Do I need to credit mcp-flakes?"** - Appreciated but not required. Credit original authors.
- **"What if upstream license changes?"** - We'll detect it and update. Old images remain under old license.
- **"Can I add a proprietary server?"** - Get author permission first, then recipe-only.

## References

- [Open Source Initiative](https://opensource.org/licenses)
- [Choose A License](https://choosealicense.com/)
- [GitHub Licensing Guide](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
- [OCI Image Spec - Annotations](https://github.com/opencontainers/image-spec/blob/main/annotations.md)

---

**Policy Version**: 1.0  
**Last Updated**: 2024-06-09  
**Maintained by**: mcp-flakes project
