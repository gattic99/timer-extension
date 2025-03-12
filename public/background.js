
// FocusFlow background script
let timerState = {
  mode: 'focus',
  timeRemaining: 25 * 60, // 25 minutes in seconds
  isRunning: false,
  breakActivity: null,
  completed: false
};

let intervalId = null;

// Handle timer state updates and broadcasting
function updateTimer() {
  if (timerState.isRunning) {
    timerState.timeRemaining -= 1;
    
    // Check if timer has completed
    if (timerState.timeRemaining <= 0) {
      timerState.isRunning = false;
      timerState.completed = true;
      
      // Switch modes when timer completes
      if (timerState.mode === 'focus') {
        // Switch to break mode
        chrome.storage.local.get(['focusflow_settings'], function(result) {
          const settings = result.focusflow_settings || { 
            focusDuration: 25 * 60,
            breakDuration: 5 * 60 
          };
          
          timerState = {
            ...timerState,
            mode: 'break',
            timeRemaining: settings.breakDuration,
            isRunning: false,
            completed: true
          };
          
          // Broadcast to all tabs
          broadcastTimerState();
          
          // Play notification sound
          chrome.tabs.query({}, function(tabs) {
            if (tabs.length > 0) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'PLAY_BREAK_SOUND' });
            }
          });
        });
      } else {
        // Switch back to focus mode
        chrome.storage.local.get(['focusflow_settings'], function(result) {
          const settings = result.focusflow_settings || { 
            focusDuration: 25 * 60,
            breakDuration: 5 * 60 
          };
          
          timerState = {
            ...timerState,
            mode: 'focus',
            timeRemaining: settings.focusDuration,
            isRunning: false,
            breakActivity: null,
            completed: true
          };
          
          // Broadcast to all tabs
          broadcastTimerState();
          
          // Play notification sound
          chrome.tabs.query({}, function(tabs) {
            if (tabs.length > 0) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'PLAY_FOCUS_SOUND' });
            }
          });
        });
      }
      
      // Clear the interval if timer has completed
      clearInterval(intervalId);
      intervalId = null;
    }
    
    // Broadcast updates to all tabs
    broadcastTimerState();
  }
}

// Broadcast timer state to all tabs
function broadcastTimerState() {
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { 
        action: 'UPDATE_TIMER_STATE', 
        timerState: timerState 
      }).catch(() => {
        // Suppress errors for tabs that can't receive messages
      });
    });
  });
}

// Start the timer interval
function startTimerInterval() {
  if (intervalId === null) {
    intervalId = setInterval(updateTimer, 1000);
  }
}

// Initialize default settings if not already present
chrome.runtime.onInstalled.addListener(() => {
  console.log('FocusFlow extension installed');
  
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
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'GET_TIMER_STATE') {
    sendResponse({ timerState });
  }
  else if (message.action === 'START_TIMER') {
    timerState = {
      ...timerState,
      isRunning: true,
      completed: false
    };
    
    startTimerInterval();
    broadcastTimerState();
    sendResponse({ success: true });
  }
  else if (message.action === 'PAUSE_TIMER') {
    timerState = {
      ...timerState,
      isRunning: false
    };
    
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    
    broadcastTimerState();
    sendResponse({ success: true });
  }
  else if (message.action === 'RESET_TIMER') {
    const mode = message.mode || timerState.mode;
    
    chrome.storage.local.get(['focusflow_settings'], function(result) {
      const settings = result.focusflow_settings || { 
        focusDuration: 25 * 60,
        breakDuration: 5 * 60 
      };
      
      timerState = {
        mode,
        timeRemaining: mode === 'focus' ? settings.focusDuration : settings.breakDuration,
        isRunning: false,
        breakActivity: null,
        completed: false
      };
      
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      
      broadcastTimerState();
      sendResponse({ success: true });
    });
    
    return true; // Keep the message channel open for the async response
  }
  else if (message.action === 'SELECT_BREAK_ACTIVITY') {
    timerState = {
      ...timerState,
      breakActivity: message.activity
    };
    
    broadcastTimerState();
    sendResponse({ success: true });
  }
  else if (message.action === 'UPDATE_FOCUS_DURATION') {
    chrome.storage.local.get(['focusflow_settings'], function(result) {
      const settings = result.focusflow_settings || { 
        focusDuration: 25 * 60,
        breakDuration: 5 * 60 
      };
      
      const newSettings = {
        ...settings,
        focusDuration: message.duration * 60
      };
      
      chrome.storage.local.set({ 'focusflow_settings': newSettings });
      
      // If in focus mode and not running, update the time remaining
      if (timerState.mode === 'focus' && !timerState.isRunning) {
        timerState = {
          ...timerState,
          timeRemaining: message.duration * 60
        };
        
        broadcastTimerState();
      }
      
      sendResponse({ success: true });
    });
    
    return true; // Keep the message channel open for the async response
  }
  else if (message.action === 'UPDATE_BREAK_DURATION') {
    chrome.storage.local.get(['focusflow_settings'], function(result) {
      const settings = result.focusflow_settings || { 
        focusDuration: 25 * 60,
        breakDuration: 5 * 60 
      };
      
      const newSettings = {
        ...settings,
        breakDuration: message.duration * 60
      };
      
      chrome.storage.local.set({ 'focusflow_settings': newSettings });
      
      // If in break mode and not running, update the time remaining
      if (timerState.mode === 'break' && !timerState.isRunning) {
        timerState = {
          ...timerState,
          timeRemaining: message.duration * 60
        };
        
        broadcastTimerState();
      }
      
      sendResponse({ success: true });
    });
    
    return true; // Keep the message channel open for the async response
  }
  
  return false; // Return false for synchronous responses
});
