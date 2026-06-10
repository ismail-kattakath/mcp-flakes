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

## Quick Start

```bash
# 1. Get Google Cloud credentials (see Requirements section)
# 2. Place credentials.json in ./secrets/
# 3. Run the server
docker compose up -d
docker compose exec yutu /app/yutu --help
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **Video Management** | "Upload my new video with optimized metadata" |
| **Comment Moderation** | "Review and respond to recent comments" |
| **Playlist Curation** | "Create a playlist from my top-performing videos" |
| **Channel Branding** | "Update channel banner and description" |
| **Analytics Tracking** | "Get view count trends for last 30 days" |
| **Bulk Operations** | "Update thumbnails for all videos in a series" |

## Example Workflows

### Upload and Optimize Video

```javascript
// 1. Upload video
youtube_upload({
  file: "/path/to/video.mp4",
  title: "Complete Guide to MCP Servers",
  description: "Learn how to build MCP servers...",
  tags: ["mcp", "ai", "tutorial"],
  category: "22",  // People & Blogs
  privacy: "public"
})

// 2. Set custom thumbnail
youtube_video_update({
  video_id: "abc123",
  thumbnail: "/path/to/thumbnail.jpg"
})

// 3. Add to playlist
youtube_playlist_manage({
  action: "add",
  playlist_id: "PLxxx",
  video_id: "abc123"
})
```

### Manage Comments

```javascript
// 1. List recent comments
comments = youtube_comment_list({
  video_id: "abc123",
  order: "time",
  max_results: 50
})

// 2. Reply to comment
youtube_comment_reply({
  comment_id: "xyz789",
  text: "Thanks for watching! Check out the next video..."
})

// 3. Moderate spam
youtube_comment_moderate({
  comment_id: "spam123",
  action: "remove"
})
```

### Create Content Series

```javascript
// 1. Create playlist for series
playlist = youtube_playlist_manage({
  action: "create",
  title: "MCP Server Tutorial Series",
  description: "Complete guide to building MCP servers",
  privacy: "public"
})

// 2. Upload all videos in series
videos.forEach(video => {
  uploaded = youtube_upload({
    file: video.path,
    title: video.title,
    description: video.description,
    playlist_id: playlist.id
  })
})

// 3. Update playlist description with links
youtube_playlist_manage({
  action: "update",
  playlist_id: playlist.id,
  description: generatePlaylistDescription(videos)
})
```

### Analytics and Reporting

```javascript
// 1. Get channel statistics
stats = youtube_channel_info({ 
  part: "statistics" 
})
// Returns: subscriber count, view count, video count

// 2. Get top-performing videos
videos = youtube_video_list({
  part: "statistics,snippet",
  max_results: 10,
  order: "viewCount"
})

// 3. Analyze engagement
videos.forEach(video => {
  engagement = calculateEngagement(
    video.statistics.likeCount,
    video.statistics.viewCount,
    video.statistics.commentCount
  )
})
```

## YouTube API Scopes

The server requires these OAuth scopes:

| Scope | Purpose |
|-------|---------|
| `youtube.readonly` | Read channel data, videos, playlists |
| `youtube.upload` | Upload and update videos |
| `youtube` | Full access (manage comments, channel settings) |
| `youtube.force-ssl` | All operations over HTTPS |
| `yt-analytics.readonly` | Analytics and reporting data |

## Video Categories

| ID | Category |
|----|----------|
| 1 | Film & Animation |
| 2 | Autos & Vehicles |
| 10 | Music |
| 15 | Pets & Animals |
| 17 | Sports |
| 20 | Gaming |
| 22 | People & Blogs |
| 23 | Comedy |
| 24 | Entertainment |
| 25 | News & Politics |
| 26 | Howto & Style |
| 27 | Education |
| 28 | Science & Technology |

## Privacy Levels

| Level | Description |
|-------|-------------|
| `public` | Anyone can search and view |
| `unlisted` | Anyone with link can view |
| `private` | Only you and invited users |

## GCP Setup Steps

### 1. Create GCP Project
```
https://console.cloud.google.com/projectcreate
```

### 2. Enable APIs
```
YouTube Data API v3 ✓ (Required)
YouTube Analytics API (Optional)
YouTube Reporting API (Optional)
```

### 3. Create OAuth Credentials
```
1. Go to Credentials > Create Credentials > OAuth client ID
2. Application type: Desktop app
3. Download JSON → save as credentials.json
```

### 4. OAuth Consent Screen
```
1. Configure OAuth consent screen
2. Add scopes: youtube, youtube.upload, youtube.force-ssl
3. Add test users (for development)
```

## Authentication Flow

1. **First Run**: Browser opens for Google OAuth
2. **Grant Access**: Approve requested YouTube scopes
3. **Token Storage**: OAuth token cached in config directory
4. **Auto Refresh**: Tokens refreshed automatically when expired

## CLI Commands

```bash
# Upload video
yutu upload --file video.mp4 --title "My Video" --description "..."

# List videos
yutu video list --max-results 50

# Update video metadata
yutu video update --video-id abc123 --title "New Title"

# Create playlist
yutu playlist create --title "My Playlist" --description "..."

# Get channel info
yutu channel info

# List comments
yutu comment list --video-id abc123 --max-results 100
```

## Related Flakes

- **spotify** - Music streaming automation
- **gradusnotation** - Music notation and composition
- **unbrowser** - Web automation for video metadata
- **memory** - Track video performance over time

## Tips

- **Thumbnails**: Use 1280x720 resolution for best quality
- **Tags**: Include 5-10 relevant tags for discoverability
- **Descriptions**: Add timestamps and links in description
- **Playlists**: Organize content into playlists for binge-watching
- **Analytics**: Check analytics regularly to optimize content
- **Rate Limits**: YouTube API has quota limits - monitor usage

## See Also

- [Yutu Documentation](https://github.com/eat-pray-ai/yutu)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [YouTube API Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)
- [ATTRIBUTION.md](./ATTRIBUTION.md) for licensing details
