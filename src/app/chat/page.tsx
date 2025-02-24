"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InitialUpload } from "@/components/chat/InitialUpload";
import { useAppDispatch } from "@/store/hooks";
import { createConversation, generateAnalysis } from "@/store/chatSlice";
import Loading from "@/components/loading";

export function Page() {
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleImageSelect = async (imageBase64: string) => {
    try {
      // Create new conversation
      const conversation = await dispatch(
        createConversation({
          title: "Wine Pairing Analysis",
          user: 1,
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
      console.error("Failed to analyze image:", error);
    } finally {
    }
  };

  if (!hasStartedChat) {
    return (
      <main className="w-full max-w-md relative z-10 flex flex-col items-center text-center mx-auto">
        {!hasStartedChat && <InitialUpload onImageSelect={handleImageSelect} />}
        <Loading />
      </main>
    );
  }
}
