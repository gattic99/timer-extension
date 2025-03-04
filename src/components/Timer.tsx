
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
    <div className="flex flex-col items-center space-y-4 animate-fade-in">
      <div className="timer-display mb-2">
        <div className={`timer-text ${timerTextColor} text-4xl font-bold`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      <div className="w-full max-w-md">
        <Progress 
          value={timePercentage} 
          className={`h-2 ${progressColor} transition-all duration-500`}
        />
      </div>
    </div>
  );
};

export default Timer;
