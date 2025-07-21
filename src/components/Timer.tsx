
import React from "react";
import { formatTime, getTimePercentage } from "@/utils/timerUtils";
import { TimerState } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  totalDuration: number;
}

const Timer: React.FC<TimerProps> = ({
  timerState,
  onStart,
  onPause,
  onReset,
  totalDuration
}) => {
  const { timeRemaining, isRunning, mode } = timerState;
  const timePercentage = getTimePercentage(timeRemaining, totalDuration);
  
  const progressColor = mode === 'focus' 
    ? 'bg-focus-purple' 
    : 'bg-break-green';
  
  const timerTextColor = mode === 'focus'
    ? 'text-focus-purple'
    : 'text-break-green';

  return (
    <div className="flex flex-col items-center space-y-6 animate-fade-in">
      <div className="timer-display">
        <div className={`timer-text ${timerTextColor}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      <div className="w-full max-w-md">
        <Progress 
          value={timePercentage} 
          className={`h-2 ${progressColor} transition-all duration-500`}
        />
      </div>
      
      <div className="flex items-center space-x-4 mt-6">
        {isRunning ? (
          <button 
            onClick={onPause}
            className="btn-secondary flex items-center space-x-2 animate-fade-in"
            aria-label="Pause Timer"
          >
            <Pause size={20} />
            <span>Pause</span>
          </button>
        ) : (
          <button 
            onClick={onStart}
            className="btn-primary flex items-center space-x-2 animate-fade-in"
            aria-label="Start Timer"
          >
            <Play size={20} />
            <span>Start</span>
          </button>
        )}
        
        <button 
          onClick={onReset}
          className="btn-secondary flex items-center space-x-2"
          aria-label="Reset Timer"
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default Timer;
