import React from "react";
import Timer from "./Timer";
import { TimerState, BreakActivity } from "@/types";
import { minutesToSeconds } from "@/utils/timerUtils";
import MemoryGame from "./MemoryGame";
import RelaxGuide from "./RelaxGuide";
import { AlarmClock, Gamepad, Zap } from "lucide-react";

interface BreakModeProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSelectActivity: (activity: BreakActivity) => void;
  breakDuration: number;
}

const BreakMode: React.FC<BreakModeProps> = ({
  timerState,
  onStart,
  onPause,
  onReset,
  onSelectActivity,
  breakDuration
}) => {
  const totalDuration = minutesToSeconds(breakDuration);
  const { breakActivity } = timerState;
  
  // If a break activity is selected, render it
  if (breakActivity === 'game') {
    return <MemoryGame onReturn={() => onSelectActivity(null)} />;
  }
  
  if (breakActivity === 'relax') {
    return <RelaxGuide onReturn={() => onSelectActivity(null)} />;
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
              Have fun with a quick memory matching game to refresh your mind.
            </p>
          </div>
          
          <div 
            className="option-card break-card flex flex-col items-center animate-slide-up" 
            style={{ animationDelay: '0.1s' }}
            onClick={() => onSelectActivity('relax')}
          >
            <Zap size={36} className="mb-4 text-break-green" />
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
