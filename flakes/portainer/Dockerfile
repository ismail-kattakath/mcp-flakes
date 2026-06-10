ARG UPSTREAM_REPO=https://github.com/portainer/portainer-mcp
ARG UPSTREAM_COMMIT=4bfeecb2eb45654f09b0945d5582fc329291a275

FROM python:3.12-slim AS source

ARG UPSTREAM_REPO
ARG UPSTREAM_COMMIT

RUN apt-get update && apt-get install -y git && \
    git clone ${UPSTREAM_REPO} /repo && \
    cd /repo && \
    git checkout ${UPSTREAM_COMMIT} && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

FROM python:3.12-slim AS builder

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

COPY --from=source /repo /app

WORKDIR /app

RUN uv sync --frozen --no-dev

FROM python:3.12-slim AS release

# OCI labels for attribution and compliance
LABEL org.opencontainers.image.title="MCP Portainer Server"
LABEL org.opencontainers.image.description="Official Portainer MCP server for container management"
LABEL org.opencontainers.image.source="https://github.com/portainer/portainer-mcp"
LABEL org.opencontainers.image.revision="4bfeecb2eb45654f09b0945d5582fc329291a275"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="Portainer.io"
LABEL org.opencontainers.image.documentation="https://github.com/portainer/portainer-mcp"
LABEL org.opencontainers.image.vendor="Portainer.io"

COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app /app

ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app

ENTRYPOINT ["python", "-m", "portainer_mcp.server"]
