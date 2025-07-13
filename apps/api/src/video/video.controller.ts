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
  Delete,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoBatchService } from './video-batch.service';
import { PaginationQueryDTO, PaginationResponseDto } from '../common/dto/pagination.dto';
import { Language } from '@polinote/entities';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoQueueService } from './video-queue.service';
import { ProcessVideoDto, VideoJobResponseDto, VideoJobStatusDto } from './dto/process.video.dto';
import { VideoResponseDto } from './dto/video-response.dto';
import { SummaryService } from '../summary/summary.service';
import { TranscriptSegmentService } from '../transcript-segment/transcript-segment.service';
import { SummaryResponseDto } from '../summary/dto/summary-response.dto';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly videoBatchService: VideoBatchService,
    private readonly videoQueueService: VideoQueueService,
    private readonly summaryService: SummaryService,
    private readonly transcriptSegmentService: TranscriptSegmentService,
  ) { }

  @Get()
  async findAll(
    @Query() paginationQuery: PaginationQueryDTO,
  ): Promise<PaginationResponseDto<VideoResponseDto>> {
    const result = await this.videoService.findAll(paginationQuery);
    return PaginationResponseDto.from(result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<VideoResponseDto> {
    const video = await this.videoService.findOne(id);
    return VideoResponseDto.from(video);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createVideoDto: CreateVideoDto): Promise<VideoResponseDto> {
    const video = await this.videoService.createOne(createVideoDto);
    return VideoResponseDto.from(video);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.videoService.remove(id);
  }

  @Get(':id/summaries')
  async findVideoSummaries(@Param('id') id: string): Promise<SummaryResponseDto[]> {
    const video = await this.videoService.findOne(id);
    return video.summaries.map(SummaryResponseDto.from);
  }

  @Get(':id/summaries/:language')
  async findVideoSummaryByLanguage(
    @Param('id') id: string,
    @Param('language') language: Language,
  ): Promise<SummaryResponseDto> {
    const summary = await this.summaryService.findByVideoIdAndLanguage(id, language);
    return SummaryResponseDto.from(summary);
  }

  @Get(':id/transcript-segments')
  async findVideoTranscriptSegments(@Param('id') id: string) {
    return this.transcriptSegmentService.findByVideoId(id);
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

  @Post('batch/crawl')
  @HttpCode(HttpStatus.ACCEPTED)
  async crawlLatestBriefingVideo() {
    await this.videoBatchService.crawlLatestBriefingVideoManually();
    return { message: 'Crawl job started' };
  }
}
