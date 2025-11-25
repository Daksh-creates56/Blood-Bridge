'use server';

/**
 * @fileOverview Predicts potential blood shortages using AI analysis of historical data and real-time inventory.
 *
 * - predictBloodShortages - A function that initiates the blood shortage prediction process.
 * - PredictBloodShortagesInput - The input type for the predictBloodShortages function.
 * - PredictBloodShortagesOutput - The return type for the predictBloodShortages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictBloodShortagesInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical data of blood inventory levels, donation rates, and usage patterns. This should be a CSV formatted string.'
    ),
  realTimeInventory: z
    .string()
    .describe(
      'Real-time data of current blood inventory levels for each blood type. This should be a JSON formatted string.'
    ),
  alertThreshold: z
    .number()
    .default(0.1)
    .describe(
      'The threshold (as a percentage) at which a blood type is considered to be in shortage.'
    ),
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
  prompt: `You are an AI assistant that analyzes blood inventory data to predict potential shortages.

  Analyze the provided historical data and real-time inventory levels to identify blood types that are likely to be in shortage.

  Historical Data (CSV):
  {{historicalData}}

  Real-time Inventory (JSON):
  {{realTimeInventory}}

  Alert Threshold: {{alertThreshold}}

  Based on this data, predict which blood types will be in shortage and the urgency level of the shortage.
  Also provide the predicted deficit in units for each blood type and the locations that will be affected.
  Make sure the urgencyLevel field follows this rule:' +
  'If the predictedDeficit is greater than 50 units, the urgency level should be Critical.' +
  'If the predictedDeficit is between 20 and 50 units, the urgency level should be High.' +
  'If the predictedDeficit is less than 20 units, the urgency level should be Moderate.'
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
