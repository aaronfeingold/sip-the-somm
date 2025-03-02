// src/provider/ErrorProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { AlertCircle, X } from "lucide-react";

type ErrorType = "default" | "warning";

interface ErrorContextType {
  showError: (message: string, type?: ErrorType, duration?: number) => void;
  hideError: () => void;
}

const ErrorContext = createContext<ErrorContextType>({
  showError: () => {},
  hideError: () => {},
});

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>("default");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showError = (
    message: string,
    type: ErrorType = "default",
    duration: number = 6000
  ) => {
    setError(message);
    setErrorType(type);

    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout to hide the error after the specified duration
    const id = setTimeout(() => {
      setError(null);
    }, duration);

    setTimeoutId(id);
  };

  const hideError = () => {
    setError(null);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  return (
    <ErrorContext.Provider value={{ showError, hideError }}>
      {children}

      {/* Fixed position error notification always at the bottom of the viewport */}
      {error && (
        <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
          <div
            className={`
            flex items-center gap-2 rounded-lg p-3 shadow-lg max-w-md w-full
            ${
              errorType === "warning"
                ? "bg-amber-600 text-white"
                : "bg-red-500 text-white"
            }
          `}
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="flex-1 text-sm">{error}</p>
            <button
              onClick={hideError}
              className="rounded-full p-1 hover:bg-black/10"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </ErrorContext.Provider>
  );
};
