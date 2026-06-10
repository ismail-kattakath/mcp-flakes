# mcp-searxng

> Originally created by Ihor Sokoliuk · Licensed under MIT  
> Packaged by [mcp-flakes](https://github.com/ismail-kattakath/mcp-flakes)

## Quick start

```bash
docker run -i --rm ghcr.io/mcp-flakes/mcp-searxng:latest
```

## Environment variables

- `SEARXNG_URL` _(required)_ — URL of your SearXNG instance (e.g. http://localhost:8080)
- `AUTH_USERNAME` — HTTP Basic Auth username for password-protected SearXNG instances
- `AUTH_PASSWORD` _(secret)_ — HTTP Basic Auth password for password-protected SearXNG instances
- `SEARXNG_TIMEOUT_MS` — Maximum time in milliseconds to wait for a SearXNG search response (default: 10000)
- `USER_AGENT` — Global User-Agent header for all outgoing requests
- `URL_READER_USER_AGENT` — User-Agent for web_url_read only, overrides USER_AGENT
- `HTTP_PROXY` — Global HTTP proxy for all traffic
- `HTTPS_PROXY` — Global HTTPS proxy for all traffic
- `SEARCH_HTTP_PROXY` — HTTP proxy for searxng_web_search only
- `SEARCH_HTTPS_PROXY` — HTTPS proxy for searxng_web_search only
- `URL_READER_HTTP_PROXY` — HTTP proxy for web_url_read only
- `URL_READER_HTTPS_PROXY` — HTTPS proxy for web_url_read only
- `NO_PROXY` — Comma-separated bypass list for proxy (e.g. localhost,.internal,example.com)
- `MCP_HTTP_PORT` — Port number to enable HTTP transport mode (e.g. 3000)
- `MCP_HTTP_HOST` — Interface address to bind to in HTTP mode (default: 127.0.0.1)
- `MCP_RATE_WINDOW_MS` — Rate limiting sliding window duration in milliseconds (default: 60000)
- `MCP_RATE_INIT_MAX` — Max POST /mcp requests per rate limit window (default: 20)
- `MCP_RATE_SESSION_MAX` — Max GET/DELETE /mcp requests per rate limit window (default: 300)
- `MCP_HTTP_HARDEN` — Enable hardened HTTP security features (default: false)
- `MCP_HTTP_AUTH_TOKEN` _(secret)_ — Bearer token for HTTP requests in hardened mode
- `MCP_HTTP_ALLOWED_ORIGINS` — Comma-separated CORS origin allowlist for hardened mode
- `MCP_HTTP_ALLOWED_HOSTS` — Comma-separated DNS rebinding protection allowlist for hardened mode
- `MCP_HTTP_ALLOW_PRIVATE_URLS` — Allow web_url_read to fetch internal/private URLs (default: false)
- `MCP_HTTP_EXPOSE_FULL_CONFIG` — Expose full config details in /health response (default: false)
- `NODE_ENV` — Node.js environment (development/production)

## Tools (2)

- `searxng_web_search`
- `web_url_read`

## Source & compliance

- **Repository:** https://github.com/ihor-sokoliuk/mcp-searxng
- **Commit:** `80bdaf054b8e6da6429eb7a49ca9eaeb973de0ee`
- **License:** MIT
- **Transport:** stdio

<!-- agent-generated stub. Flesh out before merge. -->
