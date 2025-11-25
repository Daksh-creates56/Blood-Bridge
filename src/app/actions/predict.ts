'use server';

import { predictBloodShortages as predictBloodShortagesFlow, PredictBloodShortagesInput, PredictBloodShortagesOutput } from '@/ai/flows/predict-blood-shortages';

export async function predictBloodShortages(input: PredictBloodShortagesInput): Promise<PredictBloodShortagesOutput> {
  try {
    const output = await predictBloodShortagesFlow(input);
    return output;
  } catch (error) {
    console.error("Error in predictBloodShortages server action:", error);
    throw new Error("Failed to get prediction from AI flow.");
  }
}

export type { PredictBloodShortagesInput, PredictBloodShortagesOutput };