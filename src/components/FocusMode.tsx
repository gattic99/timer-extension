
import React, { useState } from "react";
import Timer from "./Timer";
import { TimerState } from "@/types";
import { minutesToSeconds } from "@/utils/timerUtils";
import { Clock, Minus, Plus, ChevronRight } from "lucide-react";
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
    if (focusDuration > 1) {
      const newDuration = focusDuration - 1;
      onChangeFocusDuration(newDuration);
      setInputValue(newDuration.toString());
    }
  };
  
  const increaseFocusDuration = () => {
    if (focusDuration < 60) {
      const newDuration = focusDuration + 1;
      onChangeFocusDuration(newDuration);
      setInputValue(newDuration.toString());
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleInputBlur = () => {
    const newValue = parseInt(inputValue);
    if (!isNaN(newValue) && newValue >= 1 && newValue <= 60) {
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
    <>
      <div className="focus-card p-4 w-full max-w-sm mx-auto animate-scale-in">
        <div className="text-center mb-2">
          <div className="flex items-center justify-left">
            <Clock className="text-focus-purple mr-2" size={18} />
            <h2 className="text-lg text-dark-text font-semibold">Deep Work Mode</h2>
          </div>
          <p className="text-xs text-muted-foreground text-left">Set your focus timer below. When it ends, your break timer will start automatically.</p>
        </div>
        
        <div className="relative">
          <Timer timerState={timerState} onStart={onStart} onPause={onPause} onReset={onReset} totalDuration={totalDuration} />
          
          <div className="mt-0 text-center">
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="icon" onClick={decreaseFocusDuration} disabled={focusDuration <= 1 || timerState.isRunning} className="rounded-full bg-muted/30 hover:bg-muted/50 h-7 w-7">
                <Minus size={14} />
              </Button>
              
              <div className="flex items-baseline">
                <div className="relative w-12 text-center">
                  <Input 
                    type="text" 
                    value={inputValue} 
                    onChange={handleInputChange} 
                    onBlur={handleInputBlur} 
                    onKeyDown={handleKeyDown} 
                    disabled={timerState.isRunning} 
                    className="w-full text-center font-bold text-focus-purple text-base px-0 py-0.5 border-none focus:ring-0 focus:outline-none h-7" 
                  />
                  <span className="text-xs ml-0.5 text-focus-purple">min</span>
                </div>
              </div>
              
              <Button variant="outline" size="icon" onClick={increaseFocusDuration} disabled={focusDuration >= 60 || timerState.isRunning} className="rounded-full bg-muted/30 hover:bg-muted/50 h-7 w-7">
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mt-2 mb-2">
          <Button variant="outline" onClick={onReset} className="border-gray-300 text-gray-700 font-semibold px-6 py-1.5 rounded-full text-sm h-9">
            Reset <ChevronRight size={16} className="ml-1" />
          </Button>
          
          <Button onClick={timerState.isRunning ? onPause : onStart} className="bg-focus-purple hover:bg-focus-purple-dark text-white font-semibold px-6 py-1.5 rounded-full text-sm h-9">
            {timerState.isRunning ? "Pause" : "Start"} <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        
        <div className="mt-2 text-center text-xs text-muted-foreground">
          <p>Minimize distractions</p>
        </div>
      </div>
      
      <div className="max-w-sm mx-auto mt-4">
        <BreakDurationDialog breakDuration={breakDuration} onChangeBreakDuration={onChangeBreakDuration} disabled={timerState.isRunning} />
      </div>
    </>
  );
};

export default FocusMode;
