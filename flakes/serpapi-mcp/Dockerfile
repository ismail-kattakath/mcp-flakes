# MCP SerpAPI Server Flake
# Built from: github.com/serpapi/serpapi-mcp @ a18058bfa8c81e8f11b7254bc601a151f5e3e081

# Use uv image for building
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS builder

# Install git for cloning
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/serpapi/serpapi-mcp.git . && \
    git checkout a18058bfa8c81e8f11b7254bc601a151f5e3e081

# Enable bytecode compilation and copy mode
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

# Final runtime image
FROM python:3.13-slim-bookworm

# OCI labels for attribution and compliance
LABEL org.opencontainers.image.title="MCP SerpAPI Server"
LABEL org.opencontainers.image.description="MCP server for SerpAPI - multi-engine search (Google, Bing, Yahoo, DuckDuckGo, YouTube, eBay)"
LABEL org.opencontainers.image.source="https://github.com/serpapi/serpapi-mcp"
LABEL org.opencontainers.image.revision="a18058bfa8c81e8f11b7254bc601a151f5e3e081"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="SerpApi LLC"
LABEL org.opencontainers.image.documentation="https://github.com/serpapi/serpapi-mcp"

WORKDIR /app

# Copy the uv Python installation and virtual environment from builder
COPY --from=builder /root/.local /root/.local
COPY --from=builder /repo/.venv /app/.venv
COPY --from=builder /repo/src /app/src

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

# Set entrypoint
ENTRYPOINT ["python", "src/server.py"]
