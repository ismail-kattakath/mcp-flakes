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

# Set working directory to workers-bindings app
WORKDIR /repo/apps/workers-bindings

# Expose port for wrangler dev (default 8787)
EXPOSE 8787

# Set entrypoint to run wrangler dev server
# This runs the Cloudflare Worker locally using Wrangler
ENTRYPOINT ["pnpm", "run", "dev", "--", "--port", "8787", "--ip", "0.0.0.0"]
