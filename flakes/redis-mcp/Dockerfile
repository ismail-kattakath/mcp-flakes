FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install uv for fast Python package management
RUN pip install --no-cache-dir uv

# Clone the repository
RUN git clone https://github.com/redis/mcp-redis.git /app

# Install dependencies using uv
RUN uv pip install --system -e .

# Set Python to unbuffered mode for better logging
ENV PYTHONUNBUFFERED=1

# Run the server
ENTRYPOINT ["python", "-m", "src.main"]
CMD ["--help"]
