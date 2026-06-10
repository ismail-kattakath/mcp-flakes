# MCP A2A Search Server Flake
# Published npm package pattern - no build from source needed
# Package: a2asearch-mcp@1.1.6

# Use pinned node runner
FROM node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df

LABEL org.opencontainers.image.source="https://github.com/tadas-github/a2asearch-mcp"
LABEL org.opencontainers.image.authors="Tadas Stankevicius"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/tadas-github/a2asearch-mcp"
LABEL ai.mcp.flake.upstream.commit="c4feef919f42785380136e417d134dae42f5cd85"

# Install the published package globally
RUN npm install -g a2asearch-mcp@1.1.6

WORKDIR /app

# Set entrypoint to npx with the package
ENTRYPOINT ["npx", "-y", "a2asearch-mcp"]
