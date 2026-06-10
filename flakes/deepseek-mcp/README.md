# DeepSeek MCP Server

MCP server for DeepSeek AI with chat, reasoning, multi-turn sessions, function calling, thinking mode, and cost tracking.

## Features

- **DeepSeek V3.2**: Latest models with chat and reasoning capabilities
- **Multi-Turn Sessions**: Conversation context preserved across requests
- **Model Fallback & Circuit Breaker**: Automatic fallback between models
- **Thinking Mode**: Enable thinking on deepseek-chat
- **JSON Output Mode**: Structured JSON responses
- **Function Calling**: OpenAI-compatible tool use (up to 128 tools)
- **Cache-Aware Cost Tracking**: Automatic cost calculation
- **Session Management**: List, delete, and clear sessions
- **12 Prompt Templates**: Templates for debugging, code review, and more
- **Streaming Support**: Real-time response generation

## Quick Start

### With Docker Compose

```bash
cd flakes/deepseek-mcp
export DEEPSEEK_API_KEY=your-key-here
docker compose run --rm mcp-deepseek
```

### Pull Prebuilt Image

```bash
docker pull ghcr.io/mcp-flakes/deepseek-mcp:latest
docker run -i --rm -e DEEPSEEK_API_KEY=your-key-here ghcr.io/mcp-flakes/deepseek-mcp:latest
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DEEPSEEK_API_KEY` | Yes | Your DeepSeek API key |

### Get API Key

Sign up at [platform.deepseek.com](https://platform.deepseek.com) to get your API key.

## Pricing

DeepSeek offers very competitive pricing:

- **DeepSeek-V3.2 Chat**: $0.14 per 1M input tokens, $0.28 per 1M output tokens
- **DeepSeek-V3.2 Reasoner**: $0.55 per 1M input tokens, $2.19 per 1M output tokens

**Note**: DeepSeek is one of the most cost-effective AI APIs available, offering GPT-4 level performance at a fraction of the cost.

## Example Usage

Once connected to your MCP client:

- "Use DeepSeek to solve this complex math problem with reasoning"
- "Ask DeepSeek to write a Python function with thinking mode enabled"
- "Start a multi-turn session with DeepSeek for a coding project"

## Tools

- `deepseek_chat` - Chat with DeepSeek V3.2 models (chat and reasoner)
- `deepseek_sessions` - Manage chat sessions (list, delete, clear)
- `deepseek_models` - List available DeepSeek models with pricing
- `deepseek_config` - View current configuration
- `deepseek_usage` - Track token usage and costs

## Models

- **deepseek-chat**: Fast, general-purpose chat model
- **deepseek-reasoner**: Advanced reasoning with chain-of-thought

## Upstream

- **Repository**: https://github.com/arikusi/deepseek-mcp-server
- **License**: MIT
- **Author**: arikusi
- **Version**: 1.7.0
- **Listed on**: MCP Registry, Smithery, Glama, LobeHub, Fronteir AI
