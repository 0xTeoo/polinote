import { BaseProcessor } from '../core/base-processor';
import { Storage } from '../storage';
import { StorageInput, StorageOutput } from '../types';

export class StorageProcessor extends BaseProcessor<StorageInput, StorageOutput> {
  constructor(private storage: Storage) {
    super();
  }

  async process(input: StorageInput, jobId: string): Promise<StorageOutput> {
    this.log('Starting storage operations', jobId);
    
    try {
      this.logStep(1, 'Saving results', jobId);
      
      const filePath = await this.storage.saveJobResults(input.videoId, input.result);
      
      this.log(`Results saved to: ${filePath}`, jobId);
      
      this.logSuccess('Storage operations completed', jobId);
      
      return { filePath };
    } catch (error) {
      this.logError('Storage operations failed', error as Error, jobId);
      throw error;
    }
  }
} 