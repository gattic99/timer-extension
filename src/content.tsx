
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Declare the hasRun property on the window object
declare global {
  interface Window {
    hasRun?: boolean;
    focusflowRoot?: any;
  }
}

// Connect to the background script and set up message handling
function initializeContentScript() {
  // Create container for the extension UI
  const appContainer = document.createElement("div");
  appContainer.id = "chrome-extension-root";
  document.body.appendChild(appContainer);

  // Render the React app
  const rootElement = document.getElementById("chrome-extension-root");
  if (rootElement) {
    window.focusflowRoot = createRoot(rootElement);
    window.focusflowRoot.render(<App />);
  }

  // Set up event listener for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'UPDATE_TIMER_STATE') {
      // Dispatch a custom event that will be caught by the App component
      window.dispatchEvent(new CustomEvent('FOCUSFLOW_UPDATE', { 
        detail: { timerState: message.timerState }
      }));
    }
    else if (message.action === 'PLAY_BREAK_SOUND') {
      const audio = new Audio(chrome.runtime.getURL("/assets/time-for-break.mp3"));
      audio.play().catch(err => console.error("Error playing break sound:", err));
    }
    else if (message.action === 'PLAY_FOCUS_SOUND') {
      const audio = new Audio(chrome.runtime.getURL("/assets/time-for-focus.mp3"));
      audio.play().catch(err => console.error("Error playing focus sound:", err));
    }
  });

  // Initial request for timer state
  chrome.runtime.sendMessage({ action: 'GET_TIMER_STATE' }, (response) => {
    if (response && response.timerState) {
      window.dispatchEvent(new CustomEvent('FOCUSFLOW_UPDATE', { 
        detail: { timerState: response.timerState }
      }));
    }
  });
}

// Check if the extension has already run in this context
if (!window.hasRun) {
  window.hasRun = true;
  initializeContentScript();
}
