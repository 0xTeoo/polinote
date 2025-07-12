import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { CreateTranscriptDto } from './dto/create-transcript.dto';
import { Transcript } from '@polinote/entities';

@Injectable()
export class TranscriptService {
  constructor(
    @InjectRepository(Transcript)
    private transcriptRepository: Repository<Transcript>,
  ) {
  }

  async createOne(
    createDto: CreateTranscriptDto,
    queryRunner?: QueryRunner,
  ): Promise<Transcript> {
    const { videoId, content } = createDto;
    const manager = queryRunner?.manager || this.transcriptRepository.manager;

    try {
      // Check if transcript already exists
      const existingTranscript = await manager.findOne(Transcript, {
        where: { video: { id: videoId } },
      });

      if (existingTranscript) {
        throw new HttpException(
          'Transcript already exists for this video',
          HttpStatus.CONFLICT,
        );
      }

      const transcript = manager.create(Transcript, {
        video: { id: videoId },
        content,
      });

      return manager.save(Transcript, transcript);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to create transcript: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
