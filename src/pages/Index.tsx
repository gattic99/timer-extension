
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { defaultTimerSettings } from "@/utils/timerUtils";
import { useTimer } from "@/hooks/useTimer";
import FocusMode from "@/components/FocusMode";
import BreakMode from "@/components/BreakMode";
import { TimerSettings } from "@/types";
import { X } from "lucide-react";
import FigmaBackground from "@/components/FigmaBackground";
import FloatingTimer from "@/components/FloatingTimer";
import PlatformerGame from "@/components/PlatformerGame";
import { toast } from "sonner";
const Index: React.FC = () => {
  const [settings, setSettings] = useState<TimerSettings>(defaultTimerSettings);
  const [isOpen, setIsOpen] = useState(false);
  const {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    selectBreakActivity,
    updateFocusDuration,
    updateBreakDuration
  } = useTimer({
    settings
  });
  const handleFocusDurationChange = (newDuration: number) => {
    const newSettings = {
      ...settings,
      focusDuration: newDuration
    };
    setSettings(newSettings);
    updateFocusDuration(newDuration);
  };
  const handleBreakDurationChange = (newDuration: number) => {
    const newSettings = {
      ...settings,
      breakDuration: newDuration
    };
    setSettings(newSettings);
    updateBreakDuration(newDuration);
  };
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  // Handler to return from game to timer
  const handleReturnFromGame = () => {
    selectBreakActivity(null);
  };

  // If we're in break mode and game is selected, show the full-screen game
  if (timerState.mode === 'break' && timerState.breakActivity === 'game') {
    return <PlatformerGame onReturn={handleReturnFromGame} timerState={timerState} />;
  }
  return <div className="min-h-screen relative overflow-hidden">
      <FigmaBackground />
      
      <FloatingTimer isOpen={isOpen} timerState={timerState} togglePopup={togglePopup} />
      
      {isOpen && <div className="fixed bottom-24 right-6 z-50 animate-scale-in">
          <Card className="glass-panel w-full max-w-[calc(448px+40px)] p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-focus-purple">FocusFlow</h1>
                <p className="text-sm text-gray-500 mt-1">Enhance your workflow with structured focus and rest</p>
              </div>
              
              <div className="flex space-x-2">
                <button onClick={togglePopup} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close Timer">
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {timerState.mode === 'focus' ? <FocusMode timerState={timerState} onStart={startTimer} onPause={pauseTimer} onReset={() => resetTimer('focus')} focusDuration={settings.focusDuration} breakDuration={settings.breakDuration} onChangeFocusDuration={handleFocusDurationChange} onChangeBreakDuration={handleBreakDurationChange} /> : <BreakMode timerState={timerState} onStart={startTimer} onPause={pauseTimer} onReset={() => resetTimer('break')} onSelectActivity={selectBreakActivity} breakDuration={settings.breakDuration} onChangeBreakDuration={handleBreakDurationChange} />}
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              Focus deeply, then take mindful breaks to stay energized.
            </p>
          </Card>
        </div>}
    </div>;
};
export default Index;
