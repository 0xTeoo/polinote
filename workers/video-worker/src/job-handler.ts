import { Job } from "bullmq";
import { downloadAudio } from "./download-audio";
import { transcribeAudio } from "./transcribe-audio";
import { summarize } from "./summarize";
import { Language } from "@polinote/entities";
import { Storage } from "./storage";
import { getYoutubeMetadata, YoutubeMetadata } from "./lib/youtube";
import { extractVideoId } from "./utils/youtube";
import { getAudioDuration, splitAudioFile } from "./utils/audio";

interface VideoJobData {
  youtubeUrl: string;
}

interface JobResult {
  videoId: string;
  metadata: YoutubeMetadata;
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

export async function jobHandler(job: Job<VideoJobData>): Promise<JobResult> {
  const { youtubeUrl } = job.data;
  const videoId = extractVideoId(youtubeUrl);

  console.log(`Processing job ${job.id} for URL: ${youtubeUrl}`);

  try {
    // Initialize storage
    const storage = new Storage();

    // Step 0: Fetch YouTube metadata
    console.log("Step 0: Fetching YouTube metadata...");
    const metadata = await getYoutubeMetadata(videoId);

    // Step 1: Download audio
    console.log("Step 1: Downloading audio...");
    const downloadedAudioPath = await downloadAudio(youtubeUrl, videoId);

    // Step 2: Check audio duration and split if necessary
    console.log("Step 2: Checking audio duration...");
    const audioDuration = getAudioDuration(downloadedAudioPath);
    console.log(`Audio duration: ${audioDuration} seconds`);

    let audioPaths: string[];
    const MAX_DURATION = 1450; // 24 minutes and 10 seconds

    if (audioDuration <= MAX_DURATION) {
      console.log("Audio is under 24 minutes, no splitting needed");
      audioPaths = [downloadedAudioPath];
    } else {
      console.log("Audio is over 24 minutes, splitting into parts...");
      audioPaths = splitAudioFile(downloadedAudioPath, [
        { start: 0, duration: MAX_DURATION },
        { start: MAX_DURATION },
      ]);
    }

    // Step 3: Transcribe audio
    console.log("Step 2: Transcribing audio...");
    const { rawTranscript, transcriptSegments } = await transcribeAudio(audioPaths);

    // Step 4: Summarize transcript
    console.log("Step 3: Summarizing transcript...");
    const summaries = await Promise.all([
      summarize(rawTranscript, Language.KO),
      summarize(rawTranscript, Language.EN),
    ]);

    const result: JobResult = {
      videoId,
      metadata,
      rawTranscript,
      transcriptSegments,
      summaries,
    };

    // Step 4: Save results to data directory
    console.log("Step 4: Saving results to data directory...");
    const resultPath = await storage.saveJobResults(videoId, result);

    console.log(`Job ${job.id} completed successfully`);
    console.log(`Files saved:`);
    console.log(`  - Audio: ${downloadedAudioPath}`);
    console.log(`  - Results: ${resultPath}`);
    return result;
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error);
    throw error;
  }
}
