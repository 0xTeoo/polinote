import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Max, IsOptional, Min } from "class-validator";
import { PaginationResult } from "src/types";

export class PaginationQueryDTO {
  @ApiPropertyOptional({
    description: "Page number (starts from 1)",
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Number of items per page",
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class PaginationMetaDTO {
  @ApiProperty({
    description: "Current page number",
    example: 1,
  })
  @Type(() => Number)
  currentPage: number;

  @ApiProperty({
    description: "Total number of pages",
    example: 5,
  })
  @Type(() => Number)
  totalPages: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 10,
  })
  @Type(() => Number)
  itemsPerPage: number;

  @ApiProperty({
    description: "Total number of items",
    example: 50,
  })
  @Type(() => Number)
  totalItems: number;
}

export class PaginationResponseDto<T> {
  @ApiProperty({
    description: "Array of items",
    isArray: true,
  })
  items: T[];

  @ApiProperty({
    description: "Pagination metadata",
    type: PaginationMetaDTO,
  })
  meta: PaginationMetaDTO;

  public static from<T>(
    {
      items,
      totalItems,
      page,
      limit,
    }: PaginationResult<T>,
  ): PaginationResponseDto<T> {
    const totalPages = Math.ceil(totalItems / limit);

    const meta = new PaginationMetaDTO();
    meta.currentPage = page;
    meta.totalPages = totalPages;
    meta.itemsPerPage = limit;
    meta.totalItems = totalItems;

    const dto = new PaginationResponseDto<T>();
    dto.items = items;
    dto.meta = meta;
    return dto;
  }
}
