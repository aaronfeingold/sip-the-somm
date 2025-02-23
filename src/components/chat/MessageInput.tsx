'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ onSend, disabled = false, placeholder = "Ask me about the wine pairing..." }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 p-4 bg-pink-950/50 border-t border-pink-800">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 p-4 bg-pink-900 border border-pink-700 rounded-lg text-white
                 placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500
                 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="p-4 bg-pink-600 text-white rounded-lg hover:bg-pink-500
                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
