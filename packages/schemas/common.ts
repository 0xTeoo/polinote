import { z } from "zod";

export enum Language {
  EN = "en",
  KO = "ko",
}

export const paginationMetaSchema = z.object({
  totalItems: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  itemsPerPage: z.number(),
});