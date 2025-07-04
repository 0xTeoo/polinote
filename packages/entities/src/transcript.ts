import { Entity, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { DefaultEntity } from "./default-entity";
import { Video } from "./video";
import { TranscriptSegment } from "./transcript-segment";

@Entity({ schema: "polinote", name: "transcripts" })
export class Transcript extends DefaultEntity {
  @Column({ type: "text", name: "content" })
  content: string;

  @OneToOne(() => Video, (video) => video.transcript, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "video_id" })
  video: Video;

  @OneToMany(() => TranscriptSegment, (segment) => segment.transcript)
  segments: TranscriptSegment[];
}
