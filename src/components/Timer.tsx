
import React, { useEffect } from "react";
import { formatTime, getTimePercentage } from "@/utils/timerUtils";
import { TimerState } from "@/types";
import { Pause, Play, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

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
  const {
    timeRemaining,
    mode,
    isRunning
  } = timerState;
  
  // Always use purple regardless of mode
  const timerTextColor = 'text-focus-purple';
  
  return <div className="flex flex-col items-center space-y-2 animate-fade-in">
      <div className="timer-display mb-0" style={{
      width: "140px",
      height: "140px"
    }}>
        <div className={`timer-text ${timerTextColor} text-3xl font-bold`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      {/* Render control buttons if callback functions are provided */}
      {onStart && onPause && onReset && (
        <div className="flex justify-center gap-4 mt-2">
          <Button variant="outline" onClick={onReset} disabled={!isRunning} className="border-gray-300 text-gray-700 font-semibold px-6 py-1.5 rounded-full text-sm h-9">
            Reset <ChevronRight size={16} className="ml-1" />
          </Button>
          
          <Button onClick={isRunning ? onPause : onStart} className="bg-focus-purple hover:bg-focus-purple-dark text-white font-semibold px-6 py-1.5 rounded-full text-sm h-9">
            {isRunning ? "Pause" : "Start"} <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      )}
    </div>;
};

export default Timer;
