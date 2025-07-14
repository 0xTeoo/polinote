import { z } from "zod";

export const videoSchema = z.object({
  id: z.string(),
  youtubeVideoId: z.string(),
  title: z.string(),
  description: z.string(),
  publishedAt: z.string(),
  thumbnailUrl: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type VideoDTO = z.infer<typeof videoSchema>;