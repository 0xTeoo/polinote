import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummaryService } from './summary.service';
import { Summary } from '@polinote/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Summary])],
  providers: [SummaryService],
  exports: [SummaryService],
})
export class SummaryModule {}
