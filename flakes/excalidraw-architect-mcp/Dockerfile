FROM python@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203

LABEL org.opencontainers.image.source="https://github.com/BV-Venky/excalidraw-architect-mcp"
LABEL org.opencontainers.image.authors="Bhukya Venkatesh"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/BV-Venky/excalidraw-architect-mcp"
LABEL ai.mcp.flake.upstream.commit="74742702b5f4ad8ca54b9c7141e40429974b9299"

# Install uv for faster package installation
RUN pip install --no-cache-dir uv

# Install the excalidraw-architect-mcp package from PyPI
# Including the PNG export support (with cairosvg)
RUN uv pip install --system "excalidraw-architect-mcp[png]==1.0.3"

# Set the entrypoint to run the server
ENTRYPOINT ["excalidraw-architect-mcp"]
