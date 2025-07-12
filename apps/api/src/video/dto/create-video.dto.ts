import { IsString } from "class-validator";

export class CreateVideoDto {
  @IsString()
  youtubeVideoId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  publishedAt: Date;

  @IsString()
  thumbnailUrl: string;
}
