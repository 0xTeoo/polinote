import { z } from "zod";

export const transcriptSegmentSchema = z.object({
  id: z.number(),
  start: z.number(),
  end: z.number(),
  text: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TranscriptSegmentDTO = z.infer<typeof transcriptSegmentSchema>;