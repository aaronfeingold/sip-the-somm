"use client";

import React, { createContext, useContext, useCallback } from "react";
import { toast } from "sonner";
import { XCircle } from "lucide-react";

// Define the error types we'll support
export type ErrorSeverity = "default" | "critical" | "warning" | "token";

interface ErrorContextType {
  showError: (
    message: string,
    severity?: ErrorSeverity,
    duration?: number
  ) => void;
}

// Create context with default values
const ErrorContext = createContext<ErrorContextType>({
  showError: () => {},
});

// Custom hook for easy access to the error context
export const useError = () => useContext(ErrorContext);

// Context Provider component
export function ErrorProvider({ children }: { children: React.ReactNode }) {
  // Show an error with the given message and optional severity
  const showError = useCallback(
    (
      message: string,
      severity: ErrorSeverity = "default",
      duration: number = 5000
    ) => {
      // Create icon based on severity
      const icon = (
        <XCircle
          className={`h-5 w-5 ${
            severity === "token"
              ? "text-pink-500"
              : severity === "warning"
              ? "text-amber-500"
              : "text-destructive"
          }`}
        />
      );

      // Determine toast type based on severity
      switch (severity) {
        case "critical":
          toast.error(message, {
            icon,
            duration,
            className: "bg-destructive text-destructive-foreground",
          });
          break;
        case "warning":
          toast.warning(message, {
            icon,
            duration,
            className:
              "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
          });
          break;
        case "token":
          toast.error(message, {
            icon,
            duration,
            className:
              "bg-pink-700/10 text-pink-700 dark:text-pink-300 border border-pink-500/20",
          });
          break;
        default:
          toast(message, {
            icon,
            duration,
          });
      }
    },
    []
  );

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
    </ErrorContext.Provider>
  );
}
