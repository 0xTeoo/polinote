import { z } from "zod";

export const summarySchema = z.object({
  id: z.string(),
  language: z.string(),
  headline: z.string(),
  overview: z.string(),
  stakeholders: z.array(z.object({
    type: z.string(),
    name: z.string(),
    interests: z.string(),
  })),
  policyImplications: z.object({
    domestic: z.array(z.object({
      issue: z.string(),
      impact: z.string(),
    })),
    international: z.array(z.object({
      issue: z.string(),
      impact: z.string(),
    })),
  }),
  economicImpact: z.object({
    markets: z.string(),
    trade: z.string(),
    investment: z.string(),
  }),
  analysis: z.object({
    historicalContext: z.string(),
    scenarios: z.array(z.string()),
    recommendations: z.object({
      policy: z.string(),
      investment: z.string(),
    }),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type SummaryDTO = z.infer<typeof summarySchema>;