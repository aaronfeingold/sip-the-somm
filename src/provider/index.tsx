"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { ErrorProvider } from "./ErrorProvider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor ?? null}>
        <ErrorProvider>
          {children}
          <Toaster richColors />
        </ErrorProvider>
      </PersistGate>
    </Provider>
  );
}
