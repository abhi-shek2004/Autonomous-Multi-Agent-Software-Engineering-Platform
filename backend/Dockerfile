FROM python:3.12-slim as builder

WORKDIR /workspace

# Install system dependencies needed for compiling psycopg2 and other packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.12-slim

WORKDIR /workspace

# Copy global local site packages
COPY --from=builder /root/.local /root/.local
# Copy all backend codes into workspace
COPY . /workspace/backend

# Set up global Path parameters
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/workspace

# Install pg client libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8000 8001 8002 8003
