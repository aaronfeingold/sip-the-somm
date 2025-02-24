"use server";

import { openai, DEFAULT_MODEL, MAX_COMPLETION_TOKENS } from "@/lib/openai";
import { revalidatePath } from "next/cache";
import humps from "humps";
import type { Message, Analysis, CompletionUsage } from "@/types";
import type {
  ChatCompletionMessageParam,
  ChatCompletionContentPart,
  ChatCompletionUserMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionContentPartImage,
} from "openai/resources/chat/completions";
import { systemContent, userContentText } from "@/lib/constants";

const defaultUsage: CompletionUsage = {
  completionTokens: 0,
  promptTokens: 0,
  totalTokens: 0,
};

export async function analyze(
  image1Base64: string,
  image2Base64?: string
): Promise<Analysis> {
  try {
    const messages: Array<ChatCompletionMessageParam> = [
      {
        role: "system",
        content: systemContent,
      } as ChatCompletionSystemMessageParam,
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${image1Base64}`,
            },
          } as ChatCompletionContentPartImage,
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${image2Base64}`,
            },
          } as ChatCompletionContentPartImage,
          {
            type: "text",
            text: userContentText,
          } as ChatCompletionContentPart,
        ] as Array<ChatCompletionContentPart>,
      } as ChatCompletionUserMessageParam,
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages,
      max_tokens: 500,
    } as ChatCompletionCreateParamsNonStreaming);

    // Parse the response into structured data
    // You might need to adjust this based on actual response format
    const analysis: Analysis = JSON.parse(
      response.choices[0].message.content || "{}"
    );

    return analysis;
  } catch (error) {
    console.error("Error analyzing images:", error);
    throw error;
  }
}

export async function getChatResponse(
  messages: Array<Message>,
  conversationId: number,
  maxCompletionTokens?: number
): Promise<{ content: string; usage: CompletionUsage }> {
  try {
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: maxCompletionTokens ?? MAX_COMPLETION_TOKENS,
    });

    const response = completion.choices[0].message.content || "";
    const usage: CompletionUsage = completion.usage
      ? JSON.parse(humps.decamelize(JSON.stringify(completion.usage)))
      : defaultUsage;

    // Revalidate the chat page to reflect new messages
    revalidatePath(`/chat/${conversationId}`);

    return {
      content: response,
      usage,
    };
  } catch (error) {
    console.error("Error getting chat response:", error);
    throw error;
  }
}
