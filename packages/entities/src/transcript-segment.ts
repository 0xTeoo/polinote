import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { DefaultEntity } from "./default-entity";
import { Transcript } from "./transcript";

@Entity({ schema: "polinote", name: "transcript_segments" })
export class TranscriptSegment extends DefaultEntity {
  @Column({ type: "timestamptz", name: "start_time" })
  startTime: Date;

  @Column({ type: "timestamptz", name: "end_time" })
  endTime: Date;

  @Column({ type: "text", name: "content" })
  content: string;

  @ManyToOne(() => Transcript, (transcript) => transcript.segments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "transcript_id" })
  transcript: Transcript;
}
