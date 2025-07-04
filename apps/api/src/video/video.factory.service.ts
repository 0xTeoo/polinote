import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { TranscriptService } from '../transcript/transcript.service';
import { SummaryService } from '../summary/summary.service';
import { google } from 'googleapis';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { splitAudioFile } from 'src/common/utils/audio.utils';
import { downloadYoutubeAudio } from 'src/common/utils/audio.utils';
import { Language, Video } from '@polinote/entities';

const youtube = google.youtube('v3');

interface YoutubeMetadata {
  title: string;
  description: string;
  published_at: Date;
  thumbnail_url: string;
}

@Injectable()
export class VideoFactoryService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private transcriptService: TranscriptService,
    private summaryService: SummaryService,
  ) {}

  private async fetchYoutubeMetadata(
    videoId: string,
  ): Promise<YoutubeMetadata> {
    try {
      const response = await youtube.videos.list({
        key: process.env.YOUTUBE_API_KEY,
        part: ['snippet'],
        id: [videoId],
      });

      const video = response.data.items?.[0];
      if (!video || !video.snippet) {
        throw new Error('Video not found');
      }

      const { snippet } = video;
      return {
        title: snippet.title || '',
        description: snippet.description || '',
        published_at: new Date(snippet.publishedAt || ''),
        thumbnail_url:
          snippet.thumbnails?.maxres?.url ||
          snippet.thumbnails?.high?.url ||
          `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to fetch YouTube metadata: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async createVideoEntity({
    youtubeVideoId,
    metadata,
    queryRunner,
  }: {
    youtubeVideoId: string;
    metadata: YoutubeMetadata;
    queryRunner: QueryRunner;
  }): Promise<Video> {
    const video = new Video();
    video.youtubeVideoId = youtubeVideoId;
    video.title = metadata.title;
    video.description = metadata.description;
    video.publishedAt = metadata.published_at;
    video.thumbnailUrl = metadata.thumbnail_url;

    return queryRunner.manager.save(video);
  }

  private async createTranscriptAndSummaries({
    video,
    youtubeVideoId,
    queryRunner,
  }: {
    video: Video;
    youtubeVideoId: string;
    queryRunner: QueryRunner;
  }): Promise<void> {
    // Step 1: Download audio using yt-dlp
    const downloadedAudioPath = downloadYoutubeAudio(youtubeVideoId);

    // Step 2: Split the audio file
    const splitedAudioPaths = splitAudioFile(downloadedAudioPath, [
      { start: 0, duration: 1450 },
      { start: 1450 },
    ]);

    // Step 3: Create Full Transcript
    const transcript = await this.transcriptService.createOne(
      {
        videoId: video.id,
        audioPaths: splitedAudioPaths,
      },
      queryRunner,
    );

    // // Step 4: Create Transcript Segments
    // const transcriptSegments = await this.transcriptService.createSegments(
    //   transcript.content,
    //   queryRunner,
    // );

    // Create summaries in parallel
    await Promise.all([
      this.summaryService.createOne(
        {
          videoId: video.id,
          transcript: transcript.content,
          language: Language.EN,
        },
        queryRunner,
      ),
      this.summaryService.createOne(
        {
          videoId: video.id,
          transcript: transcript.content,
          language: Language.KO,
        },
        queryRunner,
      ),
    ]);
  }

  async createVideo(createVideoDto: CreateVideoDto): Promise<Video> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Fetch metadata
      const metadata = await this.fetchYoutubeMetadata(
        createVideoDto.youtubeVideoId,
      );

      // 2. Create video entity
      const video = await this.createVideoEntity({
        youtubeVideoId: createVideoDto.youtubeVideoId,
        metadata,
        queryRunner,
      });

      // 3. Create transcript and summaries
      await this.createTranscriptAndSummaries({
        video,
        youtubeVideoId: createVideoDto.youtubeVideoId,
        queryRunner,
      });

      // 4. Commit transaction
      await queryRunner.commitTransaction();

      // 5. Return complete video with relations
      const result = await queryRunner.manager.findOne(Video, {
        where: { id: video.id },
        relations: ['transcript', 'summaries'],
      });

      if (!result) {
        throw new Error('Failed to fetch created video with relations');
      }

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        `Failed to create video: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
