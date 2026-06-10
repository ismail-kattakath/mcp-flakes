# MCP CLIRank Server Flake
# Published npm package pattern
# Package: clirank-mcp-server

FROM node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df

LABEL org.opencontainers.image.source="https://github.com/alexanderclapp/clirank-mcp-server"
LABEL org.opencontainers.image.authors="Alexander Clapp"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/alexanderclapp/clirank-mcp-server"
LABEL ai.mcp.flake.upstream.commit="6a73958d2a7d090dd5c8639baf0734c2f986ab1f"

RUN npm install -g clirank-mcp-server

WORKDIR /app

ENTRYPOINT ["npx", "clirank-mcp-server"]
