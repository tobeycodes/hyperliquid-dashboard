"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WebSocketProvider } from "./web-socket-provider";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>{children}</WebSocketProvider>
    </QueryClientProvider>
  );
}
