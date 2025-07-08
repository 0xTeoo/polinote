import { ConfigModule } from "@nestjs/config";

const environments = () => ({
  port: parseInt(process.env.APP_PORT || "4000", 10),
  isProduction: process.env.NODE_ENV === "production",
  database: {
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || "5432", 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY,
  },
  queue: {
    video: process.env.VIDEO_QUEUE_NAME,
  },
  bullmq: {
    host: process.env.BULLMQ_REDIS_HOST,
    port: parseInt(process.env.BULLMQ_REDIS_PORT || "6379", 10),
  }
});

export const Configuration = ConfigModule.forRoot({
  isGlobal: true,
  load: [environments],
});