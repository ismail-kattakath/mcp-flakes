# MCP OCI Registry Server Flake
# Built from: github.com/StacklokLabs/ocireg-mcp @ 095e395f13870329f0d106f6a422adb386b44d0e

# Builder stage
FROM golang:1.23-bookworm AS builder

LABEL org.opencontainers.image.source="https://github.com/StacklokLabs/ocireg-mcp"
LABEL org.opencontainers.image.authors="Stacklok, Inc."
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL ai.mcp.flake.upstream.repo="https://github.com/StacklokLabs/ocireg-mcp"
LABEL ai.mcp.flake.upstream.commit="095e395f13870329f0d106f6a422adb386b44d0e"

# Install git and ca-certificates
RUN apt-get update && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Clone and checkout pinned commit
RUN git clone https://github.com/StacklokLabs/ocireg-mcp.git . && \
    git checkout 095e395f13870329f0d106f6a422adb386b44d0e

# Build the binary with GOTOOLCHAIN auto to download newer Go if needed
ENV GOTOOLCHAIN=auto
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o ocireg-mcp ./cmd/ocireg-mcp

# Runtime stage
FROM alpine:latest

WORKDIR /app

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Copy the binary from builder
COPY --from=builder /build/ocireg-mcp /app/ocireg-mcp

# Create config directory
RUN mkdir -p /root/.docker

ENV PORT=8080
ENV DOCKER_CONFIG=/root/.docker

EXPOSE 8080

ENTRYPOINT ["/app/ocireg-mcp"]
