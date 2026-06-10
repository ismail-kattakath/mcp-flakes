# MCP Tavily Search Server Flake
# Built from: github.com/Tomatio13/mcp-server-tavily @ 261215247293d6299b108f9f887eeddb5006ac97

# Use uv image for building
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

# Install git for cloning
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/Tomatio13/mcp-server-tavily.git . && \
    git checkout 261215247293d6299b108f9f887eeddb5006ac97

# Enable bytecode compilation and copy mode
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

# Final runtime image
FROM python:3.12-slim-bookworm

# OCI labels for attribution and compliance
LABEL org.opencontainers.image.title="MCP Tavily Search Server"
LABEL org.opencontainers.image.description="MCP server for Tavily AI search API with basic and advanced search modes"
LABEL org.opencontainers.image.source="https://github.com/Tomatio13/mcp-server-tavily"
LABEL org.opencontainers.image.revision="261215247293d6299b108f9f887eeddb5006ac97"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="Tomatio13"
LABEL org.opencontainers.image.documentation="https://github.com/Tomatio13/mcp-server-tavily"

WORKDIR /app

# Copy the uv Python installation and virtual environment from builder
COPY --from=builder /root/.local /root/.local
COPY --from=builder /repo/.venv /app/.venv

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Set entrypoint
ENTRYPOINT ["tavily-search"]
