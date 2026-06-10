# MCP Fetch Server Flake
# Built from: github.com/modelcontextprotocol/servers @ 275175cda17ca9c49920ceed2bcf27e12e59f8b2

# Use a Python image with uv pre-installed
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

# Install git for cloning
RUN apt-get update && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone --depth=1 https://github.com/modelcontextprotocol/servers.git . && \
    git fetch --depth=1 origin 275175cda17ca9c49920ceed2bcf27e12e59f8b2 && \
    git checkout 275175cda17ca9c49920ceed2bcf27e12e59f8b2

# Set working directory to the fetch subpackage
WORKDIR /repo/src/fetch

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Install the project's dependencies using the lockfile
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-editable

# Final stage
FROM python:3.12-slim-bookworm

WORKDIR /app

# Copy uv's managed Python and the virtual environment
COPY --from=builder /root/.local /root/.local
COPY --from=builder /repo/src/fetch/.venv /app/.venv

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Run with python directly to avoid shebang path issues
ENTRYPOINT ["python", "-m", "mcp_server_fetch"]
