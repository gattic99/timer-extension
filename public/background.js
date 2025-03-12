
// FocusFlow Background Script
console.log('FocusFlow background script initialized');

// Timer state
let timerState = {
  mode: 'focus',
  timeRemaining: 25 * 60, // 25 minutes in seconds
  isRunning: false,
  completed: false
};

let timerInterval = null;

// Format time as MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Start the timer
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  
  timerState.isRunning = true;
  timerState.completed = false;
  
  timerInterval = setInterval(() => {
    if (timerState.timeRemaining > 0) {
      timerState.timeRemaining--;
    } else {
      // Timer completed
      clearInterval(timerInterval);
      timerState.isRunning = false;
      timerState.completed = true;
      
      // Switch modes
      if (timerState.mode === 'focus') {
        timerState.mode = 'break';
        timerState.timeRemaining = 5 * 60; // 5 minute break
      } else {
        timerState.mode = 'focus';
        timerState.timeRemaining = 25 * 60; // 25 minute focus
      }
    }
    
    // Update all tabs with new timer state
    updateAllTabs();
  }, 1000);
}

// Pause the timer
function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerState.isRunning = false;
  updateAllTabs();
}

// Toggle timer between running and paused
function toggleTimer() {
  if (timerState.isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

// Update all tabs with current timer state
function updateAllTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'UPDATE_TIMER',
        timeDisplay: formatTime(timerState.timeRemaining),
        mode: timerState.mode,
        isRunning: timerState.isRunning,
        completed: timerState.completed
      }).catch(err => {
        // Suppress errors for tabs that don't have content script running
      });
    });
  });
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'TOGGLE_TIMER') {
    toggleTimer();
    sendResponse({status: 'success'});
  }
  else if (message.action === 'GET_TIMER_STATE') {
    sendResponse({
      timeDisplay: formatTime(timerState.timeRemaining),
      mode: timerState.mode,
      isRunning: timerState.isRunning,
      completed: timerState.completed
    });
  }
  return true; // Keeps the message channel open for async responses
});

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('FocusFlow extension installed');
});
