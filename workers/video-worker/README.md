# Video Worker

A BullMQ worker for processing YouTube videos. This worker downloads audio from YouTube videos, transcribes them using OpenAI Whisper, and summarizes the content using OpenAI GPT-4.

## Features

- Downloads audio from YouTube videos using `yt-dlp`
- Transcribes audio using OpenAI Whisper API
- Summarizes transcripts using OpenAI GPT-4
- Processes jobs via BullMQ queue
- Supports Redis for job queue management

## Prerequisites

- Node.js 18+
- Redis server
- `yt-dlp` installed on the system
- `ffmpeg` installed on the system
- OpenAI API key

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Worker Configuration
WORKER_CONCURRENCY=1
QUEUE_NAME=video_queue

# File Storage
DOWNLOADS_DIR=./downloads
```

## Usage

### Development
```bash
pnpm dev
```

### Production
```bash
pnpm build
pnpm start
```

### Testing
```bash
pnpm test
```

## Job Flow

Each job processes a YouTube video through the following steps:

1. **Download Audio**: Uses `yt-dlp` to download audio as MP3
2. **Transcribe**: Uses OpenAI Whisper API to transcribe the audio
3. **Summarize**: Uses OpenAI GPT-4 to create a summary of the transcript

## Job Payload

```typescript
{
  youtubeUrl: string; // Full YouTube URL
}
```

## Job Result

```typescript
{
  videoId: string;
  audioPath: string;
  transcript: string;
  transcriptWithTimestamps: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  summary: string;
}
```

## Docker

Build and run with Docker:

```bash
docker build -t video-worker .
docker run --env-file .env video-worker
```

## Queue Management

The worker listens to the `video_queue` (configurable via `QUEUE_NAME` env var) and processes jobs with the following configuration:

- **Concurrency**: Configurable via `WORKER_CONCURRENCY` (default: 1)
- **Retries**: 3 attempts with exponential backoff
- **Graceful Shutdown**: Handles SIGTERM and SIGINT signals

## Error Handling

- Failed downloads are retried with exponential backoff
- Audio files are cleaned up after processing
- Comprehensive error logging for debugging 