# MCP Unbrowser Server Flake
# Built from: github.com/protostatis/unbrowser @ 3936108c5f3762a12be3576cd65e4b1f899aaaae

# Builder stage - using nightly for edition2024 support
FROM rustlang/rust:nightly-bookworm AS builder

LABEL org.opencontainers.image.source="https://github.com/protostatis/unbrowser"
LABEL org.opencontainers.image.authors="Unchained/protostatis"
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL ai.mcp.flake.upstream.repo="https://github.com/protostatis/unbrowser"
LABEL ai.mcp.flake.upstream.commit="3936108c5f3762a12be3576cd65e4b1f899aaaae"

# Install git, ca-certificates, and build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        ca-certificates \
        pkg-config \
        libssl-dev \
        cmake \
        g++ \
        libclang-dev \
        llvm-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Clone and checkout pinned commit
RUN git clone https://github.com/protostatis/unbrowser.git . && \
    git checkout 3936108c5f3762a12be3576cd65e4b1f899aaaae

# Build the release binary
RUN cargo build --release && \
    strip target/release/unbrowser

# Runtime stage
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        libssl3 && \
    rm -rf /var/lib/apt/lists/*

# Copy the binary from builder
COPY --from=builder /build/target/release/unbrowser /app/unbrowser

# Create profile directory for browser state
RUN mkdir -p /root/.unbrowser/profiles

ENV UNBROWSER_PROFILE=/root/.unbrowser/profiles/default

ENTRYPOINT ["/app/unbrowser", "--mcp"]
