import * as fs from "fs";
import * as path from "path";

interface StorageConfig {
  baseDir: string;
}

/**
 * Storage utility for saving video processing results
 */
export class Storage {
  private config: StorageConfig;

  constructor(baseDir: string = "./data") {
    this.config = {
      baseDir,
    };

    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    if (!fs.existsSync(this.config.baseDir)) {
      fs.mkdirSync(this.config.baseDir, { recursive: true });
      console.log(`Created directory: ${this.config.baseDir}`);
    }
  }

  /**
   * Get video directory path
   */
  private getVideoDir(videoId: string): string {
    return path.join(this.config.baseDir, videoId);
  }

  /**
   * Ensure video directory exists
   */
  private ensureVideoDir(videoId: string): string {
    const videoDir = this.getVideoDir(videoId);
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
      console.log(`Created video directory: ${videoDir}`);
    }
    return videoDir;
  }

  /**
   * Save complete job results to result.json
   */
  async saveJobResults(
    videoId: string,
    result: {
      videoId: string;
      rawTranscript: string;
      transcriptSegments: Array<{
        start: number;
        end: number;
        text: string;
      }>;
      summaries: Array<{
        overview: string;
        keySections: {
          introduction: string;
          mainPoints: string[];
          conclusion: string;
        };
        analysis: string;
      }>;
    }
  ): Promise<string> {
    const videoDir = this.ensureVideoDir(videoId);
    const filepath = path.join(videoDir, "result.json");

    await fs.promises.writeFile(filepath, JSON.stringify(result, null, 2), "utf-8");
    console.log(`Job results saved: ${filepath}`);
    return filepath;
  }

  /**
   * Read job results from file
   */
  async readJobResults(videoId: string): Promise<any> {
    const filepath = path.join(this.getVideoDir(videoId), "result.json");

    if (!fs.existsSync(filepath)) {
      throw new Error(`Job results file not found: ${filepath}`);
    }

    const content = await fs.promises.readFile(filepath, "utf-8");
    return JSON.parse(content);
  }

  /**
   * Get audio file path for a video
   */
  getAudioPath(videoId: string): string {
    return path.join(this.getVideoDir(videoId), "audio.mp3");
  }

  /**
   * Check if audio file exists for a video
   */
  hasAudio(videoId: string): boolean {
    return fs.existsSync(this.getAudioPath(videoId));
  }

  /**
   * Move audio file to storage directory
   */
  async moveAudioFile(oldPath: string, videoId: string): Promise<string> {
    const newPath = this.getAudioPath(videoId);
    this.ensureVideoDir(videoId);

    if (fs.existsSync(oldPath)) {
      await fs.promises.rename(oldPath, newPath);
      console.log(`Audio file moved to: ${newPath}`);
      return newPath;
    } else {
      throw new Error(`Audio file not found at: ${oldPath}`);
    }
  }

  /**
   * Check if files exist for a video
   */
  hasFiles(videoId: string): {
    audio: boolean;
    result: boolean;
  } {
    const videoDir = this.getVideoDir(videoId);
    const audioPath = path.join(videoDir, "audio.mp3");
    const resultPath = path.join(videoDir, "result.json");

    return {
      audio: fs.existsSync(audioPath),
      result: fs.existsSync(resultPath),
    };
  }

  /**
   * List all available video IDs
   */
  listAvailableVideos(): string[] {
    if (!fs.existsSync(this.config.baseDir)) {
      return [];
    }

    const items = fs.readdirSync(this.config.baseDir, { withFileTypes: true });
    return items
      .filter(item => item.isDirectory())
      .map(item => item.name)
      .sort();
  }

  /**
   * Get video directory info
   */
  getVideoInfo(videoId: string): {
    exists: boolean;
    path: string;
    files: string[];
  } {
    const videoDir = this.getVideoDir(videoId);
    const exists = fs.existsSync(videoDir);

    if (!exists) {
      return {
        exists: false,
        path: videoDir,
        files: [],
      };
    }

    const files = fs.readdirSync(videoDir);
    return {
      exists: true,
      path: videoDir,
      files: files.sort(),
    };
  }
}
