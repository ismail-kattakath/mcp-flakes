# Notion MCP Server

Markdown-first Notion API server with 9 composite tools, featuring 77% token reduction via tiered documentation and efficient bulk operations.

## Features

- **Markdown-first** - Natural markdown to Notion blocks conversion
- **9 composite tools** - Replaces 28+ individual endpoint calls
- **Token efficient** - ~77% reduction via tiered documentation
- **Auto-pagination** - Handles large datasets automatically
- **Bulk operations** - Efficient batch processing
- **Rich content** - Supports toggles, callouts, code blocks, tables
- **Database queries** - Full filter and sort support

## Authentication

Requires a Notion Internal Integration Token.

### Setup

1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Give it a name (e.g., "MCP Server")
4. Select the workspace
5. Click "Submit"
6. Copy the "Internal Integration Token" (starts with `secret_`)
7. **Important**: Share pages/databases with your integration:
   - Open the page/database in Notion
   - Click "..." menu → "Add connections"
   - Search for your integration name
   - Click to grant access

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NOTION_API_KEY` | Yes | Internal Integration Token from Notion |

**Note**: The integration only has access to pages/databases you explicitly share with it.

## Tools

### Database Operations
- `list_databases` - List all accessible databases in workspace
- `query_database` - Query database with filters, sorts, and pagination

### Page Management
- `create_page` - Create a new page with markdown content
- `update_page` - Update page properties and markdown content
- `get_page` - Get page content rendered as markdown
- `search_notion` - Full-text search across workspace

### Block Operations
- `append_blocks` - Append markdown blocks to a page
- `get_block_children` - Get child blocks (recursive)
- `delete_block` - Delete a specific block

## Usage Examples

### Create a page
```
"Create a Notion page titled 'Meeting Notes' with the following content:
# Meeting with Product Team
- Discussed new feature roadmap
- Q2 launches planned"
```

### Query a database
```
"Query the 'Tasks' database for all items where Status is 'In Progress' and Priority is 'High'"
```

### Update page content
```
"Append to the 'Project Plan' page:
## Next Steps
1. Review design mockups
2. Schedule dev kickoff"
```

### Search
```
"Search Notion for pages about 'API documentation'"
```

## Markdown Support

### Text Formatting
- **Bold**, *italic*, `code`, ~~strikethrough~~
- [Links](https://example.com)
- Inline equations: $E = mc^2$

### Blocks
- Headings (h1, h2, h3)
- Bulleted and numbered lists
- Todo checkboxes
- Code blocks with syntax highlighting
- Quotes
- Dividers
- Callouts
- Toggle lists
- Tables

### Advanced
```markdown
> 💡 **Callout**
> This is an info callout

<details>
<summary>Toggle heading</summary>
Hidden content here
</details>
```

## Docker Usage

### Build
```bash
docker compose build
```

### Run
```bash
export NOTION_API_KEY="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
docker compose up -d
```

## Database Filters

Query databases with powerful filters:

```json
{
  "filter": {
    "and": [
      {
        "property": "Status",
        "select": { "equals": "In Progress" }
      },
      {
        "property": "Priority",
        "select": { "equals": "High" }
      }
    ]
  },
  "sorts": [
    {
      "property": "Created",
      "direction": "descending"
    }
  ]
}
```

## Supported Property Types

- Title
- Rich Text
- Number
- Select / Multi-select
- Date
- Checkbox
- URL
- Email
- Phone
- Relation
- Rollup
- Formula
- People

## Performance Features

- **Tiered documentation**: Reduces token usage by 77%
- **Auto-pagination**: Handles unlimited results
- **Bulk operations**: Batch multiple changes
- **Request caching**: Minimizes API calls
- **Parallel fetching**: Concurrent block retrieval

## Limitations

- Integration must be explicitly shared with pages/databases
- API rate limits: 3 requests/second (handled automatically)
- Some advanced blocks (synced blocks, embeds) have limited support
- File uploads require separate handling

## Links

- Upstream: https://github.com/n24q02m/better-notion-mcp
- NPM: https://www.npmjs.com/package/@n24q02m/better-notion-mcp
- Notion API: https://developers.notion.com
- Create Integration: https://www.notion.so/my-integrations
- License: MIT
