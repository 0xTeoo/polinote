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

  @Column({ type: "text", name: "headline", nullable: true })
  headline: string;

  @Column({ type: "text", name: "overview", nullable: true })
  overview: string;

  @Column({ type: "json", name: "stakeholders", nullable: true })
  stakeholders: Array<{
    type: "country" | "organization";
    name: string;
    interests: string;
  }>;

  @Column({ type: "json", name: "policy_implications", nullable: true })
  policyImplications: {
    domestic: Array<{
      issue: string;
      impact: string;
    }>;
    international: Array<{
      issue: string;
      impact: string;
    }>;
  };

  @Column({ type: "json", name: "economic_impact", nullable: true })
  economicImpact: {
    markets: string;
    trade: string;
    investment: string;
  };

  @Column({ type: "json", name: "analysis", nullable: true })
  analysis: {
    historicalContext: string;
    scenarios: string[];
    recommendations: {
      policy: string;
      investment: string;
    };
  };

  @ManyToOne(() => Video, (video) => video.summaries, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "video_id" })
  video: Video;
}
