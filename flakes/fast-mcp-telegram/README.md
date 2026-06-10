# Fast MCP Telegram

Multi-tenant Telegram gateway for AI agents with MTProto User API support.

## Features

- **8 Agent-Optimized Tools**: Send/receive messages, search chats, manage media
- **MTProto User API**: Direct Telegram access via Telethon
- **Multi-tenant**: Support for multiple Telegram accounts
- **HTTP + stdio Transport**: Flexible integration options
- **File Attachments**: Upload and download media files
- **Voice Transcription**: Built-in audio transcription support

## Authentication

Requires Telegram API credentials from https://my.telegram.org:

1. `TELEGRAM_API_ID`: Your application ID
2. `TELEGRAM_API_HASH`: Your application hash
3. `TELEGRAM_PHONE_NUMBER`: Your phone number (international format)

First run will prompt for phone verification code and 2FA password (if enabled).

## Tools

- `get_chats` - List available Telegram chats/channels
- `get_messages` - Retrieve messages from a chat
- `search_messages` - Search messages across chats
- `send_message` - Send text message to a chat
- `send_file` - Upload and send file attachments
- `download_media` - Download media from messages
- `get_user_info` - Get user profile information
- `get_chat_info` - Get chat/channel details

## Usage

```bash
docker run -it \
  -e TELEGRAM_API_ID=your_api_id \
  -e TELEGRAM_API_HASH=your_api_hash \
  -e TELEGRAM_PHONE_NUMBER=+1234567890 \
  mcp-flakes/fast-mcp-telegram
```

## Common Use Cases

- **Customer Support Bot**: Respond to Telegram inquiries
- **Content Distribution**: Send updates to channels
- **Chat History Analysis**: Search and analyze conversations
- **Media Management**: Download/upload files programmatically
- **Group Administration**: Manage group messages and members

## Documentation

- [GitHub Repository](https://github.com/leshchenko1979/fast-mcp-telegram)
- [Telegram API Docs](https://core.telegram.org/api)
- [MTProto Protocol](https://core.telegram.org/mtproto)
