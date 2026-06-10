# MCP CLIRank Server Flake
# Published npm package pattern
# Package: clirank-mcp-server

FROM node@sha256:10fc5f5f33cba34a4befa58fcf95f724e67707fab7c32fb8cd3fcf90ebcc20df

RUN npm install -g clirank-mcp-server

WORKDIR /app

ENTRYPOINT ["npx", "clirank-mcp-server"]
