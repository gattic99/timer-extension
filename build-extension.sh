
#!/bin/bash
# Script to build and package the FocusFlow Chrome Extension

echo "Building FocusFlow Chrome Extension..."

# Create build directories
mkdir -p build/extension/assets

# Clean previous builds
rm -rf build/extension/*

# Build React components
echo "Building React components..."
npm run build

# Copy build output
echo "Copying build files..."
cp -r dist/* build/extension/

# Copy manifest and icons
cp public/manifest.json build/extension/
cp public/icon-*.png build/extension/

# Copy CSS file directly to ensure it's available
cp public/styles.css build/extension/

# Copy audio and image assets
cp public/assets/*.mp3 build/extension/
cp public/assets/*.png build/extension/

# Copy content script template
cp public/content.js build/extension/

# Create background script
echo "Creating background script..."
cat > build/extension/background.js << 'EOF'
// FocusFlow Background Script
chrome.runtime.onInstalled.addListener(() => {
  console.log('FocusFlow extension installed');
  
  // Initialize storage with default values
  chrome.storage.local.set({
    timerState: {
      mode: 'focus',
      timeRemaining: 1500, // 25 minutes in seconds
      isRunning: false,
      breakActivity: null,
      completed: false
    }
  });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_TIMER_STATE') {
    // Return timer state from storage
    chrome.storage.local.get(['timerState'], (result) => {
      sendResponse({ timerState: result.timerState });
    });
    return true;
  }
  
  if (request.action === 'UPDATE_TIMER_STATE') {
    chrome.storage.local.set({ timerState: request.timerState }, () => {
      // Broadcast to all tabs
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id !== sender.tab?.id) {
            chrome.tabs.sendMessage(tab.id, {
              type: 'TIMER_STATE_UPDATED',
              timerState: request.timerState
            });
          }
        });
      });
    });
  }
});

// Listen for tab updates to reinject content if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
  }
});
EOF

echo "✓ Build completed successfully!"
echo "Extension files prepared in build/extension/"
echo ""
echo "To load in Chrome:"
echo "1. Go to chrome://extensions/"
echo "2. Enable 'Developer mode' toggle in the top-right corner"
echo "3. Click 'Load unpacked' and select the 'build/extension' folder"
