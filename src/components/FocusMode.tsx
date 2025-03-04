
import React, { useState } from "react";
import Timer from "./Timer";
import { TimerState } from "@/types";
import { minutesToSeconds } from "@/utils/timerUtils";
import { Clock, Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import BreakDurationDialog from "./BreakDurationDialog";
import { Input } from "./ui/input";

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
  const [inputValue, setInputValue] = useState(focusDuration.toString());
  
  const decreaseFocusDuration = () => {
    if (focusDuration > 5) {
      const newDuration = focusDuration - 5;
      onChangeFocusDuration(newDuration);
      setInputValue(newDuration.toString());
    }
  };
  
  const increaseFocusDuration = () => {
    if (focusDuration < 60) {
      const newDuration = focusDuration + 5;
      onChangeFocusDuration(newDuration);
      setInputValue(newDuration.toString());
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleInputBlur = () => {
    const newValue = parseInt(inputValue);
    if (!isNaN(newValue) && newValue >= 5 && newValue <= 60) {
      onChangeFocusDuration(newValue);
    } else {
      setInputValue(focusDuration.toString());
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
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
      
      <div className="flex justify-center gap-8 mt-8 mb-6">
        <Button 
          onClick={timerState.isRunning ? onPause : onStart}
          className="bg-focus-purple hover:bg-focus-purple-dark text-white font-semibold px-8 py-2 rounded-full"
        >
          {timerState.isRunning ? "Pause" : "Start"}
        </Button>
        
        <Button 
          variant="outline"
          onClick={onReset}
          className="border-gray-300 text-gray-700 font-semibold px-8 py-2 rounded-full"
        >
          Reset
        </Button>
      </div>
      
      {/* Focus Duration Controls - Between the timer and buttons */}
      <div className="mb-4 text-center">
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
            <div className="relative w-16 text-center">
              <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                disabled={timerState.isRunning}
                className="w-full text-center font-bold text-focus-purple text-lg px-0 py-1 border-none focus:ring-0 focus:outline-none"
              />
              <span className="text-xs ml-1 text-focus-purple">minutes</span>
            </div>
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
