import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoBatchService } from './video.batch.service';
import { Video } from '../entities/video.entity';
import { TranscriptModule } from '../transcript/transcript.module';
import { VideoFactoryService } from './video.factory.service';
import { SummaryModule } from 'src/summary/summary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    TranscriptModule,
    SummaryModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoBatchService, VideoFactoryService],
  exports: [VideoService],
})
export class VideoModule {}
