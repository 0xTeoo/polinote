import { z } from "zod";
import { fetchWithError } from "@/lib/fetch";
import { paginationMetaSchema, videoSchema, VideoDTO } from "@polinote/schemas";
import { PaginationResponse } from "@/types";

const schema = z.object({
  items: z.array(videoSchema),
  meta: paginationMetaSchema,
});

export async function getVideos(
  page: number
): Promise<PaginationResponse<VideoDTO>> {
  const response = await fetchWithError<z.infer<typeof schema>>(
    "/videos",
    {
      method: "GET",
      params: {
        page: page.toString(),
      },
    },
    schema
  );

  return {
    items: response.items,
    meta: {
      totalItems: response.meta.totalItems,
      totalPages: response.meta.totalPages,
      currentPage: response.meta.currentPage,
      itemsPerPage: response.meta.itemsPerPage,
    },
  };
}
