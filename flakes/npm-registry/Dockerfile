ARG UPSTREAM_REPO=https://github.com/mikusnuz/npm-mcp
ARG UPSTREAM_COMMIT=6c32032b320128283f3b2c2716242484084215cf

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

RUN --mount=type=cache,target=/root/.npm npm ci && \
    npm run build

FROM node:22.12-alpine AS release

# OCI labels for attribution and compliance
LABEL org.opencontainers.image.title="MCP npm Registry Server"
LABEL org.opencontainers.image.description="MCP server for npm package management"
LABEL org.opencontainers.image.source="https://github.com/mikusnuz/npm-mcp"
LABEL org.opencontainers.image.revision="6c32032b320128283f3b2c2716242484084215cf"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="mikusnuz"
LABEL org.opencontainers.image.documentation="https://github.com/mikusnuz/npm-mcp"

# Install npm CLI for registry operations
RUN npm install -g npm@latest

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

ENV NODE_ENV=production

WORKDIR /app

RUN npm ci --ignore-scripts --omit=dev

ENTRYPOINT ["node", "dist/index.js"]
