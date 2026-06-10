FROM python@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203

LABEL org.opencontainers.image.source="https://github.com/leonardoca1/aesthetics-wiki-mcp"
LABEL org.opencontainers.image.authors="Leonardo Cametti"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/leonardoca1/aesthetics-wiki-mcp"
LABEL ai.mcp.flake.upstream.commit="70dcd681ebbdfdfc8ce7b30347bb5708c48b1b41"

# Install uv for faster package installation
RUN pip install --no-cache-dir uv

# Install the aesthetics-wiki-mcp package from PyPI
RUN uv pip install --system aesthetics-wiki-mcp==0.2.0

# Set the entrypoint to run the server
ENTRYPOINT ["aesthetics-wiki-mcp"]
