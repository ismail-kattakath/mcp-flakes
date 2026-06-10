# MCP A2A Search Server Flake

Search 4,800+ MCP servers, AI agents, CLI tools and agent skills.

## Upstream

- **Source**: https://github.com/tadas-github/a2asearch-mcp
- **Package**: a2asearch-mcp@1.1.6
- **Commit**: c4feef919f42785380136e417d134dae42f5cd85
- **License**: MIT

## Build Pattern

This flake uses the **npm-package pattern** - it installs the pre-built published package from npm rather than building from source. This is faster and simpler for packages that are published to registries.

## Tools

- `search_mcp_servers` - Search across 4,800+ MCP servers by keyword
- `get_server_details` - Get detailed information about a specific server
- `list_categories` - List all available server categories

## Environment Variables

None required - free public API with no authentication.

## Usage

### With Docker Compose

```bash
cd flakes/a2asearch
docker compose run --rm mcp-a2asearch
```

### Direct Docker Run

```bash
docker run -i --rm ghcr.io/mcp-flakes/a2asearch:latest
```

### Example Query

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | docker run -i --rm ghcr.io/mcp-flakes/a2asearch:latest
```

## MCP Protocol

This server uses stdio transport. Free tier with no rate limits.
