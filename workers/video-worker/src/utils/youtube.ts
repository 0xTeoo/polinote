/**
 * Extract video ID from YouTube URL
 */
export function extractVideoId(youtubeUrl: string): string {
  const url = new URL(youtubeUrl);
  const videoId = url.searchParams.get('v');
  if (!videoId) {
    throw new Error('Invalid YouTube URL: could not extract video ID');
  }
  return videoId;
}
