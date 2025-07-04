import { Entity, Column, ManyToOne } from "typeorm";
import { DefaultEntity } from "./default-entity";
import { Transcript } from "./transcript";

@Entity({ schema: "polinote", name: "transcript_segments" })
export class TranscriptSegment extends DefaultEntity {
  @Column({ type: "timestamp", name: "start_time" })
  startTime: Date;

  @Column({ type: "timestamp", name: "end_time" })
  endTime: Date;

  @Column({ type: "text", name: "content" })
  content: string;
  
  @ManyToOne(() => Transcript, (transcript) => transcript.segments)
  transcript: Transcript;
}
