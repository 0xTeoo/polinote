import { Redis } from "ioredis";
import { config } from "dotenv";
import OpenAI from "openai";
config();

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || "0"),
  maxRetriesPerRequest: null,
});

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});