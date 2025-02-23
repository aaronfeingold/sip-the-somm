import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { analyze, getChatResponse } from "@/actions/chat";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { WineAnalysisResponse } from "@/actions/chat";

export interface Conversation {
  id: number;
  title: string;
  messages: ChatCompletionMessageParam[];
  totalTokens: number;
  tokensIn: number;
  tokensOut: number;
  tokenLimit: number;
  warnTokenLimit: boolean;
  analysis: WineAnalysisResponse;
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  conversations: {
    data: Conversation[];
    error: string | null;
  };
  status: "idle" | "loading" | "failed";
  activeConversation: number | null;
}

const initialState: ChatState = {
  conversations: {
    data: [],
    error: null,
  },
  status: "idle",
  activeConversation: null,
};

export const createConversation = createAsyncThunk(
  "chat/createConversation",
  async ({ title }: { title: string; user?: number }) => {
    // In the future, this will interface with your API
    const conversation: Conversation = {
      id: Date.now(),
      title,
      messages: [] as ChatCompletionMessageParam[],
      totalTokens: 0,
      tokensIn: 0,
      tokensOut: 0,
      tokenLimit: 4000, // Example limit
      warnTokenLimit: false,
      analysis: {} as WineAnalysisResponse,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return conversation;
  }
);

export const generateAnalysis = createAsyncThunk(
  "chat/generateAnalysis",
  async ({
    image1,
    image2,
    conversationId,
  }: {
    image1: string;
    image2?: string;
    conversationId: number;
  }) => {
    const analysis = await analyze(image1, image2);
    return { analysis, conversationId };
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({
    conversation,
    message,
    messageHistory,
  }: {
    conversation: number;
    message: string;
    messageHistory: Array<ChatCompletionMessageParam>;
  }) => {
    const response = await getChatResponse(
      [...messageHistory, { role: "user", content: message }],
      conversation
    );

    return {
      conversationId: conversation,
      tokensIn: response.usage.promptTokens,
      tokensOut: response.usage.completionTokens,
      totalTokens: response.usage.totalTokens,
      messages: [
        {
          role: "user",
          content: message,
        } as ChatCompletionMessageParam,
        {
          role: "assistant",
          content: response.content,
        } as ChatCompletionMessageParam,
      ],
    };
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation(state, action: PayloadAction<number>) {
      state.activeConversation = action.payload;
    },
    clearError(state) {
      state.conversations.error = null;
    },
    setTokenWarning(
      state,
      action: PayloadAction<{ id: number; warn: boolean }>
    ) {
      const conversation = state.conversations.data.find(
        (c) => c.id === action.payload.id
      );
      if (conversation) {
        conversation.warnTokenLimit = action.payload.warn;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createConversation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.status = "idle";
        state.conversations.data.push(action.payload);
        state.activeConversation = action.payload.id;
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.status = "failed";
        state.conversations.error =
          action.error.message || "Failed to create conversation";
      })
      .addCase(generateAnalysis.pending, (state) => {
        state.status = "loading";
      })
      .addCase(generateAnalysis.fulfilled, (state, action) => {
        state.status = "idle";
        const conversation = state.conversations.data.find(
          (c) => c.id === action.payload.conversationId
        );
        if (conversation) conversation.analysis = action.payload.analysis;
      })
      .addCase(generateAnalysis.rejected, (state, action) => {
        state.status = "failed";
        state.conversations.error =
          action.error.message || "Failed to generate analysis conversation";
      })
      .addCase(sendMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "idle";
        const conversation = state.conversations.data.find(
          (c) => c.id === action.payload.conversationId
        );
        if (conversation) {
          conversation.messages.push(...action.payload.messages);
          conversation.tokensIn += conversation.tokensIn || 0;
          conversation.tokensOut += action.payload.tokensOut || 0;
          conversation.totalTokens += action.payload.totalTokens || 0;
          conversation.updatedAt = new Date().toISOString();
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.conversations.error =
          action.error.message || "Failed to send message";
      });
  },
});

export const { setActiveConversation, clearError } = chatSlice.actions;
export default chatSlice.reducer;
