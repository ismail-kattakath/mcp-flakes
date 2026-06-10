# 🎵 Spotify MCP Server Flake

![Spotify](https://img.shields.io/badge/Spotify-1DB954?logo=spotify&logoColor=white)
![Tools](https://img.shields.io/badge/Tools-100+-success)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)

Control Spotify from AI agents with 100+ tools for playback, playlists, discovery, and intelligent curation. Features smart shuffle algorithms and natural language music search.

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

## Quick Start

```bash
# 1. Get Spotify Client ID
# Visit: https://developer.spotify.com/dashboard
# Create app, set redirect URI: http://127.0.0.1:8888/callback

# 2. Set environment variable
export SPOTIFY_CLIENT_ID="your_client_id_here"

# 3. Run server (browser opens for OAuth)
cd flakes/spotify
docker compose run --rm mcp-spotify
```

## Toolset Options

| Toolset | Tools | Description |
|---------|-------|-------------|
| `core` | ~27 | Essential playback, search, playlists (default) |
| `core,discovery` | ~40 | Core + recommendations, top tracks/artists |
| `core,power` | ~50 | Core + smart shuffle, vibe engine, NL search |
| `core,social` | ~35 | Core + sharing, following, social features |
| `all` | ~100 | Everything except destructive |
| `all,destructive` | ~110 | Everything including remove/unfollow (use with caution) |

## Power Features

### Smart Shuffle Strategies

| Strategy | Description |
|----------|-------------|
| **Energy Arc** | Start low energy, build to peak, wind down |
| **Velocity Shuffle** | Gradually increase or decrease tempo |
| **Mood Journey** | Transition between emotional tones |
| **Album Aware** | Keep album tracks together |
| **Discovery Mix** | Blend favorites with recommendations |
| **Tempo Smooth** | Avoid jarring BPM changes |

### Vibe Engine

Analyze playlist mood without audio-features API:
- Sentiment analysis from track/artist names
- Genre classification
- Era detection
- Energy estimation
- Coherence scoring

### Natural Language Search

```
"Find that upbeat indie rock song with piano from 2018"
"Sad acoustic song by a female artist"
"Electronic dance track with heavy bass"
```

### Artist Network

Map relationship graphs:
- Related artists (up to 100+ connections)
- Genre clustering
- Collaboration networks
- Influence mapping

## Use Cases

| Use Case | Example |
|----------|---------|
| **Smart Playlists** | "Create an energy arc playlist from these tracks" |
| **Music Discovery** | "Find similar artists to Radiohead" |
| **Playlist Analysis** | "What's the vibe of my workout playlist?" |
| **Taste Tracking** | "How has my music taste evolved over time?" |
| **Intelligent Shuffle** | "Shuffle my library but keep albums together" |
| **Natural Search** | "Find that melancholic piano song from the 90s" |

## Example Workflows

### Create Energy Arc Playlist

```python
# 1. Get user's saved tracks
tracks = get_saved_tracks(limit=200)

# 2. Apply energy arc shuffle
shuffled = smart_shuffle(
  tracks=tracks,
  strategy="energy_arc",
  peak_position=0.7  # Peak at 70% through
)

# 3. Create new playlist
create_playlist(
  name="Energy Arc Mix",
  tracks=shuffled
)
```

### Discover Music

```python
# 1. Get top artists
top_artists = get_top_artists(time_range="medium_term")

# 2. Find related artists
network = map_artist_network(artist_id=top_artists[0].id, depth=2)

# 3. Get recommendations
recommendations = get_recommendations(
  seed_artists=network[:5],
  limit=50
)

# 4. Create discovery playlist
create_playlist(
  name="Discovery Mix",
  tracks=recommendations
)
```

### Analyze Taste Evolution

```python
# Compare listening history over time
evolution = analyze_taste_evolution(
  time_ranges=["short_term", "medium_term", "long_term"]
)

# Returns:
# - Genre shifts
# - Energy level changes
# - Diversity metrics
# - New artist discovery rate
```

### Natural Language Search

```python
# Search with description
results = natural_language_search(
  query="upbeat electronic song with female vocals from 2020s",
  limit=20
)

# AI parses:
# - Genre: electronic
# - Energy: high
# - Vocals: female
# - Era: 2020-2029
```

## Authentication Flow

1. **First Use**: Browser opens for Spotify OAuth
2. **Grant Access**: Approve requested scopes
3. **Token Cached**: Stored locally for future use
4. **Auto Refresh**: Tokens refreshed automatically
5. **No Secrets**: Uses PKCE flow (no client secret needed)

## Required Scopes

The server requests these Spotify scopes:
- `user-read-playback-state` - Read current playback
- `user-modify-playback-state` - Control playback
- `user-read-currently-playing` - Current track info
- `playlist-read-private` - Read playlists
- `playlist-modify-public` - Edit public playlists
- `playlist-modify-private` - Edit private playlists
- `user-library-read` - Read saved tracks
- `user-library-modify` - Modify saved tracks
- `user-top-read` - Read top artists/tracks
- `user-follow-read` - Read follows
- `user-follow-modify` - Modify follows (if destructive enabled)

## Safety

**Destructive tools** (remove tracks, unfollow artists, delete content) are **NOT loaded by default**. They require explicit opt-in via `SPOTIFY_MCP_TOOLSETS=all,destructive`.

Non-destructive operations are safe:
- Reading data
- Playback control
- Adding tracks/follows
- Creating playlists

## Related Flakes

- **gradusnotation** - Music notation and theory
- **yutu** - YouTube music and video management
- **memory** - Track music preferences over time

## Tips

- Start with `core` toolset and expand as needed
- Use smart shuffle for better listening experiences
- Analyze vibe before sharing playlists
- Natural language search works best with descriptive queries
- Artist network helps discover new music in your taste
