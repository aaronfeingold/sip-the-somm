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
  content: string;
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
  analysis: Analysis;
  images: {
    image1: string;
    image2: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type { Message, Chat, CompletionUsage, Analysis };
