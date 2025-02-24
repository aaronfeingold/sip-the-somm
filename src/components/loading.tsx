"use client";

import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

export default function Loading() {
  const { status } = useAppSelector((state) => state.chat);

  if (status === "analyzing") {
    return (
      <div className="flex justify-center items-center space-x-4">
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
          <div className="mb-12 w-full px-4">
            <Image
              src="/wineLoader.gif" // Put your GIF in the public folder
              alt="Loading..."
              width={225} // Adjust size as needed
              height={225}
              priority // This ensures the loader itself loads quickly
            />
          </div>
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
