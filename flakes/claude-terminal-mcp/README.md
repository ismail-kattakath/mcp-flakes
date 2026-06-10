# MCP Claude Terminal Server Flake

Pure Node.js terminal and filesystem access for Claude Desktop. Zero npm dependencies - uses only Node.js built-in modules.

## Upstream

- **Source**: https://github.com/LukeLamb/claude-terminal-mcp
- **Commit**: 25ee5511264ef1c84a1e9bc596dd5104fe1be5e3
- **License**: MIT

## Tools

- `execute_command` - Execute a shell command in the terminal
  - `command` (string, required): Shell command to execute
  - `cwd` (string, optional): Working directory

- `read_file` - Read contents of a file
  - `path` (string, required): File path to read

- `write_file` - Write content to a file
  - `path` (string, required): File path to write
  - `content` (string, required): Content to write

- `list_directory` - List files in a directory
  - `path` (string, required): Directory path to list

- `start_background_job` - Start a long-running background process
  - `command` (string, required): Command to run in background
  - `cwd` (string, optional): Working directory

- `stop_background_job` - Stop a running background job
  - `job_id` (string, required): Job ID to stop

- `list_jobs` - List all running background jobs

## Environment Variables

- `DEFAULT_CWD` - Default working directory for commands (default: `/tmp`)

## Build Notes

**NO BUILD STEP REQUIRED** - This is pure JavaScript with zero dependencies. The repository contains only `server.js` with Node.js built-in modules.

## Usage

### With Docker Compose

```bash
cd flakes/claude-terminal-mcp
docker compose run --rm mcp-claude-terminal
```

### Direct Docker Run

```bash
docker run -i --rm \
  -e DEFAULT_CWD=/workspace \
  ghcr.io/mcp-flakes/claude-terminal-mcp:latest
```

### In a Bundle

```yaml
include:
  - ../../flakes/claude-terminal-mcp/compose.yaml

# Override environment in bundle's .env file:
# DEFAULT_CWD=/workspace
```

## MCP Protocol

This server uses stdio transport. It expects MCP protocol messages on stdin and writes responses to stdout.

## Example Usage

Execute a command:
```json
{
  "name": "execute_command",
  "arguments": {
    "command": "ls -la",
    "cwd": "/tmp"
  }
}
```

Read a file:
```json
{
  "name": "read_file",
  "arguments": {
    "path": "/etc/hosts"
  }
}
```

Start a background job:
```json
{
  "name": "start_background_job",
  "arguments": {
    "command": "python -m http.server 8080",
    "cwd": "/var/www"
  }
}
```

## Example Questions for Claude

1. "Run 'uname -a' to show system information"
2. "List all files in /tmp"
3. "Read the contents of package.json"
4. "Start a Python web server in the background on port 8080"
5. "Show me all running background jobs"
