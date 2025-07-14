import { Module } from '@nestjs/common';
import { TranscriptModule } from './transcript/transcript.module';
import { TranscriptSegmentModule } from './transcript-segment/transcript-segment.module';
import { SummaryModule } from './summary/summary.module';
import { VideoModule } from './video/video.module';
import { BullMQConfig, Configuration, PostgresDataSource } from './config';
import { NestModules, Routes } from './config/route';

@Module({
  imports: [
    Configuration,
    PostgresDataSource,
    BullMQConfig,
    TranscriptModule,
    TranscriptSegmentModule,
    SummaryModule,
    VideoModule,
    Routes,
    ...NestModules
  ],
})
export class AppModule { }
