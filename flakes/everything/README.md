# 🎪 Everything - Complete MCP Protocol Reference Server

> Originally created by [Model Context Protocol team](https://github.com/modelcontextprotocol/servers) · Licensed under MIT  
> Packaged by [mcp-flakes](https://github.com/yourusername/mcp-flakes)

![Official MCP](https://img.shields.io/badge/MCP-official-blue) ![Tools: 15+](https://img.shields.io/badge/tools-15+-blue) ![Prompts: 4](https://img.shields.io/badge/prompts-4-green) ![Resources](https://img.shields.io/badge/resources-dynamic-purple)

## 📋 What This Does

The official MCP reference implementation that exercises **every feature** of the Model Context Protocol. Use this to test client implementations, explore protocol capabilities, learn MCP patterns, and validate advanced features like tasks, sampling, elicitation, and resource subscriptions.

## ⚡ Quick Start

```bash
docker run -i --rm ghcr.io/mcp-flakes/everything:latest
```

With Docker Compose:
```bash
cd flakes/everything
docker compose run --rm mcp-everything
```

## 🎯 Perfect For

- **MCP client testing** - Validate your client implementation against all protocol features
- **Protocol learning** - Explore tools, resources, prompts, sampling, tasks, and elicitation in one place
- **Integration development** - Reference implementation for building MCP-compliant servers
- **Feature exploration** - Test advanced capabilities like resource subscriptions and bidirectional tasks

## 🛠️ Tools & Features

### Basic Tools (4)
| Tool | Purpose |
|------|---------|
| `echo` | Echo messages back (basic connectivity test) |
| `get-sum` | Calculate sum of two numbers |
| `get-env` | Return all environment variables as JSON |
| `get-roots-list` | Return last roots list from client |

### Content & Annotations (3)
| Tool | Purpose |
|------|---------|
| `get-annotated-message` | Messages with priority/audience annotations |
| `get-tiny-image` | Tiny PNG MCP logo (image content test) |
| `get-structured-content` | Structured responses with outputSchema |

### Resource Management (3)
| Tool | Purpose |
|------|---------|
| `get-resource-links` | Multiple resource links (text/blob) |
| `get-resource-reference` | Concrete resource content blocks |
| `gzip-file-as-resource` | Fetch, compress, register session resources |

### Operations & Control (3)
| Tool | Purpose |
|------|---------|
| `trigger-long-running-operation` | Multi-step operations with progress |
| `toggle-simulated-logging` | Control periodic log messages |
| `toggle-subscriber-updates` | Control resource update notifications |

### Advanced Features (6)
| Tool | Purpose |
|------|---------|
| `trigger-sampling-request` | Issue sampling requests to client/LLM |
| `trigger-elicitation-request` | Issue form-mode elicitation requests |
| `trigger-url-elicitation` | Issue URL-mode elicitation |
| `simulate-research-query` | MCP Tasks with multi-stage operations |
| `trigger-sampling-request-async` | Bidirectional sampling tasks |
| `trigger-elicitation-request-async` | Bidirectional elicitation tasks |

## 📋 Prompts (4)

- **`simple-prompt`** - Static no-argument prompt
- **`args-prompt`** - Two-argument prompt (city/state) with parameters
- **`completable-prompt`** - Demonstrates argument auto-completions
- **`resource-prompt`** - Embeds dynamic resources in messages

## 📚 Resources

| Resource URI Pattern | Type | Description |
|---------------------|------|-------------|
| `demo://resource/dynamic/text/{index}` | Text | Dynamic text resources |
| `demo://resource/dynamic/blob/{index}` | Blob | Dynamic binary resources |
| `demo://resource/static/document/<filename>` | Text | Static documents |
| `demo://resource/session/<name>` | Mixed | Session-scoped resources |

## 🎨 Advanced Features Demonstrated

### Resource Subscriptions
Subscribe/unsubscribe to resource URIs and receive update notifications:
1. Client subscribes to `demo://resource/dynamic/text/1`
2. Use `toggle-subscriber-updates` to enable notifications
3. Receive updates when resources change
4. Per-session tracking with independent delivery

### Simulated Logging
Test logging implementations across severity levels:
- Use `toggle-simulated-logging` for periodic log messages
- **Levels**: debug, info, notice, warning, error, critical, alert, emergency
- Clients control minimum level via `logging/setLevel`

### MCP Tasks (SEP-1686)
Full task lifecycle demonstration:
- **Capabilities**: `tasks.list`, `tasks.cancel`, `tasks.requests.tools.call`
- **Statuses**: working, input_required, completed, failed, cancelled
- **Bidirectional**: Both server and client can be task executors

**Task Lifecycle:**
1. Client calls `tools/call` with `task: true`
2. Server returns `CreateTaskResult` with `taskId`
3. Client polls `tasks/get` for status updates
4. Client retrieves final result via `tasks/result`

## 📚 Examples

### Example 1: Test Basic Connectivity
Ask Claude: *"Echo 'hello world' and calculate the sum of 42 and 58"*

Validates basic tool execution and data passing.

### Example 2: Explore Resources
Ask Claude: *"Show me the dynamic text resource at index 5 and the static document 'example.txt'"*

Tests resource URI resolution and content delivery.

### Example 3: Test Task System
Ask Claude: *"Simulate a research query with 3 steps and show progress updates"*

Demonstrates the full MCP Tasks protocol including progress reporting.

### Example 4: Advanced Integration
Ask Claude: *"Enable subscriber updates, then monitor the dynamic blob resource at index 2"*

Tests resource subscriptions and real-time update notifications.

## 🔗 Works Great With

- **a2asearch** - Test Everything server, then discover other MCP servers to integrate
- **fetch** - Compare external web resource fetching with Everything's internal resources
- **claude-terminal-mcp** - Run Everything server diagnostics and inspect MCP protocol messages

## 🔧 Configuration

### Environment Variables

**None required** - This is a self-contained test server.

### Build Pattern

**Type**: Source build from official MCP monorepo  
**Subpath**: `src/everything`

Built from the Model Context Protocol reference implementation.

## 📖 Additional Documentation

Deep dives into specific features:
- [Architecture](https://github.com/modelcontextprotocol/servers/blob/main/src/everything/docs/architecture.md) - Server design and component structure
- [Server Features](https://github.com/modelcontextprotocol/servers/blob/main/src/everything/docs/features.md) - Complete feature catalog
- [How It Works](https://github.com/modelcontextprotocol/servers/blob/main/src/everything/docs/how-it-works.md) - Implementation details and patterns

## 📦 Source & Compliance

- **Source**: https://github.com/modelcontextprotocol/servers
- **Subpath**: src/everything
- **Commit**: `275175cda17ca9c49920ceed2bcf27e12e59f8b2`
- **License**: MIT
- **Protocol**: stdio transport
- **Status**: Official MCP reference implementation
