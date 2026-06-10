# MCP Sequential Thinking Server Flake
# Built from: github.com/modelcontextprotocol/servers @ 275175cda17ca9c49920ceed2bcf27e12e59f8b2

# Use pinned node runner
FROM node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df

LABEL org.opencontainers.image.title="mcp-server-sequential-thinking" \
      org.opencontainers.image.description="MCP server for sequential thinking and problem solving" \
      org.opencontainers.image.source="https://github.com/modelcontextprotocol/servers" \
      org.opencontainers.image.revision="275175cda17ca9c49920ceed2bcf27e12e59f8b2" \
      org.opencontainers.image.licenses="Apache-2.0 OR MIT" \
      org.opencontainers.image.authors="Model Context Protocol a Series of LF Projects, LLC." \
      org.opencontainers.image.vendor="mcp-flakes"

# Install git and ca-certificates
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone --depth=1 https://github.com/modelcontextprotocol/servers.git . && \
    git fetch --depth=1 origin 275175cda17ca9c49920ceed2bcf27e12e59f8b2 && \
    git checkout 275175cda17ca9c49920ceed2bcf27e12e59f8b2

# Install all dependencies (monorepo lockfile)
RUN npm ci

# Build the sequentialthinking server
RUN cd src/sequentialthinking && npm run build

# Set working directory to the built package
WORKDIR /repo/src/sequentialthinking

# Set entrypoint
ENTRYPOINT ["node", "dist/index.js"]
