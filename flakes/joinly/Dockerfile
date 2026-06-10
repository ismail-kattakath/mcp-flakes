# Joinly Meeting Platform MCP Server Flake
# Python PyPI package pattern
# Package: joinly==0.5.3

FROM python@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203

# OCI labels for attribution
LABEL org.opencontainers.image.source="https://github.com/joinly-ai/joinly"
LABEL org.opencontainers.image.authors="Joinly AI Team"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/joinly-ai/joinly"
LABEL ai.mcp.flake.upstream.commit="HEAD"
LABEL ai.mcp.flake.pattern="python-pypi"

# Install system dependencies for Playwright
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        chromium \
        libglib2.0-0 \
        libnss3 \
        libnspr4 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdrm2 \
        libxkbcommon0 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2 \
        libgbm1 \
        libpango-1.0-0 \
        libcairo2 \
        libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Install uv for faster Python package management
RUN pip install --no-cache-dir uv

# Install the package
RUN uv pip install --system joinly==0.5.3

# Install Playwright browsers
RUN playwright install chromium

WORKDIR /app

# Set entrypoint
ENTRYPOINT ["python", "-m", "joinly"]
