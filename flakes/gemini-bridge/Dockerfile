FROM python@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203

LABEL org.opencontainers.image.source="https://github.com/jaspertvdm/mcp-server-gemini-bridge"
LABEL org.opencontainers.image.authors="Jasper van de Meent"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/jaspertvdm/mcp-server-gemini-bridge"
LABEL ai.mcp.flake.upstream.commit="7dd7440a3a98ec46d78ee3ccb19aba9385329602"

# Install uv for faster package installation
RUN pip install --no-cache-dir uv

# Install the mcp-server-gemini-bridge package from PyPI
RUN uv pip install --system mcp-server-gemini-bridge

# Set the entrypoint to run the server
ENTRYPOINT ["mcp-server-gemini-bridge"]
