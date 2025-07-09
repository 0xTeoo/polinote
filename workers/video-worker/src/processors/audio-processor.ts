import * as fs from 'fs';
import * as path from 'path';
import { BaseProcessor } from '../core/base-processor';
import { MediaToolsClient } from '../lib/media-tools.client';
import { Storage } from '../storage';
import { AudioInput, AudioOutput, AudioSplit } from '../types';
import { AUDIO_CONSTANTS } from '../constants';

export class AudioProcessor extends BaseProcessor<AudioInput, AudioOutput> {
  constructor(
    private mediaToolsClient: MediaToolsClient,
    private storage: Storage
  ) {
    super();
  }

  async process(input: AudioInput, jobId: string): Promise<AudioOutput> {
    this.log('Starting audio processing', jobId);

    try {
      // Step 1: Download audio
      this.logStep(1, 'Downloading audio', jobId);
      const audioPath = await this.downloadAudio(input.youtubeUrl, input.videoId, jobId);

      // Step 2: Process audio (check duration and split if necessary)
      this.logStep(2, 'Processing audio', jobId);
      const audioPaths = await this.processAudio(audioPath, jobId);

      this.logSuccess('Audio processing completed', jobId);
      return { audioPaths };
    } catch (error) {
      this.logError('Audio processing failed', error as Error, jobId);
      throw error;
    }
  }

  private async downloadAudio(youtubeUrl: string, videoId: string, jobId: string): Promise<string> {
    this.log(`Downloading audio for video ID: ${videoId}`, jobId);

    // Use temporary directory for download
    const tempDir = AUDIO_CONSTANTS.TEMP_DIR;
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempAudioPath = path.join(tempDir, `${videoId}.mp3`);

    // Download audio using yt-dlp
    this.mediaToolsClient.downloadAudio(youtubeUrl, tempAudioPath);

    // Verify file was downloaded
    if (!fs.existsSync(tempAudioPath)) {
      throw new Error(`Audio file was not downloaded to expected path: ${tempAudioPath}`);
    }

    // Move to storage directory
    const finalAudioPath = await this.storage.moveAudioFile(tempAudioPath, videoId);
    this.log(`Audio downloaded and moved to: ${finalAudioPath}`, jobId);

    return finalAudioPath;
  }

  private async processAudio(audioPath: string, jobId: string): Promise<string[]> {
    const audioDuration = this.mediaToolsClient.getAudioDuration(audioPath);
    this.log(`Audio duration: ${audioDuration} seconds`, jobId);

    if (audioDuration <= AUDIO_CONSTANTS.MAX_DURATION_SECONDS) {
      this.log('Audio is under 24 minutes, no splitting needed', jobId);
      return [audioPath];
    }

    this.log('Audio is over 24 minutes, splitting into parts', jobId);
    const splits: AudioSplit[] = [
      { start: 0, duration: AUDIO_CONSTANTS.MAX_DURATION_SECONDS },
      { start: AUDIO_CONSTANTS.MAX_DURATION_SECONDS },
    ];

    const splitPaths = this.mediaToolsClient.splitAudio(audioPath, splits);
    this.log(`Audio split successfully into ${splitPaths.length} parts`, jobId);

    return splitPaths;
  }
} 