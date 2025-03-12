
// FocusFlow Background Script
// Manages timer state across tabs and persists timer data

console.log('FocusFlow background script initialized');

// Default timer settings
const DEFAULT_FOCUS_DURATION = 25 * 60; // 25 minutes in seconds
const DEFAULT_BREAK_DURATION = 5 * 60;  // 5 minutes in seconds

// Timer state
let timerState = {
  mode: 'focus', // 'focus' or 'break'
  isRunning: false,
  secondsRemaining: DEFAULT_FOCUS_DURATION,
  completed: false,
  focusDuration: DEFAULT_FOCUS_DURATION,
  breakDuration: DEFAULT_BREAK_DURATION
};

let timerInterval = null;

// Timer functions
function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerState.isRunning = true;
  timerState.completed = false;
  
  timerInterval = setInterval(() => {
    if (timerState.secondsRemaining > 0) {
      timerState.secondsRemaining--;
      broadcastTimerState();
    } else {
      completeTimer();
    }
  }, 1000);
  
  broadcastTimerState();
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  timerState.isRunning = false;
  broadcastTimerState();
}

function resetTimer(mode = 'focus') {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  timerState.mode = mode;
  timerState.isRunning = false;
  timerState.secondsRemaining = mode === 'focus' ? timerState.focusDuration : timerState.breakDuration;
  timerState.completed = false;
  
  broadcastTimerState();
}

function completeTimer() {
  pauseTimer();
  
  timerState.completed = true;
  timerState.secondsRemaining = 0;
  
  // Play sound or notification here if needed
  
  // Switch modes
  const nextMode = timerState.mode === 'focus' ? 'break' : 'focus';
  
  // After a short delay, reset the timer to the next mode
  setTimeout(() => {
    resetTimer(nextMode);
  }, 3000);
  
  broadcastTimerState();
}

// Broadcast timer state to all tabs
function broadcastTimerState() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'TIMER_UPDATE',
        timerState: timerState
      }).catch(() => {
        // Ignore errors for tabs that can't receive messages
      });
    });
  });
  
  // Save state to storage
  chrome.storage.local.set({ timerState: timerState });
}

// Message handlers
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'START_TIMER':
      startTimer();
      sendResponse({ status: 'success', timerState: timerState });
      break;
      
    case 'PAUSE_TIMER':
      pauseTimer();
      sendResponse({ status: 'success', timerState: timerState });
      break;
      
    case 'RESET_TIMER':
      resetTimer(message.mode || 'focus');
      sendResponse({ status: 'success', timerState: timerState });
      break;
      
    case 'GET_TIMER_STATE':
      sendResponse({ status: 'success', timerState: timerState });
      break;
      
    case 'UPDATE_SETTINGS':
      if (message.focusDuration) {
        timerState.focusDuration = message.focusDuration;
      }
      if (message.breakDuration) {
        timerState.breakDuration = message.breakDuration;
      }
      sendResponse({ status: 'success', timerState: timerState });
      break;
  }
  
  return true; // Required for async response
});

// Initialize from storage if available
chrome.storage.local.get(['timerState'], (result) => {
  if (result.timerState) {
    timerState = result.timerState;
    
    // If the timer was running when the browser closed, restart it
    if (timerState.isRunning) {
      startTimer();
    }
  }
});

// When extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('FocusFlow extension installed or updated');
  resetTimer('focus');
});
