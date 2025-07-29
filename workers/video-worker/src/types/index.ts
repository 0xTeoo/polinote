import { Language } from "@polinote/entities";

export interface VideoJobData {
  youtubeUrl: string;
}

export interface YoutubeMetadata {
  title: string;
  description: string;
  publishedAt: Date;
  thumbnailUrl: string;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

// 새로운 Summary 인터페이스
export interface Summary {
  language: Language;
  summary: {
    headline: string;
    overview: string;
  };
  stakeholders: Array<{
    type: "country" | "organization";
    name: string;
    interests: string;
  }>;
  policyImplications: {
    domestic: Array<{
      issue: string;
      impact: string;
    }>;
    international: Array<{
      issue: string;
      impact: string;
    }>;
  };
  economicImpact: {
    markets: string;
    trade: string;
    investment: string;
  };
  analysis: {
    historicalContext: string;
    scenarios: string[];
    recommendations: {
      policy: string;
      investment: string;
    };
  };
}

export interface JobResult {
  videoId: string;
  metadata: YoutubeMetadata;
  rawTranscript: string;
  transcriptSegments: TranscriptSegment[];
  summaries: Summary[];
}

export interface AudioSplit {
  start: number;
  duration?: number;
}

export interface DownloadResult {
  audioPath: string;
  splitPaths?: string[];
}

export interface TranscribeResult {
  rawTranscript: string;
  transcriptSegments: TranscriptSegment[];
}

export interface StorageConfig {
  baseDir: string;
}

export interface VideoInfo {
  exists: boolean;
  path: string;
  files: string[];
}

export interface FileStatus {
  hasAudio: boolean;
  hasResult: boolean;
}

// Processor Input/Output Types
export interface AudioInput {
  youtubeUrl: string;
  videoId: string;
}

export interface AudioOutput {
  audioPaths: string[];
}

export interface TranscribeInput {
  audioPaths: string[];
}

export interface TranscribeOutput {
  rawTranscript: string;
  transcriptSegments: TranscriptSegment[];
}

export interface SummarizeInput {
  rawTranscript: string;
}

export interface SummarizeOutput {
  summaries: Summary[];
}

export interface StorageInput {
  videoId: string;
  result: JobResult;
}

export interface StorageOutput {
  filePath: string;
} 