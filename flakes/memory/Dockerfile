# MCP Memory Server Flake
# Built from: github.com/modelcontextprotocol/servers @ 275175cda17ca9c49920ceed2bcf27e12e59f8b2

# Use pinned node runner
FROM node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df

# OCI labels for attribution and compliance
LABEL org.opencontainers.image.title="MCP Memory Server"
LABEL org.opencontainers.image.description="MCP server for knowledge graph memory operations"
LABEL org.opencontainers.image.source="https://github.com/modelcontextprotocol/servers"
LABEL org.opencontainers.image.revision="275175cda17ca9c49920ceed2bcf27e12e59f8b2"
LABEL org.opencontainers.image.licenses="Apache-2.0 OR MIT"
LABEL org.opencontainers.image.authors="Model Context Protocol a Series of LF Projects, LLC."
LABEL org.opencontainers.image.documentation="https://github.com/modelcontextprotocol/servers/tree/275175cda17ca9c49920ceed2bcf27e12e59f8b2/src/memory"

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

# Build the memory server
RUN cd src/memory && npm run build

# Set working directory to the built package
WORKDIR /repo/src/memory

# Set entrypoint
ENTRYPOINT ["node", "dist/index.js"]
