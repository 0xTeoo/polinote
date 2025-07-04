import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranscriptService } from './transcript.service';
import { Transcript } from '@polinote/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Transcript])],
  providers: [TranscriptService],
  exports: [TranscriptService],
})
export class TranscriptModule {}
