// src/entities/transcript-segment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Transcript } from './transcript.entity';

@Entity()
export class TranscriptSegment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transcript, transcript => transcript.segments)
  transcript: Transcript;

  @Column('timestamp')
  start_time: Date;

  @Column('timestamp')
  end_time: Date;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;
}