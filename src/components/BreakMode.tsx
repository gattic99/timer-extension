import React from "react";
import Timer from "./Timer";
import { TimerState, BreakActivity } from "@/types";
import { minutesToSeconds } from "@/utils/timerUtils";
import PlatformerGame from "./PlatformerGame";
import RelaxGuide from "./RelaxGuide";
import { AlarmClock, Gamepad, Dumbbell, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreakModeProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSelectActivity: (activity: BreakActivity) => void;
  breakDuration: number;
  onDurationChange: (duration: number) => void;
}

const BreakMode: React.FC<BreakModeProps> = ({
  timerState,
  onStart,
  onPause,
  onReset,
  onSelectActivity,
  breakDuration,
  onDurationChange
}) => {
  const totalDuration = minutesToSeconds(breakDuration);
  const { breakActivity } = timerState;
  
  const incrementDuration = () => {
    onDurationChange(Math.min(breakDuration + 1, 30)); // Max 30 minutes
  };
  
  const decrementDuration = () => {
    onDurationChange(Math.max(breakDuration - 1, 1)); // Min 1 minute
  };
  
  // If a break activity is selected, render it
  if (breakActivity === 'game') {
    return <PlatformerGame onReturn={() => onSelectActivity(null)} timerState={timerState} />;
  }
  
  if (breakActivity === 'relax') {
    return <RelaxGuide onReturn={() => onSelectActivity(null)} timerState={timerState} />;
  }
  
  // Otherwise render break timer with activity options
  return (
    <div className="break-card w-full max-w-xl mx-auto animate-scale-in">
      <div className="text-center mb-2">
        <p className="text-muted-foreground text-sm">
          Take a moment to relax.
        </p>
      </div>
      
      {!timerState.isRunning && (
        <div className="flex items-center justify-center mb-4">
          <div className="w-full max-w-xs flex items-center justify-between bg-gray-50 rounded-full p-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-white border-gray-200 text-break-green hover:text-white hover:bg-break-green"
              onClick={decrementDuration}
              disabled={timerState.isRunning}
            >
              <Minus size={16} />
            </Button>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-break-green">
                {breakDuration}
                <span className="text-xl">min</span>
              </div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-white border-gray-200 text-break-green hover:text-white hover:bg-break-green"
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
      
      <div className="mt-4">
        <h3 className="text-center text-sm font-semibold mb-2">Choose a break activity:</h3>
        <div className="grid grid-cols-2 gap-2">
          <div 
            className="option-card game-card flex flex-col items-center p-2 h-[80px] animate-slide-up cursor-pointer rounded-lg hover:bg-gray-100 transition-colors" 
            onClick={() => onSelectActivity('game')}
          >
            <Gamepad size={24} className="mb-1 text-game-orange" />
            <h4 className="text-sm font-semibold">Play a Game</h4>
          </div>
          
          <div 
            className="option-card break-card flex flex-col items-center p-2 h-[80px] animate-slide-up cursor-pointer rounded-lg hover:bg-gray-100 transition-colors" 
            style={{ animationDelay: '0.1s' }}
            onClick={() => onSelectActivity('relax')}
          >
            <Dumbbell size={24} className="mb-1 text-break-green" />
            <h4 className="text-sm font-semibold">Relax & Stretch</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakMode;
