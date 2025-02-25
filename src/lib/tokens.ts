import { encode } from "gpt-tokenizer";

export const MAX_COMPLETION_TOKENS = 500;
export const MAX_TOKENS_PER_CONVERSATION = 4000;

export function countTokens(text: string): number {
  if (!text) return 0;

  try {
    const tokens = encode(text);
    return tokens.length;
  } catch (error) {
    console.error("Error counting tokens:", error);

    return Math.ceil(text.length / 4);
  }
}

export function getMessagesTokenCount(
  messages: Array<{ role: string; content: string }>
): number {
  let totalTokens = 0;

  for (const message of messages) {
    totalTokens += countTokens(message.content);
    totalTokens += 4;
  }

  totalTokens += 2;

  return totalTokens;
}

export function isWithinTokenLimit(
  messages: Array<{ role: string; content: string }>,
  limit: number = 4000
): boolean {
  const tokenCount = getMessagesTokenCount(messages);
  return tokenCount < limit;
}
