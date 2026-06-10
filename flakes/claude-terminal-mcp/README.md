# 💻 Claude Terminal - Pure Node.js Shell & Filesystem Access

> Originally created by [LukeLamb](https://github.com/LukeLamb/claude-terminal-mcp) · Licensed under MIT  
> Packaged by [mcp-flakes](https://github.com/yourusername/mcp-flakes)

![Zero dependencies](https://img.shields.io/badge/dependencies-0-green) ![Pure Node.js](https://img.shields.io/badge/Node.js-built--in-339933?logo=node.js) ![Tools: 7](https://img.shields.io/badge/tools-7-blue)

## 📋 What This Does

Pure Node.js terminal and filesystem access for Claude Desktop with zero npm dependencies. Execute shell commands, manage files, and run background processes - all using only Node.js built-in modules for maximum reliability and minimal overhead.

## ⚡ Quick Start

```bash
docker run -i --rm \
  -e DEFAULT_CWD=/workspace \
  ghcr.io/mcp-flakes/claude-terminal-mcp:latest
```

With Docker Compose:
```bash
cd flakes/claude-terminal-mcp
docker compose run --rm mcp-claude-terminal
```

## 🎯 Perfect For

- **Development automation** - Execute build scripts, run tests, manage processes
- **File management** - Read logs, write configs, navigate directory structures
- **System administration** - Check system info, monitor processes, manage services
- **Background jobs** - Run dev servers, watchers, or long-running processes while interacting with Claude

## 🛠️ Tools & Features

| Tool | Purpose | Key Parameters |
|------|---------|---------------|
| `execute_command` | Execute any shell command | `command`, `cwd` (optional) |
| `read_file` | Read file contents | `path` |
| `write_file` | Write content to file | `path`, `content` |
| `list_directory` | List directory contents | `path` |
| `start_background_job` | Start long-running process | `command`, `cwd` (optional) |
| `stop_background_job` | Stop background process | `job_id` |
| `list_jobs` | List all running jobs | None |

## 📚 Examples

### Example 1: Development Workflow
Ask Claude: *"List all JavaScript files in the current directory, then run 'npm test' on the project"*

Navigate, inspect, and execute build commands seamlessly.

### Example 2: Log Analysis
Ask Claude: *"Read the last 50 lines of /var/log/app.log and summarize any errors"*

Combine file reading with AI analysis.

### Example 3: Background Development Server
Ask Claude: *"Start a Python HTTP server on port 8080 in /var/www as a background job, then list all running jobs"*

```json
{
  "name": "start_background_job",
  "arguments": {
    "command": "python -m http.server 8080",
    "cwd": "/var/www"
  }
}
```

The server runs in the background while you continue working.

### Example 4: System Diagnostics
Ask Claude: *"Run 'uname -a', 'df -h', and 'free -m' to show system information"*

Quick system checks with natural language.

### Example 5: Config File Management
Ask Claude: *"Read the nginx.conf file, update the port to 8080, and write it back"*

AI-assisted configuration editing.

## 🔗 Works Great With

- **a2asearch** - Find and install MCP servers, then use terminal to test them
- **fetch** - Fetch remote content, save locally with write_file, then process with shell tools
- **everything** - Combine terminal execution with MCP's full protocol testing capabilities

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `DEFAULT_CWD` | Default working directory | `/tmp` | `/workspace`, `/home/user/project` |

**Note**: Each command can override `cwd` per-execution, but `DEFAULT_CWD` sets the fallback.

### Security Considerations

This server provides shell access - use appropriate security measures:
- Run in isolated containers
- Mount only necessary volumes
- Set restrictive permissions
- Monitor background jobs

### Build Pattern

**Type**: Pure JavaScript (no build step)  
**Dependencies**: Zero - uses only Node.js built-in modules (`child_process`, `fs`, `path`)

The entire server is a single `server.js` file. Maximum simplicity and reliability.

## 📦 Source & Compliance

- **Source**: https://github.com/LukeLamb/claude-terminal-mcp
- **Commit**: `25ee5511264ef1c84a1e9bc596dd5104fe1be5e3`
- **License**: MIT
- **Protocol**: stdio transport
- **Runtime**: Node.js (no external dependencies)
