# MCP Exa Search Server Flake
# Built from: github.com/exa-labs/exa-mcp-server @ 9ea4ba3e67f87c462c3e06b192470e837ed9009e

FROM node:20-bookworm-slim AS builder

# Install git for cloning
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/exa-labs/exa-mcp-server.git . && \
    git checkout 9ea4ba3e67f87c462c3e06b192470e837ed9009e

# Install dependencies and build
RUN npm ci && \
    npm run build

# Final runtime image
FROM node:20-bookworm-slim

# OCI labels for attribution and compliance
LABEL org.opencontainers.image.title="MCP Exa Search Server"
LABEL org.opencontainers.image.description="MCP server for Exa AI semantic search, web crawling, and code search"
LABEL org.opencontainers.image.source="https://github.com/exa-labs/exa-mcp-server"
LABEL org.opencontainers.image.revision="9ea4ba3e67f87c462c3e06b192470e837ed9009e"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="Exa Labs, Inc."
LABEL org.opencontainers.image.documentation="https://docs.exa.ai/reference/exa-mcp"

WORKDIR /app

# Copy built application
COPY --from=builder /repo/package*.json ./
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/dist ./dist

EXPOSE 3000

# Set entrypoint
ENTRYPOINT ["node", "dist/index.js"]
