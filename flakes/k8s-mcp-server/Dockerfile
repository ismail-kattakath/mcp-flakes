# MCP K8s Server Flake
# Built from: github.com/alexei-led/k8s-mcp-server @ 1794ac932b5ff75c60a6d9c117ee57a81b95678a

# Use the official k8s-mcp-server image as base
FROM ghcr.io/alexei-led/k8s-mcp-server:latest

LABEL org.opencontainers.image.title="k8s-mcp-server" \
      org.opencontainers.image.description="Kubernetes MCP Server for kubectl, helm, istioctl, and argocd CLI operations" \
      org.opencontainers.image.source="https://github.com/alexei-led/k8s-mcp-server" \
      org.opencontainers.image.revision="1794ac932b5ff75c60a6d9c117ee57a81b95678a" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.authors="Alexei Ledenev" \
      org.opencontainers.image.vendor="mcp-flakes"

# The upstream image already has everything we need
# It includes kubectl, helm, istioctl, argocd, and the MCP server
# Runs as non-root user with security best practices
