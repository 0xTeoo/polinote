import { Language } from '@polinote/entities';

export class CreateSummaryDto {
  videoId: string;
  language: Language;
  content: string; // 마크다운 형식의 Executive Briefing 내용
}
