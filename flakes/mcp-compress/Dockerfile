# MCP Compress Server Flake
# Built from: github.com/ShipItAndPray/mcp-compress @ 610408e55d912466aaa5b442a51f2b31cae3c6fe
# Pure JavaScript - No build step required

FROM node@sha256:6710aea4dbb47f7d74f6b604b5e9e86ef39627121be69407b2c3552605f2033d AS builder

# Install git for cloning
RUN apt-get update && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /repo

# Clone and checkout pinned commit
RUN git clone https://github.com/ShipItAndPray/mcp-compress.git . && \
    git checkout 610408e55d912466aaa5b442a51f2b31cae3c6fe

# No npm install needed - zero dependencies!

# Final stage
FROM node@sha256:6710aea4dbb47f7d74f6b604b5e9e86ef39627121be69407b2c3552605f2033d

WORKDIR /app

# Copy the entire repo (it's just index.js)
COPY --from=builder /repo /app

ENTRYPOINT ["node", "index.js"]
