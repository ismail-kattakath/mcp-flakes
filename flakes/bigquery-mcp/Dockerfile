FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir uv

RUN git clone https://github.com/LucasHild/mcp-server-bigquery.git /app

RUN uv pip install --system -e .

ENV PYTHONUNBUFFERED=1

ENTRYPOINT ["python", "-m", "mcp_server_bigquery"]
