import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import chatReducer from "./chatSlice";

const chatPersistConfig = {
  key: "chat",
  storage,
};

export const store = configureStore({
  reducer: {
    chat: persistReducer(chatPersistConfig, chatReducer),
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
