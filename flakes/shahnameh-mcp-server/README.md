# 📖 Shahnameh MCP Server

![Persian](https://img.shields.io/badge/Persian-Literature-800080)
![Epic](https://img.shields.io/badge/Epic-Ferdowsi-gold)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)

MCP server for accessing the Shahnameh (Book of Kings), the epic Persian poem by Ferdowsi. Search verses, explore chapters, and read explanations of Persian literature's greatest masterpiece.

**شاهنامه زنده است** (The Shahnameh lives on)

## Installation

This server requires building from source as it's not published to PyPI.

## Build Pattern

**Type**: Source build (git clone + pip install)

**Base Image**: `python:3.12-slim`

This flake demonstrates the source build pattern:
1. Clone the repository at a specific commit
2. Install dependencies with `uv pip install --system -e .`
3. Run the main.py entry point

## Prerequisites

⚠️ **This MCP server requires a separate API backend to function.**

You must run the Shahnameh API server separately:
- API Repository: https://github.com/ArezooGoshtasbi/shahnameh-api
- Database: https://github.com/aliafsahnoudeh/shahnameh-dataset

The MCP server is just a client that calls the API backend.

## Tools

- `get_chapters(title=None)` - Get all chapters of Shahnameh with their sub-chapters
- `get_chapter_by_id(id)` - Get a specific chapter by its ID
- `get_verses(...)` - Get verses from Shahnameh
- `search_verses(...)` - Search for verses by keyword
- `get_explanations(...)` - Get explanations for verses

## Environment Variables

- `SHAHNAMEH_API_BASE` (required): Base URL for the Shahnameh API backend
  - Default: `http://host.docker.internal:8000/api/v1` (assumes API running on host)
  - Change this if your API is running elsewhere

## Docker Compose Configuration

The `compose.yaml` uses `host.docker.internal` to access an API running on your host machine. If your API is running in another container or remote server, update the `SHAHNAMEH_API_BASE` environment variable.

## Source

- **Repository**: https://github.com/aliafsahnoudeh/shahnameh-mcp-server
- **Commit**: `5d932ee2a812637ac82bf1fe7caffcbc6a5e921b`
- **License**: Not specified in repository

## Quick Start

```bash
# 1. Set up the Shahnameh API backend first
# See: https://github.com/ArezooGoshtasbi/shahnameh-api

# 2. Run the API backend on your host (default: port 8000)

# 3. Start MCP server
docker compose run --rm mcp-shahnameh
```

## Prerequisites

⚠️ **This server requires the Shahnameh API backend:**

1. **API Server**: https://github.com/ArezooGoshtasbi/shahnameh-api
2. **Database**: https://github.com/aliafsahnoudeh/shahnameh-dataset

The MCP server is a client that connects to the separate API backend.

## Use Cases

| Use Case | Example |
|----------|---------|
| **Literary Research** | "Find all verses about Rostam" |
| **Persian Learning** | "Get explanations for verses in the Rostam and Sohrab story" |
| **Story Exploration** | "Show me the chapters about the Seven Trials" |
| **Verse Search** | "Search for verses containing 'love' and 'wine'" |
| **Chapter Navigation** | "Get all sub-chapters in the Kayanian dynasty section" |

## About the Shahnameh

The **Shahnameh** (Book of Kings) is:
- **Epic poem** by Ferdowsi (940-1020 CE)
- **60,000+ verses** spanning Persian mythology and history
- **1000 years** of Persian civilization
- **National epic** of Greater Iran
- **Cultural cornerstone** of Persian-speaking world

### Major Sections

| Section | Content |
|---------|---------|
| **Mythical Age** | Creation myths, early heroes (Jamshid, Zahhak) |
| **Heroic Age** | Great heroes and champions (Rostam, Esfandiyar) |
| **Historical Age** | Sassanid kings and historical events |

### Famous Stories

- **Rostam and Sohrab** - Tragic father-son battle
- **Seven Trials of Rostam** - Hero's legendary quests
- **Siyavash** - Tale of innocence and betrayal
- **Bijan and Manijeh** - Epic love story
- **Kay Khosrow** - Legendary king's reign

## Example Workflows

### Explore a Story

```javascript
// 1. Get all chapters
chapters = get_chapters()

// 2. Find Rostam chapters
rostam_chapters = chapters.filter(c => 
  c.title.includes("رستم")
)

// 3. Get specific chapter
chapter = get_chapter_by_id({ 
  id: rostam_chapters[0].id 
})

// 4. Get verses from chapter
verses = get_verses({
  chapter_id: chapter.id,
  start: 1,
  limit: 50
})
```

### Search by Theme

```javascript
// Search for verses about bravery
verses = search_verses({
  keyword: "شجاعت",  // bravery
  limit: 20
})

// Get explanations
verses.forEach(verse => {
  explanation = get_explanations({
    verse_id: verse.id
  })
})
```

### Study a Hero

```javascript
// Find all mentions of Rostam
rostam_verses = search_verses({
  keyword: "رستم",
  limit: 100
})

// Organize by chapter
by_chapter = groupByChapter(rostam_verses)

// Read with explanations
by_chapter.forEach(chapter => {
  chapter.verses.forEach(verse => {
    console.log(verse.text)
    console.log(verse.explanation)
  })
})
```

## API Configuration

```yaml
environment:
  - SHAHNAMEH_API_BASE=http://host.docker.internal:8000/api/v1
```

**Change if your API runs elsewhere:**
- Different port: `http://host.docker.internal:3000/api/v1`
- Docker network: `http://shahnameh-api:8000/api/v1`
- Remote server: `https://api.example.com/v1`

## Tools Reference

### get_chapters(title=None)
Browse the chapter structure:
- All chapters and sub-chapters
- Filter by title
- Hierarchical organization

### get_chapter_by_id(id)
Get specific chapter:
- Chapter metadata
- Sub-chapters list
- Verse count

### get_verses(...)
Retrieve verses:
- By chapter ID
- Pagination support
- With or without translations

### search_verses(...)
Search functionality:
- Keyword search in text
- Filter by chapter
- Sort by relevance

### get_explanations(...)
Scholarly explanations:
- Verse interpretation
- Historical context
- Literary analysis

## Cultural Context

The Shahnameh represents:
- **Linguistic milestone**: Preserved Persian language post-Arab conquest
- **Cultural identity**: Foundation of Persian national consciousness
- **Literary achievement**: Masterwork of world literature
- **Historical record**: Chronicles of pre-Islamic Persia
- **Educational tool**: Taught in schools across Iran

## Persian Context

این سرور MCP برای دسترسی به شاهنامه فردوسی طراحی شده است. این پروژه بخشی از تلاش برای زنده نگه داشتن زبان و ادبیات پارسی در دوره هوش مصنوعی است.

## Related Flakes

- **open-library** - Book and literature search
- **metmuseum** - Persian art and artifacts
- **memory** - Track reading progress and notes

## Tips

- **Persian keyboard**: Use Persian input for accurate search
- **Diacritics**: Search works with or without diacritical marks
- **Transliteration**: API may support romanization
- **Context**: Read surrounding verses for full story context
- **Explanations**: Essential for understanding archaic Persian
