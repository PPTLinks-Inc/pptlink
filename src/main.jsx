import "./util/intrument";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
// import { PostHogProvider } from "posthog-react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import App from "./App";

posthog.init("phc_ETDAGjIfNguCe01Qmh2M8r3vjPYIPZs8Mf58aL9H8ra", {
  api_host: "https://us.i.posthog.com"
});

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PostHogProvider client={posthog}>
        <App />
      </PostHogProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);
