import { ApiProperty } from "@nestjs/swagger";
import { Video } from "@polinote/entities";

export class VideoResponseDto {
  @ApiProperty({
    description: "Video ID",
    example: "123",
  })
  id: string;

  @ApiProperty({
    description: "Video title",
    example: "Video Title",
  })
  title: string;

  @ApiProperty({
    description: "Video description",
    example: "Video Description",
  })
  description: string;

  @ApiProperty({
    description: "Video published at",
    example: "2021-01-01",
  })
  publishedAt: Date;

  @ApiProperty({
    description: "Video thumbnail URL",
    example: "https://example.com/thumbnail.jpg",
  })
  thumbnailUrl: string;

  @ApiProperty({
    description: "Video created at",
    example: "2021-01-01",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Video updated at",
    example: "2021-01-01",
  })
  updatedAt: Date;

  public static from(video: Video) {
    const dto = new VideoResponseDto();
    dto.id = video.id;
    dto.title = video.title;
    dto.description = video.description;
    dto.publishedAt = video.publishedAt;
    dto.thumbnailUrl = video.thumbnailUrl;
    dto.createdAt = video.createdAt;
    dto.updatedAt = video.updatedAt;
    return dto;
  }
}