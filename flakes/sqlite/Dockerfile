ARG UPSTREAM_REPO=https://github.com/modelcontextprotocol/servers-archived
ARG UPSTREAM_COMMIT=9be4674

FROM python:3.12-slim-bookworm AS source

ARG UPSTREAM_REPO
ARG UPSTREAM_COMMIT

RUN apt-get update && apt-get install -y git && \
    git clone ${UPSTREAM_REPO} /repo && \
    cd /repo && \
    git checkout ${UPSTREAM_COMMIT} && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

WORKDIR /app

# Copy source code from upstream
COPY --from=source /repo/src/sqlite /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Install dependencies and project using uv sync
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev --no-editable

FROM python:3.12-slim-bookworm

WORKDIR /app

COPY --from=builder /root/.local /root/.local
COPY --from=builder /app/.venv /app/.venv

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

ENTRYPOINT ["mcp-server-sqlite"]
