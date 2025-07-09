import { Worker } from "bullmq";
import { jobHandler } from "./job-handler";
import { redis } from "./config";
import { QUEUE_CONSTANTS } from "./constants";
import { Logger } from "./utils/logger";

const worker = new Worker(QUEUE_CONSTANTS.QUEUE_NAME, jobHandler, {
  connection: redis,
  concurrency: 1,
  skipStalledCheck: false,
  skipLockRenewal: false,
  lockDuration: 15 * 60 * 1000, // 15 minutes
  stalledInterval: 1 * 60 * 1000, // 1 minute
});

worker.on("completed", (job) => {
  Logger.success(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  Logger.error(`Job ${job?.id} failed`, err);
});

worker.on("error", (err) => {
  Logger.error("Worker error", err);
});

Logger.info("Video worker started. Waiting for jobs...");

// Graceful shutdown
process.on("SIGTERM", async () => {
  Logger.info("SIGTERM received, shutting down gracefully...");
  await worker.close();
  await redis.quit();
  process.exit(0);
});

process.on("SIGINT", async () => {
  Logger.info("SIGINT received, shutting down gracefully...");
  await worker.close();
  await redis.quit();
  process.exit(0);
});
