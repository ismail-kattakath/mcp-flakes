# MCP Anyquery Server Flake
# Built from: github.com/julien040/anyquery @ 66d5e684cd0a1a4086758aadaf3b22aee4e6e498

# Builder stage
FROM golang:1.23-bookworm AS builder

LABEL org.opencontainers.image.source="https://github.com/julien040/anyquery"
LABEL org.opencontainers.image.authors="Julien Riou"
LABEL org.opencontainers.image.licenses="MIT"
LABEL ai.mcp.flake.upstream.repo="https://github.com/julien040/anyquery"
LABEL ai.mcp.flake.upstream.commit="66d5e684cd0a1a4086758aadaf3b22aee4e6e498"

# Install git and ca-certificates
RUN apt-get update && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Clone and checkout pinned commit
RUN git clone https://github.com/julien040/anyquery.git . && \
    git checkout 66d5e684cd0a1a4086758aadaf3b22aee4e6e498

# Build the binary with GOTOOLCHAIN auto to download newer Go if needed
ENV GOTOOLCHAIN=auto
RUN CGO_ENABLED=1 go build -ldflags="-s -w" -o anyquery .

# Runtime stage
FROM debian:bookworm-slim

WORKDIR /app

# Install ca-certificates for HTTPS and sqlite dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates libsqlite3-0 && \
    rm -rf /var/lib/apt/lists/*

# Copy the binary from builder
COPY --from=builder /build/anyquery /app/anyquery

# Create config directory
RUN mkdir -p /root/.config/anyquery

ENV ANYQUERY_CONFIG_DIR=/root/.config/anyquery

ENTRYPOINT ["/app/anyquery", "mcp", "--stdio"]
