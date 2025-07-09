export class Logger {
  private static formatMessage(level: string, message: string, jobId?: string): string {
    const timestamp = new Date().toISOString();
    const jobPrefix = jobId ? `[Job:${jobId}]` : '';
    return `${timestamp} [${level}]${jobPrefix} ${message}`;
  }

  static info(message: string, jobId?: string): void {
    console.log(this.formatMessage('INFO', message, jobId));
  }

  static error(message: string, error?: Error, jobId?: string): void {
    console.error(this.formatMessage('ERROR', message, jobId));
    if (error) {
      console.error(error.stack);
    }
  }

  static warn(message: string, jobId?: string): void {
    console.warn(this.formatMessage('WARN', message, jobId));
  }

  static debug(message: string, jobId?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatMessage('DEBUG', message, jobId));
    }
  }

  static step(stepNumber: number, stepName: string, jobId?: string): void {
    this.info(`Step ${stepNumber}: ${stepName}`, jobId);
  }

  static success(message: string, jobId?: string): void {
    console.log(this.formatMessage('SUCCESS', message, jobId));
  }
} 