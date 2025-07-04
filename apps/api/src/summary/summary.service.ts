import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import OpenAI from 'openai';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { ConfigService } from '@nestjs/config';
import { Language, Summary } from '@polinote/entities';

@Injectable()
export class SummaryService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(Summary)
    private summaryRepository: Repository<Summary>,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.getOrThrow<string>('openai.apiKey'),
    });
  }

  private async generateSummaryWithAI(
    transcript: string,
    language: Language,
  ): Promise<{
    overview: string;
    key_sections: {
      introduction: string;
      main_points: string[];
      conclusion: string;
    };
    analysis: string;
  }> {
    try {
      const prompt = `Please analyze this transcript and provide a structured summary in ${language === Language.KO ? 'Korean' : 'English'
        }. 

      Required sections:
      - Overview: A concise summary of the main content
      - Key Sections:
        - Introduction: Opening remarks and context
        - Main Points: Key discussion points
        - Conclusion: Closing remarks and outcomes
      - Analysis: Thoughtful analysis of implications and significance

      Formatting requirements:
      1. Use markdown for emphasis:
         - **Bold** for key policy announcements, decisions, or significant statements
         - *Italic* for names of people, organizations, or important terms when first mentioned
         - \`backticks\` for specific numbers, dates, or statistical data
         - > Blockquotes for direct quotes from speakers
         - ### Headers for major topic transitions

      2. Always emphasize:
         - Policy changes or announcements
         - Numerical data or statistics
         - Names of key officials or organizations
         - Critical deadlines or dates
         - Direct quotes from officials
         - Major conclusions or decisions

      Format the response as a JSON with the following structure:
      {
        "overview": "A concise overview with emphasized key points",
        "key_sections": {
          "introduction": "Description of opening remarks with emphasis",
          "main_points": ["Array of key points with proper markdown emphasis"],
          "conclusion": "Summary of closing remarks with emphasis"
        },
        "analysis": "A thoughtful analysis with emphasized significant points"
      }

      Transcript:
      ${transcript}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert political analyst specializing in White House press briefings. Your task is to provide clear, accurate, and insightful summaries of briefing transcripts. Use markdown formatting effectively to highlight key information and make the content more readable and impactful.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      if (!result.overview || !result.key_sections || !result.analysis) {
        throw new Error('Invalid response format from OpenAI');
      }

      return {
        overview: result.overview,
        key_sections: result.key_sections,
        analysis: result.analysis,
      };
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new HttpException(
        'Failed to generate summary',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createOne(
    createDto: CreateSummaryDto,
    queryRunner?: QueryRunner,
  ): Promise<Summary> {
    const { videoId, transcript, language } = createDto;
    const manager = queryRunner?.manager || this.summaryRepository.manager;

    try {
      // Check if summary already exists
      const existingSummary = await manager.findOne(Summary, {
        where: {
          video: {
            id: videoId,
          },
          language,
        },
      });

      if (existingSummary) {
        throw new HttpException(
          'Summary already exists for this video and language',
          HttpStatus.CONFLICT,
        );
      }

      const summaryContent = await this.generateSummaryWithAI(
        transcript,
        language,
      );

      const summary = manager.create(Summary, {
        video: {
          id: videoId,
        },
        language: language,
        overview: summaryContent.overview,
        keySections: summaryContent.key_sections,
        analysis: summaryContent.analysis,
      });

      // Save using the appropriate manager
      return manager.save(Summary, summary);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to create summary: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
