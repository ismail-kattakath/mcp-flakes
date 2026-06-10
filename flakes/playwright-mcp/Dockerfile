# MCP Playwright Server Flake
# Built from: github.com/microsoft/playwright-mcp @ b301c372ec741289eff1cf6aab9d3bec553f31e2

FROM node:20-bookworm AS builder

# Install git for cloning
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/microsoft/playwright-mcp.git . && \
    git checkout b301c372ec741289eff1cf6aab9d3bec553f31e2

# Install dependencies
RUN npm ci

# Final runtime image with Playwright browsers
FROM mcr.microsoft.com/playwright:v1.48.0-jammy

# OCI labels for attribution and compliance
LABEL org.opencontainers.image.title="MCP Playwright Server"
LABEL org.opencontainers.image.description="Official Microsoft MCP server for browser automation using Playwright"
LABEL org.opencontainers.image.source="https://github.com/microsoft/playwright-mcp"
LABEL org.opencontainers.image.revision="b301c372ec741289eff1cf6aab9d3bec553f31e2"
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL org.opencontainers.image.authors="Microsoft Corporation"
LABEL org.opencontainers.image.documentation="https://github.com/microsoft/playwright-mcp"

WORKDIR /app

# Copy built application
COPY --from=builder /repo/package*.json ./
COPY --from=builder /repo/node_modules ./node_modules

# Install @playwright/mcp
RUN npm install -g @playwright/mcp@latest

# Set entrypoint
ENTRYPOINT ["npx", "@playwright/mcp@latest"]
