import OpenAI from "openai";

// Initialize OpenAI client with server-side check
export const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API Key");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};
export const DEFAULT_MODEL = "gpt-4-turbo";
