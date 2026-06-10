# 📚 Open Library MCP Server Flake

![Books](https://img.shields.io/badge/Books-20M+-FFA500?logo=open-source-initiative)
![No Auth](https://img.shields.io/badge/API-Public-success)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue?logo=typescript)

Search and explore 20 million+ books and author biographies through Open Library's public API. Find books by title, discover author details, and retrieve cover images.

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

## Quick Start

```bash
# Start the server - no API keys needed!
cd flakes/open-library
docker compose run --rm mcp-open-library
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **Book Discovery** | "Find books about artificial intelligence" |
| **Author Research** | "Get biography of Isaac Asimov" |
| **Reading Lists** | "Find all books by Ursula K. Le Guin" |
| **Book Metadata** | "Get ISBN and publisher for The Hobbit" |
| **Cover Art** | "Show me the cover for this ISBN" |
| **Bibliography** | "List all works by this author" |

## Example Workflows

### Discover Books by Author

```javascript
// 1. Search for author
get_authors_by_name({ name: "J.R.R. Tolkien" })
// Returns: Array of matching authors with Open Library keys

// 2. Get author details
get_author_info({ author_key: "/authors/OL26320A" })
// Returns: Biography, birth/death dates, works list

// 3. Get author photo
get_author_photo({ author_id: "OL26320A" })
// Returns: Photo URL
```

### Find Specific Book

```javascript
// 1. Search by title
get_book_by_title({ title: "The Hobbit" })
// Returns: Array of editions with ISBNs, publishers, dates

// 2. Get book cover
get_book_cover({ 
  isbn: "9780345339683",
  size: "L"  // S, M, or L
})
// Returns: Cover image URL
```

### Lookup by Identifier

```javascript
// Get book by ISBN
get_book_by_id({ 
  isbn: "9780345339683" 
})

// Get book by OCLC number
get_book_by_id({ 
  oclc: "123456789" 
})

// Get book by Library of Congress Control Number
get_book_by_id({ 
  lccn: "2001012345" 
})
```

## Identifier Types

| Type | Description | Example |
|------|-------------|---------|
| **ISBN** | International Standard Book Number | 9780345339683 |
| **OCLC** | Online Computer Library Center number | 123456789 |
| **LCCN** | Library of Congress Control Number | 2001012345 |
| **OLID** | Open Library ID | OL123456M |

## Cover Image Sizes

| Size | Dimensions | Best For |
|------|-----------|----------|
| **S** | ~50px | Thumbnails, lists |
| **M** | ~180px | Search results, cards |
| **L** | ~300px | Detail pages, displays |

## API Response Examples

### Book Search Result

```json
{
  "title": "The Hobbit",
  "author_name": ["J.R.R. Tolkien"],
  "first_publish_year": 1937,
  "isbn": ["9780345339683", ...],
  "publisher": ["Houghton Mifflin", ...],
  "subject": ["Fantasy", "Middle Earth", ...],
  "cover_i": 12345678
}
```

### Author Information

```json
{
  "name": "J.R.R. Tolkien",
  "birth_date": "1892-01-03",
  "death_date": "1973-09-02",
  "bio": "John Ronald Reuel Tolkien was an English writer...",
  "works": [...],
  "photos": [12345]
}
```

## Search Tips

- Use partial titles: "hobbit" finds "The Hobbit"
- Include author in search: "dune herbert"
- Search by subject: "science fiction space opera"
- Use quotes for exact phrases: "lord of the rings"

## Data Sources

Open Library aggregates data from:
- Library of Congress
- Amazon
- Goodreads
- WorldCat
- Community contributions

## Transport

- **Protocol**: stdio
- **No environment variables required**
- **No authentication needed** (uses public Open Library API)

## Related Flakes

- **metmuseum** - Art and museum collections
- **aesthetics-wiki-mcp** - Cultural and aesthetic information
- **memory** - Track reading lists and preferences
