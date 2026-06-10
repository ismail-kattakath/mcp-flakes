# Cloudflare Workers Bindings MCP Server

Manage Cloudflare Workers platform resources including KV Namespaces, R2 Buckets, D1 Databases, Workers, and Hyperdrive configurations.

## Overview

This is an official Cloudflare MCP server that integrates tools for managing resources in the Cloudflare Workers Platform. It supports remote MCP connections with Cloudflare OAuth built-in.

## Tools

### KV Namespaces
- `kv_namespaces_list` - List all KV namespaces
- `kv_namespace_create` - Create a new KV namespace
- `kv_namespace_delete` - Delete a KV namespace
- `kv_namespace_get` - Get KV namespace details
- `kv_namespace_update` - Update KV namespace title

### Workers
- `workers_list` - List all Workers in your account
- `workers_get_worker` - Get Worker details
- `workers_get_worker_code` - Get Worker source code

### R2 Buckets
- `r2_buckets_list` - List R2 buckets
- `r2_bucket_create` - Create a new R2 bucket
- `r2_bucket_get` - Get R2 bucket details
- `r2_bucket_delete` - Delete an R2 bucket

### D1 Databases
- `d1_databases_list` - List all D1 databases
- `d1_database_create` - Create a new D1 database
- `d1_database_delete` - Delete a D1 database
- `d1_database_get` - Get D1 database details
- `d1_database_query` - Query a D1 database with SQL

### Hyperdrive
- `hyperdrive_configs_list` - List Hyperdrive configurations
- `hyperdrive_config_create` - Create a Hyperdrive configuration
- `hyperdrive_config_delete` - Delete a Hyperdrive configuration
- `hyperdrive_config_get` - Get Hyperdrive configuration details
- `hyperdrive_config_edit` - Edit a Hyperdrive configuration

## Quick Start

```bash
# Create environment file
cat > .env << EOF
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
EOF

# Run the server (HTTP mode)
docker compose up -d mcp-cloudflare-workers

# Access the MCP endpoint at:
# http://localhost:8787/mcp
```

## Transport

This server uses **HTTP transport** and runs via Wrangler dev locally. It exposes an HTTP endpoint at port 8787.

## Required Configuration

### Cloudflare Credentials

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with account access
  - Get from: https://dash.cloudflare.com/profile/api-tokens
  - Required permissions: Workers, KV, R2, D1, Hyperdrive
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare Account ID (found in dashboard)

## Example Prompts

- "List my Cloudflare accounts"
- "Show me my KV namespaces"
- "Create a new KV namespace called 'my-kv-store'"
- "List my Cloudflare Workers"
- "Get the code for the 'my-worker-script' worker"
- "Show me my R2 buckets"
- "Create an R2 bucket named 'my-new-bucket'"
- "List my D1 databases"
- "Run the query 'SELECT * FROM customers LIMIT 10' on database 'my-db'"

## Remote MCP Server

This server is also available as a hosted remote MCP server at:

```
https://bindings.mcp.cloudflare.com
```

For MCP clients that don't support remote servers natively, use [mcp-remote](https://www.npmjs.com/package/mcp-remote):

```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "npx",
      "args": ["mcp-remote", "https://bindings.mcp.cloudflare.com/mcp"]
    }
  }
}
```

## Features

- **Remote MCP** - Built-in Cloudflare OAuth for remote connections
- **Comprehensive Coverage** - Manage all major Workers platform resources
- **SQL Queries** - Direct D1 database querying
- **Worker Inspection** - Get Worker source code for analysis
- **Official Support** - Maintained by Cloudflare

## Upstream

- **Source**: https://github.com/cloudflare/mcp-server-cloudflare
- **License**: Apache-2.0
- **Commit**: cb0186135e2f2c00d91b9ad2fcab54d630eeb911
