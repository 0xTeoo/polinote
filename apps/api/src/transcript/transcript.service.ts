import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { Transcript } from '../entities/transcript.entity';
import { CreateTranscriptDto } from './dto/create-transcript.dto';
import OpenAI from 'openai';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TranscriptService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(Transcript)
    private transcriptRepository: Repository<Transcript>,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.getOrThrow<string>("openai.apiKey"),
    });
  }

  async fetchRawTranscript(audioPaths: string[]): Promise<string> {
    try {
      const transcriptions = await Promise.all(
        audioPaths.map(async (path) => {
          const transcription = await this.openai.audio.transcriptions.create({
            file: fs.createReadStream(path),
            model: 'whisper-1',
          });

          return transcription.text;
        }),
      );

      const fullTranscription = transcriptions.join('\n');

      return fullTranscription;
    } catch (error) {
      console.error('Error during transcription:', error);
      throw new HttpException(
        `Failed to fetch transcript: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createOne(
    createDto: CreateTranscriptDto,
    queryRunner?: QueryRunner,
  ): Promise<Transcript> {
    const { video_id, audio_paths } = createDto;
    const manager = queryRunner?.manager || this.transcriptRepository.manager;

    try {
      // Check if transcript already exists
      const existingTranscript = await manager.findOne(Transcript, {
        where: { video_id },
      });

      if (existingTranscript) {
        throw new HttpException(
          'Transcript already exists for this video',
          HttpStatus.CONFLICT,
        );
      }

      const rawTranscript = await this.fetchRawTranscript(audio_paths);

      const transcript = manager.create(Transcript, {
        video_id,
        content: rawTranscript,
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
