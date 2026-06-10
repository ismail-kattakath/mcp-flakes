# 🗜️ MCP Compress Server Flake

![Node.js](https://img.shields.io/badge/Node.js-Zero_Dependencies-339933?logo=node.js)
![Algorithms](https://img.shields.io/badge/Algorithms-4-blue)
![MIT](https://img.shields.io/badge/License-MIT-green)

Data compression server for AI agents. Compress and decompress data using multiple algorithms (gzip, brotli, deflate, zstd) with built-in storage. **Zero dependencies** - uses only Node.js built-in zlib module.

## Upstream

- **Source**: https://github.com/ShipItAndPray/mcp-compress
- **Commit**: 610408e55d912466aaa5b442a51f2b31cae3c6fe
- **License**: MIT

## Tools

- `compress` - Compress text, JSON, or CSV data
  - `data` (string, required): Data to compress
  - `algorithm` (string, optional): Algorithm to use (gzip, brotli, deflate, zstd, auto)

- `decompress` - Decompress previously compressed data
  - `data` (string, required): Compressed data to decompress
  - `algorithm` (string, required): Algorithm used for compression

- `analyze` - Analyze data compressibility and recommend best algorithm
  - `data` (string, required): Data to analyze

- `store` - Compress and store data to disk with metadata
  - `key` (string, required): Storage key/identifier
  - `data` (string, required): Data to compress and store
  - `algorithm` (string, optional): Compression algorithm

- `retrieve` - Decompress and retrieve stored data
  - `key` (string, required): Storage key to retrieve

- `stats` - Show compression statistics across all stored data

## Build Notes

**NO BUILD STEP REQUIRED** - This is pure JavaScript with zero dependencies. The repository contains only `index.js` using Node.js built-in `zlib` module.

## Usage

### With Docker Compose

```bash
cd flakes/mcp-compress
docker compose run --rm mcp-compress
```

### Direct Docker Run

```bash
docker run -i --rm ghcr.io/mcp-flakes/mcp-compress:latest
```

### In a Bundle

```yaml
include:
  - ../../flakes/mcp-compress/compose.yaml
```

## MCP Protocol

This server uses stdio transport. It expects MCP protocol messages on stdin and writes responses to stdout.

## Example Usage

Analyze data compressibility:
```json
{
  "name": "analyze",
  "arguments": {
    "data": "{\"large\": \"json object with lots of repetitive data...\"}"
  }
}
```

Compress data:
```json
{
  "name": "compress",
  "arguments": {
    "data": "This is a large text document that will compress well...",
    "algorithm": "gzip"
  }
}
```

Store compressed data:
```json
{
  "name": "store",
  "arguments": {
    "key": "my-dataset",
    "data": "{\"results\": [...]}",
    "algorithm": "brotli"
  }
}
```

Retrieve stored data:
```json
{
  "name": "retrieve",
  "arguments": {
    "key": "my-dataset"
  }
}
```

Get compression statistics:
```json
{
  "name": "stats",
  "arguments": {}
}
```

## Quick Start

```bash
# Start the server
cd flakes/mcp-compress
docker compose run --rm mcp-compress
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **API Response Caching** | Compress and store large API responses |
| **Log Compression** | Compress log data before storage |
| **Data Transfer** | Reduce data size for efficient transfer |
| **Storage Optimization** | Compress JSON/CSV datasets |
| **Algorithm Selection** | Analyze and choose best compression algorithm |

## Algorithm Comparison

| Algorithm | Speed | Ratio | Best For |
|-----------|-------|-------|----------|
| **gzip** | Fast | Good | General purpose, HTTP responses |
| **brotli** | Slower | Better | Web assets, static content |
| **deflate** | Fast | Good | Legacy compatibility |
| **zstd** | Fastest | Best | Real-time compression, large datasets |
| **auto** | - | - | Automatic selection based on data |

## Example Workflows

### Compress and Store Large Dataset

```javascript
// 1. Analyze compressibility
{
  "name": "analyze",
  "arguments": {
    "data": "{\"users\": [/* 10000 users */]}"
  }
}
// Returns: { gzip: 85%, brotli: 88%, zstd: 90% }

// 2. Store with best algorithm
{
  "name": "store",
  "arguments": {
    "key": "users-dataset",
    "data": "{\"users\": [/* 10000 users */]}",
    "algorithm": "zstd"
  }
}

// 3. Later, retrieve it
{
  "name": "retrieve",
  "arguments": {
    "key": "users-dataset"
  }
}
```

### Compress API Response

```javascript
// Compress JSON API response
{
  "name": "compress",
  "arguments": {
    "data": "{\"results\": [...], \"metadata\": {...}}",
    "algorithm": "gzip"
  }
}
// Returns: compressed base64 string

// Later, decompress
{
  "name": "decompress",
  "arguments": {
    "data": "H4sIAAAAAAAA...",
    "algorithm": "gzip"
  }
}
```

## Typical Compression Ratios

| Data Type | Original | Compressed | Ratio |
|-----------|----------|------------|-------|
| JSON (repetitive) | 1 MB | 100 KB | 90% |
| CSV data | 5 MB | 800 KB | 84% |
| Log files | 10 MB | 1 MB | 90% |
| Plain text | 1 MB | 300 KB | 70% |

## Example Questions for Claude

1. "Can you analyze this JSON data and tell me how much it would compress?"
2. "Compress this large text file using brotli"
3. "Store this dataset under the key 'user-data' with compression"
4. "Retrieve the data I stored earlier as 'user-data'"
5. "Show me compression statistics for all stored data"
6. "What's the best compression algorithm for this CSV data?"

## Related Flakes

- **filesystem** - File operations
- **sqlite** - Structured data storage
- **postgres** - Database operations
