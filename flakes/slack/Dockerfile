ARG UPSTREAM_REPO=https://github.com/jtalk22/slack-mcp-server
ARG UPSTREAM_COMMIT=b57674e

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

RUN --mount=type=cache,target=/root/.npm npm install --production

FROM node:22.12-alpine AS release

# OCI labels for attribution and compliance
LABEL org.opencontainers.image.title="MCP Slack Server"
LABEL org.opencontainers.image.description="Session-based Slack MCP server with 21 tools"
LABEL org.opencontainers.image.source="https://github.com/jtalk22/slack-mcp-server"
LABEL org.opencontainers.image.revision="b57674e"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="jtalk22"
LABEL org.opencontainers.image.documentation="https://github.com/jtalk22/slack-mcp-server"

COPY --from=builder /app /app

ENV NODE_ENV=production

WORKDIR /app

ENTRYPOINT ["node", "src/server.js"]
