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
  audioPath: string
): Promise<TranscriptionResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }

  const openai = new OpenAI({
    apiKey,
  });

  try {
    console.log(`Transcribing audio file: ${audioPath}`);

    // Verify file exists
    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found: ${audioPath}`);
    }

    // Create file stream
    const audioFile = fs.createReadStream(audioPath);

    // Transcribe with timestamps
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    // Extract full transcript
    const rawTranscript = transcription.text || "";

    // Extract timestamped segments
    const transcriptSegments =
      transcription.segments?.map((segment) => ({
        start: segment.start,
        end: segment.end,
        text: segment.text,
      })) || [];

    console.log(
      `Transcription completed. Length: ${rawTranscript.length} characters`
    );

    return {
      rawTranscript,
      transcriptSegments,
    };
  } catch (error) {
    console.error(`Failed to transcribe audio: ${error}`);
    throw new Error(`Failed to transcribe audio file ${audioPath}: ${error}`);
  }
}
