import { execSync } from 'child_process';
import * as path from 'path';

/**
 * Download an audio file from a YouTube video and save it as an MP3 file.
 *
 * @param youtubeVideoId - The ID of the YouTube video to download.
 * @returns The path to the downloaded audio file.
 */
export function downloadYoutubeAudio(youtubeVideoId: string): string {
  const filePath = path.join(__dirname, `${youtubeVideoId}.mp3`);
  execSync(
    `yt-dlp -x --audio-format mp3 -o "${filePath}" "https://www.youtube.com/watch?v=${youtubeVideoId}"`,
  );
  return filePath;
}

/**
 * Split an audio file into multiple parts based on the provided splits array.
 * Each part is saved as a separate file in the same directory as the input file.
 *
 * @param inputPath - The path to the input audio file.
 * @param splits - An array of objects specifying the start time and duration of each part.
 * @returns An array of paths to the split audio files.
 */
export function splitAudioFile(
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
