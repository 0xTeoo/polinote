import { BaseProcessor } from '../core/base-processor';
import { OpenAIClient } from '../lib/openai.client';
import { TranscribeInput, TranscribeOutput } from '../types';

export class TranscribeProcessor extends BaseProcessor<TranscribeInput, TranscribeOutput> {
  constructor(private openaiClient: OpenAIClient) {
    super();
  }

  async process(input: TranscribeInput, jobId: string): Promise<TranscribeOutput> {
    this.log('Starting transcription', jobId);
    
    try {
      this.logStep(1, 'Transcribing audio', jobId);
      
      const { rawTranscript, transcriptSegments } = await this.openaiClient.transcribeAudio(input.audioPaths);
      
      this.log(`Transcription completed. Length: ${rawTranscript.length} characters`, jobId);
      this.log(`Generated ${transcriptSegments.length} segments`, jobId);
      
      this.logSuccess('Transcription completed', jobId);
      
      return {
        rawTranscript,
        transcriptSegments,
      };
    } catch (error) {
      this.logError('Transcription failed', error as Error, jobId);
      throw error;
    }
  }
} 