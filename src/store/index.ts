import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './features/chat/chatSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
