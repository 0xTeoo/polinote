import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoBatchService } from './video-batch.service';
import { TranscriptModule } from '../transcript/transcript.module';
import { VideoFactoryService } from './video-factory.service';
import { SummaryModule } from 'src/summary/summary.module';
import { Video } from '@polinote/entities';
import { VideoQueueService } from './video-queue.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    TranscriptModule,
    SummaryModule,
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'video',
    })
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoBatchService, VideoFactoryService, VideoQueueService],
  exports: [VideoService, VideoQueueService],
})
export class VideoModule { }
