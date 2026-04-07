# Stage 1: Node.js dependencies
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Stage 2: Runtime
FROM node:22-bookworm-slim AS runtime

# System dependencies: FFmpeg, Chromium, ImageMagick, Python, fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    chromium \
    imagemagick \
    python3 \
    python3-venv \
    fonts-noto \
    fonts-noto-cjk \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install uv (Python package manager)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Set Remotion/Puppeteer environment
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV REMOTION_CHROME_EXECUTABLE=/usr/bin/chromium
ENV REMOTION_CONCURRENCY=2

WORKDIR /app

# Copy Node.js dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy Python config and install dependencies
COPY pyproject.toml uv.lock* ./
RUN uv sync --no-dev 2>/dev/null || uv pip install -r pyproject.toml --system 2>/dev/null || true

# Copy application code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
