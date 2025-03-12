
// FocusFlow Content Script
// This script injects the timer UI into web pages

(function() {
  console.log('FocusFlow content script initialized');
  
  // Create the container for our floating timer
  const container = document.createElement('div');
  container.id = 'focusflow-container';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '2147483647'; // Maximum z-index value
  document.body.appendChild(container);

  // Create the floating button
  const floatingBtn = document.createElement('button');
  floatingBtn.id = 'focusflow-btn';
  floatingBtn.style.width = '50px';
  floatingBtn.style.height = '50px';
  floatingBtn.style.borderRadius = '50%';
  floatingBtn.style.backgroundColor = '#8B5CF6'; // Purple color
  floatingBtn.style.color = 'white';
  floatingBtn.style.border = 'none';
  floatingBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  floatingBtn.style.cursor = 'pointer';
  floatingBtn.style.display = 'flex';
  floatingBtn.style.alignItems = 'center';
  floatingBtn.style.justifyContent = 'center';
  floatingBtn.style.transition = 'transform 0.2s ease';
  floatingBtn.innerHTML = '25:00';
  floatingBtn.title = 'Start Focus Timer';
  
  container.appendChild(floatingBtn);

  // State variables
  let isTimerRunning = false;
  let timerMode = 'focus';
  let timerSeconds = 25 * 60; // 25 minutes by default

  // Event listener for the floating button
  floatingBtn.addEventListener('click', () => {
    if (isTimerRunning) {
      chrome.runtime.sendMessage({ action: 'PAUSE_TIMER' });
    } else {
      chrome.runtime.sendMessage({ action: 'START_TIMER' });
    }
  });

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'TIMER_UPDATE') {
      updateTimerDisplay(message.timerState);
    }
    sendResponse({ status: 'success' });
    return true;
  });

  // Function to update the timer display
  function updateTimerDisplay(timerState) {
    if (!timerState) return;
    
    isTimerRunning = timerState.isRunning;
    timerMode = timerState.mode;
    timerSeconds = timerState.secondsRemaining;
    
    // Format time as MM:SS
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update button text
    floatingBtn.innerHTML = formattedTime;
    
    // Update button color based on mode
    if (timerMode === 'focus') {
      floatingBtn.style.backgroundColor = '#8B5CF6'; // Purple for focus
    } else {
      floatingBtn.style.backgroundColor = '#4BB98C'; // Green for break
    }
    
    // Pulse animation when timer is complete
    if (timerState.completed) {
      floatingBtn.style.animation = 'pulse 1.5s infinite';
    } else {
      floatingBtn.style.animation = 'none';
    }
  }

  // Request initial timer state from background
  chrome.runtime.sendMessage({ action: 'GET_TIMER_STATE' }, (response) => {
    if (response && response.timerState) {
      updateTimerDisplay(response.timerState);
    }
  });
})();
