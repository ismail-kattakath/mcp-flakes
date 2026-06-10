# Exa Search MCP Server

Official MCP server for Exa AI (formerly Metaphor) - semantic search engine for AI.

## Features

- **Semantic Search**: AI-powered search that understands meaning and context
- **Web Crawling**: Extract and process web content
- **Code Search**: Search for code across repositories
- **Find Similar**: Discover related content based on URLs
- **Content Extraction**: Get full content from search results

## API & Pricing

**Provider**: [Exa AI](https://exa.ai/)

**Pricing Tiers**:
- **Free Tier**: 1,000 searches/month
- **Pro**: $20/month for 50,000 searches
- **Scale**: $200/month for 1M searches
- **Enterprise**: Custom pricing

**Rate Limits**:
- Free: 10 requests/second
- Pro: 50 requests/second
- Enterprise: Negotiable

**Special Features**:
- Neural search (semantic understanding)
- Autoprompt (automatic query optimization)
- Content extraction with highlights
- Time-based filtering

## Environment Variables

- `EXA_API_KEY` (required): Get from [Exa Dashboard](https://dashboard.exa.ai/api-keys)

## Example Queries

```bash
# Semantic search
exa_search(query="latest developments in quantum computing", num_results=10)

# Find similar pages
exa_find_similar(url="https://example.com/article", num_results=5)

# Get full content
exa_get_contents(ids=["result-id-1", "result-id-2"])
```

## Usage

### Hosted Endpoint
```
https://mcp.exa.ai/mcp
```

### Local Docker
```bash
docker compose up -d
```

## License

MIT - Exa Labs, Inc.

## Links

- [GitHub](https://github.com/exa-labs/exa-mcp-server)
- [API Docs](https://docs.exa.ai/)
- [Dashboard](https://dashboard.exa.ai/)
- [Pricing](https://exa.ai/pricing)
