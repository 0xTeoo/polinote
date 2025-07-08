import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';

export interface VideoJobData {
  youtubeUrl: string;
}

export interface VideoJobResult {
  videoId: string;
  audioPath: string;
  rawTranscript: string;
  transcriptSegments: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  summaries: Array<{
    overview: string;
    keySections: {
      introduction: string;
      mainPoints: string[];
      conclusion: string;
    };
    analysis: string;
  }>;
}

@Injectable()
export class VideoQueueService implements OnModuleDestroy {
  constructor(
    @InjectQueue('video') private readonly videoQueue: Queue<VideoJobData, VideoJobResult>
  ) { }

  async addVideoJob(youtubeUrl: string) {
    const job = await this.videoQueue.add(
      'process-video',
      { youtubeUrl },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
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

  async onModuleDestroy() {
    await this.videoQueue.close();
  }
}