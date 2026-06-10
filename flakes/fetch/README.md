# MCP Fetch Server Flake

Provides web content fetching capabilities for MCP clients. Retrieves and processes web pages, converting HTML to markdown for easier consumption.

## Upstream

- **Source**: https://github.com/modelcontextprotocol/servers
- **Subpath**: src/fetch
- **Commit**: 275175cda17ca9c49920ceed2bcf27e12e59f8b2
- **License**: MIT

## Tools

- `fetch` - Fetches a URL from the internet and extracts its contents as markdown
  - `url` (string, required): URL to fetch
  - `max_length` (integer, optional): Maximum characters to return (default: 5000)
  - `start_index` (integer, optional): Start content from this character index (default: 0)
  - `raw` (boolean, optional): Get raw content without markdown conversion (default: false)

## Prompts

- `fetch` - Fetch a URL and extract its contents as markdown
  - `url` (string, required): URL to fetch

## Features

- **Chunked reading**: Use `start_index` to read large pages in chunks
- **Markdown conversion**: Automatically converts HTML to clean markdown
- **robots.txt support**: Respects robots.txt by default for autonomous requests
- **Custom user agents**: Configurable user agent strings
- **Proxy support**: Route requests through HTTP/HTTPS proxies

## Security Warning

This server can access local/internal IP addresses and may represent a security risk. Exercise caution to ensure it does not expose sensitive data.

## Environment Variables

- `USER_AGENT` - Custom user agent string for HTTP requests (optional)
- `IGNORE_ROBOTS_TXT` - Set to 'true' to ignore robots.txt restrictions (optional)
- `PROXY_URL` - HTTP/HTTPS proxy URL for requests (optional)

## Usage

### With Docker Compose

```bash
cd flakes/fetch
docker compose run --rm mcp-fetch
```

### Direct Docker Run

```bash
docker run -i --rm \
  -e USER_AGENT="MyBot/1.0" \
  -e PROXY_URL="http://proxy.example.com:8080" \
  ghcr.io/mcp-flakes/fetch:latest
```

### In a Bundle

```yaml
include:
  - ../../flakes/fetch/compose.yaml

# Override environment in bundle's .env file:
# USER_AGENT=MyBot/1.0
# IGNORE_ROBOTS_TXT=false
# PROXY_URL=http://proxy.example.com:8080
```

## MCP Protocol

This server uses stdio transport. It expects MCP protocol messages on stdin and writes responses to stdout.

## Example Usage

Fetch a webpage as markdown:
```json
{
  "name": "fetch",
  "arguments": {
    "url": "https://example.com",
    "max_length": 10000
  }
}
```

Read a large page in chunks:
```json
{
  "name": "fetch",
  "arguments": {
    "url": "https://example.com/long-article",
    "max_length": 5000,
    "start_index": 5000
  }
}
```

Get raw HTML without conversion:
```json
{
  "name": "fetch",
  "arguments": {
    "url": "https://example.com",
    "raw": true
  }
}
```
