# MCP Compress Server Flake

Data compression server for AI agents. Compress and decompress data using multiple algorithms (gzip, brotli, deflate, zstd) with built-in storage. Zero dependencies - uses only Node.js built-in zlib module.

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

## Example Questions for Claude

1. "Can you analyze this JSON data and tell me how much it would compress?"
2. "Compress this large text file using brotli"
3. "Store this dataset under the key 'user-data' with compression"
4. "Retrieve the data I stored earlier as 'user-data'"
5. "Show me compression statistics for all stored data"
