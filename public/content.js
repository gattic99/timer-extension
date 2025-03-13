
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
  if (message.type === 'TIMER_STATE_UPDATED') {
    window.dispatchEvent(
      new CustomEvent('FOCUSFLOW_UPDATE', {
        detail: { timerState: message.timerState }
      })
    );
  }
});

// Wait for DOM to be fully loaded
window.addEventListener('load', () => {
  // Initialize the React app
  try {
    console.log('Loading FocusFlow app...');
    import(chrome.runtime.getURL('index.js')).then((module) => {
      const { createRoot } = require('react-dom/client');
      const root = createRoot(appRoot);
      root.render(React.createElement(module.default));
      console.log('FocusFlow app loaded successfully');
    }).catch(error => {
      console.error('Error loading FocusFlow app:', error);
    });
  } catch (error) {
    console.error('Error initializing FocusFlow app:', error);
  }
});
