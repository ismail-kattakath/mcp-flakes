# MCP AWS ECS Server Flake
# Built from: github.com/awslabs/mcp @ a4c4c880293db24aac9f1480bd417ce9386dd779

# Use Python 3.12 slim
FROM python:3.12-slim

LABEL org.opencontainers.image.title="aws-ecs-mcp" \
      org.opencontainers.image.description="AWS ECS MCP Server for containerizing and deploying applications to Amazon ECS" \
      org.opencontainers.image.source="https://github.com/awslabs/mcp" \
      org.opencontainers.image.revision="a4c4c880293db24aac9f1480bd417ce9386dd779" \
      org.opencontainers.image.licenses="Apache-2.0" \
      org.opencontainers.image.authors="Amazon Web Services" \
      org.opencontainers.image.vendor="mcp-flakes"

# Install system dependencies including Docker CLI
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    curl \
    gnupg \
    lsb-release && \
    # Install Docker CLI
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    chmod a+r /etc/apt/keyrings/docker.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y --no-install-recommends docker-ce-cli && \
    rm -rf /var/lib/apt/lists/*

# Install uv for fast Python package management
RUN pip install --no-cache-dir uv

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/awslabs/mcp.git . && \
    git checkout a4c4c880293db24aac9f1480bd417ce9386dd779

# Install the ECS MCP server package
WORKDIR /repo/src/ecs-mcp-server
RUN pip install --no-cache-dir .

# Set working directory back to root
WORKDIR /

# Set entrypoint
ENTRYPOINT ["python", "-m", "awslabs.ecs_mcp_server.main"]
