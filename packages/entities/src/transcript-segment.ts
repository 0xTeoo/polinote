import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { DefaultIncrementEntity } from "./default-entity";
import { Transcript } from "./transcript";

@Entity({ schema: "polinote", name: "transcript_segments" })
export class TranscriptSegment extends DefaultIncrementEntity {
  @Column({ type: "float", name: "start" })
  start: number;

  @Column({ type: "float", name: "end" })
  end: number;

  @Column({ type: "text", name: "text" })
  text: string;

  @ManyToOne(() => Transcript, (transcript) => transcript.segments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "transcript_id" })
  transcript: Transcript;
}
