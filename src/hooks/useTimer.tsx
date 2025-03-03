
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

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Timer tick function
  const tick = useCallback(() => {
    setTimerState(prevState => {
      if (prevState.timeRemaining <= 1) {
        // Time's up - handle completion
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        // Play notification sound
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.error("Error playing sound:", e));
        }
        
        // Show toast notification
        if (prevState.mode === 'focus') {
          toast("Focus time complete! Time for a break.", {
            position: "top-center"
          });
          
          // Switch to break mode
          return {
            ...prevState,
            mode: 'break',
            timeRemaining: minutesToSeconds(settings.breakDuration),
            isRunning: false,
            completed: true
          };
        } else {
          toast("Break time complete! Ready to focus again?", {
            position: "top-center"
          });
          
          // Switch back to focus mode
          return {
            ...prevState,
            mode: 'focus',
            timeRemaining: minutesToSeconds(settings.focusDuration),
            isRunning: false,
            breakActivity: null,
            completed: true
          };
        }
      }
      
      // Normal tick - decrease time remaining
      return {
        ...prevState,
        timeRemaining: prevState.timeRemaining - 1
      };
    });
  }, [settings]);

  // Start timer
  const startTimer = useCallback(() => {
    if (intervalRef.current !== null) return;
    
    setTimerState(prev => ({ ...prev, isRunning: true, completed: false }));
    
    intervalRef.current = window.setInterval(() => {
      tick();
    }, 1000);
  }, [tick]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (intervalRef.current === null) return;
    
    window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    
    setTimerState(prev => ({ ...prev, isRunning: false }));
  }, []);

  // Reset timer
  const resetTimer = useCallback((mode: TimerMode = 'focus') => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
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
  }, [settings]);

  // Select break activity
  const selectBreakActivity = useCallback((activity: BreakActivity) => {
    setTimerState(prev => ({ ...prev, breakActivity: activity }));
  }, []);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    selectBreakActivity
  };
};
