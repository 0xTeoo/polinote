import { Language } from 'src/entities/summary.entity';

export class CreateSummaryDto {
  video_id: number;
  transcript: string;
  language: Language;
}
