# Spotify MCP Server Flake

Control Spotify from Claude, Cursor, or any MCP client. 100+ tools for playback, playlists, discovery, and curation.

## Upstream

- **Repository**: https://github.com/gupta-kush/spotify-mcp
- **Commit**: 13a711cfe56e02b7e06b34da08c7238485cd539b
- **License**: MIT
- **Language**: Python

## Features

- **Playback Control**: Play, pause, skip, seek, volume, shuffle, repeat
- **Search**: Search tracks, albums, artists, playlists
- **Playlists**: Create, manage, and organize playlists
- **Discovery**: Get recommendations, top artists/tracks
- **Smart Shuffle**: 6 different shuffle strategies including energy arcs
- **Vibe Engine**: Mood analysis without audio-features API
- **Natural Language Search**: Find songs by description
- **Artist Network**: Map related artists (100+ connections)
- **Taste Evolution**: Track music taste changes over time
- **Library Management**: Index and organize your music

## Tools

The server provides 100+ tools across multiple toolsets:

- **Core** (~27 tools): Playback, playlists, search, library, browse, stats
- **Social**: Social features and sharing
- **Discovery**: Music discovery and recommendations
- **Power**: Smart shuffle, vibe engine, natural language search, artist network
- **Destructive**: Remove tracks, unfollow artists (opt-in only)

## Environment Variables

### Required

- `SPOTIFY_CLIENT_ID`: Your Spotify API Client ID
  - Get from https://developer.spotify.com/dashboard
  - Create an app and set redirect URI to `http://127.0.0.1:8888/callback`
  - Check "Web API" in app settings

### Optional

- `SPOTIFY_MCP_TOOLSETS`: Control which tools to load (default: `core`)
  - `core` - ~27 essential tools
  - `core,discovery` - Add discovery tools
  - `core,power` - Add power tools
  - `all` - All tools except destructive
  - `all,destructive` - All tools including destructive ones

## Usage

```yaml
spotify:
  command: docker
  args:
    - compose
    - -f
    - path/to/mcp-flakes/flakes/spotify/compose.yaml
    - run
    - --rm
    - mcp-spotify
  env:
    SPOTIFY_CLIENT_ID: your_client_id_here
    SPOTIFY_MCP_TOOLSETS: core
```

## Authentication

The server uses PKCE OAuth flow:

1. First time you use a Spotify tool, your browser opens for OAuth
2. Grant access to the app
3. Token is cached locally for future use
4. No client secret needed

## Example Queries

- "Play Bohemian Rhapsody"
- "Make my playlist start chill and build to high energy"
- "Find that sad song with strings by Pink Floyd from the 90s"
- "How has my music taste changed over time?"
- "Map Radiohead's related artist network"
- "Compare my Gym and Running playlists"
- "What's the vibe of my Summer playlist?"
- "Create a radio playlist based on Radiohead"

## Build

This is a single-package Python repository. The build process:

1. `uv pip install --system .` - Install package and dependencies
2. Entrypoint: `python -m spotify_mcp`

## Transport

- **Protocol**: stdio
- **Authentication**: OAuth PKCE (browser-based first-time setup)
- **Token caching**: Local file storage

## Safety

Destructive tools (remove tracks, unfollow artists, delete content) are NOT loaded by default. They require explicit opt-in via `SPOTIFY_MCP_TOOLSETS=all,destructive`.
