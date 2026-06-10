# 🏛️ Met Museum MCP Server Flake

![Art](https://img.shields.io/badge/Art-490K+_Objects-C41E3A?logo=the-metropolitan-museum-of-art)
![No Auth](https://img.shields.io/badge/API-Public-success)
![TypeScript](https://img.shields.io/badge/TypeScript-MCP_Apps-blue?logo=typescript)

Explore the Metropolitan Museum of Art's 490,000+ artworks through natural language. Browse departments, search the collection, and view high-resolution images via The Met's public API.

## Upstream

- **Repository**: https://github.com/mikechao/metmuseum-mcp
- **Commit**: 576b5441daa04cae33d4583c23c35074390c9e2f
- **License**: MIT
- **Language**: TypeScript

## Features

- **List Departments**: Browse all departments at The Met
- **Search Museum Objects**: Search for artworks with filters
- **Get Museum Object**: Retrieve detailed information and images for specific artworks
- **Open Met Explorer**: Launch an interactive MCP App for browsing the collection

## Tools

1. `list-departments` - Lists all valid departments at The Met
2. `search-museum-objects` - Search for objects with query, filters, and pagination
3. `get-museum-object` - Get detailed object information including images
4. `open-met-explorer` - Launch interactive MCP App for collection browsing

## Environment Variables

### Optional

- `MET_API_TIMEOUT_MS`: Timeout for API requests in milliseconds (default: 10000)
- `MET_API_DEBUG`: Enable debug logging for schema validation (1, true, yes, on)

## Usage

```yaml
metmuseum:
  command: docker
  args:
    - compose
    - -f
    - path/to/mcp-flakes/flakes/metmuseum/compose.yaml
    - run
    - --rm
    - mcp-metmuseum
```

## Example Queries

- "Can you help me explore the works of Vincent Van Gogh?"
- "Can you help me explore the Met?"
- "Can you show me a few paintings from the Asian Art department?"
- "Can you find the painting titled 'Corridor in the Asylum'?"
- "Can you find any art that has 'cat' in the title or features 'cats'?"

## API Details

The server uses The Met's open Collection API:
- **Base URL**: https://collectionapi.metmuseum.org
- **Authentication**: None required (public API)
- **Rate Limits**: Standard API rate limits apply

### Search Parameters

- `q` - Search term
- `hasImages` - Filter objects with images
- `title` - Search titles only
- `departmentId` - Filter by department
- `page` - Page number (1-based)
- `pageSize` - Results per page (max 100)

### Object Details

When retrieving objects:
- Full metadata (title, artist, date, medium, dimensions)
- Primary image URL (if available)
- Credit line and acquisition details
- Tags and classifications
- Department information

## MCP Apps Support

This server includes MCP Apps UI components:
- Interactive Met Explorer for live search and filtering
- Visual object inspector with image display
- Client support required for full functionality

## Build

This is a single-package TypeScript repository. The build process:

1. `npm install` - Install dependencies from package-lock.json
2. `npm run build` - Compile TypeScript and build UI assets
3. Entrypoint: `node dist/index.js`

## Transport

- **Protocol**: stdio (also supports HTTP with `--http` flag)
- **No authentication required**
- **Public API access** to The Met Collection

## Quick Start

```bash
# Start the server - no API keys needed!
cd flakes/metmuseum
docker compose run --rm mcp-metmuseum
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **Art Research** | "Find all Van Gogh paintings in the collection" |
| **Education** | "Show me ancient Egyptian artifacts" |
| **Inspiration** | "Browse contemporary photography" |
| **Curation** | "Find artworks with cats in the title" |
| **Historical Context** | "Show me 19th century European paintings" |

## Collection Highlights

The Met's collection spans:
- **5,000+ years** of art history
- **490,000+ objects** digitized
- **17 departments** from Ancient Egypt to Modern Art
- **High-resolution images** for most works

### Departments Available

| Department | ID | Examples |
|------------|-----|----------|
| American Decorative Arts | 1 | Furniture, glass, metalwork |
| Ancient Near Eastern Art | 3 | Mesopotamian sculptures |
| Arms and Armor | 4 | Medieval weapons, samurai armor |
| Asian Art | 6 | Chinese ceramics, Japanese prints |
| Egyptian Art | 10 | Mummies, hieroglyphs, sculptures |
| European Paintings | 11 | Rembrandt, Vermeer, Van Gogh |
| Greek and Roman Art | 13 | Classical sculptures, pottery |
| Medieval Art | 17 | Illuminated manuscripts, reliquaries |
| Modern and Contemporary | 21 | Picasso, Pollock, contemporary works |

## Example Workflows

### Explore an Artist

```javascript
// 1. Search for artist's works
search_museum_objects({
  q: "Vincent Van Gogh",
  hasImages: true,
  departmentId: 11,  // European Paintings
  page: 1,
  pageSize: 20
})

// 2. Get detailed information
get_museum_object({ objectID: 436524 })
// Returns: "Wheat Field with Cypresses" - full metadata + image URL
```

### Browse by Department

```javascript
// 1. List all departments
list_departments()

// 2. Search specific department
search_museum_objects({
  departmentId: 10,  // Egyptian Art
  hasImages: true,
  pageSize: 50
})
```

### Thematic Search

```javascript
// Search by theme
search_museum_objects({
  q: "landscape sunset",
  hasImages: true,
  title: true  // Search titles only
})
```

### MCP Apps Explorer

```javascript
// Launch interactive explorer
open_met_explorer()
// Opens browser-based UI with:
// - Live search
// - Image gallery
// - Filters and facets
// - Object inspector
```

## Object Metadata

Each artwork includes:
- **Identification**: Title, artist, date, culture
- **Physical**: Medium, dimensions, classification
- **Provenance**: Credit line, acquisition info
- **Images**: Primary image URL (high-res when available)
- **Context**: Department, gallery location
- **Taxonomy**: Tags, keywords, categories

## Search Tips

### Query Syntax
- Use quotes for exact phrases: `"still life"`
- Combine terms: `"cat" AND "painting"`
- Artist names: `"Monet"`
- Time periods: `"19th century"`

### Filters
- `hasImages: true` - Only objects with images
- `departmentId` - Specific department
- `title: true` - Search titles only
- `pageSize: 100` - Up to 100 results per page

## Interactive Features

### MCP Apps Support
This server includes **MCP Apps** - interactive UI components that launch in supported clients:

- **Met Explorer**: Visual search and browse interface
- **Object Inspector**: Detailed artwork viewer with zoom
- **Department Navigator**: Browse by collection area

*Note: Requires MCP Apps-compatible client (Claude Desktop 0.7+)*

## Data Attribution

This MCP server is not officially associated with The Metropolitan Museum of Art. It is a third-party implementation using The Met's public Collection API.

**Collection Images**: The Met makes images of public domain artworks available under CC0. Check individual artwork pages for specific image rights.

## Related Flakes

- **open-library** - Book and literature search
- **aesthetics-wiki-mcp** - Aesthetic movements and styles
- **gradusnotation** - Music notation (for musical instruments)
