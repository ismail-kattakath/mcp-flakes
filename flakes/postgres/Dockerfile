ARG UPSTREAM_REPO=https://github.com/modelcontextprotocol/servers-archived
ARG UPSTREAM_COMMIT=9be4674

FROM node:22.12-alpine AS source

ARG UPSTREAM_REPO
ARG UPSTREAM_COMMIT

RUN apk add --no-cache git && \
    git clone ${UPSTREAM_REPO} /repo && \
    cd /repo && \
    git checkout ${UPSTREAM_COMMIT}

FROM node:22.12-alpine AS builder

COPY --from=source /repo/src/postgres /app
COPY --from=source /repo/tsconfig.json /tsconfig.json

WORKDIR /app

RUN --mount=type=cache,target=/root/.npm npm install && \
    npm run build

FROM node:22-alpine AS release

LABEL org.opencontainers.image.title="mcp-server-postgres" \
      org.opencontainers.image.description="PostgreSQL MCP Server - read-only database access with schema inspection" \
      org.opencontainers.image.source="https://github.com/modelcontextprotocol/servers-archived" \
      org.opencontainers.image.revision="9be4674" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.authors="Anthropic, PBC" \
      org.opencontainers.image.vendor="mcp-flakes"

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

ENV NODE_ENV=production

WORKDIR /app

RUN npm ci --ignore-scripts --omit-dev

ENTRYPOINT ["node", "dist/index.js"]
