import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  HttpException,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoBatchService } from './video.batch.service';
import { PaginationDto, PaginatedResponseDto } from './dto/pagination.dto';
import { Video } from '@polinote/entities';
import { CreateVideoDto } from './dto/create-video.dto';

@Controller('videos')
@UseInterceptors(ClassSerializerInterceptor)
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly videoBatchService: VideoBatchService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOne(
    @Body() createVideoDto: CreateVideoDto,
  ): Promise<Video | null> {
    const newVideo = await this.videoService.createOne(createVideoDto);
    if (!newVideo) {
      throw new HttpException(
        'Failed to create video',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newVideo;
  }

  @Post('crawl-latest')
  @HttpCode(HttpStatus.OK)
  async crawlLatest() {
    try {
      await this.videoBatchService.crawlLatestBriefingVideoManually();
      return { message: 'Crawling process completed' };
    } catch (error) {
      throw new HttpException(
        `Failed to crawl latest briefing video: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findPaginated(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Video>> {
    return this.videoService.findPaginated(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Video> {
    return this.videoService.findOne(id);
  }

  @Get('youtube/:video_id')
  async findByYoutubeId(@Param('video_id') videoId: string): Promise<Video> {
    return this.videoService.findByYoutubeId(videoId);
  }
}
