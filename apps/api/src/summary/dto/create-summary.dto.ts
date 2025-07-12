import { Language } from '@polinote/entities';

export class CreateSummaryDto {
  videoId: string;
  language: Language;
  overview: string;
  keySections: {
    introduction: string;
    mainPoints: string[];
    conclusion: string;
  };
  analysis: string;
}
