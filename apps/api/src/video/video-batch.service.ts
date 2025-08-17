import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { google } from 'googleapis';
import { VideoQueueService } from './video-queue.service';
import { VideoService } from './video.service';

const youtube = google.youtube('v3');
const WHITEHOUSE_CHANNEL_ID = 'UCYxRlFDqcWM4y7FfpiAN3KQ'; // @WhiteHouse channel ID

@Injectable()
export class VideoBatchService {
  private readonly logger = new Logger(VideoBatchService.name);

  constructor(
    private readonly videoQueueService: VideoQueueService,
    private readonly videoService: VideoService
  ) { }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async crawlLatestBriefingVideo() {
    try {
      this.logger.log('Starting to crawl latest briefing video...');

      // 1. Search for latest videos from White House channel
      const searchResponse = await youtube.search.list({
        key: process.env.YOUTUBE_API_KEY,
        part: ['snippet'],
        channelId: WHITEHOUSE_CHANNEL_ID,
        maxResults: 30,
        order: 'date',
        type: ['video'],
      });

      // 2. Find the latest briefing video
      const latestBriefing = searchResponse.data.items?.find((item) =>
        item.snippet?.title?.startsWith('Press Secretary Karoline Leavitt'),
      );

      if (!latestBriefing || !latestBriefing.id?.videoId) {
        this.logger.warn('No new briefing video found');
        return;
      }

      // 3. Check if the video already exists
      const existingVideo = await this.videoService.findByYoutubeId(latestBriefing.id.videoId);

      if (existingVideo) {
        this.logger.warn('Video already exists, skipping...');
        return;
      }

      // 4. Add job to the video queue
      this.videoQueueService.addJob(`https://www.youtube.com/watch?v=${latestBriefing.id.videoId}`);

      this.logger.log(`Successfully added job to the video queue: ${latestBriefing.id.videoId}`);
    } catch (error) {
      this.logger.error('Failed to crawl latest briefing video:', error);
      throw error;
    }
  }

  // Manual trigger for testing
  async crawlLatestBriefingVideoManually() {
    return this.crawlLatestBriefingVideo();
  }
}
