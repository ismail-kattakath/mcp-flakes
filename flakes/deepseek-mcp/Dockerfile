# MCP DeepSeek Server Flake
# Published npm package pattern - no build from source needed
# Package: @arikusi/deepseek-mcp-server@1.7.0

# Use pinned node runner
FROM node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df

LABEL org.opencontainers.image.source="https://github.com/arikusi/deepseek-mcp-server"
LABEL org.opencontainers.image.authors="arikusi"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/arikusi/deepseek-mcp-server"
LABEL ai.mcp.flake.upstream.commit="5e1302171e9941bacc2ec2f83fe313c914614328"

# Install the published package globally
RUN npm install -g @arikusi/deepseek-mcp-server@1.7.0

WORKDIR /app

# Set entrypoint to npx with the package
ENTRYPOINT ["npx", "-y", "@arikusi/deepseek-mcp-server"]
