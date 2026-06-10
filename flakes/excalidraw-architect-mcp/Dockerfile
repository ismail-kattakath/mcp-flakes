FROM python@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203

# Install uv for faster package installation
RUN pip install --no-cache-dir uv

# Install the excalidraw-architect-mcp package from PyPI
# Including the PNG export support (with cairosvg)
RUN uv pip install --system "excalidraw-architect-mcp[png]==1.0.3"

# Set the entrypoint to run the server
ENTRYPOINT ["excalidraw-architect-mcp"]
