ARG UPSTREAM_REPO=https://github.com/avisangle/jenkins-mcp-server
ARG UPSTREAM_COMMIT=c83c9f77c5f8c30c08061beb67d5d9107f290c5b

FROM python:3.12-slim AS source

ARG UPSTREAM_REPO
ARG UPSTREAM_COMMIT

RUN apt-get update && apt-get install -y git && \
    git clone ${UPSTREAM_REPO} /repo && \
    cd /repo && \
    git checkout ${UPSTREAM_COMMIT} && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

FROM python:3.12-slim AS builder

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

COPY --from=source /repo /app

WORKDIR /app

RUN uv sync --no-dev

FROM python:3.12-slim AS release

# OCI labels for attribution and compliance
LABEL org.opencontainers.image.title="MCP Jenkins Server"
LABEL org.opencontainers.image.description="MCP server for Jenkins CI/CD management"
LABEL org.opencontainers.image.source="https://github.com/avisangle/jenkins-mcp-server"
LABEL org.opencontainers.image.revision="c83c9f77c5f8c30c08061beb67d5d9107f290c5b"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="Avinash Sangle"
LABEL org.opencontainers.image.documentation="https://github.com/avisangle/jenkins-mcp-server"

COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app /app

ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app

ENTRYPOINT ["python", "-m", "mcp_jenkins_server"]
