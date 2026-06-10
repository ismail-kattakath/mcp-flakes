# MCP Brave Search Server Flake
# Built from: github.com/brave/brave-search-mcp-server @ d915fade87c28d09c0338dd7a5d05d2dc41104c1

FROM node:20-bookworm-slim AS builder

# Install git and ca-certificates for cloning
RUN apt-get update && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/brave/brave-search-mcp-server.git . && \
    git checkout d915fade87c28d09c0338dd7a5d05d2dc41104c1

# Install dependencies and build
RUN npm ci && \
    npm run build

# Final runtime image
FROM node:20-bookworm-slim

# OCI labels for attribution and compliance
LABEL org.opencontainers.image.title="MCP Brave Search Server"
LABEL org.opencontainers.image.description="MCP server for Brave Search API with web, local, image, video, news search"
LABEL org.opencontainers.image.source="https://github.com/brave/brave-search-mcp-server"
LABEL org.opencontainers.image.revision="d915fade87c28d09c0338dd7a5d05d2dc41104c1"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="Brave Software, Inc."
LABEL org.opencontainers.image.documentation="https://github.com/brave/brave-search-mcp-server"

WORKDIR /app

# Copy built application
COPY --from=builder /repo/package*.json ./
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/dist ./dist

# Set entrypoint
ENTRYPOINT ["node", "dist/index.js"]
