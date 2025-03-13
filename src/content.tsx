
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
  console.log("FocusFlow React app initializing");
  
  // Create container for the extension UI if it doesn't exist
  let appContainer = document.getElementById("chrome-extension-root");
  if (!appContainer) {
    appContainer = document.createElement("div");
    appContainer.id = "chrome-extension-root";
    document.body.appendChild(appContainer);
  }

  // Render the React app
  if (appContainer) {
    try {
      window.focusflowRoot = createRoot(appContainer);
      window.focusflowRoot.render(<App />);
      console.log("FocusFlow React app rendered successfully");
    } catch (error) {
      console.error("Error rendering FocusFlow React app:", error);
    }
  }

  // Set up event listener for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in content script:", message);
    
    if (message.action === 'UPDATE_TIMER') {
      // Dispatch a custom event that will be caught by the App component
      window.dispatchEvent(new CustomEvent('FOCUSFLOW_UPDATE', { 
        detail: message
      }));
    }
    else if (message.action === 'PLAY_BREAK_SOUND') {
      const audio = new Audio(chrome.runtime.getURL("assets/time-for-break.mp3"));
      audio.play().catch(err => console.error("Error playing break sound:", err));
    }
    else if (message.action === 'PLAY_FOCUS_SOUND') {
      const audio = new Audio(chrome.runtime.getURL("assets/time-for-focus.mp3"));
      audio.play().catch(err => console.error("Error playing focus sound:", err));
    }
  });

  // Initial request for timer state
  chrome.runtime.sendMessage({ action: 'GET_TIMER_STATE' }, (response) => {
    console.log("Initial timer state:", response);
    if (response) {
      window.dispatchEvent(new CustomEvent('FOCUSFLOW_UPDATE', { 
        detail: response
      }));
    }
  });
}

// Check if the extension has already run in this context
if (!window.hasRun) {
  window.hasRun = true;
  console.log("FocusFlow initializing for the first time");
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContentScript);
  } else {
    initializeContentScript();
  }
}
