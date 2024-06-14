import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import App from "./App";
import UserContextProvider from "./contexts/userContext";
import { BrowserRouter as Router } from "react-router-dom";
import * as Sentry from "@sentry/react";

const queryClient = new QueryClient();


Sentry.init({
  dsn: "https://805f4f57fe05b40dad095ee1cabc09d4@o4507420306898944.ingest.de.sentry.io/4507420319350864",
  integrations: []});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
          <Router>
            <App />
          </Router>
      </UserContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
