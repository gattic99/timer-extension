
import React from "react";
import { formatTime } from "@/utils/timerUtils";
import { TimerState } from "@/types";
import { Timer as TimerIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingTimerProps {
  isOpen: boolean;
  timerState: TimerState;
  togglePopup: () => void;
}

const FloatingTimer: React.FC<FloatingTimerProps> = ({
  isOpen,
  timerState,
  togglePopup
}) => {
  const { timeRemaining, isRunning, mode } = timerState;
  
  const isTimerActive = isRunning && !isOpen;
  
  const timerColor = mode === 'focus' 
    ? 'bg-focus-purple hover:bg-focus-purple-dark' 
    : 'bg-break-green hover:bg-break-green-dark';
  
  return (
    <button 
      onClick={togglePopup}
      className={cn(
        "fixed bottom-6 right-6 z-50 shadow-lg flex items-center justify-center transition-all duration-300 rounded-full",
        isTimerActive 
          ? `${timerColor} w-auto min-w-[110px] h-14 px-4` 
          : `${timerColor} w-14 h-14`
      )}
      aria-label={isOpen ? "Close Focus Timer" : "Open Focus Timer"}
    >
      {isTimerActive ? (
        <div className="font-mono font-bold text-white text-xl tracking-wider">
          {formatTime(timeRemaining)}
        </div>
      ) : (
        <TimerIcon size={24} className="text-white" />
      )}
    </button>
  );
};

export default FloatingTimer;
