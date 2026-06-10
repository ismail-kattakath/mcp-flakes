# OrcaRouter MCP Server

Official MCP server for OrcaRouter LLM gateway. Browse 160+ LLM models from multiple providers with live pricing and automatic fallback routing.

## Features

- **160+ Models**: Access models from OpenAI, Anthropic, Google, Qwen, DeepSeek, Mistral, and more
- **Live Pricing**: Compare costs before choosing a model
- **Automatic Routing**: Use `orcarouter/auto` for intelligent model selection
- **Fallback Chains**: Configure primary + up to 4 fallbacks for resilience
- **Server-Side Filtering**: Filter by provider, capability, or context window
- **Detailed Model Cards**: Inspect pricing, context, latency, supported endpoints
- **No API Key for Browsing**: Catalog tools work without authentication

## Quick Start

### With Docker Compose

```bash
cd flakes/orcarouter-mcp
export ORCAROUTER_API_KEY=sk-orca-your-key  # Optional for chat, not needed for browsing
docker compose run --rm mcp-orcarouter
```

### Pull Prebuilt Image

```bash
docker pull ghcr.io/mcp-flakes/orcarouter-mcp:latest
docker run -i --rm -e ORCAROUTER_API_KEY=sk-orca-your-key ghcr.io/mcp-flakes/orcarouter-mcp:latest
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ORCAROUTER_API_KEY` | No* | - | OrcaRouter API key (*only needed for chat, not for catalog browsing) |
| `ORCAROUTER_BASE_URL` | No | `https://api.orcarouter.ai` | API base URL |
| `ORCAROUTER_REQUEST_TIMEOUT` | No | `300` | Per-request timeout in seconds |

### Get API Key

Sign up at [orcarouter.ai/console](https://www.orcarouter.ai/console) to get your API key.

## Pricing

OrcaRouter acts as a gateway - you pay OrcaRouter's rates which aggregate multiple providers:

- **Browse for Free**: All catalog tools work without an API key
- **Pay-per-use**: Only pay for the models you actually use
- **Transparent Pricing**: See exact costs before making requests

Example pricing via OrcaRouter:
- GPT-4o: Similar to OpenAI direct pricing
- Claude 3.5 Sonnet: Similar to Anthropic direct pricing
- DeepSeek V3: Ultra-low cost option

Visit [orcarouter.ai](https://www.orcarouter.ai) for detailed pricing.

## Example Usage

Once connected to your MCP client:

- "List all providers on OrcaRouter"
- "Show me all Anthropic models with their pricing"
- "Get details about minimax/minimax-m2.7"
- "Chat with orcarouter/auto and explain quantum computing"
- "Use GPT-4 via OrcaRouter to write a function"

## Tools

- `orcarouter_chat` - Run chat completion (requires API key)
- `orcarouter_models_list` - Browse the catalog (no key needed)
- `orcarouter_model_card` - Detailed info for one model (no key needed)
- `orcarouter_providers_list` - List providers with model counts (no key needed)

## Supported Providers

OpenAI, Anthropic, Google, DeepSeek, Mistral, Qwen, Minimax, Cohere, Together AI, Replicate, and many more.

## Upstream

- **Repository**: https://github.com/Continuum-AI-Corp/orcarouter-mcp-server
- **License**: MIT
- **Author**: OrcaRouter / Continuum AI Corp
- **Version**: 1.1.5
- **Website**: [orcarouter.ai](https://www.orcarouter.ai)
