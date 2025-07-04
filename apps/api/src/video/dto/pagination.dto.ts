import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class PaginationMeta {
  @Type(() => Number)
  currentPage: number;

  @Type(() => Number)
  totalPages: number;

  @Type(() => Number)
  itemsPerPage: number;
}

export class PaginatedResponseDto<T> {
  items: T[];

  @Type(() => PaginationMeta)
  meta: PaginationMeta;
}
