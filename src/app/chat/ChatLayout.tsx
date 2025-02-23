"use client";

import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SipOwl } from "@/components/SipOwl";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const pathname = usePathname();
  const conversations = useAppSelector((state) => state.chat.conversations);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-full bg-pink-900">
      {/* Sip the Owl - clickable to toggle sidebar */}
      <div className="fixed top-4 left-4 z-50">
        <SipOwl
          isExpanded={false}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="cursor-pointer"
        />
      </div>

      {/* Conversations Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-pink-950 flex-shrink-0 transition-all duration-300 pt-24`}
      >
        <div className="flex flex-col h-full">
          <Link
            href="/chat"
            className="flex items-center gap-2 m-2 p-2 bg-pink-800 hover:bg-pink-700 rounded-lg text-white transition-colors duration-200"
          >
            <MessageSquare size={20} />
            <span>New Analysis</span>
          </Link>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {conversations.data.map((conv) => (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
                  pathname === `/chat/${conv.id}`
                    ? "bg-pink-800 text-white"
                    : "text-pink-200 hover:bg-pink-800/50"
                }`}
              >
                <MessageSquare size={16} />
                <span className="truncate">
                  {conv.title || "Wine Pairing Analysis"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col pt-24">{children}</div>
    </div>
  );
}
