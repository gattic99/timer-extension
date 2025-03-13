import { useState, useEffect, useCallback } from "react";
import { TimerMode, TimerState, BreakActivity, TimerSettings } from "@/types";
import { toast } from "sonner";
import { minutesToSeconds } from "@/utils/timerUtils";
import { isExtensionContext } from "@/utils/chromeUtils";

interface UseTimerProps {
  settings: TimerSettings;
}

export const useTimer = ({ settings }: UseTimerProps) => {
  const [timerState, setTimerState] = useState<TimerState>({
    mode: "focus",
    timeRemaining: minutesToSeconds(settings.focusDuration),
    isRunning: false,
    breakActivity: null,
    completed: false,
  });

  // Listen for timer state updates from the background script
  useEffect(() => {
    const handleTimerUpdate = (event: CustomEvent) => {
      console.log("Timer update received in useTimer:", event.detail);
      if (event.detail && event.detail.timerState) {
        const newState = event.detail.timerState;
        console.log("Setting new timer state:", newState);
        
        setTimerState(prevState => ({
          ...prevState,
          mode: newState.mode,
          timeRemaining: newState.timeRemaining,
          isRunning: newState.isRunning,
          completed: newState.completed,
          // Keep breakActivity from previous state unless explicitly provided
          breakActivity: newState.breakActivity !== undefined ? newState.breakActivity : prevState.breakActivity
        }));
      }
    };

    window.addEventListener('FOCUSFLOW_UPDATE', handleTimerUpdate as EventListener);

    // Initial timer state request
    if (isExtensionContext()) {
      console.log("Requesting initial timer state from background");
      chrome.runtime.sendMessage({ action: 'GET_TIMER_STATE' }, (response) => {
        console.log("Initial timer state response:", response);
        if (response) {
          setTimerState(prevState => ({
            ...prevState,
            mode: response.mode,
            timeRemaining: response.timeRemaining,
            isRunning: response.isRunning,
            completed: response.completed
          }));
        }
      });
    }

    return () => {
      window.removeEventListener('FOCUSFLOW_UPDATE', handleTimerUpdate as EventListener);
    };
  }, []);

  const resetTimer = useCallback(
    (mode: TimerMode) => {
      console.log("Resetting timer to mode:", mode);
      if (isExtensionContext()) {
        chrome.runtime.sendMessage({ 
          action: 'RESET_TIMER',
          mode
        });
      } else {
        // Fallback for non-extension context (development)
        setTimerState({
          mode,
          timeRemaining:
            mode === "focus"
              ? minutesToSeconds(settings.focusDuration)
              : minutesToSeconds(settings.breakDuration),
          isRunning: false,
          breakActivity: null,
          completed: false,
        });
      }
    },
    [settings.focusDuration, settings.breakDuration]
  );

  const startTimer = useCallback(() => {
    console.log("Starting timer");
    if (isExtensionContext()) {
      chrome.runtime.sendMessage({ action: 'START_TIMER' });
    } else {
      // Fallback for non-extension context (development)
      setTimerState((prev) => ({ ...prev, isRunning: true, completed: false }));
    }
  }, []);

  const pauseTimer = useCallback(() => {
    console.log("Pausing timer");
    if (isExtensionContext()) {
      chrome.runtime.sendMessage({ action: 'PAUSE_TIMER' });
    } else {
      // Fallback for non-extension context (development)
      setTimerState((prev) => ({ ...prev, isRunning: false }));
    }
  }, []);

  const selectBreakActivity = useCallback(
    (activity: BreakActivity) => {
      console.log("Selecting break activity:", activity);
      if (isExtensionContext()) {
        chrome.runtime.sendMessage({ 
          action: 'SELECT_BREAK_ACTIVITY',
          activity 
        });
        
        // Update local state immediately
        setTimerState(prev => ({
          ...prev,
          breakActivity: activity
        }));
        
        // Auto-start the timer when an activity is selected
        if (activity && !timerState.isRunning) {
          setTimeout(() => {
            chrome.runtime.sendMessage({ action: 'START_TIMER' });
          }, 100);
        }
      } else {
        // Fallback for non-extension context (development)
        setTimerState((prev) => ({ ...prev, breakActivity: activity }));
      }
    },
    [timerState.isRunning]
  );

  const updateFocusDuration = useCallback(
    (minutes: number) => {
      console.log("Updating focus duration to:", minutes, "minutes");
      if (isExtensionContext()) {
        chrome.runtime.sendMessage({ 
          action: 'UPDATE_FOCUS_DURATION',
          duration: minutes 
        });
      } else {
        // Fallback for non-extension context (development)
        if (!timerState.isRunning && timerState.mode === "focus") {
          setTimerState((prev) => ({
            ...prev,
            timeRemaining: minutesToSeconds(minutes),
          }));
        }
      }
    },
    [timerState.isRunning, timerState.mode]
  );

  const updateBreakDuration = useCallback(
    (minutes: number) => {
      console.log("Updating break duration to:", minutes, "minutes");
      if (isExtensionContext()) {
        chrome.runtime.sendMessage({ 
          action: 'UPDATE_BREAK_DURATION',
          duration: minutes 
        });
      } else {
        // Fallback for non-extension context (development)
        if (!timerState.isRunning && timerState.mode === "break") {
          setTimerState((prev) => ({
            ...prev,
            timeRemaining: minutesToSeconds(minutes),
          }));
        }
      }
    },
    [timerState.isRunning, timerState.mode]
  );

  return {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    selectBreakActivity,
    updateFocusDuration,
    updateBreakDuration,
  };
};
