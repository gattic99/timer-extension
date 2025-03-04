
import React from "react";
import Timer from "./Timer";
import { TimerState } from "@/types";
import { minutesToSeconds } from "@/utils/timerUtils";
import { Clock, Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import BreakDurationDialog from "./BreakDurationDialog";

interface FocusModeProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  focusDuration: number;
  breakDuration: number;
  onChangeFocusDuration: (duration: number) => void;
  onChangeBreakDuration: (duration: number) => void;
}

const FocusMode: React.FC<FocusModeProps> = ({
  timerState,
  onStart,
  onPause,
  onReset,
  focusDuration,
  breakDuration,
  onChangeFocusDuration,
  onChangeBreakDuration
}) => {
  const totalDuration = minutesToSeconds(focusDuration);
  
  const decreaseFocusDuration = () => {
    if (focusDuration > 5) {
      onChangeFocusDuration(focusDuration - 5);
    }
  };
  
  const increaseFocusDuration = () => {
    if (focusDuration < 60) {
      onChangeFocusDuration(focusDuration + 5);
    }
  };
  
  return (
    <div className="focus-card p-6 w-full max-w-md mx-auto animate-scale-in">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-1">
          <Clock className="text-focus-purple mr-2" size={20} />
          <h2 className="text-xl font-bold text-dark-text">Focus Time</h2>
        </div>
        <p className="text-sm text-muted-foreground">
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
      
      {/* Focus Duration Controls - Moved below the timer */}
      <div className="mb-4 mt-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={decreaseFocusDuration}
            disabled={focusDuration <= 5 || timerState.isRunning}
            className="rounded-full bg-muted/30 hover:bg-muted/50 h-9 w-9"
          >
            <Minus size={18} />
          </Button>
          
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-focus-purple">{focusDuration}</span>
            <span className="text-xs ml-1 text-focus-purple">minutes</span>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={increaseFocusDuration}
            disabled={focusDuration >= 60 || timerState.isRunning}
            className="rounded-full bg-muted/30 hover:bg-muted/50 h-9 w-9"
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>
      
      {/* Break Duration Dialog */}
      <div className="mt-4 max-w-md mx-auto">
        <BreakDurationDialog 
          breakDuration={breakDuration}
          onChangeBreakDuration={onChangeBreakDuration}
          disabled={timerState.isRunning}
        />
      </div>
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Stay in the flow state. Minimize distractions.</p>
      </div>
    </div>
  );
};

export default FocusMode;
