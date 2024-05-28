import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import App from "./App";
import UserContextProvider from "./contexts/userContext";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

const queryClient = new QueryClient();

posthog.init(import.meta.env.VITE_APP_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_APP_PUBLIC_POSTHOG_HOST
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <PostHogProvider client={posthog}>
          <App />
        </PostHogProvider>
      </UserContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
