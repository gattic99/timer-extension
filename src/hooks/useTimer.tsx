
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
    
    // Create a base64 encoded audio as fallback
    const base64Audio = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCgUFBQUFBQ8PDw8PDxQPDw8PDw8ZGRkZGRkfGRkZGRkZJCQkJCQkKiQkJCQkJC8vLy8vLzUvLy8vLy86Ojo6Ojo/Ojo6Ojo6P////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYSAAAAAAAAHjOZTf9//tQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
    breakAudioRef.current = new Audio(base64Audio);
    
    // If there's a time-for-break.mp3 file in the public folder, use it
    fetch('/time-for-break.mp3')
      .then(response => {
        if (response.ok) {
          breakAudioRef.current = new Audio('/time-for-break.mp3');
          console.log("Using custom time-for-break.mp3 audio file");
        } else {
          console.log("Using fallback audio for break notification");
        }
      })
      .catch(error => {
        console.log("Fallback to built-in audio for break notification:", error);
      });
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (breakAudioRef.current) {
        breakAudioRef.current.pause();
        breakAudioRef.current = null;
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
        
        // Play notification sound based on which timer completed
        if (prevState.mode === 'focus') {
          // Play "Time for a break" sound for focus timer completion
          if (breakAudioRef.current) {
            breakAudioRef.current.play().catch(e => console.error("Error playing break sound:", e));
          }
          
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
          // Play regular notification for break timer completion
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Error playing sound:", e));
          }
          
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

  // Update focus duration
  const updateFocusDuration = useCallback((newDuration: number) => {
    if (timerState.mode === 'focus' && !timerState.isRunning) {
      setTimerState(prev => ({
        ...prev,
        timeRemaining: minutesToSeconds(newDuration)
      }));
    }
  }, [timerState]);

  // Update break duration
  const updateBreakDuration = useCallback((newDuration: number) => {
    if (timerState.mode === 'break' && !timerState.isRunning) {
      setTimerState(prev => ({
        ...prev,
        timeRemaining: minutesToSeconds(newDuration)
      }));
    }
  }, [timerState]);

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
    selectBreakActivity,
    updateFocusDuration,
    updateBreakDuration
  };
};
