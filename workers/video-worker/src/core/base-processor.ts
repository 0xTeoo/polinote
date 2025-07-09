import { Logger } from '../utils/logger';

export abstract class BaseProcessor<TInput, TOutput> {
  abstract process(input: TInput, jobId: string): Promise<TOutput>;
  
  protected log(message: string, jobId: string): void {
    Logger.info(`[${this.constructor.name}] ${message}`, jobId);
  }

  protected logStep(step: number, stepName: string, jobId: string): void {
    Logger.step(step, stepName, jobId);
  }

  protected logError(message: string, error: Error, jobId: string): void {
    Logger.error(`[${this.constructor.name}] ${message}`, error, jobId);
  }

  protected logSuccess(message: string, jobId: string): void {
    Logger.success(`[${this.constructor.name}] ${message}`, jobId);
  }
} 