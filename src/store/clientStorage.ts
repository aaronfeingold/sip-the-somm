"use client";

import { ChatState } from "@/store/types";
// Load chat state from localStorage during store creation
// TODO: monitor cache memory usage during POC -> determine if indexedDB is necessary
export const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("chatState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState) as ChatState;
  } catch (e) {
    console.warn("Error loading state:", e);
    return undefined;
  }
};
