# SerpAPI MCP Server

Official MCP server for SerpAPI - comprehensive multi-engine search API.

## Features

- **Multi-Engine Search**: Google, Bing, Yahoo, DuckDuckGo, YouTube, eBay, and 100+ more
- **Real-time Weather**: Location-based weather data via search
- **Stock Market Data**: Company financials and market info
- **Flexible Response**: Complete or compact JSON modes
- **Engine Resources**: Per-engine parameter schemas via MCP resources
- **Structured Data**: Answer boxes, organic results, news, images, shopping

## API & Pricing

**Provider**: [SerpAPI](https://serpapi.com/)

**Pricing Tiers**:
- **Free Tier**: 100 searches/month
- **Developer**: $50/month for 5,000 searches
- **Production**: $150/month for 20,000 searches
- **Enterprise**: Custom pricing for 100k+ searches

**Rate Limits**:
- Free: 5 requests/second
- Paid: Up to 50 requests/second (based on plan)

**Search Engines Supported** (100+):
- Google (all variants: web, images, news, shopping, local, etc.)
- Bing, Yahoo, DuckDuckGo
- YouTube, Reddit, Twitter/X
- Amazon, eBay, Walmart, Etsy
- Academic: Google Scholar, PubMed, arXiv
- Maps: Google Maps, Apple Maps, Yelp
- And 80+ more...

## Environment Variables

- `SERPAPI_API_KEY` (required): Get from [SerpAPI Dashboard](https://serpapi.com/manage-api-key)

## Example Queries

```bash
# Google search
search(params={q: "AI news", engine: "google"})

# Weather data
search(params={q: "weather in Tokyo", engine: "google"})

# Stock data
search(params={q: "TSLA stock", engine: "google"})

# YouTube search
search(params={q: "python tutorials", engine: "youtube"})

# Google Scholar
search(params={q: "machine learning", engine: "google_scholar"})

# Compact mode (less data)
search(params={q: "news"}, mode="compact")
```

## Usage

### Hosted Endpoint
```
https://mcp.serpapi.com/YOUR_API_KEY/mcp
```

### Local Docker
```bash
docker compose up -d
```

## Why SerpAPI?

- **Most Comprehensive**: 100+ search engines in one API
- **Production-Ready**: Used by thousands of companies
- **Structured Data**: Pre-parsed, clean JSON output
- **No Scraping Issues**: Maintains infrastructure for reliable access
- **Real-time**: Up-to-date results without caching delays

## Use Cases

- Market research and competitive analysis
- Price monitoring across e-commerce platforms
- Academic research aggregation
- News and media monitoring
- Local business intelligence
- Weather and location data

## License

MIT - SerpApi LLC

## Links

- [GitHub](https://github.com/serpapi/serpapi-mcp)
- [SerpAPI Docs](https://serpapi.com/search-api)
- [Playground](https://serpapi.com/playground)
- [Dashboard](https://serpapi.com/dashboard)
