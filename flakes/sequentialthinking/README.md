# MCP Sequential Thinking Server Flake

Provides a tool for dynamic and reflective problem-solving through structured thinking processes.

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

## MCP Protocol

This server uses stdio transport. It expects MCP protocol messages on stdin and writes responses to stdout.
