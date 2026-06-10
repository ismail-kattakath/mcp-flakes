FROM node:23.10.0-slim@sha256:0cce5a6fe140f9b0704f2dbceafb85910a12fc0c17d58112a16195911ea13ebc

RUN npm install -g pixel-surgeon-mcp@1.1.1

WORKDIR /app

ENTRYPOINT ["npx", "pixel-surgeon-mcp"]
