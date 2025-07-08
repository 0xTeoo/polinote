import { Job } from "bullmq";
import { downloadAudio } from "./download-audio";
import { transcribeAudio } from "./transcribe-audio";
import { summarize } from "./summarize";
import { Language } from "@polinote/entities";
import { Storage } from "./storage";
import { getYoutubeMetadata, YoutubeMetadata } from "./lib/youtube";
import { extractVideoId } from "./utils/youtube";

interface VideoJobData {
  youtubeUrl: string;
}

interface JobResult {
  videoId: string;
  metadata: YoutubeMetadata;
  audioPath: string;
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

    // Step 1: Download audio and split it into 2 parts
    // - 1450 seconds is the maximum duration for the audio to be transcribed using whisper
    console.log("Step 1: Downloading audio...");
    const { audioPath } = await downloadAudio({
      youtubeUrl,
      videoId,
      splitConfig: {
        splits: [
          { start: 0, duration: 1450 },
          { start: 1450 },
        ]
      }
    });

    // Step 2: Transcribe audio
    console.log("Step 2: Transcribing audio...");
    const { rawTranscript, transcriptSegments } = await transcribeAudio(
      audioPath
    );

    // Step 3: Summarize transcript
    console.log("Step 3: Summarizing transcript...");
    const summaries = await Promise.all([
      summarize(rawTranscript, Language.KO),
      summarize(rawTranscript, Language.EN),
    ]);

    const result: JobResult = {
      videoId,
      metadata,
      audioPath,
      rawTranscript,
      transcriptSegments,
      summaries,
    };

    // Step 4: Save results to data directory
    console.log("Step 4: Saving results to data directory...");
    const resultPath = await storage.saveJobResults(videoId, result);

    console.log(`Job ${job.id} completed successfully`);
    console.log(`Files saved:`);
    console.log(`  - Audio: ${audioPath}`);
    console.log(`  - Results: ${resultPath}`);
    return result;
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error);
    throw error;
  }
}
