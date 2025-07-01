import { z } from "zod";
import { videoDetailSchema } from "@/schemas";
import { fetchWithError } from "@/lib/fetch";
import { BriefingForDetail } from "@/types";

export async function getBriefingById(id: string): Promise<BriefingForDetail> {
  const response = await fetchWithError<z.infer<typeof videoDetailSchema>>(
    `/videos/${id}`,
    {
      method: "GET",
    },
    videoDetailSchema,
  );

  return {
    id: response.id,
    youtubeVideoId: response.youtube_video_id,
    title: response.title,
    description: response.description,
    publishedAt: response.published_at,
    thumbnailUrl: response.thumbnail_url,
    createdAt: response.created_at,
    transcript: response.transcript.content,
    summaries: response.summaries.map((summary) => ({
      id: summary.id,
      videoId: summary.video_id,
      language: summary.language,
      overview: summary.overview,
      keySections: {
        conclusion: summary.key_sections.conclusion,
        mainPoints: summary.key_sections.main_points,
        introduction: summary.key_sections.introduction,
      },
      analysis: summary.analysis,
      createdAt: summary.created_at,
    })),
  };
}
