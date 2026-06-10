# MongoDB MCP Server

Model Context Protocol server for MongoDB with schema inference, queries, aggregations, and write operations.

## Overview

The MongoDB MCP Server enables LLMs to interact directly with MongoDB databases through a standardized interface. It provides comprehensive support for querying, aggregating, and modifying data, with intelligent features like automatic schema inference and ObjectId handling.

## Features

- **Smart ObjectId Handling**: Configurable auto/none/force modes for string-to-ObjectId conversion
- **Read-Only Mode**: Protection against write operations with secondary read preference
- **Schema Inference**: Automatic collection schema detection from document samples
- **Query & Aggregation**: Full MongoDB query and aggregation pipeline support
- **Write Operations**: Insert, update, delete, and index creation (when not read-only)
- **Collection Auto-complete**: Collection name completion for LLM integration
- **Explain Plans**: Optional query execution plan analysis

## Use Cases

### 1. Document Queries
```
AI: "Find all users with age greater than 25"
AI: "Get the most recent 10 orders for customer ID abc123"
AI: "Search for products with 'laptop' in the name, case-insensitive"
```

### 2. Aggregation Pipelines
```
AI: "Calculate total sales by category for the last month"
AI: "Get the top 5 customers by order count"
AI: "Group orders by status and count each"
```

### 3. Schema Discovery
```
AI: "What fields does the users collection have?"
AI: "Show me the schema of the products collection"
AI: "What's the structure of documents in orders?"
```

### 4. Data Manipulation
```
AI: "Insert a new user with name John and email john@example.com"
AI: "Update the status to 'shipped' for order 12345"
AI: "Delete all expired sessions older than 30 days"
```

### 5. Index Management
```
AI: "Create an index on the email field for users"
AI: "Add a compound index on category and price for products"
AI: "Create a text index on description for full-text search"
```

## Available Tools

### Query Operations
- `query` - Execute MongoDB find queries with filters, projections, sort, limit
- `aggregate` - Run aggregation pipelines with multiple stages
- `count_documents` - Count documents matching a filter

### Write Operations (when not read-only)
- `insert_one` - Insert a single document
- `insert_many` - Insert multiple documents in one operation
- `update_one` - Update first matching document
- `update_many` - Update all matching documents
- `delete_one` - Delete first matching document
- `delete_many` - Delete all matching documents

### Schema & Metadata
- `get_schema` - Infer collection schema from sample documents
- `list_collections` - List all collections in database
- `create_index` - Create indexes for query optimization

### Advanced Features
- Query explain plans for performance analysis
- Automatic ObjectId string conversion
- Secondary read preference in read-only mode
- Validation with Zod schemas

## Configuration

### Required Environment Variables

```bash
MCP_MONGODB_URI=mongodb://localhost:27017/database
```

### Optional Environment Variables

```bash
# Read-only mode (no writes)
MCP_MONGODB_READONLY=true

# ObjectId handling (auto/none/force)
MONGODB_OBJECTID_MODE=auto

# Authentication
MONGODB_USERNAME=admin
MONGODB_PASSWORD=secure-password

# Default database
MONGODB_DATABASE=myapp
```

### Connection String Formats

**Local MongoDB:**
```
mongodb://localhost:27017/database
```

**Authenticated MongoDB:**
```
mongodb://username:password@localhost:27017/database
```

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster.mongodb.net/database
```

**Replica Set:**
```
mongodb://host1:27017,host2:27017,host3:27017/database?replicaSet=rs0
```

**With Options:**
```
mongodb://localhost:27017/database?authSource=admin&ssl=true
```

## ObjectId Handling Modes

### auto (default)
Automatically converts string IDs to ObjectId when they match ObjectId format:
```javascript
// Input: { _id: "507f1f77bcf86cd799439011" }
// Converted to: { _id: ObjectId("507f1f77bcf86cd799439011") }
```

### none
Never converts strings to ObjectId (use for custom ID types):
```javascript
// Input: { _id: "user_123" }
// Stays as: { _id: "user_123" }
```

### force
Always attempts ObjectId conversion (throws error if invalid):
```javascript
// Input: { _id: "507f1f77bcf86cd799439011" }
// Converted to: { _id: ObjectId("507f1f77bcf86cd799439011") }
// Input: { _id: "invalid" } -> Error
```

## Quick Start

### Using Docker Compose

```bash
cd flakes/mongodb-mcp
docker compose up -d
```

This starts both MongoDB and the MCP server.

### Using with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "docker",
      "args": [
        "compose",
        "-f",
        "/path/to/mcp-flakes/flakes/mongodb-mcp/compose.yaml",
        "run",
        "--rm",
        "mongodb-mcp",
        "mongodb://mongodb:27017/testdb"
      ],
      "env": {
        "MCP_MONGODB_READONLY": "false"
      }
    }
  }
}
```

### Direct NPX Usage

```bash
# Basic usage
npx -y mcp-mongo-server mongodb://localhost:27017/database

# With authentication
npx -y mcp-mongo-server mongodb://user:pass@localhost:27017/database

# Read-only mode
npx -y mcp-mongo-server mongodb://localhost:27017/database --read-only
```

## Example Interactions

### Finding Documents
```
User: "Find all active users sorted by creation date"
AI: [Uses query tool]
{
  "collection": "users",
  "filter": { "status": "active" },
  "sort": { "createdAt": -1 }
}
```

### Aggregation
```
User: "Calculate average order value by customer"
AI: [Uses aggregate tool]
{
  "collection": "orders",
  "pipeline": [
    { "$group": {
      "_id": "$customerId",
      "avgValue": { "$avg": "$total" }
    }},
    { "$sort": { "avgValue": -1 } }
  ]
}
```

### Updates
```
User: "Mark order 12345 as shipped"
AI: [Uses update_one tool]
{
  "collection": "orders",
  "filter": { "orderId": "12345" },
  "update": { "$set": { "status": "shipped", "shippedAt": "2024-01-15" } }
}
```

### Schema Inspection
```
User: "What fields exist in the products collection?"
AI: [Uses get_schema tool]
{
  "collection": "products"
}

Response shows inferred schema from sample documents:
{
  "_id": "ObjectId",
  "name": "string",
  "price": "number",
  "category": "string",
  "inStock": "boolean",
  "tags": "array"
}
```

## Security Best Practices

1. **Use Read-Only Mode**: Set `MCP_MONGODB_READONLY=true` for data exploration
2. **Limited User Permissions**: Create MongoDB users with minimal required privileges
3. **Network Security**: Use private networks, not public internet
4. **Connection Encryption**: Use TLS/SSL in production (`mongodb+srv://` or `?ssl=true`)
5. **Input Validation**: The server validates all inputs with Zod schemas
6. **Audit Logs**: Enable MongoDB audit logging for compliance

### Example MongoDB User Setup

```javascript
// Create read-only user
db.createUser({
  user: "readonly",
  pwd: "secure-password",
  roles: [{ role: "read", db: "myapp" }]
})

// Create read-write user (limited collections)
db.createUser({
  user: "app",
  pwd: "secure-password",
  roles: [
    { role: "readWrite", db: "myapp" },
    { role: "read", db: "analytics" }
  ]
})
```

## Performance Tips

1. **Create Indexes**: Use `create_index` for frequently queried fields
2. **Limit Results**: Always specify limits in queries
3. **Project Fields**: Only request needed fields with projection
4. **Explain Plans**: Use explain option to optimize queries
5. **Connection Pooling**: The driver automatically manages connection pools
6. **Read Preference**: Read-only mode uses secondary nodes when available

## Common Query Patterns

### Text Search
```javascript
{
  "filter": {
    "$text": { "$search": "laptop gaming" }
  },
  "sort": { "score": { "$meta": "textScore" } }
}
```

### Date Range
```javascript
{
  "filter": {
    "createdAt": {
      "$gte": "2024-01-01",
      "$lt": "2024-02-01"
    }
  }
}
```

### Regex Match
```javascript
{
  "filter": {
    "email": { "$regex": "@example\\.com$", "$options": "i" }
  }
}
```

### Array Contains
```javascript
{
  "filter": {
    "tags": { "$in": ["featured", "new"] }
  }
}
```

## Troubleshooting

### Connection Issues
```bash
# Test MongoDB connectivity
mongosh "mongodb://localhost:27017/testdb"

# Check authentication
mongosh "mongodb://user:pass@localhost:27017/testdb"
```

### Permission Errors
- Verify user has correct roles with `db.getUser("username")`
- Check database name matches connection URI
- Ensure authentication database is correct (default: admin)

### ObjectId Errors
- Use `MONGODB_OBJECTID_MODE=none` for custom ID types
- Ensure ID strings are valid 24-character hex for auto mode
- Check filter and update documents for ID field format

## Links

- **Repository**: https://github.com/kiliczsh/mcp-mongo-server
- **NPM**: https://www.npmjs.com/package/mcp-mongo-server
- **MongoDB Documentation**: https://www.mongodb.com/docs/
- **Video Demo**: https://www.youtube.com/watch?v=FI-oE_voCpA

## License

MIT License - see [ATTRIBUTION.md](./ATTRIBUTION.md) for details.
