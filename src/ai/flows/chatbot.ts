'use server';

/**
 * @fileOverview A chatbot flow for answering questions about the Blood Bridge app and blood donation.
 *
 * - answerQuestion - A function that takes a question and returns an answer.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatbotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
  question: z.string().describe('The user\'s latest question.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the user\'s question.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;


export async function answerQuestion(
  input: ChatbotInput
): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
    name: 'chatbotPrompt',
    input: { schema: ChatbotInputSchema },
    output: { schema: ChatbotOutputSchema },
    prompt: `You are a friendly and helpful AI assistant for an application called "Blood Bridge".
    Your purpose is to answer questions about blood donation, blood types, and how to use the Blood Bridge app.
    
    Keep your answers concise and easy to understand.
    
    Here is some information about the Blood Bridge app:
    - **Dashboard**: Shows real-time blood inventory levels across different hospitals.
    - **Predictions**: Uses AI to forecast potential blood shortages.
    - **Send Request**: Allows hospitals to broadcast urgent needs for blood.
    - **Active Requests**: Shows a list of current urgent blood requests that donors can respond to.
    
    Use the provided conversation history to maintain context.
    
    Conversation History:
    {{#each history}}
      {{role}}: {{content}}
    {{/each}}
    
    New User Question: {{question}}
    
    Your Answer:`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
