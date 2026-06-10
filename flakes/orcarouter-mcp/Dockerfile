# MCP OrcaRouter Server Flake
# Published npm package pattern - no build from source needed
# Package: @orcarouter/mcp@1.1.5

# Use pinned node runner
FROM node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df

LABEL org.opencontainers.image.source="https://github.com/Continuum-AI-Corp/orcarouter-mcp-server"
LABEL org.opencontainers.image.authors="OrcaRouter / Continuum AI Corp"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/Continuum-AI-Corp/orcarouter-mcp-server"
LABEL ai.mcp.flake.upstream.commit="02084c34a5658e745986772d8a2a35da80aa3508"

# Install the published package globally
RUN npm install -g @orcarouter/mcp@1.1.5

WORKDIR /app

# Set entrypoint to npx with the package
ENTRYPOINT ["npx", "-y", "@orcarouter/mcp"]
