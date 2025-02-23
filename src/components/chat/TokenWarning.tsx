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

  return (
    <Alert variant={tokenPercentage > 90 ? "destructive" : "default"}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Token Usage Warning</AlertTitle>
      <AlertDescription>
        {tokenPercentage > 90
          ? `Only ${remainingTokens} tokens remaining. Please start a new conversation.`
          : `Using ${currentTokens} of ${maxTokens} tokens (${Math.round(
              tokenPercentage
            )}%)`}
      </AlertDescription>
    </Alert>
  );
}
