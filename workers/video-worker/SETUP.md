# Video Worker Setup Guide

## ✅ What's Been Created

The `video-worker` package has been successfully created in the `workers/` directory with the following structure:

```
workers/video-worker/
├── src/
│   ├── main.ts              # BullMQ worker entry point
│   ├── job-handler.ts        # Orchestrates the full task flow
│   ├── download-audio.ts     # Downloads audio using yt-dlp
│   ├── transcribe-audio.ts  # Uses OpenAI Whisper API
│   ├── summarize.ts         # Uses OpenAI GPT-4 for summarization
│   └── enqueue-test.ts      # Test script to enqueue jobs
├── dist/                    # Compiled JavaScript files
├── downloads/               # Directory for downloaded audio files
├── package.json            # Package configuration with all dependencies
├── tsconfig.json           # TypeScript configuration
├── Dockerfile              # Docker configuration
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── README.md               # Comprehensive documentation
└── SETUP.md                # This setup guide
```

## 🔧 Dependencies Installed

- **BullMQ**: For job queue management
- **ioredis**: Redis client for BullMQ
- **OpenAI**: For Whisper transcription and GPT-4 summarization
- **dotenv**: Environment variable management
- **uuid**: For generating unique identifiers
- **TypeScript**: For type safety and compilation
- **tsx**: For development with TypeScript

## 🚀 Quick Start

1. **Set up environment variables**:
   ```bash
   cd workers/video-worker
   cp .env.example .env
   # Edit .env with your OpenAI API key and Redis configuration
   ```

2. **Start Redis server** (if not already running):
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:alpine
   
   # Or install Redis locally
   sudo apt-get install redis-server
   ```

3. **Start the worker**:
   ```bash
   pnpm dev  # Development mode with hot reload
   # or
   pnpm build && pnpm start  # Production mode
   ```

4. **Test with a sample job**:
   ```bash
   pnpm test  # This will enqueue a test job
   ```

## 📋 Job Flow

Each job processes a YouTube video through these steps:

1. **Download Audio**: Uses `yt-dlp` to download audio as MP3
2. **Transcribe**: Uses OpenAI Whisper API to transcribe the audio
3. **Summarize**: Uses OpenAI GPT-4 to create a summary of the transcript

## 🔄 Integration with Existing Codebase

The video-worker is designed to work alongside the existing `video-factory.service.ts`:

- **Similar functionality**: Both use `yt-dlp` for downloading and OpenAI APIs
- **Different architecture**: Worker uses BullMQ for async processing vs direct API calls
- **Shared patterns**: Similar error handling and file management approaches

## 🐳 Docker Support

The package includes a Dockerfile that:
- Uses Node.js 18 Alpine base
- Installs `yt-dlp`, `ffmpeg`, and other system dependencies
- Sets up the complete runtime environment

## 🔍 Monitoring & Debugging

- **Job status**: BullMQ provides job state tracking
- **Error handling**: Comprehensive error logging and retry mechanisms
- **File cleanup**: Audio files are automatically cleaned up after processing
- **Graceful shutdown**: Handles SIGTERM and SIGINT signals

## 📝 Next Steps

1. Configure your OpenAI API key in `.env`
2. Start a Redis server
3. Test with a sample YouTube URL
4. Integrate with your main application to enqueue jobs
5. Monitor job processing and results

## 🛠️ Troubleshooting

- **Redis connection issues**: Ensure Redis is running and accessible
- **yt-dlp errors**: Verify `yt-dlp` is installed and working
- **OpenAI API errors**: Check your API key and quota
- **File permission issues**: Ensure the `downloads/` directory is writable 