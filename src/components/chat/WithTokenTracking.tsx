"use client";

import { TokenWarning } from "./TokenWarning";
import { useAppSelector } from "@/store/hooks";
import type { Conversation, ChatState } from "@/store/chatSlice";

interface WithTokenTrackingProps {
  children: React.ReactNode;
  conversationId: number;
}

export function WithTokenTracking({
  children,
  conversationId,
}: WithTokenTrackingProps) {
  const conversation = useAppSelector(
    (state: { chat: ChatState }): Conversation | undefined =>
      state.chat.conversations.data.find(
        (c: Conversation) => c.id === conversationId
      )
  );

  if (!conversation) return children;

  return (
    <div className="space-y-4">
      {conversation.warnTokenLimit && (
        <TokenWarning
          currentTokens={conversation.totalTokens}
          maxTokens={conversation.tokenLimit}
        />
      )}
      {children}
    </div>
  );
}
