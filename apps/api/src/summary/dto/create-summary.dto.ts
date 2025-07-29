import { Language } from '@polinote/entities';

export class CreateSummaryDto {
  videoId: string;
  language: Language;
  headline: string;
  overview: string;
  stakeholders: Array<{
    type: "country" | "organization";
    name: string;
    interests: string;
  }>;
  policyImplications: {
    domestic: Array<{
      issue: string;
      impact: string;
    }>;
  };
  economicImpact: {
    markets: string;
    trade: string;
    investment: string;
  };
  analysis: {
    historicalContext: string;
    scenarios: string[];
  };
}
