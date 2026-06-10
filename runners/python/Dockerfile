# Python Runner - Debian-slim base for MCP servers
# Pinned by digest for reproducibility
FROM python@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203

# Install git and uv for fast dependency management
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    curl && \
    curl -LsSf https://astral.sh/uv/install.sh | sh && \
    rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.cargo/bin:$PATH"

WORKDIR /app

# Default entrypoint - will be overridden by specific flakes
CMD ["python"]
