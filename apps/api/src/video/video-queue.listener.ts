import { InjectQueue } from "@nestjs/bullmq";
import { Queue, QueueEvents } from "bullmq";
import { VideoJobResult } from "./video-queue.service";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { VideoService } from "./video.service";
import { SummaryService } from "src/summary/summary.service";
import { TranscriptService } from "src/transcript/transcript.service";
import { TranscriptSegmentService } from "src/transcript-segment/transcript-segment.service";

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
    private readonly transcriptSegmentService: TranscriptSegmentService,
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

      // Save transcript segments using the video's UUID
      if (jobResult.transcriptSegments && jobResult.transcriptSegments.length > 0) {
        await this.transcriptSegmentService.createMany(
          createdVideo.id,
          jobResult.transcriptSegments
        );
      }

      // Save summaries using the video's UUID
      await Promise.all(jobResult.summaries.map((summary) => {
        this.summaryService.createOne({
          videoId: createdVideo.id,
          language: summary.language,
          content: summary.content, // 마크다운 형식의 Executive Briefing 내용
        })
      }))

    });
  }
} 