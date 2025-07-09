import OpenAI from "openai";
import { Language } from "@polinote/entities";
import { TranscriptSegment, Summary } from '../types';
import { Logger } from '../utils/logger';
import * as fs from 'fs';

export class OpenAIClient {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
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
   * Generate summary using OpenAI
   */
  async summarize(text: string, language: Language): Promise<Summary> {
    try {
      const languageName = language === Language.KO ? 'Korean' : 'English';
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that creates comprehensive summaries of video transcripts in ${languageName}. 
            Create a structured summary with the following sections:
            1. Overview: A brief summary of the main content
            2. Key Sections: Introduction, main points, and conclusion
            3. Analysis: Detailed analysis and insights
            
            Format the response as JSON with the following structure:
            {
              "overview": "Brief overview",
              "keySections": {
                "introduction": "Introduction summary",
                "mainPoints": ["Point 1", "Point 2", "Point 3"],
                "conclusion": "Conclusion summary"
              },
              "analysis": "Detailed analysis"
            }`
          },
          {
            role: "user",
            content: `Please summarize the following transcript in ${languageName}:\n\n${text}`
          }
        ],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      Logger.error('Error generating summary', error as Error);
      throw error;
    }
  }
} 