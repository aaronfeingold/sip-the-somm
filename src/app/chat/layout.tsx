"use client";

import { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { MessageSquare, PlusSquare, Trash2, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteConversation } from "@/store/chatSlice";
import SidebarHeader from "@/components/chat/SidebarHeader";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const conversations = useAppSelector((state) => state.chat.conversations);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverZoneRef = useRef<HTMLDivElement>(null);

  // Detect if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDeleteChat = (id: number) => {
    if (confirmDelete === id) {
      dispatch(deleteConversation(id));
      setConfirmDelete(null);

      // If we're currently viewing the deleted conversation, redirect to /chat
      if (pathname === `/chat/${id}`) {
        router.push("/chat");
      }
    } else {
      setConfirmDelete(id);

      // Auto-reset confirmation after 3 seconds if not clicked
      setTimeout(() => {
        setConfirmDelete(null);
      }, 3000);
    }
  };

  // Close sidebar when route changes on mobile
  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Handle mouse enter/leave for desktop hover effect
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsSidebarOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Mobile Overlay when sidebar is open */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Header */}
      <div className="fixed top-4 left-4 z-50">
        <SidebarHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          title="SIP the Owl"
        />
      </div>

      {/* Hover zone for desktop - invisible area that extends the hover area */}
      <div
        ref={hoverZoneRef}
        className="fixed top-0 left-0 w-8 h-full z-40 hidden md:block"
        onMouseEnter={handleMouseEnter}
      />

      {/* Sidebar Close Button - Only visible when sidebar is open on mobile */}
      {isSidebarOpen && isMobile && (
        <button
          className="fixed top-4 right-4 z-50 p-2 bg-pink-800 rounded-full md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-5 w-5 text-white" />
        </button>
      )}

      {/* Conversations Sidebar */}
      <div
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:sticky top-0 left-0 w-64 h-screen bg-pink-950 flex-shrink-0 transition-transform duration-300 z-40 pt-20 md:pt-24 overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <Link
            href="/chat"
            className="flex items-center gap-2 m-2 p-2 bg-pink-800 hover:bg-pink-700 rounded-lg text-white transition-colors duration-200"
            onClick={closeSidebarOnMobile}
          >
            <PlusSquare size={20} />
            <span>New Analysis</span>
          </Link>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {conversations.data.map((conv) => (
              <div
                key={conv.id}
                className={`flex items-center justify-between rounded-lg transition-colors duration-200 ${
                  pathname === `/chat/${conv.id}`
                    ? "bg-pink-800 text-white"
                    : "text-pink-200 hover:bg-pink-800/50"
                }`}
              >
                <Link
                  href={`/chat/${conv.id}`}
                  className="flex items-center gap-2 p-2 flex-grow truncate"
                  onClick={closeSidebarOnMobile}
                >
                  <MessageSquare size={16} />
                  <span className="truncate">
                    {conv.title || "Wine Pairing Analysis"}
                  </span>
                </Link>
                <button
                  onClick={() => handleDeleteChat(conv.id)}
                  className={`p-2 mr-1 rounded-full hover:bg-pink-700 transition-colors ${
                    confirmDelete === conv.id
                      ? "bg-red-600 hover:bg-red-700"
                      : ""
                  }`}
                  aria-label={
                    confirmDelete === conv.id ? "Confirm delete" : "Delete chat"
                  }
                  title={
                    confirmDelete === conv.id ? "Confirm delete" : "Delete chat"
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {conversations.data.length === 0 && (
              <div className="text-pink-300 text-center p-4 italic">
                No conversations yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className={`flex-1 w-full transition-all duration-300 h-screen md:ml-64 pt-16 md:pt-0`}
      >
        {children}
      </div>
    </div>
  );
}
