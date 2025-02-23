"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InitialUpload } from "@/components/chat/InitialUpload";
import { useAppDispatch } from "@/store/hooks";
import { createConversation, generateAnalysis } from "@/store/chatSlice";
import ChatLayout from "@/app/chat/ChatLayout";

export default function ChatPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleImageSelect = async (imageBase64: string) => {
    try {
      setIsAnalyzing(true);

      // Create new conversation
      const conversation = await dispatch(
        createConversation({
          title: "Wine Pairing Analysis",
          user: 1, // You'll need to handle user ID appropriately
        })
      ).unwrap();

      // Analyze image
      await dispatch(
        generateAnalysis({
          image1: imageBase64,
          conversationId: conversation.id,
        })
      ).unwrap();

      // Navigate to the conversation
      router.push(`/chat/${conversation.id}`);
      setHasStartedChat(true);
    } catch (error) {
      console.error("Failed to generateAnalysis image:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!hasStartedChat) {
    return <InitialUpload onImageSelect={handleImageSelect} />;
  }

  return <ChatLayout>{/* Chat content will go here */}</ChatLayout>;
}
