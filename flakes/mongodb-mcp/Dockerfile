FROM oven/bun:1 as builder

WORKDIR /app

# Clone the repository
RUN apt-get update && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/kiliczsh/mcp-mongo-server.git /app

# Install dependencies and build
RUN bun install
RUN bun run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy built artifacts and dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Set Node to production mode
ENV NODE_ENV=production

# Run the server
ENTRYPOINT ["node", "build/index.js"]
