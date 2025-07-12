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
    `;
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
    // Remove markdown code blocks (```json ... ```)
    let cleaned = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');

    // Also remove any leading/trailing whitespace
    cleaned = cleaned.trim();

    return cleaned;
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
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Clean the response content before parsing
      const cleanedContent = this.cleanResponseContent(content);
      const result = JSON.parse(cleanedContent);

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