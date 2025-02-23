import { encoding_for_model } from 'tiktoken';
import type { TiktokenModel } from 'tiktoken';

// Map OpenAI models to tiktoken models
const TIKTOKEN_MODELS: Record<string, TiktokenModel> = {
  'gpt-4-turbo-preview': 'gpt-4',
  'gpt-4-vision-preview': 'gpt-4',
  'gpt-4': 'gpt-4',
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
};

export function countTokens(text: string, model: string = 'gpt-4-turbo-preview'): number {
  try {
    const tiktokenModel = TIKTOKEN_MODELS[model] || model;
    const encoder = encoding_for_model(tiktokenModel);
    const tokens = encoder.encode(text);
    encoder.free(); // Clean up
    return tokens.length;
  } catch (error) {
    console.error('Error counting tokens:', error);
    // Fallback to rough estimation if tiktoken fails
    return Math.ceil(text.length / 4);
  }
}

export function getMessagesTokenCount(messages: Array<{ role: string; content: string }>, model: string = 'gpt-4-turbo-preview'): number {
  // As per OpenAI's documentation
  // Every message follows this format: {"role": "user", "content": "hello"}
  // For GPT models, every message has a 4-token overhead
  // The final assistant message has a 2-token overhead

  let totalTokens = 0;

  for (const message of messages) {
    totalTokens += countTokens(message.content, model);
    totalTokens += 4; // Add message overhead
  }

  totalTokens += 2; // Add final overhead

  return totalTokens;
}

export function isWithinTokenLimit(messages: Array<{ role: string; content: string }>, limit: number = 4000, model: string = 'gpt-4-turbo-preview'): boolean {
  const tokenCount = getMessagesTokenCount(messages, model);
  return tokenCount < limit;
}
