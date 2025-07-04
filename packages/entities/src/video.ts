import { Entity, Column, OneToOne, OneToMany } from "typeorm";
import { DefaultEntity } from "./default-entity";
import { Transcript } from "./transcript";
import { Summary } from "./summary";

@Entity({ schema: "polinote", name: "videos" })
export class Video extends DefaultEntity {
  @Column({
    type: "varchar",
    name: "youtube_video_id",
    length: 50,
    unique: true,
  })
  youtubeVideoId: string;

  @Column({ type: "varchar", name: "title", length: 255 })
  title: string;

  @Column({ type: "text", name: "description" })
  description: string;

  @Column({ type: "timestamptz", name: "published_at" })
  publishedAt: Date;

  @Column({ type: "varchar", name: "thumbnail_url", length: 255 })
  thumbnailUrl: string;

  @OneToOne(() => Transcript, (transcript) => transcript.video)
  transcript: Transcript;

  @OneToMany(() => Summary, (summary) => summary.video)
  summaries: Summary[];
}
