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

  @Column({ type: "text", name: "overview" })
  overview: string;

  @Column({ type: "json", name: "key_sections", nullable: true })
  keySections: {
    introduction: string;
    mainPoints: string[];
    conclusion: string;
  };

  @Column({ type: "text", name: "analysis" })
  analysis: string;

  @ManyToOne(() => Video, (video) => video.summaries, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "video_id" })
  video: Video;
}
