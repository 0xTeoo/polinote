import { Worker } from "bullmq";
import { jobHandler } from "./job-handler";
import { redis } from "./config";

const worker = new Worker(process.env.QUEUE_NAME || "video_queue", jobHandler, {
  connection: redis,
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || "1"),
});

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});

console.log("Video worker started. Waiting for jobs...");

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await worker.close();
  await redis.quit();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  await worker.close();
  await redis.quit();
  process.exit(0);
});
