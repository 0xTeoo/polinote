import { z } from "zod";
import { fetchWithError } from "@/lib/fetch";
import { videoSchema } from "@polinote/schemas";


export async function getVideo(id: string) {
  const response = await fetchWithError<z.infer<typeof videoSchema>>(
    `/videos/${id}`,
    {
      method: "GET",
    },
    videoSchema
  );

  return response;
}
