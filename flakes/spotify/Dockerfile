# MCP Spotify Server Flake
# Built from: github.com/gupta-kush/spotify-mcp @ 13a711cfe56e02b7e06b34da08c7238485cd539b

# Use Python 3.12 slim
FROM python:3.12-slim

LABEL org.opencontainers.image.title="spotify-mcp" \
      org.opencontainers.image.description="Control Spotify from Claude, Cursor, or any MCP client" \
      org.opencontainers.image.source="https://github.com/gupta-kush/spotify-mcp" \
      org.opencontainers.image.revision="13a711cfe56e02b7e06b34da08c7238485cd539b" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.authors="Kush Gupta" \
      org.opencontainers.image.vendor="mcp-flakes"

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install uv for fast Python package management
RUN pip install --no-cache-dir uv

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/gupta-kush/spotify-mcp.git . && \
    git checkout 13a711cfe56e02b7e06b34da08c7238485cd539b

# Install dependencies using uv
RUN uv pip install --system .

# Set entrypoint (use the installed CLI script)
ENTRYPOINT ["spotify-mcp"]
