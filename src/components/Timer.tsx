
import React from "react";
import { formatTime, getTimePercentage } from "@/utils/timerUtils";
import { TimerState } from "@/types";

interface TimerProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  totalDuration: number;
}

const Timer: React.FC<TimerProps> = ({
  timerState,
  totalDuration
}) => {
  const { timeRemaining, mode } = timerState;
  
  const timerTextColor = mode === 'focus'
    ? 'text-focus-purple'
    : 'text-break-green';

  return (
    <div className="flex flex-col items-center space-y-2 animate-fade-in">
      <div className="timer-display mb-1" style={{width: "180px", height: "180px"}}>
        <div className={`timer-text ${timerTextColor} text-3xl font-bold`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
    </div>
  );
};

export default Timer;
