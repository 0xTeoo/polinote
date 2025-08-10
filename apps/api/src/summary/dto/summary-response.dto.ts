import { ApiProperty } from '@nestjs/swagger';
import { Language, Summary } from '@polinote/entities';

export class SummaryResponseDto {
  @ApiProperty({
    description: 'Summary ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Language of the summary',
    enum: Language,
    example: Language.EN,
  })
  language: Language;

  @ApiProperty({
    description: 'Executive Briefing content in markdown format',
    example: '# Executive Briefing\n## [Core Issue Title]\n\n---\n\n### 🎯 Key Takeaway\n[Most important one-sentence summary]',
  })
  content: string;

  @ApiProperty({
    description: 'Summary created at',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Summary updated at',
    example: '2021-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  public static from(summary: Summary): SummaryResponseDto {
    const dto = new SummaryResponseDto();
    dto.id = summary.id;
    dto.language = summary.language;
    dto.content = summary.content;
    dto.createdAt = summary.createdAt;
    dto.updatedAt = summary.updatedAt;
    return dto;
  }
} 