import { Language } from "@polinote/entities";
import { BaseProcessor } from '../core/base-processor';
import { OpenAIClient } from '../lib/openai';
import { SummarizeInput, SummarizeOutput } from '../types';

export class SummarizeProcessor extends BaseProcessor<SummarizeInput, SummarizeOutput> {
  constructor(private openaiClient: OpenAIClient) {
    super();
  }

  async process(input: SummarizeInput, jobId: string): Promise<SummarizeOutput> {
    this.log('Starting Executive Briefing generation', jobId);

    try {
      this.logStep(1, 'Generating Korean Executive Briefing', jobId);
      const koreanSummary = await this.openaiClient.summarize(input.rawTranscript, Language.KO);
      
      this.logStep(2, 'Generating English Executive Briefing', jobId);
      const englishSummary = await this.openaiClient.summarize(input.rawTranscript, Language.EN);

      const summaries = [koreanSummary, englishSummary];

      this.log(`Generated ${summaries.length} Executive Briefings`, jobId);
      this.log(`Korean content length: ${koreanSummary.content.length} characters`, jobId);
      this.log(`English content length: ${englishSummary.content.length} characters`, jobId);

      this.logSuccess('Executive Briefing generation completed successfully', jobId);

      return { summaries };
    } catch (error) {
      this.logError('Executive Briefing generation failed', error as Error, jobId);
      throw error;
    }
  }
} 