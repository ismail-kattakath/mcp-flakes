FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir uv

RUN git clone https://github.com/Snowflake-Labs/mcp.git /app

RUN uv pip install --system -e .

ENV PYTHONUNBUFFERED=1

ENTRYPOINT ["python", "-m", "snowflake_labs_mcp"]
