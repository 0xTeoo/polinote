import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDTO } from '../common/dto/pagination.dto';
import { getPaginationParams } from '../common/utils/pagination.util';
import { Video } from '@polinote/entities';
import { CreateVideoDto } from './dto/create-video.dto';
import { PaginationResult } from '../types';

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

  async findAll(paginationQueryDto: PaginationQueryDTO): Promise<PaginationResult<Video>> {
    const { page, limit, skip } = getPaginationParams(paginationQueryDto);

    const [items, totalItems] = await this.videoRepository.findAndCount({
      order: { createdAt: 'ASC' },
      take: limit,
      skip: skip,
    });

    return {
      items,
      totalItems,
      page,
      limit,
    };
  }

  async findPaginated(
    paginationQueryDto: PaginationQueryDTO,
  ) {
    const { page, limit, skip } = getPaginationParams(paginationQueryDto);

    const [items, totalItems] = await this.videoRepository.findAndCount({
      order: { createdAt: 'ASC' },
      take: limit,
      skip: skip,
    });
    return {
      items,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        itemsPerPage: limit,
        totalItems: totalItems,
      }
    }
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

  async remove(id: string): Promise<void> {
    const video = await this.findOne(id);
    await this.videoRepository.remove(video);
  }
}
