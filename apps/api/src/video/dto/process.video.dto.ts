import { IsString, IsUrl } from 'class-validator';

export class ProcessVideoDto {
  @IsString()
  @IsUrl()
  youtubeUrl: string;
}

export class VideoJobResponseDto {
  jobId: string;
  status: string;
}

export class VideoJobStatusDto {
  jobId: string;
  status: string;
  progress?: number;
  result?: any;
  failedReason?: string;
  timestamp: number;
}