# 📈 MCP Market Data Server Flake

![Crypto](https://img.shields.io/badge/Crypto-Live_Data-F7931A?logo=bitcoin)
![Stocks](https://img.shields.io/badge/Stocks-Real--time-blue?logo=yahoo)
![No API Keys](https://img.shields.io/badge/API_Keys-Not_Required-success)

Live cryptocurrency and stock market data for AI agents. Real-time prices, OHLCV candles, order books, and technical analysis. **Zero API keys required**, zero dependencies.

## Upstream

- **Source**: https://github.com/ShipItAndPray/mcp-market-data
- **Commit**: f49a989304c8f5b2bfde6fb6254d50007d82832d
- **License**: MIT

## Tools

- `price` - Get current price of any cryptocurrency or stock
  - `symbol` (string, required): Ticker symbol (e.g., BTC, ETH, AAPL)

- `candles` - Get OHLCV candlestick data
  - `symbol` (string, required): Ticker symbol
  - `interval` (string, optional): Time interval (1m, 5m, 1h, 1d, 1w, 1M)
  - `limit` (number, optional): Number of candles to return

- `order_book` - Get live order book depth (bids and asks)
  - `symbol` (string, required): Ticker symbol
  - `limit` (number, optional): Depth level (5, 10, 20, 50, 100)

- `market_cap` - Get top cryptocurrencies by market capitalization
  - `limit` (number, optional): Number of results to return

- `trending` - Get currently trending cryptocurrencies

- `analyze` - Perform technical analysis (RSI, SMA, volatility, z-score)
  - `symbol` (string, required): Ticker symbol
  - `interval` (string, optional): Time interval for analysis

- `compare` - Compare multiple assets side by side
  - `symbols` (array, required): Array of ticker symbols to compare

- `feargreed` - Get Crypto Fear & Greed Index

## Build Notes

**NO BUILD STEP REQUIRED** - This is pure JavaScript with zero dependencies. The repository contains only `index.js` with built-in modules.

## Usage

### With Docker Compose

```bash
cd flakes/mcp-market-data
docker compose run --rm mcp-market-data
```

### Direct Docker Run

```bash
docker run -i --rm ghcr.io/mcp-flakes/mcp-market-data:latest
```

### In a Bundle

```yaml
include:
  - ../../flakes/mcp-market-data/compose.yaml
```

## MCP Protocol

This server uses stdio transport. It expects MCP protocol messages on stdin and writes responses to stdout.

## Example Usage

Get current price:
```json
{
  "name": "price",
  "arguments": {
    "symbol": "BTC"
  }
}
```

Get candlestick data:
```json
{
  "name": "candles",
  "arguments": {
    "symbol": "ETH",
    "interval": "1h",
    "limit": 24
  }
}
```

Get order book:
```json
{
  "name": "order_book",
  "arguments": {
    "symbol": "BTC",
    "limit": 10
  }
}
```

Perform technical analysis:
```json
{
  "name": "analyze",
  "arguments": {
    "symbol": "BTC",
    "interval": "1d"
  }
}
```

Compare multiple assets:
```json
{
  "name": "compare",
  "arguments": {
    "symbols": ["BTC", "ETH", "SOL"]
  }
}
```

Get Fear & Greed Index:
```json
{
  "name": "feargreed",
  "arguments": {}
}
```

## Quick Start

```bash
# Start the server - no API keys needed!
cd flakes/mcp-market-data
docker compose run --rm mcp-market-data
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **Price Monitoring** | "Alert me if Bitcoin drops below $30k" |
| **Trading Analysis** | "Analyze ETH price patterns over the last week" |
| **Portfolio Tracking** | "Compare performance of BTC, ETH, and SOL" |
| **Market Research** | "What are the top trending cryptos right now?" |
| **Technical Signals** | "Calculate RSI and SMA for Bitcoin" |
| **Market Sentiment** | "What's the Fear & Greed Index?" |

## Data Sources

- **Cryptocurrency**: Live data from major exchanges
- **OHLCV Candles**: Multiple timeframes (1m to 1M)
- **Order Books**: Real-time bid/ask spreads
- **Market Cap**: CoinGecko/CoinMarketCap aggregated data
- **Fear & Greed**: Crypto sentiment index

## Technical Analysis Features

### Indicators Available
- **RSI** (Relative Strength Index) - Momentum indicator
- **SMA** (Simple Moving Average) - Trend indicator
- **Volatility** - Price variation measurement
- **Z-Score** - Statistical deviation from mean

### Interpretation

| RSI Value | Signal | Action |
|-----------|--------|--------|
| > 70 | Overbought | Consider selling |
| 30-70 | Neutral | Hold |
| < 30 | Oversold | Consider buying |

## Example Workflows

### Daily Trading Analysis

```javascript
// 1. Check current price
price("BTC")

// 2. Get 24h candles (hourly)
candles({ symbol: "BTC", interval: "1h", limit: 24 })

// 3. Technical analysis
analyze({ symbol: "BTC", interval: "1d" })

// 4. Check order book depth
order_book({ symbol: "BTC", limit: 20 })

// 5. Fear & Greed sentiment
feargreed()
```

### Portfolio Comparison

```javascript
// Compare multiple assets
compare({ symbols: ["BTC", "ETH", "SOL", "ADA", "DOT"] })

// Returns:
// - Current prices
// - 24h change %
// - Market cap
// - Volume
// - Ranking
```

### Market Discovery

```javascript
// 1. Top by market cap
market_cap({ limit: 20 })

// 2. Trending coins
trending()

// 3. Analyze a trending coin
analyze({ symbol: "PEPE", interval: "1h" })
```

## Supported Intervals

- `1m` - 1 minute candles
- `5m` - 5 minute candles
- `15m` - 15 minute candles
- `1h` - 1 hour candles
- `4h` - 4 hour candles
- `1d` - Daily candles
- `1w` - Weekly candles
- `1M` - Monthly candles

## Example Questions for Claude

1. "What's the current price of Bitcoin?"
2. "Show me the last 24 hours of ETH price action in 1-hour candles"
3. "What are the top 10 cryptocurrencies by market cap?"
4. "Perform technical analysis on BTC with daily intervals"
5. "Compare BTC, ETH, and SOL side by side"
6. "What's the current crypto Fear & Greed Index?"
7. "Is Bitcoin oversold or overbought right now?"
8. "What's the 50-day moving average for Ethereum?"

## Related Flakes

- **sequentialthinking** - Complex market analysis
- **memory** - Track trading patterns over time
- **sqlite** - Store historical price data
