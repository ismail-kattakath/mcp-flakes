# 🔍 A2A Search - Universal MCP Server Discovery

> Originally created by [tadas-github](https://github.com/tadas-github/a2asearch-mcp) · Licensed under MIT  
> Packaged by [mcp-flakes](https://github.com/yourusername/mcp-flakes)

![npm package](https://img.shields.io/badge/npm-package-CB3837?logo=npm) ![No auth required](https://img.shields.io/badge/auth-none-green) ![Tools: 3](https://img.shields.io/badge/tools-3-blue)

## 📋 What This Does

Search and discover from 4,800+ MCP servers, AI agents, CLI tools, and agent skills. A2A Search provides instant access to the largest catalog of Model Context Protocol servers, helping you find the perfect tool for any task.

## ⚡ Quick Start

```bash
docker run -i --rm ghcr.io/mcp-flakes/a2asearch:latest
```

Or with Docker Compose:
```bash
cd flakes/a2asearch
docker compose run --rm mcp-a2asearch
```

## 🎯 Perfect For

- **Finding MCP servers** - Search 4,800+ servers by keywords, capabilities, or use cases
- **Building AI workflows** - Discover complementary tools to extend your AI's capabilities
- **Exploring the ecosystem** - Browse categories and understand what's available in the MCP universe
- **Integration planning** - Research server details before adding them to your setup

## 🛠️ Tools & Features

| Tool | Purpose | Key Parameters |
|------|---------|---------------|
| `search_mcp_servers` | Search across entire catalog by keyword | `query`, `limit`, `category` |
| `get_server_details` | Get detailed info about a specific server | `server_name` |
| `list_categories` | Browse available server categories | None |

## 📚 Examples

### Example 1: Find Database Tools
Ask Claude: *"Search for MCP servers that work with PostgreSQL"*

The server will search through 4,800+ entries and return relevant database servers with descriptions, tool counts, and GitHub links.

### Example 2: Discover Creative Tools
Ask Claude: *"What MCP servers are available for image generation or art?"*

Browse through creative and media servers, see what tools they provide, and get installation links.

### Example 3: Explore by Category
Ask Claude: *"List all available server categories, then show me everything in the 'data' category"*

Perfect for systematic exploration of the MCP ecosystem.

### Example 4: Pre-Integration Research
Ask Claude: *"Get detailed information about the 'fetch' server including all its tools and environment variables"*

Review capabilities before adding a server to your workflow.

## 🔗 Works Great With

- **fetch** - Once you find a web scraping server, use fetch to test its target URLs
- **everything** - Use A2A Search to discover servers, then test integrations with the Everything reference server
- **clirank** - Compare API options found via A2A Search using CLIRank's agent-friendliness scores

## 🔧 Configuration

### Environment Variables

**None required** - A2A Search is a free public API with no authentication or rate limits.

### Build Pattern

This flake uses the **npm-package pattern** - installs the pre-built package `a2asearch-mcp@1.1.6` from npm. Fast, simple, and reliable.

## 📦 Source & Compliance

- **Source**: https://github.com/tadas-github/a2asearch-mcp
- **Package**: a2asearch-mcp@1.1.6
- **Commit**: `c4feef919f42785380136e417d134dae42f5cd85`
- **License**: MIT
- **Protocol**: stdio transport
