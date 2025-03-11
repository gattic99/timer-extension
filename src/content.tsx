
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "./index.css";

// Declare the hasRun property on the window object
declare global {
  interface Window {
    hasRun?: boolean;
  }
}

// Check if the extension has already run in this context
if (!window.hasRun) {
  window.hasRun = true;

  const appContainer = document.createElement("div");
  appContainer.id = "chrome-extension-root";
  document.body.appendChild(appContainer);

  const rootElement = document.getElementById("chrome-extension-root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  }
}
