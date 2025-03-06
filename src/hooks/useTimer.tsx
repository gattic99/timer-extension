
import { useState, useEffect, useCallback, useRef } from "react";
import { TimerMode, TimerState, BreakActivity, TimerSettings } from "@/types";
import { toast } from "sonner";
import { minutesToSeconds } from "@/utils/timerUtils";

interface UseTimerProps {
  settings: TimerSettings;
}

export const useTimer = ({ settings }: UseTimerProps) => {
  const [timerState, setTimerState] = useState<TimerState>({
    mode: 'focus',
    timeRemaining: minutesToSeconds(settings.focusDuration),
    isRunning: false,
    breakActivity: null,
    completed: false,
  });

  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const breakAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    breakAudioRef.current = new Audio('/time-for-break.mp3');
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = useCallback(() => {
    if (timerState.isRunning) return;
    
    if (timerState.timeRemaining <= 0) {
      // Reset timer if it's at 0
      resetTimer(timerState.mode);
    }
    
    setTimerState(prev => ({ ...prev, isRunning: true }));
    
    // Clear any existing interval before setting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = window.setInterval(() => {
      setTimerState(prev => {
        if (prev.timeRemaining <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          // Play notification sound when timer completes
          if (prev.mode === 'focus') {
            if (breakAudioRef.current) {
              breakAudioRef.current.play().catch(err => console.error("Error playing break audio:", err));
            }
            toast("Focus session complete! Time for a break.");
            
            // Switch to break mode
            return {
              ...prev,
              mode: 'break',
              timeRemaining: minutesToSeconds(settings.breakDuration),
              isRunning: false,
              completed: true
            };
          } else {
            if (audioRef.current) {
              audioRef.current.play().catch(err => console.error("Error playing audio:", err));
            }
            toast("Break complete! Ready to focus again?");
            
            // Switch to focus mode
            return {
              ...prev,
              mode: 'focus',
              timeRemaining: minutesToSeconds(settings.focusDuration),
              isRunning: false,
              breakActivity: null,
              completed: true
            };
          }
        }
        
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
          completed: false
        };
      });
    }, 1000);
  }, [timerState.mode, timerState.timeRemaining, timerState.isRunning, settings.focusDuration, settings.breakDuration]);

  const pauseTimer = useCallback(() => {
    if (!timerState.isRunning) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setTimerState(prev => ({ ...prev, isRunning: false }));
  }, [timerState.isRunning]);

  const resetTimer = useCallback((mode: TimerMode) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setTimerState({
      mode,
      timeRemaining: mode === 'focus' 
        ? minutesToSeconds(settings.focusDuration) 
        : minutesToSeconds(settings.breakDuration),
      isRunning: false,
      breakActivity: null,
      completed: false
    });
  }, [settings.focusDuration, settings.breakDuration]);

  const selectBreakActivity = useCallback((activity: BreakActivity) => {
    setTimerState(prev => ({ ...prev, breakActivity: activity }));
    // Auto-start the timer when an activity is selected
    if (activity && !timerState.isRunning) {
      setTimeout(() => startTimer(), 100); // Small timeout to ensure state updates first
    }
  }, [timerState.isRunning, startTimer]);

  const updateFocusDuration = useCallback((minutes: number) => {
    if (!timerState.isRunning && timerState.mode === 'focus') {
      setTimerState(prev => ({ 
        ...prev, 
        timeRemaining: minutesToSeconds(minutes)
      }));
    }
  }, [timerState.isRunning, timerState.mode]);

  const updateBreakDuration = useCallback((minutes: number) => {
    if (!timerState.isRunning && timerState.mode === 'break') {
      setTimerState(prev => ({ 
        ...prev, 
        timeRemaining: minutesToSeconds(minutes)
      }));
    }
  }, [timerState.isRunning, timerState.mode]);

  return {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    selectBreakActivity,
    updateFocusDuration,
    updateBreakDuration
  };
};
