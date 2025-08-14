# Video Worker

A BullMQ worker for processing YouTube videos. This worker downloads audio from YouTube videos, transcribes them using OpenAI Whisper, and generates Executive Briefings using OpenAI chat completions (model: gpt-5).

## 🏗️ Architecture

The video worker uses Object-Oriented Programming principles with a processor chain pattern for better maintainability, testability, and scalability.

### Project Structure

```
src/
├── core/                    # Core abstractions and orchestration
│   ├── base-processor.ts    # Abstract base class for all processors
│   └── processor-chain.ts   # Chain of responsibility pattern
├── processors/              # Business logic processors
│   ├── audio-processor.ts   # Audio download & processing
│   ├── transcribe-processor.ts # Transcription logic
│   ├── summarize-processor.ts  # Summarization logic
│   └── storage-processor.ts   # File storage operations
├── lib/                     # External service clients
│   ├── media-tools.client.ts # FFmpeg/FFprobe/yt-dlp integration
│   ├── youtube.client.ts    # YouTube API client (YouTube Data API v3)
│   └── openai/              # OpenAI client + language configs
├── types/                   # TypeScript type definitions
├── constants/               # Configuration constants
├── utils/                   # Utility functions
├── config.ts               # Configuration setup
├── job-handler.ts          # Main job handler (simplified)
├── main.ts                 # Worker entry point
├── storage.ts              # File storage operations
└── index.ts                # Public API exports
```

### Class Hierarchy

```
BaseProcessor<TInput, TOutput>
├── AudioProcessor
├── TranscribeProcessor
├── SummarizeProcessor
└── StorageProcessor

VideoProcessorChain (Orchestrator)
├── AudioProcessor
├── TranscribeProcessor
├── SummarizeProcessor
└── StorageProcessor
```

## 🎯 Features

- Downloads audio from YouTube videos using `yt-dlp`
- Transcribes audio using OpenAI Whisper API
- Generates bilingual Executive Briefings (KO/EN) via OpenAI chat completions
- Processes jobs via BullMQ queue
- Supports Redis for job queue management
- OOP architecture with clear separation of concerns
- Comprehensive error handling and logging
- Type-safe implementation with TypeScript

## 📋 Prerequisites

- Node.js 20+
- Redis server
- `yt-dlp` installed on the system
- `ffmpeg`/`ffprobe` installed on the system
- OpenAI API key
- YouTube Data API v3 key

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Configure environment variables in `.env`:
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key_here

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Notes
# - Worker concurrency is currently fixed to 1 in code
# - Files are stored under ./workspace (see constants)
```

### 3. Start Redis Server
```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install Redis locally
sudo apt-get install redis-server
```

## 🏃‍♂️ Usage

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

## 🔄 Job Flow

Each job processes a YouTube video through the following steps:

1. **Audio Processing**: Downloads audio using `yt-dlp` and processes/splits with `ffmpeg`
2. **Transcription**: Uses OpenAI Whisper (`whisper-1`) to transcribe the audio (supports segment timestamps)
3. **Summarization**: Uses OpenAI chat completions to produce Korean and English Executive Briefings
4. **Metadata**: Fetches YouTube video metadata via YouTube Data API v3
5. **Storage**: Saves results under `./workspace/data/<videoId>/`

If both audio and result files already exist for a given `videoId`, the worker returns the cached result without reprocessing.

## 📊 Job Payload & Result

### Input
```typescript
{
  youtubeUrl: string; // Full YouTube URL
}
```

### Output
```typescript
{
  videoId: string;
  metadata: {
    title: string;
    description: string;
    publishedAt: Date;
    thumbnailUrl: string;
  };
  rawTranscript: string;
  transcriptSegments: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  summaries: Array<{
    language: 'KO' | 'EN';
    content: string; // Markdown Executive Briefing
  }>;
}
```

## 🏗️ OOP Principles Applied

### 1. **Single Responsibility Principle**
Each processor handles one specific concern:
- **AudioProcessor**: Downloads and processes audio files
- **TranscribeProcessor**: Handles audio transcription
- **SummarizeProcessor**: Generates Executive Briefings (KO/EN)
- **StorageProcessor**: Manages file storage operations

### 2. **Open/Closed Principle**
- Base processor class is open for extension, closed for modification
- New processors can be added without changing existing code
- Easy to add new processing steps to the chain

### 3. **Dependency Injection**
- Processors receive their dependencies through constructor injection
- Easy to test and mock dependencies
- Loose coupling between components

### 4. **Chain of Responsibility**
- Clear processing pipeline with defined steps
- Each processor passes output to the next processor
- Easy to modify the processing order

## 💻 Usage Examples

### Basic Job Processing
```typescript
import { jobHandler } from './job-handler';

// The job handler is now much simpler and focused
const result = await jobHandler(job);
```

### Using Individual Processors
```typescript
import { AudioProcessor, MediaToolsClient, Storage } from './index';

const audioProcessor = new AudioProcessor(new MediaToolsClient(), new Storage());
const result = await audioProcessor.process({ youtubeUrl, videoId }, jobId);
```

### Using the Processor Chain
```typescript
import { VideoProcessorChain } from './core/processor-chain';

const processor = new VideoProcessorChain();
const result = await processor.process(jobData, jobId);
```

### Creating Custom Processors
```typescript
import { BaseProcessor } from './core/base-processor';

export class CustomProcessor extends BaseProcessor<CustomInput, CustomOutput> {
  async process(input: CustomInput, jobId: string): Promise<CustomOutput> {
    this.log('Processing...', jobId);
    // Your custom logic here
    return result;
  }
}
```

## 📈 Queue Management

The worker listens to the `video` queue and processes jobs with the following configuration:

- **Concurrency**: Fixed to 1
- **Graceful Shutdown**: Handles SIGTERM and SIGINT signals
- Note: Retry/backoff is controlled by the job producer, not the worker

## 🗂️ Storage Layout

- Base directory: `./workspace/data`
- Temp directory for downloads: `./workspace/temp`
- Per-video directory: `./workspace/data/<videoId>/`
  - `audio.mp3`
  - `result.json`

## 🧪 Testing Strategy

Each processor can be tested independently:

```typescript
describe('AudioProcessor', () => {
  let processor: AudioProcessor;
  let mockMediaToolsClient: jest.Mocked<MediaToolsClient>;
  let mockStorage: jest.Mocked<Storage>;

  beforeEach(() => {
    mockMediaToolsClient = createMockMediaToolsClient();
    mockStorage = createMockStorage();
    processor = new AudioProcessor(mockMediaToolsClient, mockStorage);
  });

  it('should process audio successfully', async () => {
    const result = await processor.process(input, jobId);
    expect(result.audioPaths).toHaveLength(1);
  });
});
```
