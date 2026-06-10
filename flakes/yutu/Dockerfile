# MCP Yutu Server Flake
# Built from: github.com/eat-pray-ai/yutu @ e2d232c0a2b645bb96da70d167d572c01f24c85b

# Builder stage
FROM golang:1.23-bookworm AS builder

LABEL org.opencontainers.image.source="https://github.com/eat-pray-ai/yutu"
LABEL org.opencontainers.image.authors="eat-pray-ai"
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL ai.mcp.flake.upstream.repo="https://github.com/eat-pray-ai/yutu"
LABEL ai.mcp.flake.upstream.commit="e2d232c0a2b645bb96da70d167d572c01f24c85b"

# Install git and ca-certificates
RUN apt-get update && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Clone and checkout pinned commit
RUN git clone https://github.com/eat-pray-ai/yutu.git . && \
    git checkout e2d232c0a2b645bb96da70d167d572c01f24c85b

# Build the binary with GOTOOLCHAIN auto to download newer Go if needed
ENV GOTOOLCHAIN=auto
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o yutu .

# Runtime stage
FROM alpine:latest

WORKDIR /app

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Copy the binary from builder
COPY --from=builder /build/yutu /app/yutu

# Create config directory
RUN mkdir -p /root/.config/yutu

ENV YUTU_CONFIG_DIR=/root/.config/yutu

ENTRYPOINT ["/app/yutu", "mcp"]
