ARG UPSTREAM_REPO=https://github.com/domdomegg/airtable-mcp-server
ARG UPSTREAM_COMMIT=7e763ed

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
LABEL org.opencontainers.image.title="MCP Airtable Server"
LABEL org.opencontainers.image.description="Airtable database integration MCP server"
LABEL org.opencontainers.image.source="https://github.com/domdomegg/airtable-mcp-server"
LABEL org.opencontainers.image.revision="7e763ed"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="Adam Jones (domdomegg)"
LABEL org.opencontainers.image.documentation="https://github.com/domdomegg/airtable-mcp-server"

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

ENV NODE_ENV=production

WORKDIR /app

RUN npm ci --ignore-scripts --omit-dev

ENTRYPOINT ["node", "dist/index.js"]
