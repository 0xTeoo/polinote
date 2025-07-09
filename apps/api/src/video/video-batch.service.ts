import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { google } from 'googleapis';
import { VideoService } from './video.service';

const youtube = google.youtube('v3');
const WHITEHOUSE_CHANNEL_ID = 'UCYxRlFDqcWM4y7FfpiAN3KQ'; // @WhiteHouse channel ID

@Injectable()
export class VideoBatchService {
  private readonly logger = new Logger(VideoBatchService.name);

  constructor(private readonly videoService: VideoService) { }

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

      // 3. Create new video
      await this.videoService.createOne({
        youtubeVideoId: latestBriefing.id.videoId,
      });

      this.logger.log(
        `Successfully crawled and saved video: ${latestBriefing.id.videoId}`,
      );
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
