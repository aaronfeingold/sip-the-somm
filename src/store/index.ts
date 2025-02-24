import { configureStore } from '@reduxjs/toolkit';
import chatReducer from "./chatSlice";
import { localStorageMiddleware } from "./clientStorageMiddleware";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
