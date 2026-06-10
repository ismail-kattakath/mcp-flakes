# 🎨 Aesthetics Wiki - Visual Culture Encyclopedia

> Originally created by [leonardoca1](https://github.com/leonardoca1/aesthetics-wiki-mcp) · Licensed under MIT  
> Packaged by [mcp-flakes](https://github.com/yourusername/mcp-flakes)

![PyPI package](https://img.shields.io/badge/PyPI-package-3776AB?logo=python) ![No auth required](https://img.shields.io/badge/auth-none-green) ![Tools: 5](https://img.shields.io/badge/tools-5-blue)

## 📋 What This Does

Explore thousands of visual aesthetics from the comprehensive [Aesthetics Wiki](https://aesthetics.fandom.com). From cottagecore to dark academia, vaporwave to goblincore, this server provides structured access to aesthetic movements, their visual elements, key colors, fashion, music, and cultural contexts.

## ⚡ Quick Start

```bash
docker run -i --rm ghcr.io/mcp-flakes/aesthetics-wiki-mcp:latest
```

Or install directly:
```bash
pip install aesthetics-wiki-mcp
# or with uvx
uvx aesthetics-wiki-mcp
```

## 🎯 Perfect For

- **Creative projects** - Research visual styles, color palettes, and design elements for branding or art direction
- **Content creation** - Discover aesthetic themes for mood boards, photography, or social media content
- **Cultural research** - Understand aesthetic movements, their origins, and cultural significance
- **Design inspiration** - Get random aesthetics for creative sparks or explore related visual styles

## 🛠️ Tools & Features

| Tool | Purpose | Key Parameters |
|------|---------|---------------|
| `search_aesthetic` | Full-text search across all aesthetics | `query`, `limit` (default: 10) |
| `get_aesthetic` | Fetch complete page content + main image | `name`, `max_chars` (default: 6000) |
| `get_aesthetic_images` | Get gallery of images from a page | `name`, `limit` (default: 12) |
| `list_related` | Discover linked/related aesthetics | `name`, `limit` (default: 20) |
| `random_aesthetic` | Random aesthetic discovery | `count` (default: 1) |

## 📚 Examples

### Example 1: Research a Specific Aesthetic
Ask Claude: *"Get information about 'Dark Academia' including images and related aesthetics"*

Returns the full page content, main image URL, and a list of related styles like Light Academia, Gothic, or Romantic Academia.

### Example 2: Creative Brainstorming
Ask Claude: *"Give me 3 random aesthetics for inspiration"*

Perfect for breaking creative blocks or discovering new visual directions.

### Example 3: Build a Mood Board
Ask Claude: *"Search for aesthetics related to 'vintage' and get image galleries for the top 3 results"*

Compile visual references for design projects.

### Example 4: Explore a Style Family
Ask Claude: *"Show me all aesthetics related to 'Vaporwave' and summarize their key differences"*

Understand the nuances between related visual movements.

## 🔗 Works Great With

- **excalidraw-architect-mcp** - Create visual style guides or mood board architectures based on aesthetic research
- **fetch** - Scrape referenced websites or artist portfolios mentioned in aesthetic pages
- **everything** - Combine aesthetic image resources with other MCP content types for richer creative workflows

## 🔧 Configuration

### Environment Variables

**None required** - Uses the public MediaWiki API (no authentication needed).

### Build Pattern

**Type**: PyPI published package  
**Base Image**: `python:3.12-slim`

Installs from PyPI for fast, reliable deployment.

## 📦 Source & Compliance

- **Repository**: https://github.com/leonardoca1/aesthetics-wiki-mcp
- **Commit**: `70dcd681ebbdfdfc8ce7b30347bb5708c48b1b41`
- **License**: MIT
- **Protocol**: stdio transport
- **Data Source**: [Aesthetics Wiki on Fandom](https://aesthetics.fandom.com)
