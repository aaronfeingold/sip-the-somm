import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { analyze, getChatResponse } from "@/actions/chat";
import { Message, Chat } from "@/types";
import { ChatState } from "@/store/types";
import {
  getMessagesTokenCount,
  isWithinTokenLimit,
  MAX_TOKENS_PER_CONVERSATION,
} from "@/lib/tokens";

const chatTokenLimit = MAX_TOKENS_PER_CONVERSATION; // arbitrary limit for now...

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
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image1, image2 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate analysis");
    }
    const analysis = await response.json();
    const tokenUsage =
      "usage" in analysis
        ? analysis.usage
        : {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
          };
    return { analysis, conversationId, image1, image2, tokenUsage };
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    {
      conversation,
      message,
      messageHistory,
    }: {
      conversation: number;
      message: string;
      messageHistory: Array<Message>;
    },
    { rejectWithValue }
  ) => {
    const newMessageHistory = [
      ...messageHistory,
      { role: "user", content: message } as Message,
    ];
    const tokenCount = getMessagesTokenCount(newMessageHistory);
    const isApproachingLimit = tokenCount > chatTokenLimit * 0.9;

    if (!isWithinTokenLimit(newMessageHistory, chatTokenLimit)) {
      return rejectWithValue({
        error: "Token limit exceeded. Please start a new conversation.",
        tokenCount,
        isApproachingLimit: true,
      });
    }

    const response = await fetch("/api/openai", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: newMessageHistory,
        conversationId: conversation,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send message");
    }

    const responseData = await response.json();

    return {
      conversationId: conversation,
      tokensIn: responseData.usage.promptTokens,
      tokensOut: responseData.usage.completionTokens,
      totalTokens: responseData.usage.totalTokens,
      messages: [
        {
          role: "user",
          content: message,
        } as Message,
        {
          role: "assistant",
          content: responseData.content,
        } as Message,
      ],
      isApproachingLimit,
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
    updateTokenCounts(
      state,
      action: PayloadAction<{
        id: number;
        totalTokens: number;
        tokensIn: number;
        tokensOut: number;
      }>
    ) {
      const conversation = state.conversations.data.find(
        (c) => c.id === action.payload.id
      );
      if (conversation) {
        conversation.totalTokens = action.payload.totalTokens;
        conversation.tokensIn = action.payload.tokensIn;
        conversation.tokensOut = action.payload.tokensOut;

        // Set warning flag if reaching 90% of token limit
        conversation.warnTokenLimit =
          conversation.totalTokens > conversation.tokenLimit * 0.9;
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
          if (action.payload.tokenUsage) {
            conversation.tokensIn +=
              action.payload.tokenUsage.promptTokens || 0;
            conversation.tokensOut +=
              action.payload.tokenUsage.completionTokens || 0;
            conversation.totalTokens +=
              action.payload.tokenUsage.totalTokens || 0;
            conversation.warnTokenLimit =
              conversation.totalTokens > conversation.tokenLimit * 0.9;
          }
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
          if (action.payload.isApproachingLimit !== undefined) {
            conversation.warnTokenLimit = action.payload.isApproachingLimit;
          } else {
            conversation.warnTokenLimit =
              conversation.totalTokens > conversation.tokenLimit * 0.9;
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.conversations.error =
          action.error.message || "Failed to send message";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (action.payload && (action.payload as any).isApproachingLimit) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const conversationId = (action.meta.arg as any).conversation;
          const conversation = state.conversations.data.find(
            (c) => c.id === conversationId
          );
          if (conversation) {
            conversation.warnTokenLimit = true;
          }
        }
      });
  },
});

export const { setActiveConversation, clearError } = chatSlice.actions;
export default chatSlice.reducer;
