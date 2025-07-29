import OpenAI from "openai";
import { Language } from "@polinote/entities";
import { TranscriptSegment, Summary } from '../../types';
import { Logger } from '../../utils/logger';
import { getLanguageConfig } from './language-config';
import * as fs from 'fs';

export class OpenAIClient {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
  }

  /**
   * Generate system prompt with guidelines
   */
  private generateSystemPrompt(config: any): string {
    const guidelines = config.guidelines.map((guideline: string) => `- ${guideline}`).join('\n');
    return `${config.systemPrompt}

Guidelines:
${guidelines}

Please ensure your response is valid JSON that matches the specified structure exactly.`;
  }

  /**
   * Generate user prompt
   */
  private generateUserPrompt(config: any, text: string): string {
    return config.userPromptTemplate.replace('{text}', text);
  }

  /**
   * Transcribe audio files using Whisper API
   */
  async transcribeAudio(audioPaths: string[]): Promise<{
    rawTranscript: string;
    transcriptSegments: TranscriptSegment[];
  }> {
    try {
      let fullTranscript = '';
      let allSegments: TranscriptSegment[] = [];
      let timeOffset = 0;

      for (const audioPath of audioPaths) {
        const file = fs.createReadStream(audioPath);

        const response = await this.openai.audio.transcriptions.create({
          file,
          model: "whisper-1",
          response_format: "verbose_json",
          timestamp_granularities: ["segment"],
        });

        const transcription = response as any;

        if (transcription.text) {
          fullTranscript += transcription.text + ' ';
        }

        if (transcription.segments) {
          const segments = transcription.segments.map((segment: any) => ({
            start: segment.start + timeOffset,
            end: segment.end + timeOffset,
            text: segment.text,
          }));
          allSegments.push(...segments);
        }

        // Update time offset for next file
        if (transcription.segments && transcription.segments.length > 0) {
          timeOffset = allSegments[allSegments.length - 1].end;
        }
      }

      return {
        rawTranscript: fullTranscript.trim(),
        transcriptSegments: allSegments,
      };
    } catch (error) {
      Logger.error('Error transcribing audio', error as Error);
      throw error;
    }
  }

  /**
   * Clean OpenAI response content by removing markdown code blocks
   */
  private cleanResponseContent(content: string): string {
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    let cleaned = content.trim();

    // Remove markdown code blocks (```json ... ```)
    cleaned = cleaned.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    cleaned = cleaned.replace(/```\s*/g, '').replace(/```\s*$/g, '');

    // Remove any leading/trailing whitespace
    cleaned = cleaned.trim();

    // If the response starts with "I'm sorry" or similar, it's not JSON
    if (cleaned.toLowerCase().startsWith("i'm sorry") || 
        cleaned.toLowerCase().startsWith("i cannot") ||
        cleaned.toLowerCase().startsWith("i can't")) {
      throw new Error('OpenAI refused to process the request: ' + cleaned.substring(0, 100));
    }

    // Check if it looks like JSON
    if (!cleaned.startsWith('{') || !cleaned.endsWith('}')) {
      throw new Error('Response is not in JSON format: ' + cleaned.substring(0, 100));
    }

    return cleaned;
  }

  /**
   * Validate summary structure
   */
  private validateSummaryStructure(data: any): boolean {
    try {
      // Check summary object
      if (!data.summary || typeof data.summary !== 'object') {
        Logger.error('Summary validation failed: missing or invalid summary object', data);
        return false;
      }
      if (!data.summary.headline || typeof data.summary.headline !== 'string') {
        Logger.error('Summary validation failed: missing or invalid headline', data.summary);
        return false;
      }
      if (!data.summary.overview || typeof data.summary.overview !== 'string') {
        Logger.error('Summary validation failed: missing or invalid overview', data.summary);
        return false;
      }

      // Check stakeholders array
      if (!Array.isArray(data.stakeholders)) {
        Logger.error('Summary validation failed: stakeholders is not an array', data.stakeholders);
        return false;
      }
      
      // Allow empty stakeholders array but validate structure if not empty
      for (const stakeholder of data.stakeholders) {
        if (!stakeholder.type || !stakeholder.name || !stakeholder.interests) {
          Logger.error('Summary validation failed: invalid stakeholder structure', stakeholder);
          return false;
        }
        if (!['country', 'organization'].includes(stakeholder.type)) {
          Logger.error('Summary validation failed: invalid stakeholder type', stakeholder.type);
          return false;
        }
      }

      // Check policyImplications
      if (!data.policyImplications || typeof data.policyImplications !== 'object') {
        Logger.error('Summary validation failed: missing or invalid policyImplications', data.policyImplications);
        return false;
      }
      if (!Array.isArray(data.policyImplications.domestic)) {
        Logger.error('Summary validation failed: domestic policyImplications is not an array', data.policyImplications.domestic);
        return false;
      }
      if (!Array.isArray(data.policyImplications.international)) {
        Logger.error('Summary validation failed: international policyImplications is not an array', data.policyImplications.international);
        return false;
      }

      // Validate policy implications items
      for (const item of [...data.policyImplications.domestic, ...data.policyImplications.international]) {
        if (!item.issue || !item.impact) {
          Logger.error('Summary validation failed: invalid policy implication item', item);
          return false;
        }
      }

      // Check economicImpact
      if (!data.economicImpact || typeof data.economicImpact !== 'object') {
        Logger.error('Summary validation failed: missing or invalid economicImpact', data.economicImpact);
        return false;
      }
      if (!data.economicImpact.markets || !data.economicImpact.trade || !data.economicImpact.investment) {
        Logger.error('Summary validation failed: missing economicImpact fields', data.economicImpact);
        return false;
      }

      // Check analysis
      if (!data.analysis || typeof data.analysis !== 'object') {
        Logger.error('Summary validation failed: missing or invalid analysis', data.analysis);
        return false;
      }
      if (!data.analysis.historicalContext || !Array.isArray(data.analysis.scenarios)) {
        Logger.error('Summary validation failed: missing historicalContext or scenarios', data.analysis);
        return false;
      }
      if (!data.analysis.recommendations || typeof data.analysis.recommendations !== 'object') {
        Logger.error('Summary validation failed: missing or invalid recommendations', data.analysis.recommendations);
        return false;
      }
      if (!data.analysis.recommendations.policy || !data.analysis.recommendations.investment) {
        Logger.error('Summary validation failed: missing policy or investment recommendations', data.analysis.recommendations);
        return false;
      }

      Logger.info('Summary structure validation passed');
      return true;
    } catch (error) {
      Logger.error('Error during summary structure validation', error as Error);
      return false;
    }
  }

  /**
   * Generate summary using OpenAI
   */
  async summarize(text: string, language: Language): Promise<Summary> {
    try {
      const config = getLanguageConfig(language);
      const systemPrompt = this.generateSystemPrompt(config);
      const userPrompt = this.generateUserPrompt(config, text);

      Logger.info(`Generating summary in ${config.nativeName} (${config.name})`);

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.1, // Lower temperature for more consistent JSON output
        max_tokens: 4000,
        response_format: { type: "json_object" }, // Force JSON response
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Clean the response content before parsing
      const cleanedContent = this.cleanResponseContent(content);
      
      // Log the cleaned response for debugging
      Logger.info('OpenAI response cleaned:', cleanedContent.substring(0, 500) + '...');

      let result;
      try {
        result = JSON.parse(cleanedContent);
      } catch (parseError) {
        Logger.error('Failed to parse JSON response', parseError as Error);
        Logger.error(content);
        throw new Error('Invalid JSON response from OpenAI');
      }

      // Log the parsed result for debugging
      Logger.info('Parsed result structure:', JSON.stringify(result, null, 2));

      // Validate the structure
      if (!this.validateSummaryStructure(result)) {
        Logger.error('Invalid summary structure received', result);
        throw new Error('Summary structure validation failed');
      }

      return {
        language,
        ...result,
      };
    } catch (error) {
      Logger.error('Error generating summary', error as Error);
      throw error;
    }
  }
} 