# Redis MCP Server

Official Redis MCP Server - Natural language interface for AI agents to manage and search data in Redis efficiently.

## Overview

The Redis MCP Server provides a comprehensive natural language interface for AI agents to interact with Redis, supporting all major data structures including strings, hashes, lists, sets, sorted sets, streams, JSON documents, and vector embeddings. It enables seamless integration between LLMs and Redis for caching, session management, real-time data, and vector search.

## Features

- **Complete Redis Data Structure Support**: Strings, hashes, lists, sets, sorted sets, streams, JSON, and pub/sub
- **Vector Search**: Create indexes and perform semantic similarity searches
- **Natural Language Interface**: AI agents can query and update Redis using conversational language
- **Official Implementation**: Maintained by Redis, inc.
- **Azure EntraID Support**: Native authentication for Azure Managed Redis
- **Documentation Search**: Built-in tool to search Redis docs and best practices
- **High Performance**: Designed for production workloads with efficient data operations

## Use Cases

### 1. Session Management
```
AI: "Store this user session with a 30-minute expiration"
AI: "Cache this API response for 5 minutes"
AI: "Set this feature flag to true"
```

### 2. Real-time Messaging
```
AI: "Add this event to the activity stream"
AI: "Publish a notification to all subscribers"
AI: "Create a consumer group for order processing"
```

### 3. Vector Search
```
AI: "Index these document embeddings for semantic search"
AI: "Find the 10 most similar products to this description"
AI: "Search for related articles using this query vector"
```

### 4. Leaderboards & Analytics
```
AI: "Add this player score to the leaderboard"
AI: "Get the top 10 users by points"
AI: "Store this time-series metric with timestamp"
```

### 5. Document Storage
```
AI: "Store this user profile as JSON"
AI: "Update the preferences field in the config document"
AI: "Get the nested value at path user.settings.theme"
```

## Available Tools

### String Operations
- `string_set` - Set string value with optional TTL
- `string_get` - Retrieve string value

### Hash Operations
- `hash_set` - Store field-value pairs with optional vector embeddings
- `hash_get` - Retrieve hash fields

### List Operations
- `list_push` - Append/prepend items to list
- `list_pop` - Pop items from list (FIFO/LIFO)

### Set Operations
- `set_add` - Add unique members to set
- `set_members` - List all set members
- `set_intersect` - Get intersection of multiple sets

### Sorted Set Operations
- `sorted_set_add` - Add scored members
- `sorted_set_range` - Get range by score or rank

### Pub/Sub
- `pubsub_publish` - Publish messages to channels
- `pubsub_subscribe` - Create stateful subscriptions

### Stream Operations
- `stream_add` - Add entries to stream
- `stream_read` - Read stream entries
- `stream_group_create` - Create consumer groups
- `stream_ack` - Acknowledge processed entries

### JSON Operations
- `json_set` - Store JSON documents
- `json_get` - Retrieve JSON documents with path support

### Vector Search
- `vector_index_create` - Create vector search index
- `vector_search` - Perform similarity search

### Utilities
- `docs_search` - Search Redis documentation
- `server_info` - Get Redis server information

## Configuration

### Required Environment Variables

```bash
REDIS_URL=redis://localhost:6379
```

### Optional Environment Variables

```bash
# Authentication
REDIS_PASSWORD=your-secure-password
REDIS_USERNAME=default

# Database selection
REDIS_DB=0

# Cluster mode
REDIS_CLUSTER_MODE=false

# Documentation search
MCP_DOCS_SEARCH_URL=https://api.redis.com/docs/search
```

### Connection String Formats

**Local Redis:**
```
redis://localhost:6379
redis://localhost:6379/0
```

**Authenticated Redis:**
```
redis://:password@localhost:6379
redis://username:password@localhost:6379
```

**Redis SSL/TLS:**
```
rediss://username:password@redis-host:6380
```

**Redis Cluster:**
```
redis://node1:6379,node2:6379,node3:6379
```
Set `REDIS_CLUSTER_MODE=true` for cluster mode.

**Azure Managed Redis:**
```
rediss://myredis.redis.cache.windows.net:6380
```
Uses EntraID authentication when credentials are provided.

## Quick Start

### Using Docker Compose

```bash
cd flakes/redis-mcp
docker compose up -d
```

This starts both the Redis server and the MCP server.

### Using with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "redis": {
      "command": "docker",
      "args": [
        "compose",
        "-f",
        "/path/to/mcp-flakes/flakes/redis-mcp/compose.yaml",
        "run",
        "--rm",
        "redis-mcp"
      ],
      "env": {
        "REDIS_URL": "redis://localhost:6379"
      }
    }
  }
}
```

### Direct PyPI Installation

```bash
uvx redis-mcp-server --redis-url redis://localhost:6379
```

## Example Interactions

### Caching API Responses
```
User: "Cache this weather data for London with a 10 minute expiration"
AI: [Uses string_set with key "weather:london", value as JSON, TTL 600 seconds]

User: "What's the cached weather for London?"
AI: [Uses string_get with key "weather:london"]
```

### Session Storage
```
User: "Store this user session with ID abc123 for 30 minutes"
AI: [Uses hash_set to store session fields with 1800s TTL]

User: "Update the last_activity timestamp for session abc123"
AI: [Uses hash_set to update specific field]
```

### Event Streaming
```
User: "Add this order event to the orders stream"
AI: [Uses stream_add to append event with auto-generated ID]

User: "Create a consumer group called 'processors' for the orders stream"
AI: [Uses stream_group_create]

User: "Read new orders for the processors group"
AI: [Uses stream_read with consumer group]
```

### Vector Search
```
User: "Create a vector index for product embeddings with 768 dimensions"
AI: [Uses vector_index_create with FLAT or HNSW algorithm]

User: "Find the 5 most similar products to this embedding"
AI: [Uses vector_search with query vector and k=5]
```

## Security Best Practices

1. **Use Redis ACL**: Create dedicated users with minimal permissions
2. **Enable TLS**: Use `rediss://` URLs for encrypted connections
3. **Set Password**: Always configure `REDIS_PASSWORD` in production
4. **Network Isolation**: Run Redis on private networks, not exposed to internet
5. **Limit Keys**: Use key prefixes and ACL patterns to restrict access
6. **Monitor Access**: Enable Redis audit logs and monitoring

### Example Redis ACL Setup

```bash
# Create read-write user for MCP
ACL SETUSER mcpuser on >secure-password ~* +@all -@dangerous

# Read-only user
ACL SETUSER readonly on >password ~* +@read +@connection

# Limited to specific key patterns
ACL SETUSER appuser on >password ~app:* +@all -@dangerous
```

Then set:
```bash
REDIS_USERNAME=mcpuser
REDIS_PASSWORD=secure-password
```

## Performance Considerations

- **Connection Pooling**: The server maintains persistent connections
- **Pipeline Commands**: Batch operations when possible
- **TTL Management**: Set appropriate expirations to prevent memory bloat
- **Index Optimization**: Choose appropriate vector index types (FLAT vs HNSW)
- **Cluster Scaling**: Use Redis Cluster for horizontal scaling

## Troubleshooting

### Connection Issues
```bash
# Test Redis connectivity
redis-cli -h localhost -p 6379 ping

# Check auth
redis-cli -h localhost -p 6379 -a password ping

# TLS connection
redis-cli -h host -p 6380 --tls ping
```

### Permission Errors
- Verify ACL permissions with `ACL WHOAMI` and `ACL GETUSER <username>`
- Check that user has required command permissions

### Memory Issues
- Monitor with `INFO memory`
- Set `maxmemory` and eviction policies
- Use TTL on keys to auto-expire data

## Links

- **Repository**: https://github.com/redis/mcp-redis
- **PyPI**: https://pypi.org/project/redis-mcp-server/
- **Redis Documentation**: https://redis.io/docs/
- **MCP Protocol**: https://modelcontextprotocol.io/

## License

MIT License - see [ATTRIBUTION.md](./ATTRIBUTION.md) for details.
