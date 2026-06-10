# Discord MCP Server

Comprehensive Discord bot integration with 46 tools for channels, messages, roles, threads, and moderation.

## Features

- **46 comprehensive tools** for Discord server management
- **Multi-guild support** - manage multiple servers
- **Thread & forum operations** - full forum channel support
- **Webhook management** - create and execute webhooks
- **Moderation tools** - kick, ban, bulk delete, slowmode
- **Role management** - create, edit, assign roles
- **Audit logging** - track server changes

## Authentication

Requires a Discord Bot Token from the Discord Developer Portal.

### Setup

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Go to "Bot" tab
4. Click "Reset Token" to get your bot token
5. Enable required **Privileged Gateway Intents**:
   - ✅ Server Members Intent
   - ✅ Message Content Intent
6. Go to OAuth2 → URL Generator
7. Select scopes: `bot`, `applications.commands`
8. Select permissions (minimum):
   - Read Messages/View Channels
   - Send Messages
   - Manage Messages
   - Manage Channels
   - Manage Roles
   - Manage Threads
   - Manage Webhooks
9. Copy the generated URL and invite bot to your server

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_BOT_TOKEN` | Yes | Bot token from Discord Developer Portal |

## Tools

### Server Management
- `list_guilds` - List all servers the bot is in
- `get_guild` - Get detailed guild/server information

### Channel Operations
- `list_channels` - List all channels in a guild
- `get_channel` - Get detailed channel information
- `create_channel` - Create a new channel (text/voice/category)
- `delete_channel` - Delete a channel
- `set_slowmode` - Set channel slowmode delay

### Messaging
- `send_message` - Send a message to a channel
- `edit_message` - Edit an existing message
- `delete_message` - Delete a message
- `get_messages` - Get messages from a channel (up to 100)
- `bulk_delete_messages` - Bulk delete messages (2-100)
- `pin_message` - Pin a message
- `unpin_message` - Unpin a message
- `add_reaction` - Add emoji reaction
- `remove_reaction` - Remove emoji reaction

### Member Management
- `list_members` - List guild members
- `get_member` - Get member details
- `kick_member` - Kick a member from guild
- `ban_member` - Ban a member
- `unban_member` - Unban a member

### Role Management
- `list_roles` - List all roles in guild
- `create_role` - Create a new role
- `edit_role` - Edit role properties (name, color, permissions)
- `delete_role` - Delete a role
- `assign_role` - Assign role to member
- `remove_role` - Remove role from member

### Thread Operations
- `create_thread` - Create a new thread
- `list_threads` - List threads in channel
- `join_thread` - Join a thread
- `leave_thread` - Leave a thread
- `archive_thread` - Archive a thread

### Forum Channels
- `create_forum_post` - Create a forum post
- `list_forum_posts` - List forum posts
- `get_forum_post` - Get forum post details
- `edit_forum_post` - Edit forum post
- `delete_forum_post` - Delete forum post

### Webhooks
- `create_webhook` - Create a webhook
- `list_webhooks` - List webhooks
- `delete_webhook` - Delete a webhook
- `execute_webhook` - Execute webhook to send message

### Server Admin
- `list_invites` - List guild invites
- `create_invite` - Create an invite
- `delete_invite` - Delete an invite
- `get_audit_log` - Get audit log entries
- `list_emojis` - List guild custom emojis

## Usage Examples

### Send a message
```
"Send a message to #general saying 'Hello from AI!'"
```

### Manage roles
```
"Create a new role called 'Contributors' with blue color"
"Assign the Contributors role to @username"
```

### Moderation
```
"Delete the last 50 messages in #spam-channel"
"Set slowmode to 10 seconds in #chat"
"Kick @spammer from the server"
```

### Forum management
```
"Create a forum post in #help-forum with title 'Need help with setup'"
"List all posts in #announcements"
```

## Docker Usage

### Build
```bash
docker compose build
```

### Run
```bash
export DISCORD_BOT_TOKEN="MTxxxxxxxxxxxxx.xxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxx"
docker compose up -d
```

## Compatibility

- ✅ Claude Desktop / Claude Code
- ✅ Cursor
- ✅ Windsurf
- ✅ Any MCP-compatible client

## Required Permissions

Your bot needs these Discord permissions:
- View Channels
- Send Messages
- Manage Messages
- Manage Channels
- Manage Roles
- Manage Threads
- Manage Webhooks
- Kick Members
- Ban Members
- Read Message History
- Add Reactions

## Required Intents

Enable these in Discord Developer Portal:
- **Server Members Intent** (for member operations)
- **Message Content Intent** (for reading message content)

## Links

- Upstream: https://github.com/iprashantraj/mcp-discord-bridge
- Discord Developer Portal: https://discord.com/developers/applications
- License: MIT
