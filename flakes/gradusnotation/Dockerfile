FROM node:23.10.0-slim@sha256:0cce5a6fe140f9b0704f2dbceafb85910a12fc0c17d58112a16195911ea13ebc

RUN npm install -g @gradusmusic/notation-mcp@0.2.5

WORKDIR /app

ENTRYPOINT ["npx", "-y", "@gradusmusic/notation-mcp"]
