FROM python@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203

LABEL org.opencontainers.image.source="https://github.com/jaspertvdm/mcp-server-ollama-bridge"
LABEL org.opencontainers.image.authors="Jasper van de Meent"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/jaspertvdm/mcp-server-ollama-bridge"
LABEL ai.mcp.flake.upstream.commit="ff7132bb618c5fe2a78c747d61a2429e2f3d4c1f"

# Install uv for faster package installation
RUN pip install --no-cache-dir uv

# Install the mcp-server-ollama-bridge package from PyPI
RUN uv pip install --system mcp-server-ollama-bridge

# Set the entrypoint to run the server
ENTRYPOINT ["mcp-server-ollama-bridge"]
