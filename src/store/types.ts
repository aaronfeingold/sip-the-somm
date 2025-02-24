import type { Chat } from "@/types";

export interface ChatState {
  conversations: {
    data: Chat[];
    error: string | null;
  };
  status: "idle" | "loading" | "failed" | "analyzing";
  activeConversation: number | null;
}
