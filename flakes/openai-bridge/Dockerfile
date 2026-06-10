FROM python@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203

LABEL org.opencontainers.image.source="https://github.com/jaspertvdm/mcp-server-openai-bridge"
LABEL org.opencontainers.image.authors="Jasper van de Meent"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/jaspertvdm/mcp-server-openai-bridge"
LABEL ai.mcp.flake.upstream.commit="bc2b0dbae26c5f7ddf8dfbea79aa2f34725fd4f8"

# Install uv for faster package installation
RUN pip install --no-cache-dir uv

# Install the mcp-server-openai-bridge package from PyPI
RUN uv pip install --system mcp-server-openai-bridge

# Set the entrypoint to run the server
ENTRYPOINT ["mcp-server-openai-bridge"]
