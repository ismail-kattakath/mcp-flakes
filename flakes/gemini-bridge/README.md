# Gemini Bridge MCP Server

MCP Server - Bridge to Google Gemini API. Access Gemini Pro and Flash models through MCP.

## Features

- Connect MCP clients to Google Gemini API
- Support for Gemini Pro and Flash models
- Streaming responses
- Simple configuration

## Quick Start

### With Docker Compose

```bash
cd flakes/gemini-bridge
export GOOGLE_API_KEY=...
docker compose run --rm mcp-gemini-bridge
```

### Pull Prebuilt Image

```bash
docker pull ghcr.io/mcp-flakes/gemini-bridge:latest
docker run -i --rm -e GOOGLE_API_KEY=... ghcr.io/mcp-flakes/gemini-bridge:latest
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | Yes | Your Google AI API key |

### Get API Key

Get your API key from [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey).

## Pricing

Google Gemini pricing:

- **Gemini 2.0 Flash**: Free tier available, then $0.075 per 1M input tokens, $0.30 per 1M output tokens
- **Gemini 1.5 Pro**: Free tier available, then $1.25 per 1M input tokens, $5.00 per 1M output tokens
- **Gemini 1.5 Flash**: Free tier available, then $0.075 per 1M input tokens, $0.30 per 1M output tokens

See [ai.google.dev/pricing](https://ai.google.dev/pricing) for current rates.

## Example Usage

Once connected to your MCP client:

- "Use Gemini Pro to analyze this image and..."
- "Ask Gemini Flash to summarize this document"
- "Generate creative content using Gemini"

## Tools

- `gemini_chat` - Send chat messages to Gemini models
- `gemini_completion` - Generate text completions

## Upstream

- **Repository**: https://github.com/jaspertvdm/mcp-server-gemini-bridge
- **License**: MIT
- **Author**: Jasper van de Meent
- **Part of**: HumoticaOS / SymbAIon ecosystem
