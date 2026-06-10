# MCP Everything Server Flake

A comprehensive test server that exercises all features of the MCP protocol. This is a reference implementation showcasing MCP capabilities including tools, resources, prompts, sampling, tasks, and more.

## Upstream

- **Source**: https://github.com/modelcontextprotocol/servers
- **Subpath**: src/everything
- **Commit**: 275175cda17ca9c49920ceed2bcf27e12e59f8b2
- **License**: MIT

## Tools

### Basic Tools
- `echo` - Echoes the provided message back
- `get-sum` - Calculates and returns the sum of two numbers
- `get-env` - Returns all environment variables as JSON
- `get-roots-list` - Returns the last list of roots sent by client

### Content and Annotations
- `get-annotated-message` - Returns annotated messages with priority/audience
- `get-tiny-image` - Returns a tiny PNG MCP logo
- `get-structured-content` - Demonstrates structured responses with outputSchema

### Resources
- `get-resource-links` - Returns multiple resource links (text/blob)
- `get-resource-reference` - Returns concrete resource content blocks
- `gzip-file-as-resource` - Fetches, compresses, and registers session resources

### Operations and Control
- `trigger-long-running-operation` - Simulates multi-step operations with progress
- `toggle-simulated-logging` - Controls simulated logging per session
- `toggle-subscriber-updates` - Controls resource update notifications

### Advanced Features
- `trigger-sampling-request` - Issues sampling requests to client/LLM
- `trigger-elicitation-request` - Issues elicitation requests (form-mode)
- `trigger-url-elicitation` - Issues URL-mode elicitation requests
- `simulate-research-query` - Demonstrates MCP Tasks with multi-stage operations
- `trigger-sampling-request-async` - Bidirectional tasks (sampling)
- `trigger-elicitation-request-async` - Bidirectional tasks (elicitation)

## Prompts

- `simple-prompt` - No-argument static prompt
- `args-prompt` - Two-argument prompt with city/state
- `completable-prompt` - Demonstrates argument auto-completions
- `resource-prompt` - Embeds dynamic resources in messages

## Resources

- **Dynamic Text**: `demo://resource/dynamic/text/{index}`
- **Dynamic Blob**: `demo://resource/dynamic/blob/{index}`
- **Static Documents**: `demo://resource/static/document/<filename>`
- **Session Scoped**: `demo://resource/session/<name>`

## Features Demonstrated

### Resource Subscriptions
- Clients can subscribe/unsubscribe to resource URIs
- Use `toggle-subscriber-updates` to start/stop update notifications
- Per-session tracking with independent delivery

### Simulated Logging
- Use `toggle-simulated-logging` to control periodic log messages
- Varying levels: debug, info, notice, warning, error, critical, alert, emergency
- Clients control minimum level via `logging/setLevel`

### MCP Tasks (SEP-1686)
- **Capabilities**: `tasks.list`, `tasks.cancel`, `tasks.requests.tools.call`
- **Task Statuses**: working, input_required, completed, failed, cancelled
- **Bidirectional**: Both server and client can be task executors

#### Task Lifecycle
1. Client calls `tools/call` with `task: true`
2. Server returns `CreateTaskResult` with `taskId`
3. Client polls `tasks/get` for status updates
4. When complete, client calls `tasks/result` for final result

## Usage

### With Docker Compose

```bash
cd flakes/everything
docker compose run --rm mcp-everything
```

### Direct Docker Run

```bash
docker run -i --rm \
  ghcr.io/mcp-flakes/everything:latest
```

### In a Bundle

```yaml
include:
  - ../../flakes/everything/compose.yaml
```

## Use Cases

This server is primarily intended for:
- Testing MCP client implementations
- Demonstrating all MCP protocol features
- Reference implementation for MCP builders
- Exploring advanced features like tasks and elicitation

## MCP Protocol

This server uses stdio transport. It expects MCP protocol messages on stdin and writes responses to stdout.

## Additional Documentation

For more details, see the upstream documentation:
- [Architecture](https://github.com/modelcontextprotocol/servers/blob/main/src/everything/docs/architecture.md)
- [Server Features](https://github.com/modelcontextprotocol/servers/blob/main/src/everything/docs/features.md)
- [How It Works](https://github.com/modelcontextprotocol/servers/blob/main/src/everything/docs/how-it-works.md)
