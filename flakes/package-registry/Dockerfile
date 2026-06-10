ARG UPSTREAM_REPO=https://github.com/Artmann/package-registry-mcp
ARG UPSTREAM_COMMIT=89e60ef40f8c82856b637b0cfbcc417773dd4e03

FROM node:22.21-alpine AS source

ARG UPSTREAM_REPO
ARG UPSTREAM_COMMIT

RUN apk add --no-cache git && \
    git clone ${UPSTREAM_REPO} /repo && \
    cd /repo && \
    git checkout ${UPSTREAM_COMMIT}

FROM node:22.21-alpine AS builder

COPY --from=source /repo /app

WORKDIR /app

# Install dependencies using yarn and build with TypeScript
RUN corepack enable && \
    yarn install && \
    yarn tsc --outDir dist

FROM node:22.21-alpine AS release

# OCI labels for attribution and compliance
LABEL org.opencontainers.image.title="MCP Package Registry Server"
LABEL org.opencontainers.image.description="MCP server for multi-registry package search (npm, Cargo, PyPI, NuGet)"
LABEL org.opencontainers.image.source="https://github.com/Artmann/package-registry-mcp"
LABEL org.opencontainers.image.revision="89e60ef40f8c82856b637b0cfbcc417773dd4e03"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="Christoffer Artmann"
LABEL org.opencontainers.image.documentation="https://github.com/Artmann/package-registry-mcp"

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/yarn.lock /app/yarn.lock

ENV NODE_ENV=production

WORKDIR /app

RUN corepack enable && \
    yarn install --production

ENTRYPOINT ["node", "dist/index.js"]
