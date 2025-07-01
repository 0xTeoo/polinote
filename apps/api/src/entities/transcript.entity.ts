import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Video } from './video.entity';
import { TranscriptSegment } from './transcript-segment.entity';

@Entity('transcripts')
export class Transcript {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  video_id: number;

  @Column({ type: 'longtext' })
  content: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @OneToOne(() => Video, (video) => video.transcript, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'video_id' })
  video: Video;

  @OneToMany(() => TranscriptSegment, (segment) => segment.transcript)
  segments: TranscriptSegment[];
}
