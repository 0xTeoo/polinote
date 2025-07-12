import { InjectQueue } from "@nestjs/bullmq";
import { Queue, QueueEvents } from "bullmq";
import { VideoJobResult } from "./video-queue.service";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { VideoService } from "./video.service";
import { SummaryService } from "src/summary/summary.service";
import { TranscriptService } from "src/transcript/transcript.service";

export interface VideoJobData {
  youtubeUrl: string;
}

@Injectable()
export class VideoQueueEventListner implements OnModuleInit {
  private queueEvents: QueueEvents;

  constructor(
    @InjectQueue('video') private readonly videoQueue: Queue<VideoJobData, VideoJobResult>,
    private readonly videoService: VideoService,
    private readonly summaryService: SummaryService,
    private readonly transcriptService: TranscriptService,
  ) { }

  async onModuleInit() {
    const client = await this.videoQueue.client;

    this.queueEvents = new QueueEvents('video', {
      connection: {
        ...client.options,
        maxRetriesPerRequest: null,
      }
    });

    // @TODO: Save the job result to the database
    this.queueEvents.on('completed', async (args: { jobId: string; returnvalue: string; prev?: string | undefined; }, id: string) => {
      console.log('Job completed', args.jobId);
      console.log('Result', args.returnvalue);

      const jobResult = args.returnvalue as unknown as VideoJobResult;

      // Convert the publishedAt string back to a Date object
      if (jobResult.metadata && typeof jobResult.metadata.publishedAt === 'string') {
        jobResult.metadata.publishedAt = new Date(jobResult.metadata.publishedAt);
      }

      // Save video metadata and get the created video entity
      const createdVideo = await this.videoService.createOne({
        youtubeVideoId: jobResult.videoId,
        title: jobResult.metadata.title,
        description: jobResult.metadata.description,
        publishedAt: jobResult.metadata.publishedAt as Date,
        thumbnailUrl: jobResult.metadata.thumbnailUrl,
      })

      // Save transcript using the video's UUID
      await this.transcriptService.createOne({
        videoId: createdVideo.id,
        content: jobResult.rawTranscript,
      })

      // Save summaries using the video's UUID
      await Promise.all(jobResult.summaries.map((summary) => {
        this.summaryService.createOne({
          videoId: createdVideo.id,
          language: summary.language,
          overview: summary.overview,
          keySections: {
            introduction: summary.keySections.introduction,
            mainPoints: summary.keySections.mainPoints,
            conclusion: summary.keySections.conclusion,
          },
          analysis: summary.analysis,
        })
      }))

    });
  }
} 