FROM node:23.10.0-slim@sha256:9eb93430e7a87123e1e0d0e95edc8f1e3e7f96f3ad97828c6d2a4c6e6f9e1f2a

RUN npm install -g pixel-surgeon-mcp@1.1.1

WORKDIR /app

ENTRYPOINT ["npx", "pixel-surgeon-mcp"]
