
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
  
  console.log('Starting timer with', timerState.timeRemaining, 'seconds remaining');
  
  timerInterval = setInterval(() => {
    if (timerState.timeRemaining > 0) {
      timerState.timeRemaining--;
      updateAllTabs();
      console.log(`Timer tick: ${formatTime(timerState.timeRemaining)}`);
    } else {
      // Timer completed
      clearInterval(timerInterval);
      timerState.isRunning = false;
      timerState.completed = true;
      
      // Play sound based on which mode is ending
      if (timerState.mode === 'focus') {
        notifyAllTabs('PLAY_BREAK_SOUND');
      } else {
        notifyAllTabs('PLAY_FOCUS_SOUND');
      }
      
      // Switch modes
      if (timerState.mode === 'focus') {
        timerState.mode = 'break';
        timerState.timeRemaining = 5 * 60; // 5 minute break
      } else {
        timerState.mode = 'focus';
        timerState.timeRemaining = 25 * 60; // 25 minute focus
      }
      
      updateAllTabs();
    }
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

// Reset the timer
function resetTimer(mode) {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  timerState.mode = mode || 'focus';
  timerState.timeRemaining = timerState.mode === 'focus' ? 25 * 60 : 5 * 60;
  timerState.isRunning = false;
  timerState.completed = false;
  
  console.log('Timer reset to', timerState.timeRemaining, 'seconds');
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

// Notify all tabs of a specific action
function notifyAllTabs(action) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      try {
        chrome.tabs.sendMessage(tab.id, { action });
      } catch (err) {
        // Suppress errors for tabs that don't have content script running
      }
    });
  });
}

// Update all tabs with current timer state
function updateAllTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      try {
        chrome.tabs.sendMessage(tab.id, {
          action: 'UPDATE_TIMER',
          timeRemaining: timerState.timeRemaining,
          mode: timerState.mode,
          isRunning: timerState.isRunning,
          completed: timerState.completed
        });
      } catch (err) {
        // Suppress errors for tabs that don't have content script running
      }
    });
  });
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  if (message.action === 'TOGGLE_TIMER') {
    toggleTimer();
    sendResponse({status: 'success'});
  }
  else if (message.action === 'START_TIMER') {
    startTimer();
    sendResponse({status: 'success'});
  }
  else if (message.action === 'PAUSE_TIMER') {
    pauseTimer();
    sendResponse({status: 'success'});
  }
  else if (message.action === 'RESET_TIMER') {
    resetTimer(message.mode);
    sendResponse({status: 'success'});
  }
  else if (message.action === 'GET_TIMER_STATE') {
    sendResponse({
      timeRemaining: timerState.timeRemaining,
      mode: timerState.mode,
      isRunning: timerState.isRunning,
      completed: timerState.completed
    });
  }
  else if (message.action === 'UPDATE_FOCUS_DURATION') {
    if (!timerState.isRunning && timerState.mode === 'focus') {
      timerState.timeRemaining = message.duration * 60;
      updateAllTabs();
    }
    sendResponse({status: 'success'});
  }
  else if (message.action === 'UPDATE_BREAK_DURATION') {
    if (!timerState.isRunning && timerState.mode === 'break') {
      timerState.timeRemaining = message.duration * 60;
      updateAllTabs();
    }
    sendResponse({status: 'success'});
  }
  
  return true; // Keeps the message channel open for async responses
});

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('FocusFlow extension installed');
});
