import { execSync } from 'child_process';
import { AudioSplit } from '../types';
import { Logger } from '../utils/logger';

export class MediaToolsClient {
  /**
   * Get audio duration using ffprobe
   */
  getAudioDuration(audioPath: string): number {
    try {
      const command = `ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`;
      const output = execSync(command, { encoding: 'utf8' });
      return parseFloat(output.trim());
    } catch (error) {
      Logger.error('Failed to get audio duration', error as Error);
      throw error;
    }
  }

  /**
   * Split an audio file into multiple parts based on the provided splits array.
   * Each part is saved as a separate file in the same directory as the input file.
   *
   * @param inputPath - The path to the input audio file.
   * @param splits - An array of objects specifying the start time and duration of each part.
   * @returns An array of paths to the split audio files.
   */
  splitAudio(inputPath: string, splits: AudioSplit[]): string[] {
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
        splitedAudioPaths.push(output);
      } catch (error) {
        Logger.error(`Failed to split audio: ${output}`, error as Error);
        throw error;
      }
    }

    return splitedAudioPaths;
  }

  /**
   * Download audio from YouTube using yt-dlp
   */
  downloadAudio(youtubeUrl: string, outputPath: string): void {
    try {
      const command = `yt-dlp -x --audio-format mp3 -o "${outputPath}" "${youtubeUrl}"`;
      execSync(command, { stdio: 'inherit' });
    } catch (error) {
      Logger.error('Failed to download audio', error as Error);
      throw new Error(`Failed to download audio from ${youtubeUrl}: ${error}`);
    }
  }
} 