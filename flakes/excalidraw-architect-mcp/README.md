# Excalidraw Architect MCP Server

MCP server that generates beautiful Excalidraw architecture diagrams with perfect auto-layout, stateful editing, and architecture-aware component styling. Includes a living architecture knowledge graph feature.

## Installation

This server is published to PyPI and can be installed with:

```bash
pip install excalidraw-architect-mcp[png]
```

Or run directly with uvx:

```bash
uvx excalidraw-architect-mcp
```

## Build Pattern

**Type**: PyPI published package with optional dependencies

**Base Image**: `python:3.12-slim`

This flake installs the `[png]` extras to enable PNG export support via cairosvg. SVG export works without additional dependencies.

## Features

- **Perfect layouts every time** - Sugiyama algorithm with adaptive spacing
- **Architecture-aware styling** - 50+ technology mappings (Kafka, PostgreSQL, Redis, etc.)
- **Stateful editing** - Modify existing diagrams with natural language
- **Mermaid conversion** - Convert Mermaid diagrams to Excalidraw
- **Knowledge graph** - Maintain architecture as a version-controlled model in `.claude/architecture.md`
- **Export to SVG/PNG** - No browser required

## Tools

### Diagram Tools
- `create_diagram` - Create new diagram from structured data
- `mermaid_to_excalidraw` - Convert Mermaid to Excalidraw
- `modify_diagram` - Edit existing diagrams
- `get_diagram_info` - Read current diagram state
- `export_diagram` - Export to SVG or PNG

### Knowledge Graph Tools (25 total)
- `kg_init` - Create architecture knowledge graph
- `kg_add_service` / `kg_remove_service` - Manage services
- `kg_link` / `kg_unlink` - Manage dependencies
- `kg_render*` - Render various views (full, domain, focused, N-hop)
- `kg_lint` - Health check for cycles and issues
- `kg_diff` - Show architecture changes over time
- `kg_drift` - Detect code vs. architecture drift
- And more...

## Workspace

The compose.yaml mounts a `./workspace` directory for persisting:
- `.excalidraw` diagram files
- `.claude/architecture.md` knowledge graph
- Exported SVG/PNG images

## Environment Variables

None required.

## Source

- **Repository**: https://github.com/BV-Venky/excalidraw-architect-mcp
- **Commit**: `74742702b5f4ad8ca54b9c7141e40429974b9299`
- **License**: MIT

## Example Usage

Ask your AI:
- "Create a microservices architecture diagram"
- "Add a Redis cache in front of the database"
- "Export the diagram to PNG at 3x resolution"
- "Map this codebase into the architecture knowledge graph"
