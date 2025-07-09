import { google } from 'googleapis';
import { config } from "dotenv";
import { YoutubeMetadata } from '../types';
import { Logger } from '../utils/logger';

config();

export class YouTubeClient {
  private youtube = google.youtube('v3');

  /**
   * Get YouTube video metadata
   */
  async getMetadata(videoId: string): Promise<YoutubeMetadata> {
    try {
      const response = await this.youtube.videos.list({
        key: process.env.YOUTUBE_API_KEY || '',
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
      Logger.error('Error fetching YouTube metadata', error as Error);
      throw error;
    }
  }

  /**
   * Extract video ID from YouTube URL
   */
  extractVideoId(youtubeUrl: string): string {
    try {
      const url = new URL(youtubeUrl);
      const videoId = url.searchParams.get('v');
      if (!videoId) {
        throw new Error('Invalid YouTube URL: could not extract video ID');
      }
      return videoId;
    } catch (error) {
      Logger.error('Error extracting video ID', error as Error);
      throw error;
    }
  }
} 