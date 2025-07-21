
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { defaultTimerSettings } from "@/utils/timerUtils";
import { useTimer } from "@/hooks/useTimer";
import FocusMode from "@/components/FocusMode";
import BreakMode from "@/components/BreakMode";
import { TimerSettings } from "@/types";
import { Sliders } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";

const Index: React.FC = () => {
  const [settings, setSettings] = useState<TimerSettings>(defaultTimerSettings);
  
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
    
    // If in focus mode and not running, reset timer with new duration
    if (timerState.mode === 'focus' && !timerState.isRunning) {
      resetTimer('focus');
    }
  };
  
  const updateBreakDuration = (value: number[]) => {
    setSettings({
      ...settings,
      breakDuration: value[0]
    });
    
    // If in break mode and not running, reset timer with new duration
    if (timerState.mode === 'break' && !timerState.isRunning) {
      resetTimer('break');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white">
      <Card className="glass-panel w-full max-w-2xl p-6 mb-6 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-focus-purple">Focus Timer</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <button 
                className="btn-secondary flex items-center space-x-2"
                aria-label="Timer Settings"
              >
                <Sliders size={18} />
                <span>Settings</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
              </DialogHeader>
              
              <div className="py-4 space-y-8">
                <div className="space-y-4">
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
                
                <div className="space-y-4">
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
      </Card>
      
      <p className="text-sm text-muted-foreground text-center animate-fade-in">
        A minimalist productivity tool designed for remote teams.
        <br />
        Focus deeply, then take mindful breaks to stay energized.
      </p>
    </div>
  );
};

export default Index;
