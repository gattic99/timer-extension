
import React from "react";
import { formatTime } from "@/utils/timerUtils";
import { TimerState } from "@/types";
import { Pause, Play, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

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
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (!totalDuration) return 100;
    const progress = Math.min(100, Math.max(0, (timeRemaining / totalDuration) * 100));
    return progress;
  };

  console.log("Timer rendering with timeRemaining:", timeRemaining, "formatted as:", formatTime(timeRemaining));
  
  return (
    <div className="flex flex-col items-center space-y-2 animate-fade-in">
      <div className="timer-display mb-0" style={{
        width: "140px",
        height: "140px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}>
        <Progress 
          value={calculateProgress()} 
          className={cn(
            "h-2 w-full absolute -bottom-4 rounded-full",
            "bg-[#e5e7eb]" // Use className for background instead of style
          )}
          // Use a properly styled indicator with tailwind classes
          style={{ 
            "--progress-background": "var(--focus-purple)", // Custom property for indicator color
          } as React.CSSProperties}
        />
        <div className={`timer-text ${timerTextColor} text-4xl font-bold`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
    </div>
  );
};

export default Timer;
