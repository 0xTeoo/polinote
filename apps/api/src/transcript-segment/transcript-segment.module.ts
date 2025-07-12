import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranscriptSegmentService } from './transcript-segment.service';
import { TranscriptSegment, Transcript } from '@polinote/entities';

@Module({
  imports: [TypeOrmModule.forFeature([TranscriptSegment, Transcript])],
  providers: [TranscriptSegmentService],
  exports: [TranscriptSegmentService],
})
export class TranscriptSegmentModule {} 