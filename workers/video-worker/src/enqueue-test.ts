import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { config } from "dotenv";

// Load environment variables
config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || "0"),
  maxRetriesPerRequest: null,
});

const queue = new Queue("video", {
  connection: redis,
});

async function enqueueTestJob() {
  try {
    // Test YouTube URL (replace with your test URL)
    const testUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    console.log(`Enqueueing test job for URL: ${testUrl}`);

    const job = await queue.add(
      "process-video",
      {
        youtubeUrl: testUrl,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

    console.log(`Job enqueued successfully with ID: ${job.id}`);
    console.log(`Job data:`, job.data);

    // Wait a moment to see if the job gets processed
    setTimeout(async () => {
      const jobStatus = await job.getState();
      console.log(`Job status: ${jobStatus}`);

      if (jobStatus === "completed") {
        const result = await job.returnvalue;
        console.log("Job result:", result);
      }

      await queue.close();
      await redis.quit();
      process.exit(0);
    }, 5000);
  } catch (error) {
    console.error("Failed to enqueue job:", error);
    await queue.close();
    await redis.quit();
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down...");
  await queue.close();
  await redis.quit();
  process.exit(0);
});

// Run the test
enqueueTestJob();
