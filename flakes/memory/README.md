# 🧠 MCP Memory Server Flake

![Knowledge Graph](https://img.shields.io/badge/Knowledge-Graph-blueviolet)
![Persistent](https://img.shields.io/badge/Storage-Persistent-success)
![MIT](https://img.shields.io/badge/License-MIT-green)

Persistent knowledge graph storage for AI agents, enabling long-term memory across chat sessions. Build rich relationship networks and never forget important context.

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

## Quick Start

```bash
# 1. Start the server with persistent storage
cd flakes/memory
docker compose run --rm mcp-memory

# 2. Memory is stored in memory.jsonl
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **User Personalization** | Remember user preferences, goals, and habits |
| **Project Knowledge** | Track project decisions, architecture, and team members |
| **Learning Assistant** | Build knowledge about topics studied over time |
| **Relationship Mapping** | Model social/professional networks |
| **Decision History** | Track why decisions were made |
| **Context Preservation** | Maintain conversation context across sessions |

## Knowledge Graph Structure

### Entities
Nodes representing people, organizations, concepts, or things:
```json
{
  "name": "Alice Smith",
  "entityType": "person",
  "observations": [
    "Software engineer at TechCorp",
    "Prefers Python over JavaScript",
    "Working on microservices architecture"
  ]
}
```

### Relations
Directed connections between entities:
```json
{
  "from": "Alice Smith",
  "to": "TechCorp",
  "relationType": "works_at"
}
```

### Observations
Discrete facts about entities:
- Store each fact independently
- Easy to add/remove specific information
- Track granular knowledge changes

## Example Workflows

### Building a Personal Profile

```javascript
// 1. Create user entity
create_entities([{
  name: "John Doe",
  entityType: "person",
  observations: [
    "Lives in San Francisco",
    "Software engineer",
    "Interested in AI and machine learning"
  ]
}])

// 2. Create related entities
create_entities([
  { name: "OpenAI", entityType: "organization" },
  { name: "Python", entityType: "technology" }
])

// 3. Create relations
create_relations([
  { from: "John Doe", to: "OpenAI", relationType: "follows" },
  { from: "John Doe", to: "Python", relationType: "expert_in" }
])

// 4. Add new observation
add_observations({
  entityName: "John Doe",
  observations: ["Recently started learning Rust"]
})
```

### Searching Memory

```javascript
// Search for relevant nodes
search_nodes({ query: "Python programming" })

// Open specific nodes
open_nodes({ names: ["John Doe", "OpenAI"] })

// Read entire graph
read_graph()
```

### Managing Knowledge

```javascript
// Delete outdated observations
delete_observations({
  entityName: "John Doe",
  observations: ["Learning JavaScript"]
})

// Remove entity and its relations
delete_entities({ entityNames: ["OldProject"] })

// Remove specific relation
delete_relations([
  { from: "John Doe", to: "OldCompany", relationType: "worked_at" }
])
```

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

## Best Practices

### Entity Design
- Use descriptive, unique names
- Choose appropriate entity types (person, organization, concept, etc.)
- Keep observations atomic and factual

### Relation Modeling
- Use active voice for relations ("works_at", not "employed_by")
- Be consistent with relation names
- Model bidirectional relationships explicitly if needed

### Observation Management
- Store facts separately for easy updates
- Avoid duplicate observations
- Remove outdated information proactively

## Storage Format

Memory is stored in JSONL (JSON Lines) format:
- One JSON object per line
- Human-readable and version-controllable
- Easy to backup and migrate
- Supports incremental updates

## Related Flakes

- **sequentialthinking** - Complex reasoning with memory context
- **sqlite** - Structured data storage
- **postgres** - Relational database operations
