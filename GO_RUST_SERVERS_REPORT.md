# Go and Rust MCP Servers Implementation Report

Date: 2026-06-09

## Summary

Successfully identified, containerized, and tested **3 MCP servers** built in Go and Rust from the awesome-mcp-servers repository. All servers build successfully and speak MCP protocol.

## Servers Implemented

### 1. Yutu - YouTube Automation (Go)

**Repository**: https://github.com/eat-pray-ai/yutu
**Commit**: e2d232c0a2b645bb96da70d167d572c01f24c85b
**License**: Apache-2.0
**Language**: Go 1.26.0 (with GOTOOLCHAIN=auto)

**Use Case**: AI-powered YouTube automation - video uploads, metadata optimization, comment management, analytics, playlists, and channel operations.

**Build Details**:
- Builder: golang:1.23-bookworm with GOTOOLCHAIN=auto
- Runtime: alpine:latest
- Binary Size: 39.2 MB (static binary, CGO disabled)
- Transport: stdio (default) or HTTP with SSE

**Features**:
- YouTube Data API v3 integration
- Video upload and management
- Comment and playlist operations
- Channel information and branding
- Analytics and reporting APIs
- OAuth 2.0 authentication via Google Cloud

**Challenges**:
- Required Go 1.26.0 (future version) - solved with GOTOOLCHAIN=auto
- Entrypoint needed correction (removed --stdio flag)

---

### 2. Unbrowser - Lightweight Browser (Rust)

**Repository**: https://github.com/protostatis/unbrowser
**Commit**: 3936108c5f3762a12be3576cd65e4b1f899aaaae
**License**: Apache-2.0
**Language**: Rust edition 2024

**Use Case**: Lightweight browser automation for LLM agents - JavaScript execution, form filling, cookie management, without Chrome dependency.

**Build Details**:
- Builder: rustlang/rust:nightly-bookworm (required for edition2024)
- Runtime: debian:bookworm-slim
- Binary Size: 119 MB (includes dependencies)
- Transport: stdio or MCP mode (--mcp flag)

**Features**:
- JavaScript execution (QuickJS engine)
- Form automation and submission
- Link following and navigation
- Cookie and session management
- BlockMaps for token-efficient page representation
- No Chrome/Chromium dependency
- Stateful browser profiles

**Challenges**:
- Required Rust nightly for edition2024 support
- Needed cmake, g++, libclang-dev, llvm-dev for boring-sys2 (BoringSSL bindings)
- Complex build dependencies due to crypto libraries

---

### 3. OCI Registry MCP Server (Go)

**Repository**: https://github.com/StacklokLabs/ocireg-mcp
**Commit**: 095e395f13870329f0d106f6a422adb386b44d0e
**License**: Apache-2.0
**Language**: Go 1.25.7 (with GOTOOLCHAIN=auto)

**Use Case**: Query and inspect OCI container registries (Docker Hub, GHCR, GCR, etc.) for image information, tags, manifests, and configurations.

**Build Details**:
- Builder: golang:1.23-bookworm with GOTOOLCHAIN=auto
- Runtime: alpine:latest
- Binary Size: 18.1 MB (static binary, CGO disabled)
- Transport: SSE (Server-Sent Events) or Streamable HTTP

**Features**:
- Image information (digest, size, architecture, OS, layers)
- Repository tag listing
- Image manifest retrieval
- Image configuration inspection
- Docker config.json authentication support
- Works with any OCI-compliant registry

**Challenges**:
- Build path was ./cmd/server not ./cmd/ocireg-mcp
- Required GOTOOLCHAIN=auto for Go 1.25.7

---

## Build Patterns Discovered

### Go Pattern

**Multi-stage build**:
```dockerfile
FROM golang:1.23-bookworm AS builder
# Install git, ca-certificates
# Clone repo and checkout SHA
ENV GOTOOLCHAIN=auto
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o binary .

FROM alpine:latest
# Install ca-certificates
# Copy binary
ENTRYPOINT ["/app/binary"]
```

**Key learnings**:
- Modern Go servers require Go 1.24+ (future versions)
- GOTOOLCHAIN=auto automatically downloads newer Go versions
- CGO_ENABLED=0 produces static binaries perfect for Alpine
- Result: 18-40MB containers with single binary

### Rust Pattern

**Multi-stage build**:
```dockerfile
FROM rustlang/rust:nightly-bookworm AS builder
# Install cmake, g++, libclang-dev, llvm-dev, pkg-config, libssl-dev
# Clone repo and checkout SHA
RUN cargo build --release && strip target/release/binary

FROM debian:bookworm-slim
# Install ca-certificates, libssl3
# Copy binary
ENTRYPOINT ["/app/binary"]
```

**Key learnings**:
- Rust edition 2024 requires nightly compiler
- Many Rust projects use boring-sys (BoringSSL) requiring cmake + clang
- Stripping binaries reduces size significantly
- Runtime often needs libssl3 for HTTPS
- Result: 100-150MB containers (larger due to crypto libs)

---

## Size Comparison

| Server | Language | Builder Image | Runtime Image | Final Size |
|--------|----------|---------------|---------------|------------|
| yutu | Go | golang:1.23 | alpine:latest | 39.2 MB |
| ocireg-mcp | Go | golang:1.23 | alpine:latest | 18.1 MB |
| unbrowser | Rust | rust:nightly | debian:slim | 119 MB |

**Go advantages**:
- Smaller final images (18-40MB)
- Static binaries (no runtime deps)
- Faster builds
- Alpine runtime works well

**Rust advantages**:
- Memory safety guarantees
- Superior performance for CPU-intensive tasks
- Zero-cost abstractions
- But: larger images, longer builds, more build deps

---

## Testing Results

All three servers successfully:
1. ✅ Build without errors
2. ✅ Produce working binaries
3. ✅ Respond to --help/--version flags
4. ✅ Support MCP protocol
5. ✅ Run in containers

---

## Files Created

For each server:
- `flake.yaml` - Metadata and configuration
- `Dockerfile` - Multi-stage build with pinned commits
- `compose.yaml` - Docker Compose orchestration
- `README.md` - Usage documentation
- `ATTRIBUTION.md` - License compliance and credits

---

## Rejected Candidates

**anyquery** (https://github.com/julien040/anyquery):
- Reason: Compilation errors with SQLite virtual table bindings
- Issue: `undefined: sqlite3.VTab` and related symbols
- This appears to be a custom fork of go-sqlite3 causing compatibility issues
- Too complex for initial implementation

---

## Recommendations

1. **Go servers** are easier to containerize:
   - Fewer build dependencies
   - Static binaries
   - Smaller images
   - Faster builds

2. **Rust servers** require more care:
   - May need nightly compiler
   - Often require cmake, llvm, clang for crypto
   - Larger images due to shared libraries
   - But deliver excellent performance

3. **Version handling**:
   - Both ecosystems moving fast
   - GOTOOLCHAIN=auto is essential for Go
   - Rust edition 2024 needs nightly currently

4. **Build time**:
   - Go: 10-20 seconds
   - Rust: 50-120 seconds (more dependencies)

---

## Next Steps

Potential additions:
- More Go servers from K8s ecosystem (many available)
- More Rust servers (terraform-mcp, browser-use-rs)
- Investigate anyquery fix (needs sqlite3 fork understanding)
- Add health checks to compose files
- Create bundle for all Go/Rust servers

