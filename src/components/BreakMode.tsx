import React from "react";
import Timer from "./Timer";
import { TimerState, BreakActivity } from "@/types";
import { minutesToSeconds } from "@/utils/timerUtils";
import PlatformerGame from "./PlatformerGame";
import RelaxGuide from "./RelaxGuide";
import { AlarmClock, Gamepad, Dumbbell } from "lucide-react";

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
  
  // If a break activity is selected, render it
  if (breakActivity === 'game') {
    return <PlatformerGame onReturn={() => onSelectActivity(null)} timerState={timerState} />;
  }
  
  if (breakActivity === 'relax') {
    return <RelaxGuide onReturn={() => onSelectActivity(null)} timerState={timerState} />;
  }
  
  // Otherwise render break timer with activity options
  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl border border-white border-opacity-20 shadow-md p-6 w-full max-w-xl mx-auto animate-scale-in">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <AlarmClock className="text-break-green mr-2" size={20} />
          <h2 className="text-xl font-bold text-dark-text">Break Time</h2>
        </div>
        <p className="text-sm text-muted-foreground">
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
      
      <div className="mt-8">
        <h3 className="text-center text-base font-semibold mb-3">Choose a break activity:</h3>
        <div className="grid grid-cols-2 gap-3">
          <div 
            className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg border border-white border-opacity-20 shadow-sm p-4 flex flex-col items-center animate-slide-up cursor-pointer" 
            onClick={() => onSelectActivity('game')}
          >
            <Gamepad size={24} className="mb-2 text-game-orange" />
            <h4 className="text-sm font-medium">Play a Game</h4>
          </div>
          
          <div 
            className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg border border-white border-opacity-20 shadow-sm p-4 flex flex-col items-center animate-slide-up cursor-pointer" 
            style={{ animationDelay: '0.1s' }}
            onClick={() => onSelectActivity('relax')}
          >
            <Dumbbell size={24} className="mb-2 text-break-green" />
            <h4 className="text-sm font-medium">Relax & Stretch</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakMode;
