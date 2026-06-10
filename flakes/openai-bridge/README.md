# OpenAI Bridge MCP Server

MCP Server - Bridge to OpenAI API. Access GPT-4, GPT-4o and other OpenAI models through MCP.

## Features

- Connect MCP clients to OpenAI API
- Support for GPT-4, GPT-4o, GPT-3.5, and other models
- Streaming responses
- Simple configuration

## Quick Start

### With Docker Compose

```bash
cd flakes/openai-bridge
export OPENAI_API_KEY=sk-...
docker compose run --rm mcp-openai-bridge
```

### Pull Prebuilt Image

```bash
docker pull ghcr.io/mcp-flakes/openai-bridge:latest
docker run -i --rm -e OPENAI_API_KEY=sk-... ghcr.io/mcp-flakes/openai-bridge:latest
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key (starts with sk-) |

### Get API Key

Sign up at [platform.openai.com](https://platform.openai.com) to get your API key.

## Pricing

OpenAI uses pay-per-use pricing:

- **GPT-4o**: $2.50 per 1M input tokens, $10.00 per 1M output tokens
- **GPT-4o-mini**: $0.15 per 1M input tokens, $0.60 per 1M output tokens
- **GPT-4 Turbo**: $10.00 per 1M input tokens, $30.00 per 1M output tokens
- **GPT-3.5 Turbo**: $0.50 per 1M input tokens, $1.50 per 1M output tokens

See [openai.com/pricing](https://openai.com/pricing) for current rates.

## Example Usage

Once connected to your MCP client (Claude Desktop, etc.):

- "Use OpenAI GPT-4o to write a Python script that..."
- "Ask GPT-4 to analyze this code and suggest improvements"
- "Generate a haiku using GPT-3.5"

## Tools

- `openai_chat` - Send chat messages to OpenAI models
- `openai_completion` - Generate text completions

## Upstream

- **Repository**: https://github.com/jaspertvdm/mcp-server-openai-bridge
- **License**: MIT
- **Author**: Jasper van de Meent
- **Part of**: HumoticaOS / SymbAIon ecosystem
