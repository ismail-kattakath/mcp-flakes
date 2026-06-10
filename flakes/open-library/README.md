# Open Library MCP Server Flake

A Model Context Protocol (MCP) server for the Open Library API that enables AI assistants to search for book and author information.

## Upstream

- **Repository**: https://github.com/8enSmith/mcp-open-library
- **Commit**: 12bfb42d9d84c20a7759fa8caf10f96df746c7c4
- **License**: MIT
- **Language**: TypeScript

## Features

- **Book Search by Title**: Search for books using their title
- **Author Search by Name**: Search for authors using their name
- **Get Author Details**: Retrieve detailed information for a specific author
- **Get Author Photo**: Get the URL for an author's photo
- **Get Book Cover**: Get the URL for a book's cover image
- **Get Book by ID**: Retrieve detailed book information using various identifiers

## Tools

1. `get_book_by_title` - Search for book information by title
2. `get_authors_by_name` - Search for author information by name
3. `get_author_info` - Get detailed author information using their Open Library key
4. `get_author_photo` - Get author photo URL using their Open Library ID
5. `get_book_cover` - Get book cover URL using various identifiers (ISBN, OCLC, LCCN, OLID, ID)
6. `get_book_by_id` - Get detailed book information using identifiers (ISBN, LCCN, OCLC, OLID)

## Usage

```yaml
open-library:
  command: docker
  args:
    - compose
    - -f
    - path/to/mcp-flakes/flakes/open-library/compose.yaml
    - run
    - --rm
    - mcp-open-library
```

## Example Queries

- "Find books by J.R.R. Tolkien"
- "Search for The Hobbit"
- "Get details about author with key /authors/OL26320A"
- "Show me the cover for ISBN 9780345339683"

## Build

This is a single-package TypeScript repository. The build process:

1. `npm install` - Install dependencies from package-lock.json
2. `npm run build` - Compile TypeScript to JavaScript
3. Entrypoint: `node build/index.js`

## Transport

- **Protocol**: stdio
- **No environment variables required**
- **No authentication needed** (uses public Open Library API)
