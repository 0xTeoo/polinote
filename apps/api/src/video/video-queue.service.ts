import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Language } from '@polinote/entities';
import { Queue } from 'bullmq';

export interface VideoJobData {
  youtubeUrl: string;
}

export interface VideoJobResult {
  videoId: string;
  metadata: {
    title: string;
    description: string;
    publishedAt: string | Date;
    thumbnailUrl: string;
  };
  rawTranscript: string;
  transcriptSegments: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  summaries: Array<{
    language: Language;
    headline: string;
    overview: string;
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
  }>;
}

@Injectable()
export class VideoQueueService implements OnModuleDestroy {
  constructor(
    @InjectQueue('video') private readonly videoQueue: Queue<VideoJobData, VideoJobResult>
  ) { }

  async onModuleDestroy() {
    await this.videoQueue.close();
  }

  async addJob(youtubeUrl: string) {
    const job = await this.videoQueue.add(
      'process-video',
      { youtubeUrl },
      {
        attempts: 1,
        removeOnComplete: 10,
        removeOnFail: 5,
      }
    );

    return {
      jobId: job.id,
      status: 'queued',
    };
  }

  async getJobStatus(jobId: string) {
    const job = await this.videoQueue.getJob(jobId);

    if (!job) {
      return { status: 'not_found' };
    }

    const state = await job.getState();
    const progress = await job.progress;
    const result = await job.returnvalue;
    const failedReason = job.failedReason;

    return {
      jobId,
      status: state,
      progress,
      result,
      failedReason,
      timestamp: job.timestamp,
    };
  }

  async getJobResult(jobId: string): Promise<VideoJobResult | null> {
    const job = await this.videoQueue.getJob(jobId);

    if (!job) {
      return null;
    }

    const state = await job.getState();
    if (state !== 'completed') {
      return null;
    }

    return job.returnvalue;
  }

  async removeJob(jobId: string) {
    await this.videoQueue.remove(jobId);
  }
}