"use client";

import { TokenWarning } from "./TokenWarning";
import { useAppSelector } from "@/store/hooks";
import type { ChatState } from "@/store/types";
import type { Chat } from "@/types";

interface WithTokenTrackingProps {
  children: React.ReactNode;
  conversationId: number;
}

export function WithTokenTracking({
  children,
  conversationId,
}: WithTokenTrackingProps) {
  const conversation = useAppSelector(
    (state: { chat: ChatState }): Chat | undefined =>
      state.chat.conversations.data.find(
        (c: Chat) => c.id === conversationId
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
