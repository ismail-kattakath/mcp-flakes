# PostgreSQL MCP Server

A Model Context Protocol server that provides **read-only** access to PostgreSQL databases. This server enables LLMs to inspect database schemas and execute read-only SQL queries.

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

## License

MIT License - see upstream repository for details.
