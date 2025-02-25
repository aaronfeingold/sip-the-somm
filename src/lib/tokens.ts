import { encode } from "gpt-tokenizer";

/**
 * GPT tokenizer implementation for token counting
 * This replaces the tiktoken implementation with gpt-tokenizer
 * which doesn't use WebAssembly and avoids compatibility issues.
 */


/**
 * Count tokens in a string using GPT tokenizer
 * @param text Text to count tokens for
 * @param model Model name (defaults to gpt-4-turbo-preview)
 * @returns Number of tokens
 */
export function countTokens(text: string): number {
  if (!text) return 0;

  try {
    // Encode the text to tokens
    const tokens = encode(text);
    return tokens.length;
  } catch (error) {
    console.error("Error counting tokens:", error);
    // Fallback to rough estimation if tokenizer fails
    return Math.ceil(text.length / 4);
  }
}

/**
 * Get token count for an array of chat messages
 * @param messages Array of message objects with role and content
 * @param model Model name (defaults to gpt-4-turbo-preview)
 * @returns Total token count
 */
export function getMessagesTokenCount(
  messages: Array<{ role: string; content: string }>,
  model: string = "gpt-4-turbo-preview"
): number {
  // As per OpenAI's documentation
  // Every message follows this format: {"role": "user", "content": "hello"}
  // For GPT models, every message has a 4-token overhead
  // The final assistant message has a 2-token overhead

  let totalTokens = 0;

  for (const message of messages) {
    // Count tokens in the message content
    totalTokens += countTokens(message.content, model);
    // Add message overhead (4 tokens per message)
    totalTokens += 4;
  }

  // Add final overhead (2 tokens)
  totalTokens += 2;

  return totalTokens;
}

/**
 * Check if an array of messages is within a token limit
 * @param messages Array of message objects with role and content
 * @param limit Token limit (defaults to 4000)
 * @param model Model name (defaults to gpt-4-turbo-preview)
 * @returns Boolean indicating if within limit
 */
export function isWithinTokenLimit(
  messages: Array<{ role: string; content: string }>,
  limit: number = 4000,
  model: string = "gpt-4-turbo-preview"
): boolean {
  const tokenCount = getMessagesTokenCount(messages, model);
  return tokenCount < limit;
}
