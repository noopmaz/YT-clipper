# 🎬 YT Clipper

> Split any YouTube video into perfectly-timed MP4 clips — instantly.

A production-ready web app powered by **yt-dlp** + **FFmpeg** + **Next.js 14**.

![YT Clipper](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![yt-dlp](https://img.shields.io/badge/yt--dlp-latest-red)
![FFmpeg](https://img.shields.io/badge/FFmpeg-6+-green)
![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)

---

## ✨ Features

- 🔗 Paste any YouTube URL (videos, Shorts, long videos)
- 🎞️ Choose quality: Best / 1080p / 720p / 480p / 360p
- ✂️ Choose clip length: 15s / 30s / 60s
- 📥 Download individual clips as MP4
- 👁️ Preview clips directly in browser
- 📊 Real-time progress bar
- 🗑️ Auto-cleanup after 30 minutes
- 🔒 Rate limiting & spam protection
- 🌑 Beautiful dark mode UI
- 📱 Fully responsive (mobile-first)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18
- **FFmpeg** installed and in PATH
- **yt-dlp** installed and in PATH

#### Install FFmpeg

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# Windows (via choco)
choco install ffmpeg
```

#### Install yt-dlp

```bash
# macOS/Linux
pip3 install yt-dlp
# or
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
chmod +x /usr/local/bin/yt-dlp

# Windows
pip install yt-dlp
# or download yt-dlp.exe from GitHub releases
```

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/yt-clipper.git
cd yt-clipper

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your settings

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker (Recommended for Production)

```bash
# Build and run with Docker Compose
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down
```

The Docker image includes **ffmpeg** and **yt-dlp** pre-installed.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Default | Description |
|---|---|---|
| `TEMP_DIR` | `/tmp/yt-clipper` | Temporary file storage |
| `FILE_TTL_MINUTES` | `30` | Auto-delete files after N minutes |
| `MAX_VIDEO_DURATION` | `1800` | Max video duration in seconds (30 min) |
| `MAX_STORAGE_BYTES` | `524288000` | Max total temp storage (500MB) |
| `RATE_LIMIT_RPM` | `10` | Max requests per IP per minute |
| `MAX_CONCURRENT_JOBS` | `3` | Max parallel processing jobs |
| `YTDLP_PATH` | `yt-dlp` | Custom path to yt-dlp binary |
| `FFMPEG_PATH` | `ffmpeg` | Custom path to FFmpeg binary |
| `YTDLP_PROXY` | _(empty)_ | Proxy for yt-dlp (e.g. socks5://host:port) |
| `YTDLP_COOKIES_PATH` | _(empty)_ | Path to cookies.txt for restricted videos |
| `LOG_LEVEL` | `info` | Logging level (debug/info/warn/error) |
| `JOB_SECRET` | _(required in prod)_ | Secret for job tokens |

---

## 📡 API Reference

### `POST /api/process`

Start a new clipping job.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "quality": "720p",
  "clipDuration": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": { "jobId": "uuid-here" }
}
```

---

### `GET /api/status/:jobId`

Poll job status.

**Response:**
```json
{
  "success": true,
  "data": {
    "job": {
      "jobId": "...",
      "status": "splitting",
      "progress": 72,
      "statusMessage": "Splitting clip 4 of 5...",
      "videoInfo": { ... },
      "clips": [ ... ]
    }
  }
}
```

**Job statuses:** `queued` → `fetching_info` → `downloading` → `splitting` → `done` | `error`

---

### `GET /api/clips/:jobId/:filename`

Download a clip file.

---

### `GET /api/health`

Health check endpoint. Returns dependency status.

---

## 🚢 Deployment

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli
railway login
railway up
```

Set environment variables in Railway dashboard.

### Vercel

⚠️ Vercel serverless functions have a 10s timeout — not suitable for video processing.
Use Railway, Render, or a VPS instead.

### VPS (Ubuntu)

```bash
# Install dependencies
sudo apt update
sudo apt install -y nodejs npm ffmpeg python3-pip
pip3 install yt-dlp

# Clone and run
git clone https://github.com/your-username/yt-clipper.git
cd yt-clipper
npm ci
npm run build
npm start
```

Use **nginx** as a reverse proxy and **PM2** for process management.

---

## 🔧 Troubleshooting

### `yt-dlp not found`
Make sure yt-dlp is installed and in your PATH:
```bash
which yt-dlp
yt-dlp --version
```

### `FFmpeg not found`
```bash
which ffmpeg
ffmpeg -version
```

### YouTube blocking downloads
YouTube occasionally blocks yt-dlp. Try:
1. Update yt-dlp: `pip3 install -U yt-dlp`
2. Use a proxy: set `YTDLP_PROXY` in `.env.local`
3. Use cookies: export browser cookies and set `YTDLP_COOKIES_PATH`

### Age-restricted videos
Export cookies from your browser (using a browser extension like "Get cookies.txt") and set `YTDLP_COOKIES_PATH`.

---

## 📁 Project Structure

```
yt-clipper/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── process/route.ts       # Start job
│   │   │   ├── status/[jobId]/route.ts # Poll status
│   │   │   ├── clips/[jobId]/[file]/route.ts # Serve clips
│   │   │   └── health/route.ts
│   │   ├── page.tsx                   # Home page
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── ProcessingView.tsx         # Processing + clips UI
│   ├── lib/
│   │   ├── ytdlp.ts                   # yt-dlp wrapper
│   │   ├── ffmpeg.ts                  # FFmpeg wrapper
│   │   ├── jobStore.ts                # In-memory job state
│   │   ├── cleanup.ts                 # File cleanup service
│   │   ├── rateLimiter.ts             # Rate limiting
│   │   ├── logger.ts                  # Winston logger
│   │   └── clientUtils.ts             # Client-safe utils
│   └── types/index.ts
├── scripts/cleanup.js                 # Manual cleanup script
├── Dockerfile
├── docker-compose.yml
├── railway.toml
├── .env.example
└── README.md
```

---

## 📄 License

MIT — use freely, attribution appreciated.

---

## ⚠️ Disclaimer

This tool is for personal use and educational purposes. Respect YouTube's Terms of Service. Only download content you have the right to download. Don't use for commercial redistribution of copyrighted content.
