import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { Storage } from './storage';

/**
 * Download audio from a YouTube video using yt-dlp
 */
export async function downloadAudio(youtubeUrl: string, videoId: string): Promise<string> {
  const storage = new Storage();

  // Use temporary directory for download
  const tempDir = process.env.TEMP_DIR || './temp';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempAudioPath = path.join(tempDir, `${videoId}.mp3`);

  try {
    console.log(`Downloading audio for video ID: ${videoId}`);

    // Use yt-dlp to download audio to temp location
    const command = `yt-dlp -x --audio-format mp3 -o "${tempAudioPath}" "${youtubeUrl}"`;
    execSync(command);

    // Move to storage directory
    const audioPath = await storage.moveAudioFile(tempAudioPath, videoId);

    console.log(`Audio downloaded and moved to: ${audioPath}`);

    return audioPath;
  } catch (error) {
    console.error(`Failed to download audio: ${error}`);
    throw new Error(`Failed to download audio from ${youtubeUrl}: ${error}`);
  }
}
