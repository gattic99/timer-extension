
console.log('FocusFlow content script initialized');

// Create and inject the app container
const appContainer = document.createElement('div');
appContainer.id = 'focusflow-container';
document.body.appendChild(appContainer);

// Create a shadow DOM for isolation
const shadow = appContainer.attachShadow({ mode: 'open' });

// Inject styles
const styleSheet = document.createElement('link');
styleSheet.setAttribute('rel', 'stylesheet');
styleSheet.setAttribute('href', chrome.runtime.getURL('styles.css'));
shadow.appendChild(styleSheet);

// Create the app root
const appRoot = document.createElement('div');
appRoot.id = 'focusflow-root';
shadow.appendChild(appRoot);

// Initialize the React app
import('./index.js').then((module) => {
  const { createRoot } = require('react-dom/client');
  const { App } = module;
  
  const root = createRoot(appRoot);
  root.render(<App />);
}).catch(console.error);
