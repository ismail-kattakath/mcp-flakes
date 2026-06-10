# MCP Met Museum Server Flake
# Built from: github.com/mikechao/metmuseum-mcp @ 576b5441daa04cae33d4583c23c35074390c9e2f

# Use pinned node runner
FROM node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df

# OCI labels for attribution and compliance
LABEL org.opencontainers.image.title="MCP Met Museum Server"
LABEL org.opencontainers.image.description="MCP server for Metropolitan Museum of Art Collection API"
LABEL org.opencontainers.image.source="https://github.com/mikechao/metmuseum-mcp"
LABEL org.opencontainers.image.revision="576b5441daa04cae33d4583c23c35074390c9e2f"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="Mike Chao"
LABEL org.opencontainers.image.documentation="https://github.com/mikechao/metmuseum-mcp/tree/576b5441daa04cae33d4583c23c35074390c9e2f"

# Install git, ca-certificates, and enable corepack for pnpm
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    corepack enable && \
    corepack prepare pnpm@latest --activate

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/mikechao/metmuseum-mcp.git . && \
    git checkout 576b5441daa04cae33d4583c23c35074390c9e2f

# Install dependencies with pnpm
RUN pnpm install

# Build the server
RUN pnpm run build

# Set entrypoint
ENTRYPOINT ["node", "dist/index.js"]
