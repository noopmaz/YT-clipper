# ============================================================
# YT-Clipper — Production Dockerfile
# Multi-stage build for minimal image size
# ============================================================

# --- Stage 1: Dependencies ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile

# --- Stage 2: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Stage 3: Runtime ---
FROM node:20-alpine AS runner

# Install system dependencies: ffmpeg, python3, yt-dlp
RUN apk add --no-cache \
    ffmpeg \
    python3 \
    py3-pip \
    curl \
    && pip3 install --break-system-packages yt-dlp \
    && rm -rf /var/cache/apk/*

# Verify installations
RUN ffmpeg -version | head -1 \
    && yt-dlp --version

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV TEMP_DIR=/tmp/yt-clipper
ENV PORT=3000

# Create temp directory with correct permissions
RUN mkdir -p /tmp/yt-clipper && chmod 777 /tmp/yt-clipper

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built app
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
