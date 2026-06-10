ARG UPSTREAM_REPO=https://github.com/aashari/mcp-server-atlassian-bitbucket
ARG UPSTREAM_COMMIT=19b2b386c800c95cd7a7a44446f950ec661b0d91

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
LABEL org.opencontainers.image.title="MCP Bitbucket Server"
LABEL org.opencontainers.image.description="MCP server for Atlassian Bitbucket Cloud API"
LABEL org.opencontainers.image.source="https://github.com/aashari/mcp-server-atlassian-bitbucket"
LABEL org.opencontainers.image.revision="19b2b386c800c95cd7a7a44446f950ec661b0d91"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="Ahmad Asyhari"
LABEL org.opencontainers.image.documentation="https://github.com/aashari/mcp-server-atlassian-bitbucket"

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

ENV NODE_ENV=production

WORKDIR /app

RUN npm ci --ignore-scripts --omit=dev

ENTRYPOINT ["node", "dist/index.js"]
