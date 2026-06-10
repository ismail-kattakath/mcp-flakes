# 📹 Yutu YouTube MCP Server

![YouTube](https://img.shields.io/badge/YouTube-FF0000?logo=youtube&logoColor=white)
![Go](https://img.shields.io/badge/Go-1.23-00ADD8?logo=go)
![Analytics](https://img.shields.io/badge/Analytics-API-blue)

AI-powered YouTube automation toolkit with full MCP support. Manage videos, comments, playlists, analytics, and channel operations through the YouTube Data API v3.

## Overview

Yutu is a comprehensive YouTube automation tool built in Go that provides CLI, MCP server, and AI agent capabilities. It enables automated YouTube workflows including video uploads, metadata optimization, comment management, and channel branding—all through the Model Context Protocol.

## Features

- **Video Management**: Upload, update, and optimize videos
- **Comment Operations**: Manage comments and comment threads
- **Playlist Control**: Create and manage playlists
- **Channel Operations**: Update channel information and branding
- **Caption Management**: Handle video captions
- **Analytics Access**: Query YouTube Analytics and Reporting APIs
- **MCP Protocol**: Full Model Context Protocol support for AI agents

## Requirements

### Google Cloud Platform Setup

1. Create a GCP Project
2. Enable these APIs:
   - YouTube Data API v3 (Required)
   - YouTube Analytics API (Optional)
   - YouTube Reporting API (Optional)
3. Create OAuth 2.0 credentials
4. Download credentials JSON file

## Usage

### With Docker Compose

```bash
# Place your Google OAuth credentials in ./secrets/credentials.json
docker compose up -d
docker compose exec yutu /app/yutu --help
```

### With Docker

```bash
docker build -t mcp-flakes/yutu:latest .
docker run -it --rm \
  -v $(pwd)/secrets/credentials.json:/secrets/credentials.json:ro \
  -e GOOGLE_APPLICATION_CREDENTIALS=/secrets/credentials.json \
  mcp-flakes/yutu:latest
```

### Configuration

Required environment variables:
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Google OAuth credentials JSON

Optional environment variables:
- `YUTU_CONFIG_DIR`: Configuration directory (default: `/root/.config/yutu`)

### Tools Available

- `youtube_upload`: Upload videos to YouTube
- `youtube_video_list`: List and search videos
- `youtube_video_update`: Update video metadata
- `youtube_comment_list`: List and manage comments
- `youtube_playlist_manage`: Create and manage playlists
- `youtube_channel_info`: Get and update channel information

## Upstream

- **Repository**: https://github.com/eat-pray-ai/yutu
- **License**: Apache-2.0
- **Language**: Go
- **Commit**: e2d232c0a2b645bb96da70d167d572c01f24c85b

## Build Details

- **Builder Image**: golang:1.23-bookworm
- **Runtime Image**: alpine:latest
- **Build Type**: Multi-stage Docker build with static binary (CGO disabled)
- **Binary Size**: ~20-30MB (estimated static binary)

## Security Notes

- Store Google OAuth credentials securely
- Use volume mounts for credential files (read-only)
- Never commit credentials to version control
- Consider using Docker secrets for production

## See Also

- [Yutu Documentation](https://github.com/eat-pray-ai/yutu)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [ATTRIBUTION.md](./ATTRIBUTION.md) for licensing details
