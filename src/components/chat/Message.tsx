"use client";

import type { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
  showTokenCount?: boolean;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          message.role === "user"
            ? "bg-pink-700 text-white ml-4"
            : "bg-pink-950 text-pink-100 mr-4"
        }`}
      >
        <div className="prose prose-invert max-w-none">
          {Array.isArray(message.content)
            ? message.content.map((part, index) => (
                <span key={index}>{part}</span>
              ))
            : message.content ?? ""}
        </div>
      </div>
    </div>
  );
}
