import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { Storage } from './storage';
import { generateSplits, splitAudioFile } from './utils/audio';

interface DownloadResult {
  audioPath: string;
  splitPaths?: string[];
}

interface SplitConfig {
  maxDuration?: number; // Maximum duration in seconds for each split
  splits?: Array<{ start: number; duration?: number }>; // Custom splits
}

/**
 * Download audio from a YouTube video using yt-dlp
 */
export async function downloadAudio({
  youtubeUrl,
  videoId,
  splitConfig,
}: {
  youtubeUrl: string;
  videoId: string;
  splitConfig?: SplitConfig;
}
): Promise<DownloadResult> {
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
    execSync(command, { stdio: 'inherit' });

    // Verify file was downloaded
    if (!fs.existsSync(tempAudioPath)) {
      throw new Error(`Audio file was not downloaded to expected path: ${tempAudioPath}`);
    }

    // Move to storage directory
    const finalAudioPath = await storage.moveAudioFile(tempAudioPath, videoId);

    console.log(`Audio downloaded and moved to: ${finalAudioPath}`);

    let splitPaths: string[] | undefined;

    // Split audio if configuration is provided
    if (splitConfig) {
      let splits: Array<{ start: number; duration?: number }>;

      if (splitConfig.splits) {
        splits = splitConfig.splits;
      } else if (splitConfig.maxDuration) {
        splits = generateSplits(finalAudioPath, splitConfig.maxDuration);
      } else {
        throw new Error('Split configuration must provide either splits or maxDuration');
      }

      if (splits.length > 1) {
        console.log(`Splitting audio into ${splits.length} parts...`);
        splitPaths = splitAudioFile(finalAudioPath, splits);
        console.log(`Audio split successfully into ${splitPaths.length} parts`);
      }
    }

    return {
      audioPath: finalAudioPath,
      splitPaths,
    };

  } catch (error) {
    console.error(`Failed to download audio: ${error}`);
    throw new Error(`Failed to download audio from ${youtubeUrl}: ${error}`);
  }
}
