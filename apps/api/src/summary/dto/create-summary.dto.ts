import { Language } from '@polinote/entities';

export class CreateSummaryDto {
  videoId: string;
  transcript: string;
  language: Language;
}
