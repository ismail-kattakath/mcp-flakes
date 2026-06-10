# MCP Market Data Server Flake
# Built from: github.com/ShipItAndPray/mcp-market-data @ f49a989304c8f5b2bfde6fb6254d50007d82832d
# Pure JavaScript - No build step required

FROM node@sha256:6710aea4dbb47f7d74f6b604b5e9e86ef39627121be69407b2c3552605f2033d AS builder

# Install git for cloning
RUN apt-get update && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/ShipItAndPray/mcp-market-data.git . && \
    git checkout f49a989304c8f5b2bfde6fb6254d50007d82832d

# No npm install needed - zero dependencies!

# Final stage
FROM node@sha256:6710aea4dbb47f7d74f6b604b5e9e86ef39627121be69407b2c3552605f2033d

WORKDIR /app

# Copy the entire repo (it's just index.js)
COPY --from=builder /repo /app

ENTRYPOINT ["node", "index.js"]
