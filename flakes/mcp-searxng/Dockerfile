# mcp-searxng MCP Server Flake
# Published npm package pattern
# Package: mcp-searxng@1.3.2

FROM node@sha256:7af03b14a13c8cdd38e45058fd957bf00a72bbe17feac43b1c15a689c029c732

# OCI labels for attribution
LABEL org.opencontainers.image.source="https://github.com/ihor-sokoliuk/mcp-searxng"
LABEL org.opencontainers.image.authors="Ihor Sokoliuk"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/ihor-sokoliuk/mcp-searxng"
LABEL ai.mcp.flake.upstream.commit="80bdaf054b8e6da6429eb7a49ca9eaeb973de0ee"
LABEL ai.mcp.flake.pattern="npm-package"

# Install published package globally
RUN npm install -g mcp-searxng@1.3.2

WORKDIR /app

# Set entrypoint
ENTRYPOINT ["npx", "-y", "mcp-searxng"]
