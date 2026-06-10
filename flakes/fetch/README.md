# 🌐 Fetch - Web Content Retrieval with Markdown Conversion

> Originally created by [Model Context Protocol team](https://github.com/modelcontextprotocol/servers) · Licensed under MIT  
> Packaged by [mcp-flakes](https://github.com/yourusername/mcp-flakes)

![Official MCP](https://img.shields.io/badge/MCP-official-blue) ![Tools: 1](https://img.shields.io/badge/tools-1-blue) ![Prompts: 1](https://img.shields.io/badge/prompts-1-green) ![Markdown](https://img.shields.io/badge/output-markdown-lightgrey)

## 📋 What This Does

Fetch web pages and convert them to clean markdown for AI consumption. The official MCP fetch server retrieves HTML content, processes it, and returns structured markdown - perfect for extracting documentation, articles, API references, or any web content for analysis.

## ⚡ Quick Start

```bash
docker run -i --rm ghcr.io/mcp-flakes/fetch:latest
```

With Docker Compose:
```bash
cd flakes/fetch
docker compose run --rm mcp-fetch
```

With custom configuration:
```bash
docker run -i --rm \
  -e USER_AGENT="MyBot/1.0" \
  -e PROXY_URL="http://proxy.example.com:8080" \
  ghcr.io/mcp-flakes/fetch:latest
```

## 🎯 Perfect For

- **Documentation retrieval** - Fetch library docs, API references, or technical guides for AI analysis
- **Content extraction** - Pull articles, blog posts, or research papers for summarization
- **Web scraping** - Extract structured data from web pages in AI-friendly format
- **Research workflows** - Gather information from multiple sources for synthesis

## 🛠️ Tool & Prompt

### Tool: `fetch`
Fetch URL and convert to markdown.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `url` | string | Yes | - | URL to fetch |
| `max_length` | integer | No | 5000 | Maximum characters to return |
| `start_index` | integer | No | 0 | Start reading from this character index |
| `raw` | boolean | No | false | Return raw HTML instead of markdown |

### Prompt: `fetch`
Simple prompt wrapper for the fetch tool.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | URL to fetch |

## 🎨 Key Features

### Markdown Conversion
Automatically converts HTML to clean, structured markdown:
- Preserves headings, lists, tables, links
- Removes navigation, ads, scripts
- Returns readable content optimized for AI

### Chunked Reading
Read large pages in chunks using `start_index`:
```json
// First chunk
{"url": "...", "max_length": 5000, "start_index": 0}
// Second chunk
{"url": "...", "max_length": 5000, "start_index": 5000}
```

### robots.txt Support
Respects robots.txt by default for ethical scraping. Disable with `IGNORE_ROBOTS_TXT=true` if needed.

### Proxy & User Agent
- **Custom User Agents**: Set `USER_AGENT` to identify your bot
- **Proxy Support**: Route requests through `PROXY_URL` for restricted networks or anonymity

## 📚 Examples

### Example 1: Fetch Documentation
Ask Claude: *"Fetch the Python requests library documentation from https://docs.python-requests.org/en/latest/ and summarize the key features"*

Returns clean markdown of the docs for AI analysis.

### Example 2: Extract Article Content
Ask Claude: *"Fetch this blog post and give me the main points: https://example.com/article"*

Removes ads, navigation, and extracts just the article content.

### Example 3: Read Large Page in Chunks
```json
// Read first 5000 characters
{
  "name": "fetch",
  "arguments": {
    "url": "https://en.wikipedia.org/wiki/Machine_learning",
    "max_length": 5000
  }
}

// Read next 5000 characters
{
  "name": "fetch",
  "arguments": {
    "url": "https://en.wikipedia.org/wiki/Machine_learning",
    "max_length": 5000,
    "start_index": 5000
  }
}
```

### Example 4: Get Raw HTML
Ask Claude: *"Fetch the raw HTML of https://example.com so I can analyze its structure"*

```json
{
  "name": "fetch",
  "arguments": {
    "url": "https://example.com",
    "raw": true
  }
}
```

### Example 5: Research Multiple Sources
Ask Claude: *"Fetch these three articles and compare their perspectives on AI safety: [url1], [url2], [url3]"*

Sequential fetches for comparative analysis.

## 🔗 Works Great With

- **a2asearch** - Find MCP servers, then fetch their documentation URLs for detailed review
- **clirank** - Fetch API documentation for services discovered in CLIRank
- **claude-terminal-mcp** - Fetch content, save with write_file, then process with command-line tools

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `USER_AGENT` | Custom user agent string | Default MCP agent | `MyBot/1.0` |
| `IGNORE_ROBOTS_TXT` | Ignore robots.txt restrictions | `false` | `true` |
| `PROXY_URL` | HTTP/HTTPS proxy for requests | None | `http://proxy.example.com:8080` |

### Security Warning

**Important**: This server can access local/internal IP addresses. Exercise caution:
- Don't expose to untrusted networks
- Be careful with local URLs (localhost, 127.0.0.1, internal IPs)
- May expose internal services or sensitive data
- Consider network isolation or firewalling

### Example Configurations

**Development (relaxed)**:
```bash
docker run -i --rm \
  -e IGNORE_ROBOTS_TXT=true \
  ghcr.io/mcp-flakes/fetch:latest
```

**Production (ethical)**:
```bash
docker run -i --rm \
  -e USER_AGENT="MyCompanyBot/1.0 (+https://example.com/bot)" \
  -e PROXY_URL="http://proxy.corp.example.com:8080" \
  ghcr.io/mcp-flakes/fetch:latest
```

### Build Pattern

**Type**: Source build from official MCP monorepo  
**Subpath**: `src/fetch`

Built from the Model Context Protocol reference implementation.

## 📦 Source & Compliance

- **Source**: https://github.com/modelcontextprotocol/servers
- **Subpath**: src/fetch
- **Commit**: `275175cda17ca9c49920ceed2bcf27e12e59f8b2`
- **License**: MIT
- **Protocol**: stdio transport
- **Status**: Official MCP reference implementation
