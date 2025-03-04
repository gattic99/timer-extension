
import React from "react";
import Timer from "./Timer";
import { TimerState, BreakActivity } from "@/types";
import { minutesToSeconds } from "@/utils/timerUtils";
import PlatformerGame from "./PlatformerGame";
import RelaxGuide from "./RelaxGuide";
import { AlarmClock, Gamepad, Dumbbell, Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface BreakModeProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSelectActivity: (activity: BreakActivity) => void;
  breakDuration: number;
  onChangeBreakDuration: (duration: number) => void;
}

const BreakMode: React.FC<BreakModeProps> = ({
  timerState,
  onStart,
  onPause,
  onReset,
  onSelectActivity,
  breakDuration,
  onChangeBreakDuration
}) => {
  const totalDuration = minutesToSeconds(breakDuration);
  const { breakActivity } = timerState;
  
  const decreaseDuration = () => {
    if (breakDuration > 1) {
      onChangeBreakDuration(breakDuration - 1);
    }
  };
  
  const increaseDuration = () => {
    if (breakDuration < 15) {
      onChangeBreakDuration(breakDuration + 1);
    }
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
    <div className="break-card p-8 w-full max-w-xl mx-auto animate-scale-in">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <AlarmClock className="text-break-green mr-2" size={24} />
          <h2 className="text-2xl font-bold text-dark-text">Break Time</h2>
        </div>
        <p className="text-muted-foreground">
          Take a moment to relax. Choose an activity below or just take a break.
        </p>
      </div>
      
      {/* Horizontal layout for break duration controls */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={decreaseDuration}
            disabled={breakDuration <= 1 || timerState.isRunning}
            className="rounded-full bg-muted/30 hover:bg-muted/50 h-9 w-9"
          >
            <Minus size={18} />
          </Button>
          
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-focus-purple">{breakDuration}</span>
            <span className="text-sm ml-1 text-focus-purple">minutes</span>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={increaseDuration}
            disabled={breakDuration >= 15 || timerState.isRunning}
            className="rounded-full bg-muted/30 hover:bg-muted/50 h-9 w-9"
          >
            <Plus size={18} />
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
      
      <div className="mt-10">
        <h3 className="text-center text-lg font-semibold mb-4">Choose a break activity:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className="option-card game-card flex flex-col items-center animate-slide-up" 
            onClick={() => onSelectActivity('game')}
          >
            <Gamepad size={36} className="mb-4 text-game-orange" />
            <h4 className="text-lg font-semibold mb-2">Play a Game</h4>
            <p className="text-sm text-center text-muted-foreground">
              Have fun with a platformer game to refresh your mind.
            </p>
          </div>
          
          <div 
            className="option-card break-card flex flex-col items-center animate-slide-up" 
            style={{ animationDelay: '0.1s' }}
            onClick={() => onSelectActivity('relax')}
          >
            <Dumbbell size={36} className="mb-4 text-break-green" />
            <h4 className="text-lg font-semibold mb-2">Relax & Stretch</h4>
            <p className="text-sm text-center text-muted-foreground">
              Follow guided stretching exercises to relieve tension.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakMode;
