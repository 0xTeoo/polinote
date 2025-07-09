import { Language } from "@polinote/entities";
import { BaseProcessor } from '../core/base-processor';
import { OpenAIClient } from '../lib/openai.client';
import { SummarizeInput, SummarizeOutput } from '../types';

export class SummarizeProcessor extends BaseProcessor<SummarizeInput, SummarizeOutput> {
  constructor(private openaiClient: OpenAIClient) {
    super();
  }

  async process(input: SummarizeInput, jobId: string): Promise<SummarizeOutput> {
    this.log('Starting summarization', jobId);
    
    try {
      this.logStep(1, 'Generating summaries', jobId);
      
      const summaries = await Promise.all([
        this.openaiClient.summarize(input.rawTranscript, Language.KO),
        this.openaiClient.summarize(input.rawTranscript, Language.EN),
      ]);
      
      this.log(`Generated ${summaries.length} summaries (Korean and English)`, jobId);
      
      this.logSuccess('Summarization completed', jobId);
      
      return { summaries };
    } catch (error) {
      this.logError('Summarization failed', error as Error, jobId);
      throw error;
    }
  }
} 