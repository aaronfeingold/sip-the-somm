import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  role: 'user' | 'assistant';
  message: string;
  tokens?: number;
}

interface Conversation {
  id: number;
  title: string;
  messages: Message[];
  totalTokens: number;
  tokenLimit: number;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  conversations: {
    data: Conversation[];
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
  };
  activeConversation: number | null;
}

const initialState: ChatState = {
  conversations: {
    data: [],
    status: 'idle',
    error: null
  },
  activeConversation: null
};

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async ({ title, user }: { title: string; user: number }) => {
    // In the future, this will interface with your API
    const conversation: Conversation = {
      id: Date.now(),
      title,
      messages: [],
      totalTokens: 0,
      tokenLimit: 4000, // Example limit
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return conversation;
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversation, message }: { conversation: number; message: string }) => {
    // This will later integrate with your OpenAI API logic
    return {
      conversationId: conversation,
      message: {
        role: 'user' as const,
        message,
        tokens: message.length / 4 // Placeholder token calculation
      }
    };
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation(state, action: PayloadAction<number>) {
      state.activeConversation = action.payload;
    },
    clearError(state) {
      state.conversations.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createConversation.pending, (state) => {
        state.conversations.status = 'loading';
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.status = 'idle';
        state.conversations.data.push(action.payload);
        state.activeConversation = action.payload.id;
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.conversations.status = 'failed';
        state.conversations.error = action.error.message || 'Failed to create conversation';
      })
      .addCase(sendMessage.pending, (state) => {
        state.conversations.status = 'loading';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.conversations.status = 'idle';
        const conversation = state.conversations.data.find(
          (c) => c.id === action.payload.conversationId
        );
        if (conversation) {
          conversation.messages.push(action.payload.message);
          conversation.totalTokens += action.payload.message.tokens || 0;
          conversation.updatedAt = new Date().toISOString();
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.conversations.status = 'failed';
        state.conversations.error = action.error.message || 'Failed to send message';
      });
  }
});

export const { setActiveConversation, clearError } = chatSlice.actions;
export default chatSlice.reducer;
