import { z } from "zod";
import { fetchWithError } from "@/lib/fetch";
import { SummaryDTO, summarySchema } from "@polinote/schemas";
import { Language } from "@polinote/entities";

export async function getSummary(videoId: string, language: Language): Promise<SummaryDTO> {
  const response = await fetchWithError<z.infer<typeof summarySchema>>(
    `/videos/${videoId}/summaries/${language}`,
    {
      method: "GET",
    },
    summarySchema
  );

  return response;
}
