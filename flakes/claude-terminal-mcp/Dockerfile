# MCP Claude Terminal Server Flake
# Built from: github.com/LukeLamb/claude-terminal-mcp @ 25ee5511264ef1c84a1e9bc596dd5104fe1be5e3
# Pure Node.js - No build step required

FROM node@sha256:6710aea4dbb47f7d74f6b604b5e9e86ef39627121be69407b2c3552605f2033d AS builder

# Install git for cloning
RUN apt-get update && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/LukeLamb/claude-terminal-mcp.git . && \
    git checkout 25ee5511264ef1c84a1e9bc596dd5104fe1be5e3

# No npm install needed - zero dependencies!

# Final stage
FROM node@sha256:6710aea4dbb47f7d74f6b604b5e9e86ef39627121be69407b2c3552605f2033d

WORKDIR /app

# Copy the entire repo (it's just server.js and a few small files)
COPY --from=builder /repo /app

ENTRYPOINT ["node", "server.js"]
