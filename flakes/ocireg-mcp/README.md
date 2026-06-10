# 🐳 OCI Registry MCP Server

![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![OCI](https://img.shields.io/badge/OCI-Compliant-262261)
![Go](https://img.shields.io/badge/Go-1.23-00ADD8?logo=go)

Query OCI container registries and inspect images through AI agents. Inspect Docker Hub, GHCR, GCR, and any OCI-compliant registry with full authentication support.

## Overview

OCI Registry MCP Server enables LLMs to interact with OCI-compliant container registries (Docker Hub, GHCR, GCR, etc.). Built in Go using the Model Context Protocol, it provides tools for image inspection, tag listing, manifest retrieval, and configuration querying.

## Features

- **Image Information**: Get digest, size, architecture, OS, and layers
- **Tag Listing**: Enumerate all tags for a repository
- **Manifest Retrieval**: Fetch complete image manifests
- **Config Inspection**: View image configurations and metadata
- **SSE Transport**: Server-Sent Events for real-time communication
- **Authentication Support**: Docker config.json integration

## Usage

### With Docker Compose

```bash
docker compose up -d
curl http://localhost:8080
```

### With Docker

```bash
docker build -t mcp-flakes/ocireg-mcp:latest .
docker run -d -p 8080:8080 mcp-flakes/ocireg-mcp:latest
```

### Configuration

Optional environment variables:
- `PORT`: HTTP port (default: 8080)
- `DOCKER_CONFIG`: Path to Docker config directory for authentication

### Authentication

Mount your Docker config for authenticated registries:

```yaml
volumes:
  - ~/.docker/config.json:/root/.docker/config.json:ro
```

### Tools Available

- `get_image_info`: Get comprehensive image information
  - Input: `image_ref` (e.g., docker.io/library/alpine:latest)
  - Output: Digest, size, architecture, OS, creation date, layers

- `list_tags`: List all tags for a repository
  - Input: `repository` (e.g., library/alpine)
  - Output: Array of tag names

- `get_manifest`: Retrieve image manifest
  - Input: `image_ref`
  - Output: Complete OCI manifest JSON

- `get_config`: Get image configuration
  - Input: `image_ref`
  - Output: Image config including CMD, ENV, layers

## Examples

### Query Image Info

```json
{
  "tool": "get_image_info",
  "arguments": {
    "image_ref": "docker.io/library/alpine:latest"
  }
}
```

### List Repository Tags

```json
{
  "tool": "list_tags",
  "arguments": {
    "repository": "library/alpine"
  }
}
```

## Supported Registries

- Docker Hub (docker.io)
- GitHub Container Registry (ghcr.io)
- Google Container Registry (gcr.io)
- Amazon ECR
- Azure Container Registry
- Any OCI-compliant registry

## Upstream

- **Repository**: https://github.com/StacklokLabs/ocireg-mcp
- **License**: Apache-2.0
- **Language**: Go
- **Commit**: 095e395f13870329f0d106f6a422adb386b44d0e

## Build Details

- **Builder Image**: golang:1.23-bookworm
- **Runtime Image**: alpine:latest
- **Build Type**: Multi-stage Docker build with static binary (CGO disabled)
- **Binary Size**: ~15-25MB (estimated)
- **Transport**: SSE (Server-Sent Events)

## Architecture

Uses Google's go-containerregistry library for OCI spec compliance and registry interaction. Implements MCP through mark3labs/mcp-go SDK.

## Quick Start

```bash
# 1. Start the server
docker compose up -d

# 2. Access via SSE
curl http://localhost:8080
```

## Use Cases

| Use Case | Example |
|----------|---------|
| **Image Inspection** | "What's the size and architecture of alpine:latest?" |
| **Tag Discovery** | "List all available versions of nginx" |
| **Security Analysis** | "What layers are in this image?" |
| **Manifest Review** | "Show me the full manifest for this image" |
| **Multi-Arch Check** | "What architectures are available for this image?" |
| **Config Inspection** | "What's the entrypoint and environment for this image?" |

## Example Workflows

### Check Image Details

```javascript
// Get comprehensive image info
get_image_info({ 
  image_ref: "docker.io/library/alpine:latest" 
})

// Returns:
// - Digest (SHA256)
// - Size (bytes)
// - Architecture (amd64, arm64, etc.)
// - OS (linux, windows)
// - Created date
// - Layer information
```

### List Available Tags

```javascript
// List all tags for a repository
list_tags({ 
  repository: "library/alpine" 
})

// Returns: ["latest", "3.19", "3.18", "edge", ...]
```

### Inspect Manifest

```javascript
// Get complete OCI manifest
get_manifest({ 
  image_ref: "docker.io/library/nginx:1.25" 
})

// Returns: Full JSON manifest with:
// - Schema version
// - Media types
// - Config descriptor
// - Layer descriptors
// - Annotations
```

### Check Image Configuration

```javascript
// Get image config
get_config({ 
  image_ref: "docker.io/library/postgres:16" 
})

// Returns:
// - CMD
// - ENV variables
// - EXPOSE ports
// - WORKDIR
// - USER
// - Layer history
```

## Registry Patterns

### Docker Hub

```javascript
// Official images
get_image_info({ image_ref: "docker.io/library/alpine:latest" })

// User images
get_image_info({ image_ref: "docker.io/username/image:tag" })
```

### GitHub Container Registry

```javascript
get_image_info({ 
  image_ref: "ghcr.io/owner/repo:tag" 
})
```

### Google Container Registry

```javascript
get_image_info({ 
  image_ref: "gcr.io/project-id/image:tag" 
})
```

### Amazon ECR

```javascript
get_image_info({ 
  image_ref: "123456789012.dkr.ecr.us-east-1.amazonaws.com/repo:tag" 
})
```

### Azure Container Registry

```javascript
get_image_info({ 
  image_ref: "myregistry.azurecr.io/repo:tag" 
})
```

## Authentication

### Docker Config

Mount your Docker config for authenticated registries:

```yaml
volumes:
  - ~/.docker/config.json:/root/.docker/config.json:ro
```

### Login to Private Registry

```bash
# Login to registry (on host)
docker login ghcr.io -u username

# Then mount the config
docker compose up -d
```

### Environment Variable

```yaml
environment:
  - DOCKER_CONFIG=/path/to/docker/config
```

## Image Reference Format

```
[registry/]repository[:tag|@digest]
```

**Examples:**
- `alpine:latest` (implies docker.io/library/)
- `docker.io/library/alpine:3.19`
- `ghcr.io/owner/repo:v1.0.0`
- `alpine@sha256:abc123...` (by digest)

## Common Queries

### Find Latest Version

```javascript
// List tags
tags = list_tags({ repository: "library/nginx" })

// Sort and find latest
latest = tags.sort().reverse()[0]
```

### Compare Sizes

```javascript
images = [
  "alpine:latest",
  "debian:latest",
  "ubuntu:latest"
]

sizes = images.map(img => 
  get_image_info({ image_ref: img })
)

// Compare image sizes
```

### Check Multi-Architecture

```javascript
// Get manifest for multi-arch image
manifest = get_manifest({ 
  image_ref: "docker.io/library/golang:1.21" 
})

// Manifest will list all available architectures
```

## SSE Transport

This server uses Server-Sent Events (SSE) instead of stdio:

```bash
# Connect via SSE endpoint
curl -N http://localhost:8080/sse

# Send tool requests via HTTP POST
curl -X POST http://localhost:8080/tool \
  -H "Content-Type: application/json" \
  -d '{"tool": "get_image_info", "arguments": {...}}'
```

## Port Configuration

```yaml
environment:
  - PORT=8080  # Change default port
```

## Security Considerations

- **Read-Only**: Server only reads registry data, cannot push/modify
- **Authentication**: Use Docker config for private registries
- **Network**: Bind to localhost for local access only
- **Credentials**: Mount config.json as read-only

## Related Flakes

- **k8s-mcp-server** - Kubernetes container management
- **filesystem** - Local file operations
- **git** - Source code for Dockerfiles

## Tips

- Use digests for immutable references
- Check architectures for multi-platform deployments
- Inspect layers to understand image size
- List tags to find available versions
- Use authenticated access for private registries

## See Also

- [OCI Registry MCP Documentation](https://github.com/StacklokLabs/ocireg-mcp)
- [OCI Distribution Spec](https://github.com/opencontainers/distribution-spec)
- [ATTRIBUTION.md](./ATTRIBUTION.md) for licensing details
