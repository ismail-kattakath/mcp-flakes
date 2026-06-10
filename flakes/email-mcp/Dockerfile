# Email MCP Server Flake
# Published npm package pattern
# Package: @codefuturist/email-mcp@0.2.3

FROM node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df

# OCI labels for attribution
LABEL org.opencontainers.image.source="https://github.com/codefuturist/email-mcp"
LABEL org.opencontainers.image.authors="CodeFuturist"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/codefuturist/email-mcp"
LABEL ai.mcp.flake.upstream.commit="HEAD"
LABEL ai.mcp.flake.pattern="npm-package"

# Install published package globally
RUN npm install -g @codefuturist/email-mcp@0.2.3

WORKDIR /app

# Set entrypoint
ENTRYPOINT ["npx", "-y", "@codefuturist/email-mcp"]
