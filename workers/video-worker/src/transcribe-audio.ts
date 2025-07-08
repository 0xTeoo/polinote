import OpenAI from "openai";
import * as fs from "fs";

interface TranscriptionResult {
  rawTranscript: string;
  transcriptSegments: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

/**
 * Transcribe audio file using OpenAI Whisper API
 */
export async function transcribeAudio(
  audioPaths: string[]
): Promise<TranscriptionResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }

  const openai = new OpenAI({
    apiKey,
  });

  try {
    const transcriptions = await Promise.all(
      audioPaths.map(async (path) => {
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(path),
          model: "whisper-1",
          response_format: "verbose_json",
          timestamp_granularities: ["segment"],
        });
        return transcription;
      })
    );

    const fullTranscription = transcriptions.map((transcription) => transcription.text).join("\n");
    const fullTranscriptSegments = transcriptions.map((transcription) => transcription.segments).flat().map((segment) => ({
      start: segment?.start || 0,
      end: segment?.end || 0,
      text: segment?.text || "",
    }));

    return {
      rawTranscript: fullTranscription,
      transcriptSegments: fullTranscriptSegments,
    };

  } catch (error) {
    console.error(`Failed to transcribe audio: ${error}`);
    throw new Error(`Failed to transcribe audio file ${audioPaths.join(", ")}: ${error}`);
  }
}
