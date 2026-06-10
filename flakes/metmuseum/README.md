# Met Museum MCP Server Flake

A Model Context Protocol (MCP) server that provides access to the Metropolitan Museum of Art Collection through natural language interactions.

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

## Data Attribution

This MCP server is not officially associated with The Metropolitan Museum of Art. It is a third-party implementation using The Met's public Collection API.
