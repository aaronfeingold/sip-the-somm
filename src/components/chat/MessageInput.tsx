'use client';

import { useState, useEffect } from "react";
import { Send } from 'lucide-react';
import { useAppSelector } from "@/store/hooks";
import { countTokens } from "@/lib/tokens";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  conversationId?: number;
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = "Ask me about the wine pairing...",
  conversationId,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [tokenCount, setTokenCount] = useState(0);
  const [tokenWarning, setTokenWarning] = useState(false);

  // Get current conversation data if ID is provided
  const conversation = useAppSelector((state) =>
    conversationId
      ? state.chat.conversations.data.find((c) => c.id === conversationId)
      : undefined
  );

  const isApproachingLimit = conversation?.warnTokenLimit || false;

  // Update token count when message changes
  useEffect(() => {
    if (message) {
      const count = countTokens(message);
      setTokenCount(count);

      // Show warning if message is exceptionally long
      setTokenWarning(count > 500); // Warn for very long messages
    } else {
      setTokenCount(0);
      setTokenWarning(false);
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
      setTokenCount(0);
      setTokenWarning(false);
    }
  };

  return (
    <div className="space-y-1 md:space-y-2">
      {tokenWarning && !isApproachingLimit && (
        <div className="text-xs text-pink-300 px-2 md:px-4">
          Warning: Your message is quite long ({tokenCount} tokens). This may
          consume a significant portion of your token limit.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 md:gap-4 p-2 md:p-4 bg-pink-950/50 border-t border-pink-800"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            isApproachingLimit
              ? "Token limit nearly reached. Please start a new conversation."
              : placeholder
          }
          disabled={disabled || isApproachingLimit}
          className="flex-1 py-2 px-3 md:p-4 bg-pink-900 border border-pink-700 rounded-lg text-white text-sm md:text-base
                   placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500
                   disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled || isApproachingLimit}
          className="p-2 md:p-4 bg-pink-600 text-white rounded-lg hover:bg-pink-500
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {message && !isApproachingLimit && (
        <div className="text-xs text-pink-200 px-2 md:px-4">
          Current message: ~{tokenCount} tokens
        </div>
      )}
    </div>
  );
}
