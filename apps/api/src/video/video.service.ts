import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PaginationDto,
  PaginatedResponseDto,
  PaginationMeta,
} from './dto/pagination.dto';
import { Video } from '@polinote/entities';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) { }

  async createOne(createVideoDto: CreateVideoDto): Promise<Video> {
    // Check if video exists
    const existingVideo = await this.videoRepository.findOne({
      where: { youtubeVideoId: createVideoDto.youtubeVideoId },
    });

    if (existingVideo) {
      throw new HttpException(
        'Video already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // Create a new Video entity instance with proper ID generation
    const video = this.videoRepository.create(createVideoDto);
    const savedVideo = await this.videoRepository.save(video);
    return savedVideo;
  }

  async findPaginated(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Video>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await this.videoRepository.findAndCount({
      order: { createdAt: 'ASC' },
      take: limit,
      skip: skip,
    });

    const meta = new PaginationMeta();
    meta.currentPage = page;
    meta.totalPages = Math.ceil(totalItems / limit);
    meta.itemsPerPage = limit;

    const response = new PaginatedResponseDto<Video>();
    response.items = items;
    response.meta = meta;

    return response;
  }

  async findOne(id: string): Promise<Video> {
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
      where: { youtubeVideoId: youtubeId },
      relations: ['transcript', 'summaries'],
    });

    if (!video) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    return video;
  }
}
