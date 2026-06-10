# Tavily Search MCP Server

MCP server for Tavily AI - purpose-built search API for AI agents and LLMs.

## Features

- **AI-Optimized Search**: Search results optimized specifically for LLM consumption
- **Two Search Modes**: 
  - **Basic**: Fast, general searches
  - **Advanced**: Deep research with more sources and analysis
- **Structured Results**: AI-generated answers with source citations
- **Clean Data**: Pre-processed, LLM-ready output format

## API & Pricing

**Provider**: [Tavily AI](https://tavily.com/)

**Pricing Tiers**:
- **Free Tier**: 1,000 searches/month (Basic mode)
- **Basic Plan**: $20/month for 10,000 searches
- **Pro Plan**: $100/month for 100,000 searches
- **Enterprise**: Custom pricing

**Rate Limits**:
- Free: 60 requests/minute
- Paid: Higher limits based on plan

**Search Depth**:
- Basic: 5 sources, faster response (~1-2s)
- Advanced: 10+ sources, comprehensive research (~4-8s)

## Environment Variables

- `TAVILY_API_KEY` (required): Get from [Tavily Dashboard](https://app.tavily.com/)

## Example Queries

```bash
# Basic search
search(query="what is quantum computing", search_depth="basic")

# Advanced/deep search
search(query="comprehensive analysis of AI safety", search_depth="advanced")
```

## Usage

```bash
docker compose run --rm mcp-tavily-search
```

## Why Tavily for AI?

- **LLM-First Design**: Results structured for direct LLM consumption
- **Answer Generation**: AI-generated summaries with source links
- **No Noise**: Filters out ads, popups, and irrelevant content
- **Fast**: Optimized latency for real-time agent interactions

## License

MIT - Tomatio13

## Links

- [GitHub](https://github.com/Tomatio13/mcp-server-tavily)
- [Tavily API Docs](https://docs.tavily.com/)
- [Sign Up](https://tavily.com/)
