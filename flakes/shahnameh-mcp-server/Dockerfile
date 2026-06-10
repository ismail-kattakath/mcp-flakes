FROM python@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203

LABEL org.opencontainers.image.title="shahnameh-mcp-server" \
      org.opencontainers.image.description="MCP server for accessing the Shahnameh (Book of Kings) Persian epic poem" \
      org.opencontainers.image.source="https://github.com/aliafsahnoudeh/shahnameh-mcp-server" \
      org.opencontainers.image.revision="5d932ee2a812637ac82bf1fe7caffcbc6a5e921b" \
      org.opencontainers.image.licenses="NONE" \
      org.opencontainers.image.vendor="mcp-flakes" \
      org.opencontainers.image.documentation="WARNING: No license found in upstream repository"

# Install uv for faster dependency management
RUN pip install --no-cache-dir uv

# Set working directory
WORKDIR /app

# Clone the repository at the specified commit
RUN apt-get update && \
    apt-get install -y git && \
    git clone https://github.com/aliafsahnoudeh/shahnameh-mcp-server.git . && \
    git checkout 5d932ee2a812637ac82bf1fe7caffcbc6a5e921b && \
    apt-get remove -y git && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies using uv
RUN uv pip install --system -e .

# Set the entrypoint to run the main.py server
ENTRYPOINT ["python", "main.py"]
