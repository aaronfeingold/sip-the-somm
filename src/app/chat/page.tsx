"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InitialUpload } from "@/components/chat/InitialUpload";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createConversation,
  generateAnalysis,
  clearError,
} from "@/store/chatSlice";
import Loading from "@/components/loading";
import { useError } from "@/provider/ErrorProvider";

export default function Page() {
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, conversations } = useAppSelector((state) => state.chat);
  const { showError } = useError();

  // Check for errors from redux store
  useEffect(() => {
    if (conversations.error) {
      // Show error with appropriate severity
      const isImageError = conversations.error.toLowerCase().includes("image");

      showError(
        conversations.error,
        isImageError ? "warning" : "default",
        isImageError ? 10000 : 6000 // Give more time for image errors
      );

      // Clear the error from the store
      dispatch(clearError());

      // Reset loading state if we had an error during analysis
      if (status === "analyzing") {
        setHasStartedChat(false);
      }
    }
  }, [conversations.error, dispatch, showError, status]);

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
      // Error will be displayed via the useEffect above
      console.error("Failed to analyze image:", error);
      setHasStartedChat(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10 flex flex-col items-center text-center mx-auto">
      {!hasStartedChat && (
        <InitialUpload
          onImagesSelect={handleImagesSelect}
          disabled={status === "loading" || status === "analyzing"}
        />
      )}
      {(status === "loading" || status === "analyzing") && <Loading />}
    </div>
  );
}
