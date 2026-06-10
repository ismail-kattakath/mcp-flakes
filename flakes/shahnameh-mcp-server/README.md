# Shahnameh MCP Server

MCP server for accessing the Shahnameh (Book of Kings) Persian epic poem by Ferdowsi, including sections, verses, and explanations.

شاهنامه زنده است.

## Installation

This server requires building from source as it's not published to PyPI.

## Build Pattern

**Type**: Source build (git clone + pip install)

**Base Image**: `python:3.12-slim`

This flake demonstrates the source build pattern:
1. Clone the repository at a specific commit
2. Install dependencies with `uv pip install --system -e .`
3. Run the main.py entry point

## Prerequisites

⚠️ **This MCP server requires a separate API backend to function.**

You must run the Shahnameh API server separately:
- API Repository: https://github.com/ArezooGoshtasbi/shahnameh-api
- Database: https://github.com/aliafsahnoudeh/shahnameh-dataset

The MCP server is just a client that calls the API backend.

## Tools

- `get_chapters(title=None)` - Get all chapters of Shahnameh with their sub-chapters
- `get_chapter_by_id(id)` - Get a specific chapter by its ID
- `get_verses(...)` - Get verses from Shahnameh
- `search_verses(...)` - Search for verses by keyword
- `get_explanations(...)` - Get explanations for verses

## Environment Variables

- `SHAHNAMEH_API_BASE` (required): Base URL for the Shahnameh API backend
  - Default: `http://host.docker.internal:8000/api/v1` (assumes API running on host)
  - Change this if your API is running elsewhere

## Docker Compose Configuration

The `compose.yaml` uses `host.docker.internal` to access an API running on your host machine. If your API is running in another container or remote server, update the `SHAHNAMEH_API_BASE` environment variable.

## Source

- **Repository**: https://github.com/aliafsahnoudeh/shahnameh-mcp-server
- **Commit**: `5d932ee2a812637ac82bf1fe7caffcbc6a5e921b`
- **License**: Not specified in repository

## Persian Context

این سرور MCP برای دسترسی به شاهنامه فردوسی طراحی شده است. این پروژه بخشی از تلاش برای زنده نگه داشتن زبان و ادبیات پارسی در دوره هوش مصنوعی است.
