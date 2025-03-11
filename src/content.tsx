import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "./index.css";

if (!window.hasRun) {
  window.hasRun = true;

  const appContainer = document.createElement("div");
  appContainer.id = "chrome-extension-root";
  document.body.appendChild(appContainer);

  createRoot(document.getElementById("chrome-extension-root")).render(<App />);
}
