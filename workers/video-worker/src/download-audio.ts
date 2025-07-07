import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { Storage } from './storage';

interface DownloadResult {
  audioPath: string;
  videoId: string;
  splitPaths?: string[];
}

interface SplitConfig {
  maxDuration?: number; // Maximum duration in seconds for each split
  splits?: Array<{ start: number; duration?: number }>; // Custom splits
}

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(youtubeUrl: string): string {
  const url = new URL(youtubeUrl);
  const videoId = url.searchParams.get('v');
  if (!videoId) {
    throw new Error('Invalid YouTube URL: could not extract video ID');
  }
  return videoId;
}

/**
 * Split an audio file into multiple parts based on the provided splits array.
 * Each part is saved as a separate file in the same directory as the input file.
 *
 * @param inputPath - The path to the input audio file.
 * @param splits - An array of objects specifying the start time and duration of each part.
 * @returns An array of paths to the split audio files.
 */
function splitAudioFile(
  inputPath: string,
  splits: Array<{ start: number; duration?: number }>,
): string[] {
  let splitedAudioPaths: string[] = [];

  for (let i = 0; i < splits.length; i++) {
    const { start, duration } = splits[i];

    const output = `${inputPath.split('.')[0]}_${i}.mp3`;
    const args = [
      `-i "${inputPath}"`,
      `-ss ${start}`,
      duration !== undefined ? `-t ${duration}` : '',
      `-c copy "${output}"`,
    ]
      .filter(Boolean)
      .join(' ');
    try {
      execSync(`ffmpeg ${args}`);
    } catch (error) {
      console.error(`Failed to split audio: ${output}`, error);
      throw error;
    }
    splitedAudioPaths.push(output);
  }

  return splitedAudioPaths;
}

/**
 * Get audio duration using ffprobe
 */
function getAudioDuration(audioPath: string): number {
  try {
    const command = `ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`;
    const output = execSync(command, { encoding: 'utf8' });
    return parseFloat(output.trim());
  } catch (error) {
    console.error(`Failed to get audio duration: ${error}`);
    throw error;
  }
}

/**
 * Generate splits for audio file based on max duration
 */
function generateSplits(audioPath: string, maxDuration: number): Array<{ start: number; duration?: number }> {
  const totalDuration = getAudioDuration(audioPath);
  const splits: Array<{ start: number; duration?: number }> = [];

  for (let start = 0; start < totalDuration; start += maxDuration) {
    const remainingDuration = totalDuration - start;
    const duration = Math.min(maxDuration, remainingDuration);

    splits.push({
      start,
      duration: duration < maxDuration ? undefined : duration, // Don't specify duration for the last chunk
    });
  }

  return splits;
}

/**
 * Download audio from a YouTube video using yt-dlp
 */
export async function downloadAudio(
  youtubeUrl: string,
  splitConfig?: SplitConfig
): Promise<DownloadResult> {
  const videoId = extractVideoId(youtubeUrl);
  const storage = new Storage();

  // Check if audio already exists
  if (storage.hasAudio(videoId)) {
    console.log(`Audio file already exists for video ID: ${videoId}`);
    return {
      audioPath: storage.getAudioPath(videoId),
      videoId,
    };
  }

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
      videoId,
      splitPaths,
    };

  } catch (error) {
    console.error(`Failed to download audio: ${error}`);
    throw new Error(`Failed to download audio from ${youtubeUrl}: ${error}`);
  }
}
