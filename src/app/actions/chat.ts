'use server';

import { answerQuestion as answerQuestionFlow, type ChatbotInput } from '@/ai/flows/chatbot';

export async function answerQuestion(input: ChatbotInput): Promise<string> {
  try {
    const output = await answerQuestionFlow(input);
    return output.answer;
  } catch (error) {
    console.error("Error in chat server action:", error);
    return "I'm sorry, but I encountered an error and can't respond right now. Please try again later.";
  }
}
