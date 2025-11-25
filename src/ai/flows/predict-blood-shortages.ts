'use server';

/**
 * @fileOverview Predicts potential blood shortages using AI analysis of historical data and real-time inventory.
 *
 * - predictBloodShortages - A function that initiates the blood shortage prediction process.
 * - PredictBloodShortagesInput - The input type for the predictBloodShortages function.
 * - PredictBloodShortagesOutput - The return type for the predictBloodShortages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { bloodTypes } from '@/lib/schemas';

const predictionPeriods = ['Next 1 Week', 'Next 1 Month', 'Next 1 Year'] as const;

const PredictBloodShortagesInputSchema = z.object({
  bloodType: z.enum(bloodTypes).describe('The blood type to predict shortages for.'),
  predictionPeriod: z.enum(predictionPeriods).describe('The time period for the prediction.'),
});
export type PredictBloodShortagesInput = z.infer<
  typeof PredictBloodShortagesInputSchema
>;

const PredictedShortageSchema = z.object({
  bloodType: z.string().describe('The blood type that is predicted to be in shortage.'),
  predictedDeficit: z
    .number()
    .describe('The predicted deficit in units for the blood type.'),
  urgencyLevel: z
    .string()
    .describe(
      'The urgency level of the predicted shortage (Critical, High, Moderate).' + 
      'If the predictedDeficit is greater than 50 units, the urgency level should be Critical.' + 
      'If the predictedDeficit is between 20 and 50 units, the urgency level should be High.' + 
      'If the predictedDeficit is less than 20 units, the urgency level should be Moderate.'
    ),
  affectedLocations: z
    .array(z.string())
    .describe('A list of locations that are predicted to be affected by the shortage.'),
});

const PredictBloodShortagesOutputSchema = z.object({
  predictedShortages: z
    .array(PredictedShortageSchema)
    .describe('A list of blood types that are predicted to be in shortage.'),
    analysisSummary: z.array(z.string()).describe('A point-wise summary of the analysis performed by the AI.'),
});
export type PredictBloodShortagesOutput = z.infer<
  typeof PredictBloodShortagesOutputSchema
>;

export async function predictBloodShortages(
  input: PredictBloodShortagesInput
): Promise<PredictBloodShortagesOutput> {
  return predictBloodShortagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictBloodShortagesPrompt',
  input: {schema: PredictBloodShortagesInputSchema},
  output: {schema: PredictBloodShortagesOutputSchema},
  prompt: `You are an AI assistant that analyzes blood inventory data to predict potential shortages for a specific blood type over a given period.

  You have access to a vast (but simulated) dataset of historical blood inventory levels, donation rates, usage patterns, and seasonal trends for various locations.

  The user wants to know about potential shortages for blood type '{{bloodType}}' over the '{{predictionPeriod}}'.

  Your task is to:
  1.  Analyze the available data trends for '{{bloodType}}'.
  2.  Based on your analysis, predict if a shortage is likely to occur within the '{{predictionPeriod}}'.
  3.  If a shortage is predicted, identify the potential deficit in units, determine the urgency level, and list the most likely affected locations.
  4.  Provide an insightful 'analysisSummary' explaining your prediction in a point-wise format. Each point should be a separate string in an array. For example, if you predict a shortage, explain why (e.g., ["Historical data shows a 15% increase in demand for O- during the upcoming holiday season.", "A recent dip in donations has been observed in major urban centers."]). If no shortage is predicted, explain why the supply appears stable.
  5.  If you predict a shortage for the requested blood type, you may also identify and include potential shortages for other related or commonly-used blood types in the 'predictedShortages' array if your analysis indicates a high probability.

  Urgency Level Rules:
  - Critical: Deficit > 50 units
  - High: Deficit between 20 and 50 units
  - Moderate: Deficit < 20 units

  Generate a response in the specified JSON format.
  `,
});

const predictBloodShortagesFlow = ai.defineFlow(
  {
    name: 'predictBloodShortagesFlow',
    inputSchema: PredictBloodShortagesInputSchema,
    outputSchema: PredictBloodShortagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
