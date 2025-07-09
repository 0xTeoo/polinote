import { InjectQueue } from "@nestjs/bullmq";
import { Queue, QueueEvents } from "bullmq";
import { VideoJobData, VideoJobResult } from "./video-queue.service";
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class VideoQueueEventListner implements OnModuleInit {
  private queueEvents: QueueEvents;

  constructor(
    @InjectQueue('video') private readonly videoQueue: Queue<VideoJobData, VideoJobResult>
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
    this.queueEvents.on('completed', (args: { jobId: string; returnvalue: string; prev?: string | undefined; }, id: string) => {
      console.log('Job completed', args.jobId);
      console.log('Result', args.returnvalue);
    });
  }
}