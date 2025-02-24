import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { analyze, getChatResponse } from "@/actions/chat";
import { Message, Chat } from "@/types";
import { ChatState } from "@/store/types";

const chatTokenLimit = 4000; // arbitrary limit for now...

export const initialState: ChatState = {
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
    // In the future, there will be users
    const conversation: Chat = {
      id: Date.now(),
      title,
      messages: [] as Message[],
      totalTokens: 0,
      tokensIn: 0,
      tokensOut: 0,
      tokenLimit: chatTokenLimit,
      warnTokenLimit: false,
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
    return { analysis, conversationId, image1, image2 };
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
    messageHistory: Array<Message>;
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
        } as Message,
        {
          role: "assistant",
          content: response.content,
        } as Message,
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
        state.status = "analyzing";
      })
      .addCase(generateAnalysis.fulfilled, (state, action) => {
        state.status = "idle";
        const conversation = state.conversations.data.find(
          (c) => c.id === action.payload.conversationId
        );
        if (conversation) {
          conversation.messages.push(action.payload.analysis);
        }
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
