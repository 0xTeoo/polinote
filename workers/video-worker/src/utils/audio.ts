import { execSync } from "child_process";

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

/**
 * Get audio duration using ffprobe
 */
export function getAudioDuration(audioPath: string): number {
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
export function generateSplits(audioPath: string, maxDuration: number): Array<{ start: number; duration?: number }> {
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