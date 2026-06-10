FROM node:20-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/gannonh/firebase-mcp.git /app

RUN npm install && npm run build

ENV NODE_ENV=production

ENTRYPOINT ["node", "dist/index.js"]
