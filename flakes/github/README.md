# GitHub API MCP Server

A comprehensive Model Context Protocol server for the GitHub API, enabling file operations, repository management, search functionality, PR workflows, and complete GitHub automation.

## Features

- **File Operations**: Create, update, and manage files in repositories
- **Repository Management**: Create, fork, and manage repositories
- **Branch Operations**: Create and manage branches with automatic creation
- **Issue Management**: Create, update, list, and comment on issues
- **Pull Request Workflows**: Full PR lifecycle from creation to merge
- **Advanced Search**: Search code, issues/PRs, and users across GitHub
- **Batch Operations**: Push multiple files in a single commit
- **Git History Preservation**: Maintains proper Git history without force pushing

## Authentication

This server requires a GitHub Personal Access Token (PAT).

### Creating a Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token" (classic)
3. Select scopes:
   - **For private repositories**: Select `repo` (Full control of private repositories)
   - **For public repositories only**: Select `public_repo`
4. Generate and copy the token

**Security Note**: Store your token securely. Never commit it to version control.

## Tools

### File Operations

#### create_or_update_file
Create or update a single file in a repository.

**Inputs:**
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `path` (string): File path
- `content` (string): File content
- `message` (string): Commit message
- `branch` (string): Target branch
- `sha` (optional string): SHA of existing file (for updates)

#### push_files
Push multiple files in a single commit.

**Inputs:**
- `owner`, `repo`, `branch` (string)
- `files` (array): Files with `path` and `content`
- `message` (string): Commit message

#### get_file_contents
Get contents of a file or directory.

**Inputs:**
- `owner`, `repo`, `path` (string)
- `branch` (optional string): Target branch

### Repository Management

#### create_repository
Create a new GitHub repository.

**Inputs:**
- `name` (string): Repository name
- `description` (optional string)
- `private` (optional boolean)
- `autoInit` (optional boolean): Initialize with README

#### fork_repository
Fork a repository to your account or organization.

**Inputs:**
- `owner`, `repo` (string)
- `organization` (optional string): Org to fork to

#### search_repositories
Search for GitHub repositories.

**Inputs:**
- `query` (string): Search query
- `page`, `perPage` (optional number): Pagination

### Branch Operations

#### create_branch
Create a new branch.

**Inputs:**
- `owner`, `repo`, `branch` (string)
- `from_branch` (optional string): Source branch

### Issue Management

#### create_issue
Create a new issue.

**Inputs:**
- `owner`, `repo`, `title` (string)
- `body` (optional string)
- `assignees`, `labels` (optional array)
- `milestone` (optional number)

#### list_issues
List and filter issues.

**Inputs:**
- `owner`, `repo` (string)
- `state` (optional): 'open', 'closed', 'all'
- `labels`, `sort`, `direction`, `since` (optional)

#### update_issue
Update an existing issue.

**Inputs:**
- `owner`, `repo`, `issue_number` (required)
- `title`, `body`, `state`, `labels`, `assignees` (optional)

#### add_issue_comment
Add a comment to an issue.

**Inputs:**
- `owner`, `repo`, `issue_number`, `body` (string)

#### get_issue
Get details of a specific issue.

### Pull Request Workflows

#### create_pull_request
Create a new pull request.

**Inputs:**
- `owner`, `repo`, `title`, `head`, `base` (string)
- `body` (optional string)
- `draft`, `maintainer_can_modify` (optional boolean)

#### list_pull_requests
List and filter pull requests.

**Inputs:**
- `owner`, `repo` (string)
- `state`, `head`, `base`, `sort`, `direction` (optional)

#### get_pull_request
Get details of a specific PR.

**Inputs:**
- `owner`, `repo`, `pull_number` (required)

#### get_pull_request_files
Get list of files changed in a PR.

#### get_pull_request_status
Get combined status of all status checks.

#### update_pull_request_branch
Update PR branch with latest base branch changes.

#### create_pull_request_review
Create a review on a pull request.

**Inputs:**
- `owner`, `repo`, `pull_number`, `body`, `event` (required)
- `event` options: 'APPROVE', 'REQUEST_CHANGES', 'COMMENT'
- `comments` (optional array): Line-specific comments

#### merge_pull_request
Merge a pull request.

**Inputs:**
- `owner`, `repo`, `pull_number` (required)
- `merge_method` (optional): 'merge', 'squash', 'rebase'
- `commit_title`, `commit_message` (optional)

#### get_pull_request_comments
Get review comments on a PR.

#### get_pull_request_reviews
Get reviews on a pull request.

### Search Operations

#### search_code
Search for code across GitHub.

**Query Syntax:**
- `language:javascript` - by language
- `repo:owner/name` - in specific repo
- `path:src/` - in specific path
- `extension:js` - by file extension

**Example:** `"import express" language:typescript path:src/`

#### search_issues
Search for issues and pull requests.

**Query Syntax:**
- `is:issue` or `is:pr` - filter by type
- `is:open` or `is:closed` - by state
- `label:bug` - by label
- `author:username` - by author

**Example:** `"memory leak" is:issue is:open label:bug`

#### search_users
Search for GitHub users.

**Query Syntax:**
- `type:user` or `type:org` - by account type
- `followers:>1000` - by followers
- `location:London` - by location

**Example:** `"fullstack developer" location:London followers:>100`

### Commit Operations

#### list_commits
Get commits of a branch.

**Inputs:**
- `owner`, `repo` (string)
- `sha` (optional string): Branch name
- `page`, `per_page` (optional): Pagination

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_PERSONAL_ACCESS_TOKEN` | Yes | GitHub PAT with repo scope |

### Docker Usage

```bash
docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxx" \
  mcp/github:0.6.2
```

### Docker Compose

```yaml
services:
  github-mcp:
    image: mcp/github:0.6.2
    environment:
      - GITHUB_PERSONAL_ACCESS_TOKEN=${GITHUB_TOKEN}
    stdin_open: true
```

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "mcp/github:0.6.2"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

## Building

Build the Docker image locally:

```bash
docker build -t mcp/github:0.6.2 .
```

Or use Docker Compose:

```bash
docker compose build
```

## Testing

Test with your GitHub account:

```bash
# Set your token
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_your_token_here"

# Run the server
docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN \
  mcp/github:0.6.2
```

## Use Cases

### Automated Code Updates
```
"Update the README.md in my repo to include the new installation instructions"
"Create a new branch called 'feature/api-updates' and add these API changes"
```

### Issue Management
```
"Create an issue for the memory leak in the user service"
"List all open issues labeled 'bug' and 'high-priority'"
```

### Pull Request Workflows
```
"Create a PR from feature-branch to main with these changes"
"Review the latest PR and approve it if tests pass"
"Merge PR #42 using squash merge"
```

### Code Search
```
"Search for all usages of the deprecated API function across my repositories"
"Find TypeScript files that import the old authentication module"
```

### Repository Management
```
"Fork the popular-project/awesome-repo to my account"
"Create a new private repository called 'internal-tools'"
```

## Security Considerations

- **Token Scope**: Use minimal required scope (public_repo for public repos)
- **Token Storage**: Store tokens in environment variables, not in code
- **Rate Limiting**: GitHub API has rate limits (5000/hour for authenticated requests)
- **Audit Logging**: GitHub logs all API access

## Troubleshooting

### Bad credentials

**Problem:** Invalid or expired token

**Solution:** Generate a new token with proper scopes

### Resource not accessible

**Problem:** Token doesn't have required permissions

**Solution:** Regenerate token with `repo` or `public_repo` scope

### API rate limit exceeded

**Problem:** Too many API requests

**Solution:** Wait for rate limit reset or use a different token

### Branch not found

**Problem:** Specified branch doesn't exist

**Solution:** The server auto-creates branches if they don't exist

## API Rate Limits

- **Authenticated**: 5,000 requests per hour
- **Search API**: 30 requests per minute
- **GraphQL API**: 5,000 points per hour

Check current rate limit status via GitHub API headers.

## Upstream

This flake is built from the official MCP servers repository:

- **Repository**: https://github.com/modelcontextprotocol/servers-archived
- **Commit**: 9be4674
- **Path**: src/github
- **License**: MIT

**Note:** Development has moved to https://github.com/github/github-mcp-server

## Version

- **Server Version**: 0.6.2
- **MCP SDK**: 1.0.1
- **Node.js**: 22

## License

MIT License - see upstream repository for details.
