export type BriefingForList = {
  id: number;
  youtubeVideoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  createdAt: string;
};

export type BriefingForDetail = BriefingForList & {
  transcript: string;
  summaries: Array<Summary>;
};

export type Summary = {
  id: number;
  videoId: number;
  language: string;
  overview: string;
  keySections: {
    conclusion: string;
    mainPoints: Array<string>;
    introduction: string;
  };
  analysis: string;
  createdAt: string;
};

export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
};

export type PaginationResponse<T> = {
  items: T[];
  meta: PaginationMeta;
};
