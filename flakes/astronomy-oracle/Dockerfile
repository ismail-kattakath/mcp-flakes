# MCP Astronomy Oracle Server Flake
# Published npm package pattern
# Package: astronomy-oracle

FROM node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df

LABEL org.opencontainers.image.source="https://github.com/gregario/astronomy-oracle"
LABEL org.opencontainers.image.authors="gregario"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/gregario/astronomy-oracle"
LABEL ai.mcp.flake.upstream.commit="dd8ee5e155c1b04ef366cc1288a3f2e58715ad9b"

RUN npm install -g astronomy-oracle

WORKDIR /app

ENTRYPOINT ["npx", "astronomy-oracle"]
