import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

if (typeof document !== "undefined") {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
