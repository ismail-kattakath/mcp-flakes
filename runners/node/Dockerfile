# Node Runner - Debian-slim base for MCP servers
# Pinned by digest for reproducibility
FROM node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df

# Install git for cloning repos during build
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Default entrypoint - will be overridden by specific flakes
CMD ["node"]
