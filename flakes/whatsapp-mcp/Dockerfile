# WhatsApp MCP Server Flake
# Python PyPI package pattern
# Package: jina-whatsapp-mcp

FROM python@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203

# OCI labels for attribution
LABEL org.opencontainers.image.source="https://github.com/nakulben/whatsapp-mcp"
LABEL org.opencontainers.image.authors="Nakul Beniwal"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/nakulben/whatsapp-mcp"
LABEL ai.mcp.flake.upstream.commit="HEAD"
LABEL ai.mcp.flake.pattern="python-pypi"

# Install uv for faster Python package management
RUN pip install --no-cache-dir uv

# Install the package
RUN uv pip install --system jina-whatsapp-mcp

WORKDIR /app

# Set entrypoint
ENTRYPOINT ["python", "-m", "whatsapp_mcp"]
