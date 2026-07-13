import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { store } from "./app/store.ts";
import "./index.css";
import routes from "./router/index.tsx";
import { Toaster } from "./shared/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster richColors />
      <RouterProvider router={routes} />
    </Provider>
  </StrictMode>,
);
