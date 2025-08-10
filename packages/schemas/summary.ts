import { z } from "zod";

export const summarySchema = z.object({
  id: z.string(),
  language: z.string(),
  content: z.string(), // 마크다운 형식의 Executive Briefing 내용
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type SummaryDTO = z.infer<typeof summarySchema>;