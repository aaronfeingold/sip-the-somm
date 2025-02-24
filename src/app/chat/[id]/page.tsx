"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendMessage, setActiveConversation } from "@/store/chatSlice";
import { ChatMessage } from "@/components/chat/Message";
import { MessageInput } from "@/components/chat/MessageInput";
import { TokenWarning } from "@/components/chat/TokenWarning";
import Loading from "@/components/loading";

export default function Page() {
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = useAppSelector((state) =>
    state.chat.conversations.data.find((c) => c.id === parseInt(id))
  );
  const { status } = useAppSelector((state) => state.chat);

  useEffect(() => {
    if (id) {
      dispatch(setActiveConversation(parseInt(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  const handleSendMessage = async (message: string) => {
    if (status === "loading" || !id || !conversation) return;

    await dispatch(
      sendMessage({
        conversation: parseInt(id),
        message,
        messageHistory: conversation.messages,
      })
    );
  };

  if (!conversation) {
    return (
      <>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-pink-300">Conversation not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full relative">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-4 space-y-6">
            {conversation.warnTokenLimit && (
              <TokenWarning
                currentTokens={conversation.totalTokens}
                maxTokens={conversation.tokenLimit}
              />
            )}
            {conversation.messages?.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            <Loading />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-3xl mx-auto">
            <MessageInput
              onSend={handleSendMessage}
              disabled={status === "loading" || conversation.warnTokenLimit}
              placeholder={
                conversation.warnTokenLimit
                  ? "Token limit reached. Please start a new conversation."
                  : "Ask me about the wine pairing..."
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
