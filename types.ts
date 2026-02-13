export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING', // Processing file locally
  PROCESSING = 'PROCESSING', // Sending to AI
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GeneratedImage {
  original: string; // Base64
  processed: string; // Base64
}

export interface WindowAI {
  aistudio: {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

declare global {
  interface Window extends WindowAI {}
}