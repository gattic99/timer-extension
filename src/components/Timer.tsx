
import React, { useEffect } from "react";
import { formatTime, getTimePercentage } from "@/utils/timerUtils";
import { TimerState } from "@/types";

interface TimerProps {
  timerState: TimerState;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  totalDuration?: number;
}

const Timer: React.FC<TimerProps> = ({
  timerState,
  onStart,
  onPause,
  onReset,
  totalDuration
}) => {
  const { timeRemaining, mode, isRunning } = timerState;
  
  const timerTextColor = mode === 'focus'
    ? 'text-focus-purple'
    : 'text-break-green';

  return (
    <div className="flex flex-col items-center space-y-2 animate-fade-in">
      <div className="timer-display mb-0" style={{width: "140px", height: "140px"}}>
        <div className={`timer-text ${timerTextColor} text-3xl font-bold`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      {onStart && onPause && (
        <div className="flex space-x-2 mt-2">
          {!isRunning ? (
            <button 
              onClick={onStart}
              className="bg-focus-purple text-white px-3 py-1 rounded-md text-sm"
            >
              Start
            </button>
          ) : (
            <button 
              onClick={onPause}
              className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Pause
            </button>
          )}
          
          {onReset && (
            <button 
              onClick={onReset}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Timer;
