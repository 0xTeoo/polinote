import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranscriptModule } from './transcript/transcript.module';
import { VideoModule } from './video/video.module';
import { Configuration } from './config/config';
import { PostgresDataSource } from './config/database';

@Module({
  imports: [
    Configuration,
    PostgresDataSource,
    TranscriptModule,
    VideoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
