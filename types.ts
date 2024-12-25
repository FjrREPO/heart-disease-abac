export interface PredictionResponse {
  success: boolean;
  prediction: number;
  probability: {
    negative: number;
    positive: number;
  };
  timestamp: string;
  error?: string;
}