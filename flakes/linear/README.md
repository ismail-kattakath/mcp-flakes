# Linear MCP Server

Natural language interface to Linear project management for issues, projects, teams, and workflows.

## Features

- **Issue management** - Create, read, update, delete issues
- **Project tracking** - Manage projects and roadmaps
- **Team collaboration** - Access team structures and members
- **Search & filter** - Full-text search with advanced filters
- **Workflow states** - Manage issue states and transitions
- **Sprint cycles** - Track sprint progress
- **Comments** - Add and read issue comments
- **Labels** - Organize with custom labels

## Authentication

Requires a Linear Personal API Key.

### Setup

1. Go to https://linear.app/settings/api
2. Click "Create new API key"
3. Give it a name (e.g., "MCP Server")
4. Copy the generated API key (starts with `lin_api_`)
5. Store it securely - it won't be shown again

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LINEAR_API_KEY` | Yes | Personal API Key from Linear Settings |

## Tools

### Issue Management
- `list_issues` - List and filter issues with pagination
- `get_issue` - Get detailed issue information by ID or key
- `create_issue` - Create a new issue with title, description, team, assignee
- `update_issue` - Update issue properties (status, assignee, priority, labels)
- `delete_issue` - Delete an issue
- `search_issues` - Full-text search across issues

### Project Management
- `list_projects` - List all projects in workspace
- `get_project` - Get project details including milestones
- `create_project` - Create a new project with team assignment
- `update_project` - Update project properties (name, description, status)
- `create_project_link` - Link an issue to a project

### Team & Users
- `list_teams` - List all teams in workspace
- `get_team` - Get team details and members
- `list_users` - List all workspace users
- `get_user` - Get user details by ID

### Organization
- `list_labels` - List all labels
- `create_label` - Create a new label with name and color
- `list_workflows` - List workflow states (todo, in progress, done, etc.)

### Collaboration
- `add_comment` - Add comment to an issue
- `list_comments` - List comments on an issue

### Sprint Management
- `list_cycles` - List sprint cycles
- `get_cycle` - Get cycle details and issues

## Usage Examples

### Create an issue
```
"Create a Linear issue titled 'Fix login bug' in the Engineering team, assign it to @john, priority High"
```

### Search and filter
```
"Show me all high priority issues assigned to me that are in progress"
```

### Update issue status
```
"Move issue ENG-123 to 'In Review' status"
```

### Create project
```
"Create a new project called 'Q2 Redesign' in the Design team with description 'Complete UI refresh'"
```

### Add comment
```
"Add a comment to issue ENG-456: 'Fixed the race condition, ready for testing'"
```

### Sprint tracking
```
"Show me all issues in the current sprint for the Mobile team"
```

## Docker Usage

### Build
```bash
docker compose build
```

### Run
```bash
export LINEAR_API_KEY="lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
docker compose up -d
```

## Issue Filters

Filter issues by:
- **Status**: Todo, In Progress, In Review, Done, Canceled
- **Priority**: No Priority, Urgent, High, Medium, Low
- **Team**: Filter by team name or ID
- **Assignee**: Filter by user name or ID
- **Labels**: Filter by label names
- **Project**: Filter by project
- **Cycle**: Filter by sprint cycle
- **Created/Updated**: Date range filters

## Workflow States

Linear uses customizable workflow states per team:
- **Backlog**: Not started
- **Todo**: Ready to start
- **In Progress**: Actively being worked on
- **In Review**: Code/design review
- **Done**: Completed
- **Canceled**: Not doing

Each team can customize their workflow states.

## Issue Priorities

- **0**: No Priority
- **1**: Urgent
- **2**: High
- **3**: Medium
- **4**: Low

## Best Practices

- Use descriptive issue titles
- Always assign issues to a team
- Set priorities for better triage
- Use labels for categorization
- Link related issues to projects
- Add comments for status updates
- Use cycles for sprint planning

## API Rate Limits

Linear API rate limits:
- 1000 requests per hour per API key
- Burst limit: 100 requests per minute

The server handles rate limiting automatically with exponential backoff.

## Links

- Upstream: https://github.com/tacticlaunch/mcp-linear
- Linear API: https://developers.linear.app
- Get API Key: https://linear.app/settings/api
- License: MIT
