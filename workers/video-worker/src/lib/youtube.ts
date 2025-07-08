import { google } from 'googleapis';
import { config } from "dotenv";
config();

const youtube = google.youtube('v3');

export interface YoutubeMetadata {
  title: string;
  description: string;
  published_at: Date;
  thumbnail_url: string;
}

export async function getYoutubeMetadata(
  videoId: string,
): Promise<YoutubeMetadata> {
  try {
    const response = await youtube.videos.list({
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
    console.error('Error fetching YouTube metadata:', error);
    throw error;
  }
}