import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoBatchService } from './video-batch.service';
import { TranscriptModule } from '../transcript/transcript.module';
import { TranscriptSegmentModule } from '../transcript-segment/transcript-segment.module';
import { SummaryModule } from 'src/summary/summary.module';
import { Video } from '@polinote/entities';
import { VideoQueueService } from './video-queue.service';
import { BullModule } from '@nestjs/bullmq';
import { VideoQueueEventListner } from './video-queue.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    TranscriptModule,
    TranscriptSegmentModule,
    SummaryModule,
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'video',
    })
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoBatchService, VideoQueueService, VideoQueueEventListner],
  exports: [VideoService, VideoQueueService],
})
export class VideoModule { }
