import OpenAI from "openai";
import { DEFAULT_MODEL } from "@/lib/openai";
import {
  countTokens,
  getMessagesTokenCount,
  isWithinTokenLimit,
} from "@/lib/tokens";
import { revalidatePath } from "next/cache";
import humps from "humps";
import type { Message, CompletionUsage } from "@/types";
import type {
  ChatCompletionMessageParam,
  ChatCompletionContentPart,
  ChatCompletionUserMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionContentPartImage,
} from "openai/resources/chat/completions";
import { systemContent, userContentText } from "@/lib/constants";
import {
  MAX_COMPLETION_TOKENS,
  MAX_TOKENS_PER_CONVERSATION,
} from "@/lib/tokens";

const defaultUsage: CompletionUsage = {
  completionTokens: 0,
  promptTokens: 0,
  totalTokens: 0,
};

export async function analyze(
  openai: OpenAI,
  image1Base64: string,
  image2Base64?: string
): Promise<Message> {
  try {
    const systemPromptTokens = countTokens(systemContent);
    const userPromptTokens = countTokens(userContentText);

    const image1Tokens = Math.ceil(image1Base64.length / 4096) * 85;
    const image2Tokens = image2Base64
      ? Math.ceil(image2Base64.length / 4096) * 85
      : 0;

    const estimatedTokens =
      systemPromptTokens + userPromptTokens + image1Tokens + image2Tokens;

    if (estimatedTokens > 6000) {
      throw new Error(
        `Image analysis input token estimation of ${estimatedTokens} would exceed token limits. Please use smaller images.`
      );
    }

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
          image2Base64
            ? ({
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${image2Base64}`,
                },
              } as ChatCompletionContentPartImage)
            : undefined,
          {
            type: "text",
            text: userContentText,
          } as ChatCompletionContentPart,
        ].filter(Boolean) as Array<ChatCompletionContentPart>,
      } as ChatCompletionUserMessageParam,
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages,
      max_tokens: 500,
    } as ChatCompletionCreateParamsNonStreaming);

    // Parse usage data if available
    const usage: CompletionUsage = response.usage
      ? JSON.parse(humps.decamelize(JSON.stringify(response.usage)))
      : {
          promptTokens: estimatedTokens,
          completionTokens: response.choices[0].message.content?.length
            ? Math.ceil(response.choices[0].message.content.length / 4)
            : 0,
          totalTokens:
            estimatedTokens +
            (response.choices[0].message.content?.length
              ? Math.ceil(response.choices[0].message.content.length / 4)
              : 0),
        };

    const messageWithUsage = {
      ...response.choices[0].message,
      usage,
    } as Message;

    return messageWithUsage;
  } catch (error) {
    console.error("Error analyzing images:", error);
    throw error;
  }
}

export async function getChatResponse(
  openai: OpenAI,
  messages: Array<Message>,
  conversationId: number,
  maxCompletionTokens?: number
): Promise<{ content: string; usage: CompletionUsage }> {
  try {
    const tokenCount = getMessagesTokenCount(messages);

    if (!isWithinTokenLimit(messages, MAX_TOKENS_PER_CONVERSATION)) {
      throw new Error(
        `Token limit exceeded. The conversation has reached ${tokenCount} tokens, which exceeds the limit of ${MAX_TOKENS_PER_CONVERSATION}.`
      );
    }

    const availableTokens = MAX_TOKENS_PER_CONVERSATION - tokenCount;
    const requestedTokens = maxCompletionTokens ?? MAX_COMPLETION_TOKENS;

    const actualMaxTokens = Math.min(requestedTokens, availableTokens - 100); // 100 token buffer

    if (actualMaxTokens <= 0) {
      throw new Error(
        "Not enough tokens remaining for a meaningful response. Please start a new conversation."
      );
    }

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: actualMaxTokens,
    });

    const response = completion.choices[0].message.content || "";

    const usage: CompletionUsage = completion.usage
      ? JSON.parse(humps.decamelize(JSON.stringify(completion.usage)))
      : defaultUsage;

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
