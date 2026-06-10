# MCP Cloudflare Workers Bindings Server Flake
# Built from: github.com/cloudflare/mcp-server-cloudflare @ cb0186135e2f2c00d91b9ad2fcab54d630eeb911

# Use Node.js 20 slim
FROM node:20-slim

LABEL org.opencontainers.image.title="cloudflare-workers-mcp" \
      org.opencontainers.image.description="Cloudflare Workers Bindings MCP Server for managing KV, R2, D1, and Workers" \
      org.opencontainers.image.source="https://github.com/cloudflare/mcp-server-cloudflare" \
      org.opencontainers.image.revision="cb0186135e2f2c00d91b9ad2fcab54d630eeb911" \
      org.opencontainers.image.licenses="Apache-2.0" \
      org.opencontainers.image.authors="Cloudflare, Inc." \
      org.opencontainers.image.vendor="mcp-flakes"

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@10.8.0

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/cloudflare/mcp-server-cloudflare.git . && \
    git checkout cb0186135e2f2c00d91b9ad2fcab54d630eeb911

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Build the workers-bindings app
WORKDIR /repo/apps/workers-bindings
RUN pnpm run build

# Set entrypoint (the build output is in dist/)
ENTRYPOINT ["node", "dist/index.js"]
