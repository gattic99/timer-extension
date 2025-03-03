
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { defaultTimerSettings } from "@/utils/timerUtils";
import { useTimer } from "@/hooks/useTimer";
import FocusMode from "@/components/FocusMode";
import BreakMode from "@/components/BreakMode";
import { TimerSettings } from "@/types";
import { Sliders, Timer as TimerIcon, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import FigmaBackground from "@/components/FigmaBackground";
import FloatingTimer from "@/components/FloatingTimer";

const Index: React.FC = () => {
  const [settings, setSettings] = useState<TimerSettings>(defaultTimerSettings);
  const [isOpen, setIsOpen] = useState(false);
  
  const { 
    timerState, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    selectBreakActivity 
  } = useTimer({ settings });
  
  const updateFocusDuration = (value: number[]) => {
    setSettings({
      ...settings,
      focusDuration: value[0]
    });
    
    if (timerState.mode === 'focus' && !timerState.isRunning) {
      resetTimer('focus');
    }
  };
  
  const updateBreakDuration = (value: number[]) => {
    setSettings({
      ...settings,
      breakDuration: value[0]
    });
    
    if (timerState.mode === 'break' && !timerState.isRunning) {
      resetTimer('break');
    }
  };
  
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      <FigmaBackground />
      
      <FloatingTimer 
        isOpen={isOpen}
        timerState={timerState}
        togglePopup={togglePopup}
      />
      
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-scale-in">
          <Card className="glass-panel w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-focus-purple">Focus Timer</h1>
              
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <button 
                      className="p-2 rounded-full hover:bg-gray-100"
                      aria-label="Timer Settings"
                    >
                      <Sliders size={18} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Timer Settings</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4 space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="font-medium">Focus Duration</label>
                          <span className="text-sm text-muted-foreground">{settings.focusDuration} minutes</span>
                        </div>
                        <Slider 
                          value={[settings.focusDuration]} 
                          min={5} 
                          max={60} 
                          step={5} 
                          onValueChange={updateFocusDuration}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="font-medium">Break Duration</label>
                          <span className="text-sm text-muted-foreground">{settings.breakDuration} minutes</span>
                        </div>
                        <Slider 
                          value={[settings.breakDuration]} 
                          min={1} 
                          max={15} 
                          step={1} 
                          onValueChange={updateBreakDuration}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <button 
                  onClick={togglePopup}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close Timer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {timerState.mode === 'focus' ? (
              <FocusMode
                timerState={timerState}
                onStart={startTimer}
                onPause={pauseTimer}
                onReset={() => resetTimer('focus')}
                focusDuration={settings.focusDuration}
              />
            ) : (
              <BreakMode
                timerState={timerState}
                onStart={startTimer}
                onPause={pauseTimer}
                onReset={() => resetTimer('break')}
                onSelectActivity={selectBreakActivity}
                breakDuration={settings.breakDuration}
              />
            )}
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              Focus deeply, then take mindful breaks to stay energized.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
