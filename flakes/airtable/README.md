# Airtable MCP Server

Database integration with schema inspection, read and write capabilities for Airtable bases and tables.

## Features

- **Schema inspection** - List bases, tables, fields, and views
- **Full CRUD** - Create, read, update, delete records
- **Search** - Full-text search across records
- **Filtering** - Use Airtable formulas for complex queries
- **Pagination** - Automatic handling of large datasets
- **Type support** - All Airtable field types supported
- **Permission-aware** - Respects base access levels

## Authentication

Requires an Airtable Personal Access Token.

### Setup

1. Go to https://airtable.com/create/tokens
2. Click "Create new token"
3. Give it a name (e.g., "MCP Server")
4. Select required scopes:
   - ✅ `data.records:read` - Read records
   - ✅ `data.records:write` - Create/update/delete records
   - ✅ `schema.bases:read` - Read base schemas
5. Select which bases to grant access to (or all)
6. Click "Create token"
7. Copy the token (starts with `pat`)

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AIRTABLE_ACCESS_TOKEN` | Yes | Personal Access Token from Airtable |

## Tools

### Schema Operations
- `list_bases` - List all accessible bases with IDs and permissions
- `list_tables` - List tables in a base with schema details
  - Detail levels: `tableIdentifiersOnly`, `identifiersOnly`, `full`

### Record Operations
- `list_records` - List records from a table
  - Optional: `maxRecords`, `filterByFormula`
- `get_record` - Get a specific record by ID
- `search_records` - Search records by text
  - Search specific fields or all text fields
- `create_records` - Create one or more records
  - Batch insert supported
- `update_records` - Update records by ID
  - Partial updates supported
- `delete_records` - Delete records by ID
  - Batch delete supported

## Usage Examples

### List bases and tables
```
"Show me all my Airtable bases"
"List all tables in base appXXXXXXXXXXXXXX"
```

### Read records
```
"Get all records from the 'Contacts' table in base appXXXX"
"Show me records where Status is 'Active'"
"Search for 'John Smith' in the Contacts table"
```

### Create records
```
"Create a new record in Contacts table with Name='Jane Doe', Email='jane@example.com', Status='Active'"
```

### Update records
```
"Update record recXXXXXXXXXXXXXX in Contacts table, set Status='Inactive'"
```

### Delete records
```
"Delete records recXXXXXXXXXXXXXX and recYYYYYYYYYYYYYY from Contacts table"
```

## Docker Usage

### Build
```bash
docker compose build
```

### Run
```bash
export AIRTABLE_ACCESS_TOKEN="patXXXXXXXXXXXXXX.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
docker compose up -d
```

## Filtering with Formulas

Use Airtable formula syntax for complex filtering:

```javascript
// Single condition
"{Status} = 'Active'"

// Multiple conditions
"AND({Status} = 'Active', {Priority} = 'High')"

// Date filters
"IS_AFTER({Created}, '2024-01-01')"

// Text search
"SEARCH('keyword', {Description})"

// Numeric comparison
"{Score} > 80"

// Combining conditions
"OR(
  AND({Status} = 'Active', {Priority} = 'High'),
  {Urgent} = TRUE()
)"
```

## Supported Field Types

- **Text** - Single line, long text, rich text
- **Number** - Integer, decimal, percent, currency
- **Select** - Single select, multiple select
- **Date** - Date, datetime
- **Checkbox** - Boolean values
- **Attachment** - Files and images
- **Link** - Links to other tables (relationships)
- **Formula** - Computed fields
- **Rollup** - Aggregated values from linked records
- **Count** - Count of linked records
- **Lookup** - Values from linked records
- **Barcode** - Scanned barcodes
- **Rating** - Star ratings
- **Duration** - Time durations
- **Email** - Email addresses
- **Phone** - Phone numbers
- **URL** - Web links

## Base IDs and Table IDs

### Finding Base ID
1. Open your base in Airtable web
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. The base ID starts with `app`

Or use `list_bases` tool to see all base IDs.

### Finding Table ID
1. Open the table in Airtable web
2. Look at the URL: `https://airtable.com/appXXXX/tblYYYYYYYYYYYYYY/...`
3. The table ID starts with `tbl`

Or use `list_tables` tool with your base ID.

## Permission Levels

- **Owner** - Full access (read, write, delete, admin)
- **Editor** - Read and write records
- **Commenter** - Read records and add comments
- **Read-only** - View records only

The MCP server respects these permissions based on your token's access level.

## API Rate Limits

Airtable API rate limits:
- 5 requests per second per base
- Burst capacity for occasional spikes

The server handles rate limiting automatically with retries.

## Best Practices

- Use specific base and table IDs, not names
- Filter at the API level with formulas (more efficient)
- Batch create/update operations when possible
- Use `maxRecords` to limit large result sets
- Cache schema information (bases and tables)
- Handle attachments separately (they're URLs)

## Common Use Cases

### CRM Management
```
"Show all high-priority leads from the last week"
"Update contact status to 'Qualified' for recXXXXXX"
```

### Project Tracking
```
"List all tasks assigned to me that are overdue"
"Create a new task in the Backlog table"
```

### Inventory Management
```
"Find all products with stock less than 10"
"Update quantity for product SKU-12345"
```

### Content Calendar
```
"Show all blog posts scheduled for next month"
"Mark article recXXXXXX as published"
```

## Links

- Upstream: https://github.com/domdomegg/airtable-mcp-server
- Airtable API: https://airtable.com/developers/web/api/introduction
- Create Token: https://airtable.com/create/tokens
- Formula Reference: https://support.airtable.com/docs/formula-field-reference
- License: MIT
