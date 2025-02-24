"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InitialUpload } from "@/components/chat/InitialUpload";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createConversation, generateAnalysis } from "@/store/chatSlice";
import Loading from "@/components/loading";

export default function Page() {
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.chat);

  const handleImagesSelect = async (images: { food: string; wine: string }) => {
    try {
      // Create new conversation
      const conversation = await dispatch(
        createConversation({
          title: "Wine Pairing Analysis",
          user: 1,
        })
      ).unwrap();
      setHasStartedChat(true);
      // Analyze image
      await dispatch(
        generateAnalysis({
          image1: images.food,
          image2: images.wine,
          conversationId: conversation.id,
        })
      ).unwrap();

      // Navigate to the conversation
      router.push(`/chat/${conversation.id}`);
    } catch (error) {
      console.error("Failed to analyze image:", error);
    } finally {
    }
  };

    return (
      <div className="w-full max-w-md relative z-10 flex flex-col items-center text-center mx-auto">
        {!hasStartedChat && (
          <InitialUpload onImagesSelect={handleImagesSelect} />
        )}
        {status === "loading" || (status === "analyzing" && <Loading />)}
      </div>
    );
}
