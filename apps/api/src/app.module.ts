import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranscriptModule } from './transcript/transcript.module';
import { VideoModule } from './video/video.module';
import { BullMQConfig, Configuration, PostgresDataSource } from './config';

@Module({
  imports: [
    Configuration,
    PostgresDataSource,
    BullMQConfig,
    TranscriptModule,
    VideoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
