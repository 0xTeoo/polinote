import { z } from "zod";
import { videoSchema, paginationMetaSchema } from "@/schemas";
import { fetchWithError } from "@/lib/fetch";
import { BriefingForList, PaginationResponse } from "@/types";

const responseSchema = z.object({
  items: z.array(videoSchema),
  meta: paginationMetaSchema,
});

export async function getBriefings(
  page: number
): Promise<PaginationResponse<BriefingForList>> {
  const response = await fetchWithError<z.infer<typeof responseSchema>>(
    "/videos",
    {
      method: "GET",
      params: {
        page: page.toString(),
      },
    },
    responseSchema
  );

  return {
    items: response.items.map((item) => ({
      id: item.id,
      youtubeVideoId: item.youtube_video_id,
      title: item.title,
      description: item.description,
      publishedAt: item.published_at,
      thumbnailUrl: item.thumbnail_url,
      createdAt: item.created_at,
    })),
    meta: {
      currentPage: response.meta.current_page,
      totalPages: response.meta.total_pages,
      itemsPerPage: response.meta.items_per_page,
    },
  };
}
