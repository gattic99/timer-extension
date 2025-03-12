
// FocusFlow Content Script
console.log('FocusFlow content script initialized');

(function() {
  // Create container for our UI
  const container = document.createElement('div');
  container.id = 'focusflow-container';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '2147483647'; // Maximum z-index
  container.style.pointerEvents = 'auto';
  document.body.appendChild(container);

  // Create the floating timer button
  const timerButton = document.createElement('button');
  timerButton.id = 'focusflow-btn';
  timerButton.style.width = '60px';
  timerButton.style.height = '60px';
  timerButton.style.borderRadius = '50%';
  timerButton.style.backgroundColor = '#9b87f5'; // Purple
  timerButton.style.color = 'white';
  timerButton.style.border = 'none';
  timerButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  timerButton.style.cursor = 'pointer';
  timerButton.style.display = 'flex';
  timerButton.style.alignItems = 'center';
  timerButton.style.justifyContent = 'center';
  timerButton.style.fontSize = '16px';
  timerButton.style.fontWeight = 'bold';
  timerButton.style.transition = 'all 0.3s ease';
  timerButton.innerHTML = '25:00';
  timerButton.title = 'FocusFlow Timer';
  container.appendChild(timerButton);

  // Handle click events
  timerButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({action: 'TOGGLE_TIMER'});
  });

  // Listen for messages from background
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'UPDATE_TIMER') {
      timerButton.innerHTML = message.timeDisplay;
      
      // Update button color based on timer mode
      if (message.mode === 'focus') {
        timerButton.style.backgroundColor = '#9b87f5'; // Purple for focus
      } else {
        timerButton.style.backgroundColor = '#4BB98C'; // Green for break
      }
    }
    sendResponse({status: 'success'});
  });

  // Request initial timer state from background
  chrome.runtime.sendMessage({action: 'GET_TIMER_STATE'}, function(response) {
    if (response && response.timeDisplay) {
      timerButton.innerHTML = response.timeDisplay;
    }
  });

  // Add hover effect
  timerButton.addEventListener('mouseenter', function() {
    timerButton.style.transform = 'scale(1.05)';
  });
  
  timerButton.addEventListener('mouseleave', function() {
    timerButton.style.transform = 'scale(1)';
  });
})();
