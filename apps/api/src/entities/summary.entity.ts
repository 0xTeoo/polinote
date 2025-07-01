import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Video } from './video.entity';

export enum Language {
  EN = 'en',
  KO = 'ko',
}

@Entity('summaries')
export class Summary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  video_id: number;

  @Column({ type: 'enum', enum: Language })
  language: Language;

  @Column({ type: 'text' })
  overview: string;

  @Column({ type: 'json' })
  key_sections: Record<string, any>;

  @Column({ type: 'text' })
  analysis: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @ManyToOne(() => Video, (video) => video.summaries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'video_id' })
  video: Video;
}
