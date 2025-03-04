
import React from "react";
import Timer from "./Timer";
import { TimerState } from "@/types";
import { minutesToSeconds } from "@/utils/timerUtils";
import { Clock } from "lucide-react";

interface FocusModeProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  focusDuration: number;
}

const FocusMode: React.FC<FocusModeProps> = ({
  timerState,
  onStart,
  onPause,
  onReset,
  focusDuration
}) => {
  const totalDuration = minutesToSeconds(focusDuration);
  
  return (
    <div className="focus-card p-8 w-full max-w-xl mx-auto animate-scale-in">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <Clock className="text-focus-purple mr-2" size={24} />
          <h2 className="text-2xl font-bold text-dark-text">Focus Time</h2>
        </div>
        <p className="text-muted-foreground">
          Stay focused and productive. Take a break when the timer ends.
        </p>
      </div>
      
      <Timer
        timerState={timerState}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
        totalDuration={totalDuration}
      />
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Stay in the flow state. Minimize distractions.</p>
        <p className="mt-1">A break will begin automatically when the timer ends.</p>
      </div>
    </div>
  );
};

export default FocusMode;
