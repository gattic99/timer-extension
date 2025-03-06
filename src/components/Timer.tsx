
import React, { useEffect } from "react";
import { formatTime, getTimePercentage } from "@/utils/timerUtils";
import { TimerState } from "@/types";
import { Pause, Play, RotateCcw, ChevronRight } from "lucide-react";

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
      
      {onStart && onPause && onReset && (
        <div className="flex gap-4 mt-6 w-full justify-center">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-full text-sm h-10 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Reset <ChevronRight size={16} />
          </button>
          
          <button 
            onClick={isRunning ? onPause : onStart}
            className={`flex items-center gap-2 text-white font-semibold px-6 py-2 rounded-full text-sm h-10 ${isRunning ? 'bg-gray-500 hover:bg-gray-600' : 'bg-focus-purple hover:bg-focus-purple-dark'} transition-colors`}
          >
            {isRunning ? "Pause" : "Start"} <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Timer;
