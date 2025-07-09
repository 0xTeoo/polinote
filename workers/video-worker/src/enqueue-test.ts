// Example of how to use the new OOP structure
import { VideoProcessorChain } from './core/processor-chain';
import { AudioProcessor, MediaToolsClient, Storage } from './index';
import { VideoJobData } from './types';

// Example 1: Using the full processor chain
async function processVideoExample() {
  const processor = new VideoProcessorChain();

  const jobData: VideoJobData = {
    youtubeUrl: 'https://www.youtube.com/watch?v=example'
  };

  try {
    const result = await processor.process(jobData, 'test-job-id');
    console.log('Processing completed:', result);
  } catch (error) {
    console.error('Processing failed:', error);
  }
}

// Example 2: Using individual processors
async function processAudioOnlyExample() {
  const audioProcessor = new AudioProcessor(new MediaToolsClient(), new Storage());

  try {
    const result = await audioProcessor.process({
      youtubeUrl: 'https://www.youtube.com/watch?v=example',
      videoId: 'example'
    }, 'test-job-id');

    console.log('Audio processing completed:', result);
  } catch (error) {
    console.error('Audio processing failed:', error);
  }
}

// Example 3: Creating a custom processor
import { BaseProcessor } from './core/base-processor';

interface CustomInput {
  data: string;
}

interface CustomOutput {
  processedData: string;
}

class CustomProcessor extends BaseProcessor<CustomInput, CustomOutput> {
  async process(input: CustomInput, jobId: string): Promise<CustomOutput> {
    this.log('Processing custom data', jobId);

    // Your custom logic here
    const processedData = input.data.toUpperCase();

    this.logSuccess('Custom processing completed', jobId);

    return { processedData };
  }
}

// Export for testing
export { processVideoExample, processAudioOnlyExample, CustomProcessor }; 