export const AUDIO_CONSTANTS = {
  MAX_DURATION_SECONDS: 1450, // 24 minutes and 10 seconds (Whisper API limit)
  TEMP_DIR: './workspace/temp',
} as const;

export const STORAGE_CONSTANTS = {
  DEFAULT_BASE_DIR: './workspace/data',
  AUDIO_FILENAME: 'audio.mp3',
  RESULT_FILENAME: 'result.json',
} as const;

export const QUEUE_CONSTANTS = {
  QUEUE_NAME: 'video',
  DEFAULT_CONCURRENCY: 1,
} as const;

export const REDIS_CONSTANTS = {
  DEFAULT_HOST: 'localhost',
  DEFAULT_PORT: 6379,
  DEFAULT_DB: 0,
} as const; 