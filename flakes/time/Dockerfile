# MCP Time Server Flake
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

# Set working directory to the time subpackage
WORKDIR /repo/src/time

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Install the project's dependencies using the lockfile
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-editable

# Final stage
FROM python:3.12-slim-bookworm

WORKDIR /repo/src/time

# Copy the virtual environment from builder
COPY --from=builder /repo/src/time/.venv /repo/src/time/.venv
COPY --from=builder /repo/src/time /repo/src/time

# Place executables in the environment at the front of the path
ENV PATH="/repo/src/time/.venv/bin:$PATH"

# Set the LOCAL_TIMEZONE environment variable
ENV LOCAL_TIMEZONE=${LOCAL_TIMEZONE:-UTC}

ENTRYPOINT ["mcp-server-time", "--local-timezone", "${LOCAL_TIMEZONE}"]
