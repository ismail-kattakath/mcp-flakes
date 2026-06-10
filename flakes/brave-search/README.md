# Brave Search MCP Server

Official MCP server for Brave Search API providing comprehensive search capabilities.

## Features

- **Web Search**: Comprehensive web search with advanced filtering
- **Local Search**: Search for local businesses and places
- **Image Search**: Search for images with metadata
- **Video Search**: Search videos with comprehensive metadata
- **News Search**: Current news with freshness controls
- **AI Summarizer**: Generate AI-powered summaries from search results

## API & Pricing

**Provider**: [Brave Search API](https://brave.com/search/api/)

**Pricing Tiers**:
- **Free Tier**: 2,000 queries/month, limited features
- **Data for AI**: $5/month for 20,000 queries + AI features
- **Pro**: $15/month for 200,000 queries + all features
- **Enterprise**: Custom pricing

**Rate Limits**:
- Free: ~1 query/second
- Paid: Higher rate limits based on plan

## Environment Variables

- `BRAVE_API_KEY` (required): Get from [Brave API Dashboard](https://brave.com/search/api/)
- `BRAVE_MCP_TRANSPORT` (optional): Default "stdio"

## Example Queries

```bash
# Web search
brave_web_search(query="climate change", count=10)

# Local business search
brave_local_search(query="coffee shops", country="US")

# Image search
brave_image_search(query="mountains", count=20)

# News search
brave_news_search(query="tech news", freshness="pd")

# Get AI summary
brave_summarizer(key="<summary_key>")
```

## Usage

```bash
docker compose run --rm mcp-brave-search
```

## License

MIT - Brave Software, Inc.

## Links

- [GitHub](https://github.com/brave/brave-search-mcp-server)
- [API Docs](https://brave.com/search/api/)
- [Sign Up](https://brave.com/search/api/)
