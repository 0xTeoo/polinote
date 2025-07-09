import { Job } from "bullmq";
import { VideoProcessorChain } from "./core/processor-chain";
import { VideoJobData, JobResult } from "./types";
import { Logger } from "./utils/logger";

const processorChain = new VideoProcessorChain();

export async function jobHandler(job: Job<VideoJobData>): Promise<JobResult> {
  const jobId = job.id || 'unknown';
  
  try {
    Logger.info(`Processing job ${jobId}`, jobId);
    
    const result = await processorChain.process(job.data, jobId);
    
    Logger.success(`Job ${jobId} completed successfully`, jobId);
    return result;
  } catch (error) {
    Logger.error(`Job ${jobId} failed`, error as Error, jobId);
    throw error;
  }
}
