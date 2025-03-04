
import React from "react";
import Timer from "./Timer";
import { TimerState } from "@/types";
import { minutesToSeconds } from "@/utils/timerUtils";
import { Clock, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FocusModeProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  focusDuration: number;
  onDurationChange: (duration: number) => void;
}

const FocusMode: React.FC<FocusModeProps> = ({
  timerState,
  onStart,
  onPause,
  onReset,
  focusDuration,
  onDurationChange
}) => {
  const totalDuration = minutesToSeconds(focusDuration);
  
  const incrementDuration = () => {
    onDurationChange(Math.min(focusDuration + 1, 60)); // Max 60 minutes
  };
  
  const decrementDuration = () => {
    onDurationChange(Math.max(focusDuration - 1, 1)); // Min 1 minute
  };
  
  return (
    <div className="animate-scale-in">
      <div className="text-center mb-2">
        <p className="text-muted-foreground text-sm">
          Stay focused and productive.
        </p>
      </div>
      
      {!timerState.isRunning && (
        <div className="flex items-center justify-center mb-4">
          <div className="w-full max-w-xs flex items-center justify-between bg-gray-50 rounded-full p-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-white border-gray-200 text-focus-purple hover:text-white hover:bg-focus-purple"
              onClick={decrementDuration}
              disabled={timerState.isRunning}
            >
              <Minus size={16} />
            </Button>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-focus-purple">
                {focusDuration}
                <span className="text-xl">min</span>
              </div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-white border-gray-200 text-focus-purple hover:text-white hover:bg-focus-purple"
              onClick={incrementDuration}
              disabled={timerState.isRunning}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>
      )}
      
      <Timer
        timerState={timerState}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
        totalDuration={totalDuration}
      />
    </div>
  );
};

export default FocusMode;
