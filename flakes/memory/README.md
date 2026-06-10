# MCP Memory Server Flake

Provides persistent knowledge graph storage for MCP clients, enabling memory across chat sessions.

## Upstream

- **Source**: https://github.com/modelcontextprotocol/servers
- **Subpath**: src/memory
- **Commit**: 275175cda17ca9c49920ceed2bcf27e12e59f8b2
- **License**: MIT

## Tools

- `create_entities` - Create multiple new entities in the knowledge graph
- `create_relations` - Create multiple new relations between entities
- `add_observations` - Add new observations to existing entities
- `delete_entities` - Remove entities and their relations
- `delete_observations` - Remove specific observations from entities
- `delete_relations` - Remove specific relations from the graph
- `read_graph` - Read the entire knowledge graph
- `search_nodes` - Search for nodes based on query
- `open_nodes` - Retrieve specific nodes by name

## Core Concepts

### Entities
Entities are the primary nodes in the knowledge graph with a unique name, entity type, and observations.

### Relations
Relations define directed connections between entities, stored in active voice.

### Observations
Observations are discrete facts about entities, stored as strings and managed independently.

## Environment Variables

- `MEMORY_FILE_PATH` - Path to the memory storage JSONL file (default: `memory.jsonl` in server directory)

## Usage

### With Docker Compose

```bash
cd flakes/memory
docker compose run --rm mcp-memory
```

### Direct Docker Run

```bash
docker run -i --rm \
  -v $(pwd)/memory-data:/repo/src/memory \
  -e MEMORY_FILE_PATH=/repo/src/memory/memory.jsonl \
  ghcr.io/mcp-flakes/memory:latest
```

### In a Bundle

```yaml
include:
  - ../../flakes/memory/compose.yaml

# Override environment in bundle's .env file:
# MEMORY_FILE_PATH=/path/to/custom/memory.jsonl
```

## MCP Protocol

This server uses stdio transport. It expects MCP protocol messages on stdin and writes responses to stdout.

## Example System Prompt

For chat personalization, consider this prompt in Claude's Custom Instructions:

```
Follow these steps for each interaction:

1. User Identification:
   - Assume you are interacting with default_user
   - If you have not identified default_user, proactively try to do so

2. Memory Retrieval:
   - Always begin your chat by saying "Remembering..." and retrieve all relevant information
   - Always refer to your knowledge graph as your "memory"

3. Memory Capture:
   - While conversing, be attentive to new information:
     a) Basic Identity (age, gender, location, job title, education)
     b) Behaviors (interests, habits)
     c) Preferences (communication style, preferred language)
     d) Goals (targets, aspirations)
     e) Relationships (personal and professional, up to 3 degrees)

4. Memory Update:
   - After gathering new information, update your memory:
     a) Create entities for recurring organizations, people, events
     b) Connect them using relations
     c) Store facts as observations
```
