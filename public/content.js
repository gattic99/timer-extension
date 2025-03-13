
console.log('FocusFlow content script initialized');

// Create and inject the app container
const appContainer = document.createElement('div');
appContainer.id = 'focusflow-container';
document.body.appendChild(appContainer);

// Create a shadow DOM for isolation
const shadow = appContainer.attachShadow({ mode: 'open' });

// Inject styles directly
const styleElement = document.createElement('style');
fetch(chrome.runtime.getURL('styles.css'))
  .then(response => response.text())
  .then(css => {
    styleElement.textContent = css;
    shadow.appendChild(styleElement);
    console.log('FocusFlow styles loaded successfully');
  })
  .catch(error => {
    console.error('Error loading FocusFlow styles:', error);
  });

// Create the app root
const appRoot = document.createElement('div');
appRoot.id = 'focusflow-root';
shadow.appendChild(appRoot);

// Listen for timer state updates from background
chrome.runtime.onMessage.addListener((message) => {
  console.log('Content script received message:', message);
  
  if (message.action === 'UPDATE_TIMER') {
    console.log('Dispatching UPDATE_TIMER event with timeRemaining:', message.timeRemaining);
    
    window.dispatchEvent(
      new CustomEvent('FOCUSFLOW_UPDATE', {
        detail: { 
          timerState: {
            mode: message.mode,
            timeRemaining: message.timeRemaining,
            isRunning: message.isRunning,
            breakActivity: null,
            completed: message.completed
          }
        }
      })
    );
  }
});

// Request initial timer state
chrome.runtime.sendMessage({ action: 'GET_TIMER_STATE' }, (response) => {
  if (response) {
    console.log('Initial timer state in content.js:', response);
    console.log('Initial timeRemaining in seconds:', response.timeRemaining);
    
    window.dispatchEvent(
      new CustomEvent('FOCUSFLOW_UPDATE', {
        detail: { 
          timerState: {
            mode: response.mode,
            timeRemaining: response.timeRemaining,
            isRunning: response.isRunning,
            breakActivity: null,
            completed: response.completed
          }
        }
      })
    );
  }
});

// Wait for DOM to be fully loaded
window.addEventListener('DOMContentLoaded', () => {
  // Initialize the React app
  try {
    console.log('Loading FocusFlow app...');
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('index.js');
    script.type = 'module';
    script.onload = function() {
      console.log('FocusFlow script loaded successfully');
    };
    script.onerror = function(error) {
      console.error('Error loading FocusFlow script:', error);
    };
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error initializing FocusFlow app:', error);
  }
});
