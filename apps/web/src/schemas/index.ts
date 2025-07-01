import { z } from "zod";

export const transcriptSchema = z.object({
  id: z.number(),
  video_id: z.number(),
  content: z.string(),
  created_at: z.string(),
});

export const summarySchema = z.object({
  id: z.number(),
  video_id: z.number(),
  language: z.string(),
  overview: z.string(),
  key_sections: z.object({
    conclusion: z.string(),
    main_points: z.array(z.string()),
    introduction: z.string(),
  }),
  analysis: z.string(),
  created_at: z.string(),
});

export const videoSchema = z.object({
  id: z.number(),
  youtube_video_id: z.string(),
  title: z.string(),
  description: z.string(),
  published_at: z.string(),
  thumbnail_url: z.string(),
  created_at: z.string(),
});

export const videoDetailSchema = z.object({
  id: z.number(),
  youtube_video_id: z.string(),
  title: z.string(),
  description: z.string(),
  published_at: z.string(),
  thumbnail_url: z.string(),
  created_at: z.string(),
  transcript: transcriptSchema,
  summaries: z.array(summarySchema),
});

export const paginationMetaSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  items_per_page: z.number(),
});
