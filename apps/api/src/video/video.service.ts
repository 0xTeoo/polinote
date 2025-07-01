import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../entities/video.entity';
import { VideoFactoryService } from './video.factory.service';
import {
  PaginationDto,
  PaginatedResponseDto,
  PaginationMeta,
} from './dto/pagination.dto';

interface CreateVideoDto {
  youtube_video_id: string;
}

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    private videoFactoryService: VideoFactoryService,
  ) {}

  async createOne(createVideoDto: CreateVideoDto): Promise<Video> {
    // Check if video exists
    const existingVideo = await this.videoRepository.findOne({
      where: { youtube_video_id: createVideoDto.youtube_video_id },
    });

    if (existingVideo) {
      throw new HttpException(
        'Video already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const video = await this.videoFactoryService.createVideo(createVideoDto);

    if (!video) {
      throw new HttpException(
        'Failed to create video',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return video;
  }

  async findPaginated(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Video>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, total_items] = await this.videoRepository.findAndCount({
      order: { created_at: 'ASC' },
      take: limit,
      skip: skip,
    });

    const meta = new PaginationMeta();
    meta.current_page = page;
    meta.total_pages = Math.ceil(total_items / limit);
    meta.items_per_page = limit;

    const response = new PaginatedResponseDto<Video>();
    response.items = items;
    response.meta = meta;

    return response;
  }

  async findOne(id: number): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['transcript', 'summaries'],
    });

    if (!video) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    return video;
  }

  async findByYoutubeId(youtubeId: string): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: { youtube_video_id: youtubeId },
      relations: ['transcript', 'summaries'],
    });

    if (!video) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    return video;
  }
}
