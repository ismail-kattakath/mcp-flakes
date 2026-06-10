# 🎯 CLIRank - API Intelligence for AI Agents

> Originally created by [alexanderclapp](https://github.com/alexanderclapp/clirank-mcp-server) · Licensed under MIT  
> Packaged by [mcp-flakes](https://github.com/yourusername/mcp-flakes)

![npm package](https://img.shields.io/badge/npm-package-CB3837?logo=npm) ![No auth required](https://img.shields.io/badge/auth-none-green) ![Tools: 4](https://img.shields.io/badge/tools-4-blue) ![APIs: 387](https://img.shields.io/badge/APIs-387-purple)

## 📋 What This Does

Discover and evaluate 387 APIs based on their agent-friendliness (AN Score). CLIRank helps AI agents choose the best APIs for their tasks by scoring factors like CLI availability, documentation quality, API design, and automation-friendliness. Visit [clirank.dev](https://clirank.dev) for the full catalog.

## ⚡ Quick Start

```bash
docker run -i --rm ghcr.io/mcp-flakes/clirank:latest
```

With Docker Compose:
```bash
cd flakes/clirank
docker compose run --rm mcp-clirank
```

## 🎯 Perfect For

- **API selection** - Choose the most agent-friendly API when multiple options exist
- **Integration planning** - Understand API capabilities and automation potential before building
- **Tool evaluation** - Compare alternatives like Stripe vs. PayPal or AWS vs. GCP for agent workflows
- **Developer research** - Find APIs with great CLIs, SDKs, and documentation

## 🛠️ Tools & Features

| Tool | Purpose | Key Parameters |
|------|---------|---------------|
| `discover_services` | Search APIs by keyword or capability | `query`, `category`, `min_score` |
| `check_an_score` | Get Agent-Native score for an API | `api_name` |
| `compare_alternatives` | Side-by-side API comparison | `api_names[]` |
| `get_api_info` | Detailed API information | `api_name` |

### What's an Agent-Native (AN) Score?

The AN Score (0-100) rates APIs on:
- **CLI Quality** - Does it have a good command-line interface?
- **API Design** - RESTful, consistent, well-documented?
- **SDK Availability** - Official libraries for popular languages?
- **Automation-Friendly** - Easy to script and integrate?
- **Documentation** - Clear examples and references?

Higher score = better for AI agents and automation.

## 📚 Examples

### Example 1: Find Payment APIs
Ask Claude: *"Discover payment processing APIs and show me their agent-native scores"*

Compare Stripe, PayPal, Square, etc. based on automation-friendliness.

### Example 2: Evaluate a Specific API
Ask Claude: *"Check the AN score for the GitHub API and explain why it's rated that way"*

Understand what makes an API great (or not) for agent integration.

### Example 3: Compare Alternatives
Ask Claude: *"Compare AWS, GCP, and Azure APIs for agent-friendliness"*

```json
{
  "name": "compare_alternatives",
  "arguments": {
    "api_names": ["aws", "gcp", "azure"]
  }
}
```

Get side-by-side scores, CLI quality, SDK availability, and recommendations.

### Example 4: Discover by Capability
Ask Claude: *"Find highly-rated APIs for sending email and SMS notifications"*

Search by use case, filtered by minimum AN score.

## 🔗 Works Great With

- **a2asearch** - Discover MCP servers, then use CLIRank to evaluate their underlying APIs
- **fetch** - Retrieve API documentation URLs found in CLIRank results
- **claude-terminal-mcp** - Test CLIs of high-scoring APIs directly from Claude

## 🔧 Configuration

### Environment Variables

**None required** - CLIRank uses a free public API with no authentication.

### Build Pattern

**Type**: npm package pattern  
Installs pre-built `clirank-mcp-server` package from npm.

## 📦 Source & Compliance

- **Source**: https://github.com/alexanderclapp/clirank-mcp-server
- **Package**: clirank-mcp-server (npm)
- **Commit**: `6a73958d2a7d090dd5c8639baf0734c2f986ab1f`
- **License**: MIT
- **Protocol**: stdio transport
- **Web**: https://clirank.dev
- **Data**: 387 APIs with AN Scores
