import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { Language, Summary } from '@polinote/entities';

@Injectable()
export class SummaryService {

  constructor(
    @InjectRepository(Summary)
    private summaryRepository: Repository<Summary>,
  ) {
  }

  async createOne(
    createDto: CreateSummaryDto,
    queryRunner?: QueryRunner,
  ): Promise<Summary> {
    const { videoId, language, content } = createDto;
    const manager = queryRunner?.manager || this.summaryRepository.manager;

    try {
      const summaryEntity = manager.create(Summary, {
        video: { id: videoId },
        language,
        content,
      });

      // Save using the appropriate manager
      return manager.save(Summary, summaryEntity);
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

  async findByVideoIdAndLanguage(videoId: string, language: Language): Promise<Summary> {
    const summary = await this.summaryRepository.findOne({
      where: {
        video: { id: videoId },
        language: language
      },
    });

    if (!summary) {
      throw new HttpException(
        `Summary not found for video ${videoId} with language ${language}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return summary;
  }
}
