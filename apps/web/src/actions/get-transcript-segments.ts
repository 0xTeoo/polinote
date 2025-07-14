import { z } from "zod";
import { fetchWithError } from "@/lib/fetch";
import { transcriptSegmentSchema, TranscriptSegmentDTO } from "@polinote/schemas";

const schema = z.array(transcriptSegmentSchema);

export async function getTranscriptSegments(
  videoId: string,
): Promise<TranscriptSegmentDTO[]> {
  const response = await fetchWithError<z.infer<typeof schema>>(
    `/videos/${videoId}/transcript-segments`,
    {
      method: "GET",
    },
    schema
  );
  return response;
}
