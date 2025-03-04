
import React from "react";
import Timer from "./Timer";
import { TimerState } from "@/types";
import { minutesToSeconds } from "@/utils/timerUtils";
import { Clock, Minus, Plus, Coffee } from "lucide-react";
import { Button } from "./ui/button";

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
  
  const decreaseBreakDuration = () => {
    if (breakDuration > 1) {
      onChangeBreakDuration(breakDuration - 1);
    }
  };
  
  const increaseBreakDuration = () => {
    if (breakDuration < 15) {
      onChangeBreakDuration(breakDuration + 1);
    }
  };
  
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
      
      <div className="mb-6 text-center">
        <div className="text-2xl font-bold mb-2 text-focus-purple">{focusDuration} minutes</div>
        <div className="flex justify-center gap-4 mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={decreaseFocusDuration}
            disabled={focusDuration <= 5 || timerState.isRunning}
            className="rounded-full bg-muted/30 hover:bg-muted/50"
          >
            <Minus size={20} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={increaseFocusDuration}
            disabled={focusDuration >= 60 || timerState.isRunning}
            className="rounded-full bg-muted/30 hover:bg-muted/50"
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>
      
      {/* Break Duration Control */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <Coffee className="text-break-green mr-2" size={24} />
          <h3 className="text-xl font-semibold text-dark-text">Break Duration</h3>
        </div>
        <div className="text-2xl font-bold mb-2 text-break-green">{breakDuration} minutes</div>
        <div className="flex justify-center gap-4 mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={decreaseBreakDuration}
            disabled={breakDuration <= 1 || timerState.isRunning}
            className="rounded-full bg-muted/30 hover:bg-muted/50"
          >
            <Minus size={20} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={increaseBreakDuration}
            disabled={breakDuration >= 15 || timerState.isRunning}
            className="rounded-full bg-muted/30 hover:bg-muted/50"
          >
            <Plus size={20} />
          </Button>
        </div>
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
