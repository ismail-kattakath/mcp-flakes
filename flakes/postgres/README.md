# 🐘 PostgreSQL MCP Server

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Read Only](https://img.shields.io/badge/Access-Read--Only-success)
![MCP](https://img.shields.io/badge/MCP-0.6.2-blue)

Safe **read-only** access to PostgreSQL databases for AI agents. Inspect schemas, query data, and analyze databases without risk of data modification.

## Features

- **Read-Only Access**: All queries are executed within READ ONLY transactions for safety
- **Schema Discovery**: Automatically discovers and exposes table schemas
- **Comprehensive Metadata**: Provides column names and data types for all tables

## Tools

### query
Execute read-only SQL queries against the connected PostgreSQL database.

**Input:**
- `sql` (string): The SQL query to execute

**Example:**
```sql
SELECT * FROM users LIMIT 10;
```

## Resources

The server automatically provides schema information for each table:

- **Pattern**: `postgres://<host>/<table>/schema`
- **Format**: JSON with column names and data types
- **Discovery**: Automatically fetched from database metadata

## Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `POSTGRES_URL` | Yes | PostgreSQL connection URL | `postgresql://user:pass@host:5432/dbname` |

### Docker Usage

```bash
docker run -i --rm \
  -e POSTGRES_URL="postgresql://user:pass@host.docker.internal:5432/mydb" \
  mcp/postgres:0.6.2
```

**Note for macOS:** When connecting to a PostgreSQL server on your host machine, use `host.docker.internal` instead of `localhost`.

### Docker Compose

```yaml
services:
  postgres-mcp:
    image: mcp/postgres:0.6.2
    environment:
      - POSTGRES_URL=postgresql://user:pass@host.docker.internal:5432/mydb
    stdin_open: true
```

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "postgres": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "POSTGRES_URL",
        "mcp/postgres:0.6.2"
      ],
      "env": {
        "POSTGRES_URL": "postgresql://localhost:5432/mydb"
      }
    }
  }
}
```

## Connection String Format

The PostgreSQL URL follows this format:

```
postgresql://[user[:password]@][host][:port][/dbname][?param=value]
```

**Examples:**
- Basic: `postgresql://localhost:5432/mydb`
- With auth: `postgresql://user:password@localhost:5432/mydb`
- Docker host: `postgresql://user:password@host.docker.internal:5432/mydb`

## Building

Build the Docker image locally:

```bash
docker build -t mcp/postgres:0.6.2 .
```

Or use Docker Compose:

```bash
docker compose build
```

## Testing

Test the server with a PostgreSQL instance:

```bash
# Start a test PostgreSQL instance
docker run -d --name test-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=testdb \
  -p 5432:5432 \
  postgres:16-alpine

# Run the MCP server
docker run -i --rm \
  -e POSTGRES_URL="postgresql://postgres:password@host.docker.internal:5432/testdb" \
  mcp/postgres:0.6.2
```

## Security Considerations

- **Read-Only**: All queries are executed in READ ONLY transactions
- **No Mutations**: DDL and DML statements are blocked
- **Connection Security**: Supports SSL/TLS connections via PostgreSQL URL parameters
- **Credentials**: Store credentials securely, use environment variables

## Troubleshooting

### Cannot connect to localhost

**Problem:** Docker container can't reach PostgreSQL on host machine

**Solution:** Use `host.docker.internal` instead of `localhost` in your connection URL

### Authentication failed

**Problem:** Invalid username/password

**Solution:** Verify credentials and ensure PostgreSQL accepts connections from Docker

### Database does not exist

**Problem:** Database name is incorrect or doesn't exist

**Solution:** Check database name and create it if needed

## Upstream

This flake is built from the official MCP servers repository:

- **Repository**: https://github.com/modelcontextprotocol/servers-archived
- **Commit**: 9be4674
- **Path**: src/postgres
- **License**: MIT

## Version

- **Server Version**: 0.6.2
- **MCP SDK**: 1.0.1
- **Node.js**: 22

## Quick Start

```bash
# 1. Set your database URL
export POSTGRES_URL="postgresql://user:pass@host:5432/mydb"

# 2. Run the server
docker run -i --rm \
  -e POSTGRES_URL \
  mcp/postgres:0.6.2
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **Data Analysis** | "Show me top 10 customers by revenue" |
| **Schema Discovery** | "What tables exist in this database?" |
| **Query Generation** | "Find all orders from last month" |
| **Data Validation** | "Check for duplicate email addresses" |
| **Reporting** | "Generate a sales summary by region" |
| **Database Exploration** | "Describe the users table structure" |

## Example Workflows

### Explore Database Schema

```sql
-- List all tables (via resources)
-- The server automatically exposes schema for each table

-- Example resource URL:
postgres://myhost/users/schema
postgres://myhost/orders/schema
postgres://myhost/products/schema
```

### Analyze Customer Data

```sql
-- Get customer distribution by country
SELECT country, COUNT(*) as customer_count
FROM customers
GROUP BY country
ORDER BY customer_count DESC
LIMIT 10;

-- Find high-value customers
SELECT 
  c.name,
  c.email,
  SUM(o.total) as lifetime_value
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name, c.email
HAVING SUM(o.total) > 10000
ORDER BY lifetime_value DESC;
```

### Check Data Quality

```sql
-- Find duplicate emails
SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Check for NULL values
SELECT 
  COUNT(*) as total,
  COUNT(email) as with_email,
  COUNT(*) - COUNT(email) as missing_email
FROM users;
```

### Generate Reports

```sql
-- Monthly revenue report
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as order_count,
  SUM(total) as revenue
FROM orders
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY month
ORDER BY month DESC;
```

## Connection Patterns

### Local Development

```bash
POSTGRES_URL="postgresql://localhost:5432/dev_db"
```

### Docker to Host (macOS/Windows)

```bash
POSTGRES_URL="postgresql://user:pass@host.docker.internal:5432/mydb"
```

### Remote Database

```bash
POSTGRES_URL="postgresql://user:pass@db.example.com:5432/mydb?sslmode=require"
```

### Connection Pooling

```bash
POSTGRES_URL="postgresql://user:pass@pooler.example.com:6543/mydb"
```

## URL Parameters

Enhance connection string with parameters:

| Parameter | Example | Purpose |
|-----------|---------|---------|
| `sslmode` | `?sslmode=require` | Enforce SSL/TLS |
| `connect_timeout` | `?connect_timeout=10` | Connection timeout (seconds) |
| `application_name` | `?application_name=mcp-server` | Identify in pg_stat_activity |

## Safety Features

- **Read-Only Transactions**: All queries wrapped in `BEGIN READ ONLY` / `COMMIT`
- **No DDL**: CREATE, DROP, ALTER blocked
- **No DML**: INSERT, UPDATE, DELETE blocked
- **No Admin**: GRANT, REVOKE, user management blocked
- **Schema Inspection**: Safe metadata access only

## Performance Tips

### Use LIMIT for Large Tables

```sql
-- Good: Limited results
SELECT * FROM large_table LIMIT 100;

-- Avoid: Full table scan
SELECT * FROM large_table;
```

### Index-Friendly Queries

```sql
-- Good: Uses index
SELECT * FROM users WHERE id = 123;

-- Slower: Function on indexed column
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';
```

### Aggregate with WHERE

```sql
-- Good: Filter before aggregate
SELECT COUNT(*) FROM orders 
WHERE status = 'completed';

-- Slower: Aggregate then filter
SELECT COUNT(*) FROM orders 
GROUP BY status 
HAVING status = 'completed';
```

## Related Flakes

- **sqlite** - SQLite database access (read-write)
- **filesystem** - File operations
- **memory** - Knowledge graph storage

## License

MIT License - see upstream repository for details.
