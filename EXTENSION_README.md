
# FocusFlow Chrome Extension

## Overview
FocusFlow is a productivity extension that helps you stay focused by implementing the Pomodoro Technique directly in your browser. The extension features floating timers for both focus and break sessions, mindful break activities, and synchronization across all your browser tabs.

## Installation Instructions

### From the Chrome Web Store (Recommended)
1. Visit the Chrome Web Store and search for "FocusFlow"
2. Click "Add to Chrome"
3. Follow the prompts to install the extension

### Manual Installation (Developer Mode)
1. Download and extract the FocusFlow extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top-right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension should now be installed and visible in your browser

## Features
- **Pomodoro Timer**: Default 25-minute focus sessions followed by 5-minute breaks
- **Cross-tab Synchronization**: Timer runs consistently across all browser tabs
- **Customizable Durations**: Adjust focus sessions (1-120 minutes) and breaks (1-15 minutes)
- **Break Activities**: Choose between playing a game or following a guided relaxation routine
- **Floating UI**: Minimally invasive interface that stays out of your way

## Usage
- Click the purple timer icon to start a focus session
- When the timer completes, you'll be prompted to take a break
- Choose a break activity or simply take time away from your screen
- After your break, return to focused work with a fresh timer

## Files in this Package
- `manifest.json`: Extension configuration
- `background.js`: Background script for timer management and tab synchronization
- `content.js`: Content script for injecting the UI into web pages
- Various assets and component files for the UI

## Support
If you encounter any issues or have suggestions for improvement, please contact us at support@focusflow.app or visit our website at https://focusflow.app.

## License
FocusFlow is licensed under the MIT License. See LICENSE file for details.
