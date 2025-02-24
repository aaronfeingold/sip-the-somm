"use client";

import { useAppSelector } from "@/store/hooks";
import { SipOwl } from "@/components/SipOwl";

export default function Loading() {
  const { status } = useAppSelector((state) => state.chat);

  if (status === "analyzing") {
    return (
      <div className="flex justify-center items-center space-x-4">
        <div className="mb-12 w-full px-4">
          <SipOwl />
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex justify-start">
        <div className="bg-pink-950 p-4 rounded-lg">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
