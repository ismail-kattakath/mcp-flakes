FROM python:3.12-slim@sha256:090ba77e2958f6af52a5341f788b50b032dd4ca28377d2893dcf1ecbdfdfe203

RUN apt-get update && apt-get install -y git ca-certificates && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir uv

WORKDIR /repo

RUN git clone --depth=1 https://github.com/raveenb/fal-mcp-server . && \
    git fetch --depth=1 origin 398fe93e6e8ad271e4f180ee60d70567a6717c84 && \
    git checkout 398fe93e6e8ad271e4f180ee60d70567a6717c84

RUN uv pip install --system .

WORKDIR /app

ENTRYPOINT ["fal-mcp"]
