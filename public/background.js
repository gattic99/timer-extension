
// Simple background script for the FocusFlow extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('FocusFlow extension installed');
});

// Initialize default settings if not already present
chrome.storage.local.get(['focusflow_settings'], function(result) {
  if (!result.focusflow_settings) {
    chrome.storage.local.set({
      'focusflow_settings': {
        focusDuration: 25 * 60, // 25 minutes in seconds
        breakDuration: 5 * 60   // 5 minutes in seconds
      }
    });
  }
});
