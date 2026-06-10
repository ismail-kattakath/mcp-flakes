# Fast MCP Telegram Server Flake
# Python PyPI package pattern
# Package: fast-mcp-telegram==0.29.0

FROM python@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203

# OCI labels for attribution
LABEL org.opencontainers.image.source="https://github.com/leshchenko1979/fast-mcp-telegram"
LABEL org.opencontainers.image.authors="Alexey Leshchenko"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/leshchenko1979/fast-mcp-telegram"
LABEL ai.mcp.flake.upstream.commit="HEAD"
LABEL ai.mcp.flake.pattern="python-pypi"

# Install uv for faster Python package management
RUN pip install --no-cache-dir uv

# Install the package
RUN uv pip install --system fast-mcp-telegram==0.29.0

WORKDIR /app

# Set entrypoint
ENTRYPOINT ["python", "-m", "fast-mcp-telegram"]
