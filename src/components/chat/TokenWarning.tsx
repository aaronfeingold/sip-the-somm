"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface TokenWarningProps {
  currentTokens: number;
  maxTokens: number;
}

export function TokenWarning({ currentTokens, maxTokens }: TokenWarningProps) {
  const tokenPercentage = (currentTokens / maxTokens) * 100;
  const remainingTokens = maxTokens - currentTokens;
  const usageLevel =
    tokenPercentage > 95
      ? "critical"
      : tokenPercentage > 85
      ? "high"
      : tokenPercentage > 70
      ? "moderate"
      : "normal";

  // Format the percentage to 1 decimal place
  const formattedPercentage = Math.round(tokenPercentage * 10) / 10;

  return (
    <Alert
      variant={
        usageLevel === "critical"
          ? "destructive"
          : usageLevel === "high"
          ? "destructive"
          : "default"
      }
      className="text-xs md:text-sm"
    >
      <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
      <AlertTitle className="text-sm md:text-base">
        {usageLevel === "critical"
          ? "Token Limit Critical"
          : usageLevel === "high"
          ? "Token Usage High"
          : "Token Usage Information"}
      </AlertTitle>
      <AlertDescription>
        {usageLevel === "critical" ? (
          <>
            <p>
              Only <strong>{remainingTokens}</strong> tokens remaining (
              {formattedPercentage}% used). This conversation is reaching its
              limit. Please start a new conversation soon.
            </p>
            <p className="text-xs mt-1">
              The next message may not be processed if the limit is exceeded.
            </p>
          </>
        ) : usageLevel === "high" ? (
          <>
            <p>
              Using <strong>{currentTokens}</strong> of {maxTokens} tokens (
              {formattedPercentage}%).
            </p>
            <p className="text-xs mt-1">
              Consider starting a new conversation if you plan to continue this
              discussion for much longer.
            </p>
          </>
        ) : (
          <p>
            Using <strong>{currentTokens}</strong> of {maxTokens} tokens (
            {formattedPercentage}%)
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}
