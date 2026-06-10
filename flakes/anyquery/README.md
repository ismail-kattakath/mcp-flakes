# Anyquery MCP Server

SQL query engine for LLMs that can query 40+ apps and services using standard SQL.

## Overview

Anyquery is a powerful SQL-based query engine that provides a unified interface for querying diverse data sources. Built in Go for excellent performance, it enables LLMs to interact with files, databases, and external apps through familiar SQL syntax.

## Features

- **Universal SQL Interface**: Query 40+ data sources with SQL
- **Database Support**: PostgreSQL, MySQL, SQLite compatible
- **App Integrations**: Apple Notes, Notion, Chrome, Todoist, and more
- **File Querying**: Direct SQL queries on files
- **Plugin System**: Extensible through plugins
- **MCP Protocol**: Full Model Context Protocol support

## Usage

### With Docker Compose

```bash
docker compose up -d
docker compose exec anyquery /app/anyquery --help
```

### With Docker

```bash
docker build -t mcp-flakes/anyquery:latest .
docker run -it --rm mcp-flakes/anyquery:latest
```

### Configuration

Set environment variables:
- `ANYQUERY_CONFIG_DIR`: Configuration and plugin directory

### Tools Available

- `anyquery_query`: Execute SQL queries
- `anyquery_list_tables`: List available tables/data sources
- `anyquery_describe_table`: Get table schema

## Upstream

- **Repository**: https://github.com/julien040/anyquery
- **License**: MIT
- **Language**: Go
- **Commit**: 66d5e684cd0a1a4086758aadaf3b22aee4e6e498

## Build Details

- **Builder Image**: golang:1.22-bookworm
- **Runtime Image**: debian:bookworm-slim
- **Build Type**: Multi-stage Docker build with CGO enabled
- **Binary Size**: ~40-50MB (estimated, depends on final build)

## See Also

- [Anyquery Documentation](https://anyquery.dev)
- [Anyquery Integrations](https://anyquery.dev/integrations)
- [ATTRIBUTION.md](./ATTRIBUTION.md) for licensing details
