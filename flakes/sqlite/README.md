# SQLite MCP Server

A Model Context Protocol server that provides comprehensive SQLite database interaction with business intelligence capabilities. This server enables running SQL queries, analyzing data, and automatically generating business insights.

## Features

- **Full SQL Support**: Read and write operations (SELECT, INSERT, UPDATE, DELETE, CREATE TABLE)
- **Schema Management**: List tables, describe schemas, create new tables
- **Business Intelligence**: Automatic insight tracking and memo generation
- **Interactive Demo**: Guided prompt for database operations with sample data

## Tools

### Query Tools

#### read_query
Execute SELECT queries to read data from the database.

**Input:**
- `query` (string): The SELECT SQL query to execute

**Returns:** Query results as array of objects

**Example:**
```sql
SELECT * FROM customers WHERE country = 'USA' LIMIT 10;
```

#### write_query
Execute INSERT, UPDATE, or DELETE queries to modify data.

**Input:**
- `query` (string): The SQL modification query

**Returns:** `{ affected_rows: number }`

**Example:**
```sql
INSERT INTO orders (customer_id, total) VALUES (123, 99.99);
```

#### create_table
Create new tables in the database.

**Input:**
- `query` (string): CREATE TABLE SQL statement

**Example:**
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL
);
```

### Schema Tools

#### list_tables
Get a list of all tables in the database.

**No input required**

**Returns:** Array of table names

#### describe_table
View schema information for a specific table.

**Input:**
- `table_name` (string): Name of table to describe

**Returns:** Array of column definitions with names and types

### Analysis Tools

#### append_insight
Add new business insights to the memo resource.

**Input:**
- `insight` (string): Business insight discovered from data analysis

**Returns:** Confirmation of insight addition

**Note:** This triggers an update of the `memo://insights` resource

## Resources

### memo://insights
A continuously updated business insights memo that aggregates discovered insights during analysis. This resource auto-updates as new insights are discovered via the `append_insight` tool.

## Prompts

### mcp-demo
Interactive prompt that guides users through database operations.

**Required Argument:**
- `topic` (string): The business domain to analyze

**Features:**
- Generates appropriate database schemas
- Creates sample data
- Guides through analysis steps
- Integrates with business insights memo

## Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DB_PATH` | Yes | Path to SQLite database file | `/data/mydb.sqlite` |

### Docker Usage

```bash
docker run -i --rm \
  -v /path/to/local/db:/data \
  mcp/sqlite:0.6.2 \
  --db-path /data/mydb.sqlite
```

### Docker Compose

```yaml
services:
  sqlite-mcp:
    image: mcp/sqlite:0.6.2
    volumes:
      - ./data:/data
    stdin_open: true
    command: ["--db-path", "/data/mydb.sqlite"]
```

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "${HOME}/databases:/data",
        "mcp/sqlite:0.6.2",
        "--db-path",
        "/data/mydb.sqlite"
      ]
    }
  }
}
```

## Building

Build the Docker image locally:

```bash
docker build -t mcp/sqlite:0.6.2 .
```

Or use Docker Compose:

```bash
docker compose build
```

## Testing

Create a test database and run the server:

```bash
# Create a test database directory
mkdir -p ./test-data

# Create a simple test database
sqlite3 ./test-data/test.db <<EOF
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT);
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
EOF

# Run the MCP server
docker run -i --rm \
  -v $(pwd)/test-data:/data \
  mcp/sqlite:0.6.2 \
  --db-path /data/test.db
```

## Use Cases

### Data Analysis
Query and analyze data in SQLite databases with natural language:
```
"Show me the top 10 customers by total order value"
"What's the average order size this month?"
```

### Business Intelligence
Automatically track insights as you explore data:
```
"Analyze customer purchasing patterns"
"Identify trends in the sales data"
```

### Database Management
Create and modify database schemas:
```
"Create a new table for tracking inventory"
"Add sample product data to the database"
```

### Demo and Learning
Use the interactive demo prompt:
```
"Run the demo for e-commerce analytics"
"Show me how to analyze customer behavior"
```

## Volume Mounting

The database file must be accessible from inside the container. Mount a directory containing your database:

```bash
# Mount a directory
docker run -i --rm -v /path/to/db/dir:/data mcp/sqlite:0.6.2 --db-path /data/mydb.sqlite

# Mount a specific file (read-only recommended)
docker run -i --rm -v /path/to/mydb.sqlite:/data/mydb.sqlite:ro mcp/sqlite:0.6.2 --db-path /data/mydb.sqlite
```

## Security Considerations

- **Write Access**: This server supports write operations (INSERT, UPDATE, DELETE)
- **Backup Recommended**: Always backup your database before write operations
- **Read-Only Mode**: Mount database as read-only (`:ro`) for safety if you only need queries
- **Permissions**: Ensure proper file permissions for database file

## Troubleshooting

### Database file not found

**Problem:** Container can't find the database file

**Solution:** Ensure the database file exists and the volume mount path is correct

### Permission denied

**Problem:** Container doesn't have permission to access database file

**Solution:** Check file permissions (should be readable/writable by container user)

### Database is locked

**Problem:** Another process has the database locked

**Solution:** Ensure no other processes are accessing the database file

## Python Requirements

- **Python Version**: 3.10+
- **Package Manager**: uv
- **MCP SDK**: 1.6.0+

## Upstream

This flake is built from the official MCP servers repository:

- **Repository**: https://github.com/modelcontextprotocol/servers-archived
- **Commit**: 9be4674
- **Path**: src/sqlite
- **License**: MIT

## Version

- **Server Version**: 0.6.2
- **Python**: 3.12
- **MCP SDK**: 1.6.0+

## License

MIT License - see upstream repository for details.
