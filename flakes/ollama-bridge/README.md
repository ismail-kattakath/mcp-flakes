# Ollama Bridge MCP Server

MCP Server - Bridge to local Ollama LLM server. Run Llama, Mistral, Qwen and other local models through MCP.

## Features

- Connect MCP clients to local Ollama LLM
- Support for all Ollama models (Llama 3, Mistral, Qwen, etc.)
- Streaming responses
- No API keys needed - fully local
- Simple configuration

## Quick Start

### Prerequisites

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Start Ollama server: `ollama serve`
3. Pull a model: `ollama pull llama3`

### With Docker Compose

```bash
cd flakes/ollama-bridge
export OLLAMA_HOST=http://host.docker.internal:11434
docker compose run --rm mcp-ollama-bridge
```

### Pull Prebuilt Image

```bash
docker pull ghcr.io/mcp-flakes/ollama-bridge:latest
docker run -i --rm -e OLLAMA_HOST=http://host.docker.internal:11434 ghcr.io/mcp-flakes/ollama-bridge:latest
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OLLAMA_HOST` | No | `http://localhost:11434` | Ollama server URL |

### Connecting to Local Ollama

- **Linux**: `http://localhost:11434`
- **macOS/Windows (Docker)**: `http://host.docker.internal:11434`

## Pricing

**Free!** All models run locally on your machine. No API costs, no cloud charges.

## Popular Models

- **Llama 3**: Meta's latest open model
- **Mistral**: Efficient 7B parameter model
- **Qwen**: Alibaba's multilingual model
- **CodeLlama**: Specialized for code generation
- **Phi**: Microsoft's small but capable model

See [ollama.ai/library](https://ollama.ai/library) for full model list.

## Example Usage

Once connected to your MCP client:

- "Use Ollama with Llama3 to write a function that..."
- "Ask the local Mistral model to explain quantum computing"
- "Generate code using CodeLlama locally"

## Tools

- `ollama_chat` - Send chat messages to local Ollama models
- `ollama_list_models` - List all available Ollama models
- `ollama_pull_model` - Pull a model from Ollama registry

## Upstream

- **Repository**: https://github.com/jaspertvdm/mcp-server-ollama-bridge
- **License**: MIT
- **Author**: Jasper van de Meent
- **Part of**: HumoticaOS / SymbAIon ecosystem
