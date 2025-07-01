import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Transcript } from './transcript.entity';
import { Summary } from './summary.entity';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  youtube_video_id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'datetime' })
  published_at: Date;

  @Column({ type: 'varchar', length: 255 })
  thumbnail_url: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @OneToOne(() => Transcript, (transcript) => transcript.video)
  transcript: Transcript;

  @OneToMany(() => Summary, (summary) => summary.video)
  summaries: Summary[];
}
