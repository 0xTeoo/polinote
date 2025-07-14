import { z } from "zod";

export const summarySchema = z.object({
  id: z.string(),
  language: z.string(),
  overview: z.string(),
  keySections: z.object({
    conclusion: z.string(),
    mainPoints: z.array(z.string()),
    introduction: z.string(),
  }),
  analysis: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type SummaryDTO = z.infer<typeof summarySchema>;