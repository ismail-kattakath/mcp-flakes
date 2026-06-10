# 🧩 MCP Sequential Thinking Server Flake

![Reasoning](https://img.shields.io/badge/Reasoning-Structured-blueviolet)
![Problem Solving](https://img.shields.io/badge/Problem_Solving-Dynamic-success)
![MIT](https://img.shields.io/badge/License-MIT-green)

Dynamic and reflective problem-solving through structured thinking processes. Break down complex problems, revise understanding, and explore alternative reasoning paths.

## Upstream

- **Source**: https://github.com/modelcontextprotocol/servers
- **Subpath**: src/sequentialthinking
- **Commit**: 275175cda17ca9c49920ceed2bcf27e12e59f8b2
- **License**: MIT

## Tools

- `sequential_thinking` - Facilitates step-by-step thinking for problem-solving and analysis
  - Break down complex problems into manageable steps
  - Revise and refine thoughts as understanding deepens
  - Branch into alternative paths of reasoning
  - Adjust the total number of thoughts dynamically
  - Generate and verify solution hypotheses

## Tool Parameters

The `sequential_thinking` tool accepts:
- `thought` (string): The current thinking step
- `nextThoughtNeeded` (boolean): Whether another thought step is needed
- `thoughtNumber` (integer): Current thought number
- `totalThoughts` (integer): Estimated total thoughts needed
- `isRevision` (boolean, optional): Whether this revises previous thinking
- `revisesThought` (integer, optional): Which thought is being reconsidered
- `branchFromThought` (integer, optional): Branching point thought number
- `branchId` (string, optional): Branch identifier
- `needsMoreThoughts` (boolean, optional): If more thoughts are needed

## Environment Variables

- `DISABLE_THOUGHT_LOGGING` - Set to 'true' to disable logging of thought information (default: false)

## Usage

### With Docker Compose

```bash
cd flakes/sequentialthinking
docker compose run --rm mcp-sequentialthinking
```

### Direct Docker Run

```bash
docker run -i --rm \
  -e DISABLE_THOUGHT_LOGGING=false \
  ghcr.io/mcp-flakes/sequentialthinking:latest
```

### In a Bundle

```yaml
include:
  - ../../flakes/sequentialthinking/compose.yaml

# Override environment in bundle's .env file:
# DISABLE_THOUGHT_LOGGING=true
```

## Use Cases

The Sequential Thinking tool is designed for:
- Breaking down complex problems into steps
- Planning and design with room for revision
- Analysis that might need course correction
- Problems where the full scope might not be clear initially
- Tasks that need to maintain context over multiple steps
- Situations where irrelevant information needs to be filtered out

## Quick Start

```bash
# Start the server
cd flakes/sequentialthinking
docker compose run --rm mcp-sequentialthinking
```

## How It Works

### Thinking Process Flow

```
1. Initial Thought → 2. Analysis → 3. Revision (if needed)
                    ↓                      ↓
              Alternative Branch    → Further Analysis
```

### Key Concepts

| Feature | Description |
|---------|-------------|
| **Sequential Steps** | Break problem into manageable thought steps |
| **Dynamic Planning** | Adjust total thought count as understanding evolves |
| **Revision** | Reconsider previous thoughts when new insights emerge |
| **Branching** | Explore alternative reasoning paths |
| **Context Preservation** | Maintain full thought chain across steps |

## Example Workflows

### Problem Decomposition

```javascript
// Thought 1: Initial understanding
{
  thought: "I need to design a caching system. First, let me identify the key requirements.",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
}

// Thought 2: Analysis
{
  thought: "The system needs: 1) fast lookup, 2) TTL support, 3) eviction policy. This is more complex than I thought.",
  thoughtNumber: 2,
  totalThoughts: 8,  // Adjusted up
  needsMoreThoughts: true,
  nextThoughtNeeded: true
}

// Thought 3: Revision of approach
{
  thought: "Actually, before choosing data structures, I should consider the access patterns.",
  thoughtNumber: 3,
  totalThoughts: 8,
  isRevision: true,
  revisesThought: 2,
  nextThoughtNeeded: true
}
```

### Alternative Path Exploration

```javascript
// Branch A: Redis-based solution
{
  thought: "Let's explore using Redis as the cache backend.",
  thoughtNumber: 4,
  totalThoughts: 8,
  branchId: "redis",
  branchFromThought: 3,
  nextThoughtNeeded: true
}

// Branch B: In-memory solution
{
  thought: "Alternatively, we could use an in-memory cache with LRU eviction.",
  thoughtNumber: 4,
  totalThoughts: 8,
  branchId: "inmemory",
  branchFromThought: 3,
  nextThoughtNeeded: true
}
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **Architecture Design** | "Design a scalable microservices architecture" |
| **Debugging** | "Analyze why this API call is failing" |
| **Planning** | "Create a project timeline with dependencies" |
| **Code Review** | "Evaluate this implementation for issues" |
| **Learning** | "Explain how transformers work in ML" |
| **Decision Making** | "Choose between SQL and NoSQL for this use case" |

## When to Use Sequential Thinking

### ✅ Use When:
- Problem scope is unclear initially
- Multiple solution paths exist
- Understanding evolves during analysis
- Need to maintain reasoning chain
- Complex multi-step problems
- Revision might be necessary

### ❌ Don't Use When:
- Simple, straightforward tasks
- Single-step operations
- Well-defined scope upfront
- Fast response needed
- No ambiguity in approach

## Best Practices

### Effective Thought Construction

**Good:**
```
"The database schema needs normalization. Let me analyze the current structure: 
users table has redundant address fields. I should create a separate addresses table."
```

**Avoid:**
```
"I think about the database."
```

### Dynamic Planning

- Start with conservative estimate (3-5 thoughts)
- Increase if problem proves more complex
- Decrease if solution becomes clear early
- Don't over-think simple problems

### Revision Strategy

- Revise when new information contradicts previous understanding
- Reference which thought is being reconsidered
- Explain why revision is needed
- Continue forward from revised understanding

### Branching Strategy

- Branch when multiple viable approaches exist
- Give branches clear IDs ("approach-a", "redis-solution")
- Note branch point explicitly
- Can merge branches later with synthesis thought

## Logging

Control thought logging with environment variable:

```yaml
environment:
  - DISABLE_THOUGHT_LOGGING=true  # Disable detailed logs
  - DISABLE_THOUGHT_LOGGING=false # Enable logs (default)
```

Logs show:
- Thought number and progress
- Branch information
- Revisions and their targets
- Dynamic thought count adjustments

## MCP Protocol

This server uses stdio transport. It expects MCP protocol messages on stdin and writes responses to stdout.

## Related Flakes

- **memory** - Store reasoning patterns and decisions long-term
- **mcp-compress** - Compress large thought chains for storage
- **claude-terminal-mcp** - Execute complex shell workflows
