ARG UPSTREAM_REPO=https://github.com/n24q02m/better-notion-mcp
ARG UPSTREAM_COMMIT=745c4c7

FROM node:22.12-alpine AS source

ARG UPSTREAM_REPO
ARG UPSTREAM_COMMIT

RUN apk add --no-cache git && \
    git clone ${UPSTREAM_REPO} /repo && \
    cd /repo && \
    git checkout ${UPSTREAM_COMMIT}

FROM node:22.12-alpine AS builder

COPY --from=source /repo /app

WORKDIR /app

RUN --mount=type=cache,target=/root/.npm npm install && \
    npm run build

FROM node:22.12-alpine AS release

# OCI labels for attribution and compliance
LABEL org.opencontainers.image.title="MCP Notion Server"
LABEL org.opencontainers.image.description="Markdown-first Notion MCP server with 9 composite tools"
LABEL org.opencontainers.image.source="https://github.com/n24q02m/better-notion-mcp"
LABEL org.opencontainers.image.revision="745c4c7"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="n24q02m"
LABEL org.opencontainers.image.documentation="https://github.com/n24q02m/better-notion-mcp"

COPY --from=builder /app/build /app/build
COPY --from=builder /app/bin /app/bin
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

ENV NODE_ENV=production

WORKDIR /app

RUN npm ci --ignore-scripts --omit-dev

ENTRYPOINT ["node", "build/src/init-server.js"]
