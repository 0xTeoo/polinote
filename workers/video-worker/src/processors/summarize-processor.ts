import { Language } from "@polinote/entities";
import { BaseProcessor } from '../core/base-processor';
import { OpenAIClient } from '../lib/openai';
import { SummarizeInput, SummarizeOutput } from '../types';

export class SummarizeProcessor extends BaseProcessor<SummarizeInput, SummarizeOutput> {
  constructor(private openaiClient: OpenAIClient) {
    super();
  }

  async process(input: SummarizeInput, jobId: string): Promise<SummarizeOutput> {
    this.log('Starting summarization with new structure', jobId);

    try {
      this.logStep(1, 'Generating Korean summary', jobId);
      const koreanSummary = await this.openaiClient.summarize(input.rawTranscript, Language.KO);
      
      this.logStep(2, 'Generating English summary', jobId);
      const englishSummary = await this.openaiClient.summarize(input.rawTranscript, Language.EN);

      const summaries = [koreanSummary, englishSummary];

      this.log(`Generated ${summaries.length} summaries with new structure`, jobId);
      this.log(`Korean headline: ${koreanSummary.summary.headline}`, jobId);
      this.log(`English headline: ${englishSummary.summary.headline}`, jobId);
      this.log(`Korean stakeholders: ${koreanSummary.stakeholders.length} entities`, jobId);
      this.log(`English stakeholders: ${englishSummary.stakeholders.length} entities`, jobId);

      this.logSuccess('Summarization completed successfully', jobId);

      return { summaries };
    } catch (error) {
      this.logError('Summarization failed', error as Error, jobId);
      throw error;
    }
  }
} 