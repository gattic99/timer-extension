
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
    const handleTimerUpdate = (event: any) => {
      if (event.detail && event.detail.timerState) {
        setTimerState(event.detail.timerState);
      }
    };

    window.addEventListener('FOCUSFLOW_UPDATE', handleTimerUpdate);

    // Initial timer state request
    if (isExtensionContext()) {
      chrome.runtime.sendMessage({ action: 'GET_TIMER_STATE' }, (response) => {
        if (response && response.timerState) {
          setTimerState(response.timerState);
        }
      });
    }

    return () => {
      window.removeEventListener('FOCUSFLOW_UPDATE', handleTimerUpdate);
    };
  }, []);

  const resetTimer = useCallback(
    (mode: TimerMode) => {
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
    if (isExtensionContext()) {
      chrome.runtime.sendMessage({ action: 'START_TIMER' });
    } else {
      // Fallback for non-extension context (development)
      setTimerState((prev) => ({ ...prev, isRunning: true, completed: false }));
    }
  }, []);

  const pauseTimer = useCallback(() => {
    if (isExtensionContext()) {
      chrome.runtime.sendMessage({ action: 'PAUSE_TIMER' });
    } else {
      // Fallback for non-extension context (development)
      setTimerState((prev) => ({ ...prev, isRunning: false }));
    }
  }, []);

  const selectBreakActivity = useCallback(
    (activity: BreakActivity) => {
      if (isExtensionContext()) {
        chrome.runtime.sendMessage({ 
          action: 'SELECT_BREAK_ACTIVITY',
          activity 
        });
        
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
