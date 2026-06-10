# MCP Market Data Server Flake

Live cryptocurrency and stock market data for AI agents. Real-time prices, OHLCV candles, order books, and technical analysis. Zero API keys required, zero dependencies.

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

## Example Questions for Claude

1. "What's the current price of Bitcoin?"
2. "Show me the last 24 hours of ETH price action in 1-hour candles"
3. "What are the top 10 cryptocurrencies by market cap?"
4. "Perform technical analysis on BTC with daily intervals"
5. "Compare BTC, ETH, and SOL side by side"
6. "What's the current crypto Fear & Greed Index?"
