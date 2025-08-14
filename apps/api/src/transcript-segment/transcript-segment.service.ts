import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { CreateTranscriptSegmentDto } from './dto/create-transcript-segment.dto';
import { TranscriptSegment, Transcript } from '@polinote/entities';

@Injectable()
export class TranscriptSegmentService {
  constructor(
    @InjectRepository(TranscriptSegment)
    private transcriptSegmentRepository: Repository<TranscriptSegment>,
  ) { }

  async createOne(
    createDto: CreateTranscriptSegmentDto,
    queryRunner?: QueryRunner,
  ): Promise<TranscriptSegment> {
    const { videoId, start, end, text } = createDto;
    const manager = queryRunner?.manager || this.transcriptSegmentRepository.manager;

    try {
      // Find the transcript for this video
      const transcript = await manager.findOne(Transcript, {
        where: { video: { id: videoId } },
      });

      if (!transcript) {
        throw new HttpException(
          'Transcript not found for this video',
          HttpStatus.NOT_FOUND,
        );
      }

      const segment = manager.create(TranscriptSegment, {
        transcript: { id: transcript.id },
        start,
        end,
        text,
      });

      return manager.save(TranscriptSegment, segment);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to create transcript segment: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createMany(
    videoId: string,
    segments: Array<{ start: number; end: number; text: string }>,
    queryRunner?: QueryRunner,
  ): Promise<TranscriptSegment[]> {
    const manager = queryRunner?.manager || this.transcriptSegmentRepository.manager;

    try {
      // Find the transcript for this video
      const transcript = await manager.findOne(Transcript, {
        where: { video: { id: videoId } },
      });

      if (!transcript) {
        throw new HttpException(
          'Transcript not found for this video',
          HttpStatus.NOT_FOUND,
        );
      }

      // Create all segments
      const segmentEntities = segments.map(segment =>
        manager.create(TranscriptSegment, {
          transcript: { id: transcript.id },
          start: segment.start, 
          end: segment.end,
          text: segment.text,
        })
      );

      return manager.save(TranscriptSegment, segmentEntities);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to create transcript segments: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByVideoId(videoId: string): Promise<TranscriptSegment[]> {
    return this.transcriptSegmentRepository.find({
      where: { transcript: { video: { id: videoId } } },
      order: { start: 'ASC' },
    });
  }
} 