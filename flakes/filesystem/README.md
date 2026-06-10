# 📁 MCP Filesystem Server Flake

Secure file system operations for AI agents with granular directory access control.

## Upstream

- **Source**: https://github.com/modelcontextprotocol/servers
- **Subpath**: src/filesystem
- **Commit**: 275175cda17ca9c49920ceed2bcf27e12e59f8b2
- **License**: MIT

## Tools

- `read_file` - Read complete contents of a file
- `read_multiple_files` - Read multiple files simultaneously
- `write_file` - Create new file or overwrite existing (exercise caution)
- `edit_file` - Make selective edits using advanced pattern matching
- `create_directory` - Create new directory or ensure it exists
- `list_directory` - List directory contents with [FILE] or [DIR] prefixes
- `move_file` - Move or rename files and directories
- `search_files` - Recursively search for files/directories
- `get_file_info` - Get detailed metadata about files/directories
- `list_allowed_directories` - List directories the server can access

## Environment Variables

- `ALLOWED_DIRECTORIES` - Comma-separated list of directories the server can access (default: `/tmp`)

## Usage

### With Docker Compose

```bash
cd flakes/filesystem
docker compose run --rm mcp-filesystem
```

### Direct Docker Run

```bash
docker run -i --rm \
  -e ALLOWED_DIRECTORIES=/path/to/dir \
  ghcr.io/mcp-flakes/filesystem:latest
```

### In a Bundle

```yaml
include:
  - ../../flakes/filesystem/compose.yaml

# Override environment in bundle's .env file:
# ALLOWED_DIRECTORIES=/home/user/projects
```

## Quick Start

```bash
# 1. Set allowed directories in .env
echo "ALLOWED_DIRECTORIES=/home/user/projects,/tmp" > .env

# 2. Start the server
cd flakes/filesystem
docker compose run --rm mcp-filesystem
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **File Management** | "List all TypeScript files in the src directory" |
| **Code Analysis** | "Read all configuration files and summarize settings" |
| **Bulk Operations** | "Move all .log files to the archive directory" |
| **Project Search** | "Find all files containing 'API_KEY'" |
| **Metadata Inspection** | "Get size and modification date for all images" |

## Examples

### Read Multiple Files

```json
{
  "name": "read_multiple_files",
  "arguments": {
    "paths": [
      "/tmp/config.json",
      "/tmp/settings.yaml"
    ]
  }
}
```

### Pattern-Based File Editing

```json
{
  "name": "edit_file",
  "arguments": {
    "path": "/tmp/config.json",
    "edits": [
      {
        "oldText": "\"debug\": false",
        "newText": "\"debug\": true"
      }
    ]
  }
}
```

### Recursive Search

```json
{
  "name": "search_files",
  "arguments": {
    "path": "/tmp/projects",
    "pattern": "*.ts",
    "recursive": true
  }
}
```

## Security Features

- **Directory Whitelist**: Only access explicitly allowed directories
- **Path Validation**: Prevents directory traversal attacks
- **Read-Only Mode**: Optional read-only configuration
- **Sandboxed**: Runs in isolated Docker container

## MCP Protocol

This server uses stdio transport. It expects MCP protocol messages on stdin and writes responses to stdout.

## Related Flakes

- **git** - Version control operations
- **github** - GitHub API integration
- **sqlite** - Structured data storage
