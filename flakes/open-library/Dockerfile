# MCP Open Library Server Flake
# Built from: github.com/8enSmith/mcp-open-library @ 12bfb42d9d84c20a7759fa8caf10f96df746c7c4

# Use pinned node runner
FROM node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df

LABEL org.opencontainers.image.title="mcp-open-library" \
      org.opencontainers.image.description="MCP server for the Open Library" \
      org.opencontainers.image.source="https://github.com/8enSmith/mcp-open-library" \
      org.opencontainers.image.revision="12bfb42d9d84c20a7759fa8caf10f96df746c7c4" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.authors="Ben Smith" \
      org.opencontainers.image.vendor="mcp-flakes"

# Install git and ca-certificates
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/8enSmith/mcp-open-library.git . && \
    git checkout 12bfb42d9d84c20a7759fa8caf10f96df746c7c4

# Install dependencies
RUN npm install

# Build the server
RUN npm run build

# Set entrypoint
ENTRYPOINT ["node", "build/index.js"]
