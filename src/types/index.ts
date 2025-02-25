interface Analysis {
  pairings: Array<{
    dish: string;
    wines: Array<{
      name: string;
      description: string;
      confidence: number;
    }>;
  }>;
  explanation: string;
}

interface CompletionUsage {
  completionTokens: number;
  promptTokens: number;
  totalTokens: number;
}

interface Message {
  role: "user" | "assistant" | "developer";
  content: string; // string for text, unknown since IDK how to type markdown
  usage?: CompletionUsage;
}

interface Chat {
  id: number;
  title: string;
  messages: Message[];
  totalTokens: number;
  tokensIn: number;
  tokensOut: number;
  tokenLimit: number;
  warnTokenLimit: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TokenError {
  error: string;
  tokenCount: number;
  isApproachingLimit: boolean;
}

export type { Message, Chat, CompletionUsage, Analysis, TokenError };
