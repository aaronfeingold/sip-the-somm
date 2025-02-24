"use client";

import { Middleware } from "redux";

export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);
    localStorage.setItem("chatState", JSON.stringify(store.getState().chat));
    return result;
  };
