# BigQuery MCP Server

Model Context Protocol server for Google BigQuery with schema inspection and SQL query execution.

## Overview

Provides LLMs with direct access to Google Cloud BigQuery for analytics queries, schema exploration, and large-scale data analysis.

## Features

- **SQL Query Execution**: Run BigQuery SQL dialect queries
- **Schema Inspection**: List tables and describe schemas
- **Multi-Dataset Support**: Query across multiple datasets
- **Timeout Control**: Prevent long-running queries
- **Service Account Auth**: Secure authentication with GCP

## Use Cases

### 1. Analytics Queries
```
AI: "Calculate total revenue by product category this year"
AI: "Find the top 10 customers by order count"
AI: "Show monthly user growth trend"
```

### 2. Data Exploration
```
AI: "What tables exist in my analytics dataset?"
AI: "Describe the schema of the users table"
AI: "Show me sample data from the orders table"
```

### 3. Business Intelligence
```
AI: "Compare this quarter's sales to last quarter"
AI: "Generate a funnel analysis for user signups"
AI: "Calculate conversion rate by marketing channel"
```

## Configuration

### Required Environment Variables

```bash
BIGQUERY_PROJECT=my-gcp-project
BIGQUERY_LOCATION=us-central1
```

### Optional Environment Variables

```bash
# Limit to specific datasets
BIGQUERY_DATASETS=analytics,warehouse

# GCP service account
BIGQUERY_KEY_FILE=/config/gcp-service-account.json

# Query timeout (seconds)
BIGQUERY_TIMEOUT=300
```

### GCP Service Account Setup

1. Go to GCP Console > IAM & Admin > Service Accounts
2. Create service account with BigQuery User role
3. Generate JSON key
4. Save as `gcp-service-account.json`
5. Set environment variables

### Required GCP Permissions

Service account needs these roles:
- `roles/bigquery.user` - Run queries
- `roles/bigquery.dataViewer` - Read data
- `roles/bigquery.metadataViewer` - View schemas

## Available Tools

### Query Operations
- `execute_query` - Run SQL using BigQuery dialect
  - Supports standard SQL syntax
  - Query timeout control
  - Result pagination

### Schema Operations
- `list_tables` - List all tables in datasets
  - Filter by dataset
  - Show table metadata
  
- `describe_table` - Get table schema
  - Column names and types
  - Table statistics
  - Partition information

## Quick Start

### Using Docker Compose

```bash
cd flakes/bigquery-mcp
export BIGQUERY_PROJECT=my-project
export BIGQUERY_LOCATION=us-central1
export BIGQUERY_KEY_FILE=./gcp-service-account.json
docker compose up -d
```

### Using with Claude Desktop

```json
{
  "mcpServers": {
    "bigquery": {
      "command": "docker",
      "args": [
        "compose",
        "-f",
        "/path/to/flakes/bigquery-mcp/compose.yaml",
        "run",
        "--rm",
        "bigquery-mcp"
      ],
      "env": {
        "BIGQUERY_PROJECT": "my-project",
        "BIGQUERY_LOCATION": "us-central1",
        "BIGQUERY_KEY_FILE": "/path/to/credentials.json"
      }
    }
  }
}
```

### Direct Installation

```bash
uvx mcp-server-bigquery --project my-project --location us-central1
```

## Example Interactions

### Running Queries
```
User: "Show me the top 5 products by revenue this month"
AI: [Uses execute_query]
SELECT 
  product_name,
  SUM(revenue) as total_revenue
FROM `project.dataset.sales`
WHERE DATE(order_date) >= DATE_TRUNC(CURRENT_DATE(), MONTH)
GROUP BY product_name
ORDER BY total_revenue DESC
LIMIT 5
```

### Schema Exploration
```
User: "What columns does the customers table have?"
AI: [Uses describe_table]
Table: customers
Columns:
- customer_id (STRING)
- name (STRING)
- email (STRING)
- created_at (TIMESTAMP)
- total_orders (INTEGER)
```

## BigQuery SQL Tips

### Standard SQL Syntax
BigQuery uses standard SQL with some extensions:
```sql
-- Array operations
SELECT * FROM table CROSS JOIN UNNEST(array_column) as item

-- Window functions
SELECT customer_id, SUM(amount) OVER (PARTITION BY month)

-- Date functions
WHERE DATE(timestamp) BETWEEN '2024-01-01' AND '2024-12-31'
```

### Performance Optimization
1. **Partition Pruning**: Filter on partition keys
2. **Column Selection**: Only SELECT needed columns
3. **Table Sampling**: Use TABLESAMPLE for large tables
4. **Avoid SELECT ***: Specify columns explicitly

## Security Best Practices

1. **Least Privilege**: Grant minimum required permissions
2. **Dataset Restrictions**: Use `BIGQUERY_DATASETS` to limit scope
3. **Query Timeouts**: Set reasonable timeout values
4. **Audit Logs**: Enable BigQuery audit logging
5. **Cost Controls**: Set budget alerts in GCP
6. **Data Classification**: Apply column-level security

## Troubleshooting

### Authentication Issues
```bash
# Test authentication
gcloud auth application-default print-access-token

# Verify service account permissions
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:EMAIL"
```

### Query Errors
- Check SQL syntax for BigQuery dialect
- Verify table names are fully qualified: `project.dataset.table`
- Ensure service account has data access permissions

### Performance Issues
- Add WHERE clauses to limit data scanned
- Use partitioned tables for time-series data
- Enable query caching when appropriate

## Links

- **Repository**: https://github.com/LucasHild/mcp-server-bigquery
- **PyPI**: https://pypi.org/project/mcp-server-bigquery/
- **BigQuery Docs**: https://cloud.google.com/bigquery/docs
- **Smithery**: https://smithery.ai/server/mcp-server-bigquery

## License

MIT License - see [ATTRIBUTION.md](./ATTRIBUTION.md) for details.
