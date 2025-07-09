import { AudioProcessor } from '../processors/audio-processor';
import { TranscribeProcessor } from '../processors/transcribe-processor';
import { SummarizeProcessor } from '../processors/summarize-processor';
import { StorageProcessor } from '../processors/storage-processor';
import { YouTubeClient } from '../lib/youtube.client';
import { MediaToolsClient } from '../lib/media-tools.client';
import { OpenAIClient } from '../lib/openai.client';
import { Storage } from '../storage';
import { VideoJobData, JobResult } from '../types';
import { Logger } from '../utils/logger';

export class VideoProcessorChain {
  private audioProcessor: AudioProcessor;
  private transcribeProcessor: TranscribeProcessor;
  private summarizeProcessor: SummarizeProcessor;
  private storageProcessor: StorageProcessor;
  private youtubeClient: YouTubeClient;

  constructor() {
    const mediaToolsClient = new MediaToolsClient();
    const openaiClient = new OpenAIClient();
    const storage = new Storage();

    this.audioProcessor = new AudioProcessor(mediaToolsClient, storage);
    this.transcribeProcessor = new TranscribeProcessor(openaiClient);
    this.summarizeProcessor = new SummarizeProcessor(openaiClient);
    this.storageProcessor = new StorageProcessor(storage);
    this.youtubeClient = new YouTubeClient();
  }

  async process(jobData: VideoJobData, jobId: string): Promise<JobResult> {
    Logger.info('Starting video processing chain', jobId);
    
    try {
      // Extract video ID
      const videoId = this.youtubeClient.extractVideoId(jobData.youtubeUrl);
      
      // Step 1: Audio Processing
      Logger.step(1, 'Audio Processing', jobId);
      const audioOutput = await this.audioProcessor.process(
        { youtubeUrl: jobData.youtubeUrl, videoId },
        jobId
      );

      // Step 2: Transcription
      Logger.step(2, 'Transcription', jobId);
      const transcribeOutput = await this.transcribeProcessor.process(
        { audioPaths: audioOutput.audioPaths },
        jobId
      );

      // Step 3: Summarization
      Logger.step(3, 'Summarization', jobId);
      const summarizeOutput = await this.summarizeProcessor.process(
        { rawTranscript: transcribeOutput.rawTranscript },
        jobId
      );

      // Step 4: Get YouTube metadata
      Logger.step(4, 'Fetching YouTube metadata', jobId);
      const metadata = await this.youtubeClient.getMetadata(videoId);

      // Step 5: Storage
      Logger.step(5, 'Storage', jobId);
      const result: JobResult = {
        videoId,
        metadata,
        rawTranscript: transcribeOutput.rawTranscript,
        transcriptSegments: transcribeOutput.transcriptSegments,
        summaries: summarizeOutput.summaries,
      };

      await this.storageProcessor.process({ videoId, result }, jobId);

      Logger.success('Video processing chain completed successfully', jobId);
      return result;
    } catch (error) {
      Logger.error('Video processing chain failed', error as Error, jobId);
      throw error;
    }
  }
} 