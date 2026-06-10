# 🌿 MCP Git Server Flake

Complete Git repository operations for AI agents - inspect history, manage branches, and create commits with Git LFS support.

## Upstream

- **Source**: https://github.com/modelcontextprotocol/servers
- **Subpath**: src/git
- **Commit**: 275175cda17ca9c49920ceed2bcf27e12e59f8b2
- **License**: MIT

## Tools

### Status and Diff Tools
- `git_status` - Shows the working tree status
  - Input: `repo_path` (string)
  - Returns: Current status of working directory

- `git_diff_unstaged` - Shows changes in working directory not yet staged
  - Inputs: `repo_path` (string), `context_lines` (number, optional, default: 3)
  - Returns: Diff output of unstaged changes

- `git_diff_staged` - Shows changes that are staged for commit
  - Inputs: `repo_path` (string), `context_lines` (number, optional, default: 3)
  - Returns: Diff output of staged changes

- `git_diff` - Shows differences between branches or commits
  - Inputs: `repo_path` (string), `target` (string), `context_lines` (number, optional, default: 3)
  - Returns: Diff output comparing current state with target

### Commit Operations
- `git_commit` - Records changes to the repository
  - Inputs: `repo_path` (string), `message` (string)
  - Returns: Confirmation with new commit hash

- `git_add` - Adds file contents to the staging area
  - Inputs: `repo_path` (string), `files` (string[])
  - Returns: Confirmation of staged files

- `git_reset` - Unstages all staged changes
  - Input: `repo_path` (string)
  - Returns: Confirmation of reset operation

### History and Inspection
- `git_log` - Shows commit logs with optional date filtering
  - Inputs:
    - `repo_path` (string)
    - `max_count` (number, optional, default: 10)
    - `start_timestamp` (string, optional) - ISO 8601, relative, or absolute dates
    - `end_timestamp` (string, optional) - ISO 8601, relative, or absolute dates
  - Returns: Array of commit entries with hash, author, date, and message

- `git_show` - Shows the contents of a commit
  - Inputs: `repo_path` (string), `revision` (string)
  - Returns: Contents of the specified commit

### Branch Operations
- `git_create_branch` - Creates a new branch
  - Inputs: `repo_path` (string), `branch_name` (string), `base_branch` (string, optional)
  - Returns: Confirmation of branch creation

- `git_checkout` - Switches branches
  - Inputs: `repo_path` (string), `branch_name` (string)
  - Returns: Confirmation of branch switch

- `git_branch` - List Git branches
  - Inputs:
    - `repo_path` (string)
    - `branch_type` (string) - 'local', 'remote', or 'all'
    - `contains` (string, optional) - Commit SHA that branch should contain
    - `not_contains` (string, optional) - Commit SHA that branch should NOT contain
  - Returns: List of branches

## Usage

### With Docker Compose

```bash
cd flakes/git
docker compose run --rm mcp-git
```

### Direct Docker Run

```bash
docker run -i --rm \
  ghcr.io/mcp-flakes/git:latest
```

### In a Bundle

```yaml
include:
  - ../../flakes/git/compose.yaml
```

### Volume Mounting for Repository Access

To access repositories on your host system, mount them into the container:

```bash
docker run -i --rm \
  -v /path/to/your/repo:/repo \
  ghcr.io/mcp-flakes/git:latest
```

## MCP Protocol

This server uses stdio transport. It expects MCP protocol messages on stdin and writes responses to stdout.

## Quick Start

```bash
# 1. Mount your repository
docker run -i --rm \
  -v /path/to/your/repo:/repo \
  ghcr.io/mcp-flakes/git:latest

# 2. Or use Docker Compose
cd flakes/git
docker compose run --rm mcp-git
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **History Analysis** | "Show me all commits from last week" |
| **Branch Management** | "Create a feature branch from main" |
| **Code Review** | "Show me the diff for the last commit" |
| **Commit Operations** | "Stage all modified files and commit with message" |
| **Repository Inspection** | "List all branches containing commit abc123" |

## Examples

### View Recent History with Date Filtering

```json
{
  "name": "git_log",
  "arguments": {
    "repo_path": "/repo",
    "max_count": 20,
    "start_timestamp": "2024-01-01",
    "end_timestamp": "2024-12-31"
  }
}
```

### Create Feature Branch and Stage Changes

```json
// 1. Create branch
{
  "name": "git_create_branch",
  "arguments": {
    "repo_path": "/repo",
    "branch_name": "feature/new-api",
    "base_branch": "main"
  }
}

// 2. Checkout branch
{
  "name": "git_checkout",
  "arguments": {
    "repo_path": "/repo",
    "branch_name": "feature/new-api"
  }
}

// 3. Stage files
{
  "name": "git_add",
  "arguments": {
    "repo_path": "/repo",
    "files": ["src/api.ts", "tests/api.test.ts"]
  }
}
```

### Compare Branches

```json
{
  "name": "git_diff",
  "arguments": {
    "repo_path": "/repo",
    "target": "main..feature/new-api",
    "context_lines": 5
  }
}
```

## Notes

- **Git LFS Support**: Large File Storage is pre-configured
- **Container Isolation**: All operations run in secure container
- **Security**: Mount only specific repositories you want to access
- **Read/Write**: Full read and write access to mounted repositories

## Related Flakes

- **github** - GitHub API integration for PR/issue workflows
- **filesystem** - File system operations
- **gitlab** - GitLab API integration (if available)

## MCP Protocol

This server uses stdio transport. It expects MCP protocol messages on stdin and writes responses to stdout.
