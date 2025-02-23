import OpenAI from "openai";

// Initialize OpenAI client with server-side check
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API Key");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const DEFAULT_MODEL = "gpt-4-turbo";
export const MAX_COMPLETION_TOKENS = 500;
export const MAX_TOKENS_PER_CONVERSATION = 4000;
