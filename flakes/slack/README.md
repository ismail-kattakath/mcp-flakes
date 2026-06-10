# Slack MCP Server

Session-based Slack integration with 21 tools for messages, channels, search, and workflow automation.

## Features

- **21 comprehensive tools** for Slack workspace interaction
- **Session-based auth** - no OAuth, no admin approval required
- **Auto token extraction** from Chrome/Brave on macOS
- **Workflow primitives** for structured AI automation
- **Health monitoring** with automatic refresh warnings
- **Zero admin footprint** - no bot user visible in workspace

## Authentication

This server uses **session tokens** instead of OAuth, bypassing the need for app registration and admin approval.

### Setup Methods

**Option 1: Automatic (macOS only)**
```bash
npx -y @jtalk22/slack-mcp --setup
```
This wizard auto-extracts tokens from Chrome/Brave browser.

**Option 2: Manual**
1. Log into Slack in your browser
2. Open DevTools → Application → Cookies
3. Find `d` cookie (SLACK_COOKIE) and `xoxc-*` token (SLACK_TOKEN)
4. Set environment variables or store in `~/.slack-mcp-tokens.json`

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SLACK_TOKEN` | Yes | Slack user token (xoxc-...) |
| `SLACK_COOKIE` | Optional | Session cookie (d=...), auto-extracted on macOS |

**Token Storage**: Tokens are stored in `~/.slack-mcp-tokens.json` (chmod 600) or macOS Keychain.

## Tools

### Messaging
- `slack_search_messages` - Search messages across all channels
- `slack_get_channel_history` - Get recent messages from a channel
- `slack_get_thread` - Get all messages in a thread
- `slack_send_message` - Send a message to a channel
- `slack_reply_to_thread` - Reply to a message thread

### Channels & Users
- `slack_list_channels` - List all channels in workspace
- `slack_get_channel_info` - Get details about a channel
- `slack_get_user_info` - Get details about a user
- `slack_list_users` - List all users in workspace

### Engagement
- `slack_get_unread_count` - Get unread message count
- `slack_mark_as_read` - Mark messages as read
- `slack_add_reaction` - Add emoji reaction to a message
- `slack_remove_reaction` - Remove emoji reaction
- `slack_get_permalink` - Get permanent link to a message

### Workflow Automation
- `slack_workflow_save` - Save a workflow profile
- `slack_workflows` - Get structured workflow output (JSON)
- `slack_list_bookmarks` - List channel bookmarks
- `slack_search_files` - Search for files
- `slack_get_reminders` - List active reminders
- `slack_create_reminder` - Create a new reminder

### Health
- `slack_health` - Check token health and connectivity

## Workflow Primitives

Workflow profiles bind a `workflow_kind` to channels, priority people, retention, and cadence. The system returns structured JSON per workflow type:

| Workflow Kind | Returns |
|---------------|---------|
| `incident_room` | incident_summary, timeline, open_risks, owner_gaps, next_actions |
| `exec_brief` | summary, decisions, risks, asks, action_items |
| `support_inbox` | open_threads, ack_lag, owner_gaps, escalations, next_actions |
| `product_launch_watch` | launch_signals, feedback_themes, blockers, metrics, next_actions |
| `custom` | summary, highlights, open_questions, next_actions |

**Templates**: oncall-handoff, support-triage, exec-monday, sprint-tracker, customer-feedback, incident-room

## Usage Examples

### Search for a message
```
"Search Slack for messages about 'deployment' in the last 24 hours"
```

### Send a message
```
"Send a message to #engineering saying 'Build completed successfully'"
```

### Get team status
```
"Show me all unread messages from #incidents channel"
```

### Workflow automation
```
"Give me an incident room summary for #oncall-2024 with structured next actions"
```

## Docker Usage

### Build
```bash
docker compose build
```

### Run
```bash
export SLACK_TOKEN="xoxc-xxxxxxxxxxxxx"
export SLACK_COOKIE="d=xxxxxxxxxxxxx"  # optional
docker compose up -d
```

## Compatibility

- ✅ Claude Desktop / Claude Code
- ✅ Cursor
- ✅ Windsurf
- ✅ GitHub Copilot
- ✅ Gemini CLI
- ✅ Any MCP-compatible client

## Security Notes

- Tokens never leave your machine
- Session tokens have same access as your browser
- No bot user visible to workspace admins
- Tokens auto-refresh on macOS
- File writes are atomic (temp → chmod → rename)
- Concurrent refresh attempts are mutex-locked

## Links

- Upstream: https://github.com/jtalk22/slack-mcp-server
- NPM: https://www.npmjs.com/package/@jtalk22/slack-mcp
- License: MIT
