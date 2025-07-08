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
import { VideoBatchService } from './video-batch.service';
import { PaginationDto, PaginatedResponseDto } from './dto/pagination.dto';
import { Video } from '@polinote/entities';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoQueueService } from './video-queue.service';
import { ProcessVideoDto, VideoJobResponseDto, VideoJobStatusDto } from './dto/process.video.dto';

@Controller('videos')
@UseInterceptors(ClassSerializerInterceptor)
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly videoBatchService: VideoBatchService,
    private readonly videoQueueService: VideoQueueService,
  ) { }

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

  @Post('process')
  @HttpCode(HttpStatus.ACCEPTED)
  async processVideo(
    @Body() processVideoDto: ProcessVideoDto,
  ): Promise<VideoJobResponseDto> {
    try {
      // Extract video ID from YouTube URL
      const url = new URL(processVideoDto.youtubeUrl);
      const videoId = url.searchParams.get('v');

      if (!videoId) {
        throw new HttpException(
          'Invalid YouTube URL: could not extract video ID',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if video already exists in database
      try {
        const existingVideo = await this.videoService.findByYoutubeId(videoId);
        if (existingVideo) {
          throw new HttpException(
            'Video already exists in database',
            HttpStatus.CONFLICT,
          );
        }
      } catch (error) {
        if (error.status !== HttpStatus.NOT_FOUND) {
          throw error;
        }
      }

      // Add job to queue
      const jobResult = await this.videoQueueService.addJob(
        processVideoDto.youtubeUrl,
      );

      return {
        jobId: jobResult.jobId || '',
        status: jobResult.status || '',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to process video: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('job/:jobId/status')
  async getJobStatus(@Param('jobId') jobId: string): Promise<VideoJobStatusDto> {
    try {
      const status = await this.videoQueueService.getJobStatus(jobId);

      if (status.status === 'not_found') {
        throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
      }

      return {
        jobId: status.jobId || '',
        status: status.status || '',
        progress: status.progress as number || undefined,
        result: status.result || undefined,
        failedReason: status.failedReason || undefined,
        timestamp: status.timestamp || 0,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to get job status: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('job/:jobId/result')
  async getJobResult(@Param('jobId') jobId: string) {
    try {
      const result = await this.videoQueueService.getJobResult(jobId);

      if (!result) {
        throw new HttpException('Job result not found or not completed', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to get job result: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
