"use client";

import ReactMarkdown from "react-markdown";
import type { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
  key: number;
}
export function ChatMessage({ message, key }: ChatMessageProps) {
  return (
    <div
      key={key}
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
          {message.role === "assistant" ? (
            <ReactMarkdown>
              {Array.isArray(message.content)
                ? message.content.join("")
                : message.content ?? ""}
            </ReactMarkdown>
          ) : Array.isArray(message.content) ? (
            message.content.map((part, index) => (
              <span key={index}>{part}</span>
            ))
          ) : (
            message.content ?? ""
          )}
        </div>
      </div>
    </div>
  );
}
