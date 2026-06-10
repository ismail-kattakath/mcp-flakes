# 🗄️ SQLite MCP Server

![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)
![Read Write](https://img.shields.io/badge/Access-Read%2FWrite-orange)
![MCP](https://img.shields.io/badge/MCP-0.6.2-blue)

Comprehensive SQLite database interaction with business intelligence capabilities. Run queries, analyze data, manage schemas, and automatically generate insights.

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

## Quick Start

```bash
# 1. Create a database file
touch mydata.db

# 2. Run the server
docker run -i --rm \
  -v $(pwd):/data \
  mcp/sqlite:0.6.2 \
  --db-path /data/mydata.db
```

## Business Intelligence Features

### Automatic Insights

The server includes a **memo://insights** resource that automatically tracks business insights discovered during analysis:

```javascript
// Add insight during analysis
append_insight({ 
  insight: "Customer retention dropped 15% in Q2 compared to Q1"
})

// The memo://insights resource auto-updates
// Claude can reference it in subsequent analysis
```

### Interactive Demo

```javascript
// Launch guided demo
mcp-demo({ topic: "e-commerce" })

// Creates sample schema, data, and guides through:
// 1. Schema exploration
// 2. Basic queries
// 3. Aggregations
// 4. Insights generation
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **Data Analysis** | "Find top selling products by revenue" |
| **Schema Management** | "Create a users table with email validation" |
| **Reporting** | "Generate monthly sales report" |
| **ETL Operations** | "Import CSV data into database" |
| **Data Validation** | "Check for orphaned records" |
| **Insights Tracking** | "Track discovered patterns as memos" |

## Example Workflows

### Create and Populate Database

```sql
-- 1. Create table
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL CHECK(price > 0),
  category TEXT,
  stock INTEGER DEFAULT 0
);

-- 2. Insert data
INSERT INTO products (name, price, category, stock)
VALUES 
  ('Laptop', 999.99, 'Electronics', 50),
  ('Mouse', 29.99, 'Electronics', 200),
  ('Desk', 299.99, 'Furniture', 30);

-- 3. Verify
SELECT * FROM products;
```

### Analyze Sales Data

```sql
-- Top products by revenue
SELECT 
  p.name,
  p.category,
  SUM(oi.quantity * oi.price) as revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.category
ORDER BY revenue DESC
LIMIT 10;

-- Category performance
SELECT 
  category,
  COUNT(*) as product_count,
  AVG(price) as avg_price,
  SUM(stock) as total_stock
FROM products
GROUP BY category;
```

### Track Insights

```sql
-- After discovering pattern
-- Use append_insight tool:
append_insight({
  insight: "Electronics category has 3x higher turnover than Furniture"
})

-- The memo://insights resource now contains this insight
-- Future queries can reference accumulated insights
```

## Schema Tools

### List Tables

```javascript
list_tables()
// Returns: ['products', 'orders', 'customers', ...]
```

### Describe Table

```javascript
describe_table({ table_name: "products" })
// Returns:
// [
//   { name: 'id', type: 'INTEGER' },
//   { name: 'name', type: 'TEXT' },
//   { name: 'price', type: 'REAL' },
//   ...
// ]
```

## Data Types

| SQLite Type | Use For | Example |
|-------------|---------|---------|
| `INTEGER` | Whole numbers, IDs | `id INTEGER PRIMARY KEY` |
| `REAL` | Decimals, prices | `price REAL` |
| `TEXT` | Strings, names | `name TEXT NOT NULL` |
| `BLOB` | Binary data | `image BLOB` |
| `NULL` | Missing values | `middle_name TEXT` |

## Constraints

```sql
-- Primary key
id INTEGER PRIMARY KEY AUTOINCREMENT

-- Not null
email TEXT NOT NULL

-- Unique
username TEXT UNIQUE

-- Check constraint
price REAL CHECK(price > 0)

-- Default value
created_at TEXT DEFAULT CURRENT_TIMESTAMP

-- Foreign key
customer_id INTEGER REFERENCES customers(id)
```

## Common Patterns

### Date Handling

```sql
-- Store as TEXT in ISO 8601
created_at TEXT DEFAULT (datetime('now'))

-- Query by date range
SELECT * FROM orders
WHERE date(created_at) BETWEEN '2024-01-01' AND '2024-12-31'
```

### JSON Support

```sql
-- Store JSON data
CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  data JSON
);

-- Query JSON fields
SELECT json_extract(data, '$.user_id') as user_id
FROM events
WHERE json_extract(data, '$.event_type') = 'purchase';
```

### Full-Text Search

```sql
-- Create FTS table
CREATE VIRTUAL TABLE articles_fts 
USING fts5(title, content);

-- Search
SELECT * FROM articles_fts 
WHERE articles_fts MATCH 'python programming';
```

## Volume Mounting

### Mount Directory

```bash
docker run -i --rm \
  -v /path/to/db/dir:/data \
  mcp/sqlite:0.6.2 \
  --db-path /data/mydb.sqlite
```

### Mount Specific File

```bash
docker run -i --rm \
  -v /path/to/mydb.sqlite:/data/mydb.sqlite \
  mcp/sqlite:0.6.2 \
  --db-path /data/mydb.sqlite
```

## Performance Tips

### Use Indexes

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_customer ON orders(customer_id);
```

### Analyze Query Plans

```sql
EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE customer_id = 123;
```

### Vacuum Regularly

```sql
VACUUM;  -- Reclaim space and optimize
```

## Related Flakes

- **postgres** - PostgreSQL database (read-only)
- **filesystem** - File operations for CSV import/export
- **memory** - Graph-based knowledge storage

## Comparison: SQLite vs PostgreSQL

| Feature | SQLite (this) | PostgreSQL |
|---------|--------------|------------|
| Access | Read + Write | Read Only |
| Setup | Single file | Server required |
| Concurrency | Limited | High |
| Best For | Local data, prototypes | Production, multi-user |

## License

MIT License - see upstream repository for details.
