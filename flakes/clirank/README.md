# MCP CLIRank Server Flake

API intelligence for AI coding agents. 387 APIs scored on agent-friendliness.

## Upstream

- **Source**: https://github.com/alexanderclapp/clirank-mcp-server
- **Package**: clirank-mcp-server
- **Commit**: 6a73958d2a7d090dd5c8639baf0734c2f986ab1f
- **License**: MIT
- **Web**: https://clirank.dev

## Build Pattern

NPM package pattern - installs pre-built published package.

## Tools

- `discover_services` - Find APIs by keyword or capability
- `check_an_score` - Get Agent-Native score for an API
- `compare_alternatives` - Compare multiple APIs side-by-side
- `get_api_info` - Get detailed API information

## Environment Variables

None required - free public API.

## Usage

```bash
docker run -i --rm ghcr.io/mcp-flakes/clirank:latest
```
