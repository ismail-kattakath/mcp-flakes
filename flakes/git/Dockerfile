# MCP Git Server Flake
# Built from: github.com/modelcontextprotocol/servers @ 275175cda17ca9c49920ceed2bcf27e12e59f8b2

# Use uv image for building
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

# Install git for cloning
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/modelcontextprotocol/servers.git . && \
    git checkout 275175cda17ca9c49920ceed2bcf27e12e59f8b2

# Set working directory to git subpath
WORKDIR /repo/src/git

# Enable bytecode compilation and copy mode
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-editable

# Final runtime image
FROM python:3.12-slim-bookworm

# Install git and git-lfs
RUN apt-get update && \
    apt-get install -y --no-install-recommends git git-lfs && \
    rm -rf /var/lib/apt/lists/* && \
    git lfs install --system

WORKDIR /app

# Copy the virtual environment from builder
COPY --from=builder /repo/src/git/.venv /app/.venv

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Set entrypoint
ENTRYPOINT ["mcp-server-git"]
