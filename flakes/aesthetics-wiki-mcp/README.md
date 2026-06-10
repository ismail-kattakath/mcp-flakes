# Aesthetics Wiki MCP Server

MCP server for the [Aesthetics Wiki](https://aesthetics.fandom.com). Search, read, and discover thousands of visual aesthetics (cottagecore, dark academia, y2k, goblincore, and many more).

## Installation

This server is published to PyPI and can be installed with:

```bash
pip install aesthetics-wiki-mcp
```

Or run directly with uvx:

```bash
uvx aesthetics-wiki-mcp
```

## Build Pattern

**Type**: PyPI published package

**Base Image**: `python:3.12-slim`

This flake uses the simpler PyPI installation pattern since the package is published and maintained on PyPI.

## Tools

- `search_aesthetic(query, limit=10)` - Full-text search across the wiki
- `get_aesthetic(name, max_chars=6000)` - Fetch a page's cleaned content + main image URL
- `get_aesthetic_images(name, limit=12)` - Gallery of image URLs from a page
- `list_related(name, limit=20)` - List aesthetics linked from a page
- `random_aesthetic(count=1)` - Pick random aesthetics for inspiration

## Environment Variables

None required - the server uses the public MediaWiki API.

## Source

- **Repository**: https://github.com/leonardoca1/aesthetics-wiki-mcp
- **Commit**: `70dcd681ebbdfdfc8ce7b30347bb5708c48b1b41`
- **License**: MIT
