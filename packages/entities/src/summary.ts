import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { DefaultEntity } from "./default-entity";
import { Video } from "./video";

export enum Language {
  EN = "en",
  KO = "ko",
}

@Entity({ schema: "polinote", name: "summaries" })
export class Summary extends DefaultEntity {
  @Column({ type: "enum", name: "language", enum: Language })
  language: Language;

  @Column({ type: "text", name: "content" })
  content: string; // 마크다운 형식의 Executive Briefing 내용

  @ManyToOne(() => Video, (video) => video.summaries, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "video_id" })
  video: Video;
}
