# Unbrowser MCP Server

Lightweight browser automation for LLM agents in a single static binary—no Chrome required.

## Overview

Unbrowser is a Rust-based browser tier designed for agent workflows where `curl`/WebFetch is too limited but full Chrome is too heavy. It provides JavaScript execution, form filling, link following, and cookie management through a lightweight native binary with the Model Context Protocol.

## Features

- **JavaScript Execution**: Run JavaScript in fetched pages
- **Form Automation**: Fill and submit web forms
- **Link Following**: Navigate multi-page workflows
- **Cookie Management**: Maintain session state across requests
- **BlockMaps**: Return low-token representations of pages
- **Stateful Sessions**: Persistent browser profiles
- **No Chrome Dependency**: Pure Rust implementation
- **Static Binary**: Single executable with no runtime dependencies

## Usage

### With Docker Compose

```bash
docker compose up -d
docker compose exec unbrowser /app/unbrowser --help
```

### With Docker

```bash
docker build -t mcp-flakes/unbrowser:latest .
docker run -it --rm mcp-flakes/unbrowser:latest
```

### Configuration

Optional environment variables:
- `UNBROWSER_PROFILE`: Browser profile directory for cookies/state
- `RUST_LOG`: Logging level (debug, info, warn, error)

### Tools Available

- `unbrowser_navigate`: Navigate to URLs and extract content
- `unbrowser_click`: Click elements on pages
- `unbrowser_fill_form`: Fill and submit forms
- `unbrowser_screenshot`: Capture page screenshots (BlockMaps)
- `unbrowser_cookies`: Manage cookies and sessions

## When to Use

### Use Unbrowser When:
- You need JavaScript execution
- Forms must be filled and submitted
- Cookies/sessions are required
- Multi-page workflows are needed
- Token efficiency matters (BlockMaps vs full HTML)

### Escalate to Full Chrome When:
- Complex browser extensions are needed
- Human-in-the-loop authentication required
- Advanced browser features (DevTools, etc.)
- Real browser fingerprinting needed

For full Chrome automation, see [Unchained](https://unchainedsky.com) or [unchainedsky-cli](https://github.com/protostatis/unchainedsky-cli).

## Upstream

- **Repository**: https://github.com/protostatis/unbrowser
- **License**: Apache-2.0
- **Language**: Rust
- **Commit**: 3936108c5f3762a12be3576cd65e4b1f899aaaae

## Build Details

- **Builder Image**: rust:1.83-bookworm
- **Runtime Image**: debian:bookworm-slim
- **Build Type**: Multi-stage Docker build with release optimization
- **Binary Size**: ~5-10MB (estimated stripped static binary)
- **Dependencies**: libssl3 (runtime only)

## Architecture

Unbrowser uses:
- **rquickjs**: JavaScript engine (QuickJS)
- **wreq**: HTTP client with advanced features
- **html5ever**: HTML5 parsing
- LTO and stripping for minimal binary size

## Python Bindings

The upstream project also provides Python bindings as `pyunbrowser`. This flake packages only the Rust binary for MCP use.

## See Also

- [Unbrowser Documentation](https://github.com/protostatis/unbrowser)
- [Unchained](https://unchainedsky.com) - Full browser automation platform
- [ATTRIBUTION.md](./ATTRIBUTION.md) for licensing details
