
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { defaultTimerSettings } from "@/utils/timerUtils";
import { useTimer } from "@/hooks/useTimer";
import FocusMode from "@/components/FocusMode";
import BreakMode from "@/components/BreakMode";
import { TimerSettings } from "@/types";
import { Sliders, Timer as TimerIcon, X, Save } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import FigmaBackground from "@/components/FigmaBackground";
import FloatingTimer from "@/components/FloatingTimer";
import { toast } from "sonner";

const Index: React.FC = () => {
  const [settings, setSettings] = useState<TimerSettings>(defaultTimerSettings);
  const [tempSettings, setTempSettings] = useState<TimerSettings>(defaultTimerSettings);
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsChanged, setIsSettingsChanged] = useState(false);
  
  const { 
    timerState, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    selectBreakActivity 
  } = useTimer({ settings });
  
  useEffect(() => {
    const hasChanged = 
      tempSettings.focusDuration !== settings.focusDuration || 
      tempSettings.breakDuration !== settings.breakDuration;
    
    setIsSettingsChanged(hasChanged);
  }, [tempSettings, settings]);
  
  const updateFocusDuration = (value: number[]) => {
    setTempSettings({
      ...tempSettings,
      focusDuration: value[0]
    });
  };
  
  const updateBreakDuration = (value: number[]) => {
    setTempSettings({
      ...tempSettings,
      breakDuration: value[0]
    });
  };
  
  const saveSettings = () => {
    setSettings(tempSettings);
    
    if (timerState.mode === 'focus' && !timerState.isRunning) {
      resetTimer('focus');
    } else if (timerState.mode === 'break' && !timerState.isRunning) {
      resetTimer('break');
    }
    
    toast.success("Settings saved successfully");
    setIsSettingsChanged(false);
    setIsSettingsOpen(false);
  };
  
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleSettings = () => {
    if (!isSettingsOpen) {
      setTempSettings(settings);
    }
    setIsSettingsOpen(!isSettingsOpen);
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
          <Card className="glass-panel w-full max-w-md p-6 shadow-xl rounded-2xl border border-gray-200/40 bg-white/90 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-focus-purple">
                {isSettingsOpen ? "Timer Settings" : "Focus Timer"}
              </h1>
              
              <div className="flex space-x-2">
                <button 
                  onClick={toggleSettings}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label={isSettingsOpen ? "Close Settings" : "Timer Settings"}
                >
                  {isSettingsOpen ? <X size={18} /> : <Sliders size={18} />}
                </button>
                
                {!isSettingsOpen && (
                  <button 
                    onClick={togglePopup}
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label="Close Timer"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            
            {isSettingsOpen ? (
              <>
                <div className="py-4 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="font-medium">Focus Duration</label>
                      <span className="text-sm text-muted-foreground">{tempSettings.focusDuration} minutes</span>
                    </div>
                    <Slider 
                      value={[tempSettings.focusDuration]} 
                      min={5} 
                      max={60} 
                      step={5} 
                      onValueChange={updateFocusDuration}
                      className="focus-purple-slider"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="font-medium">Break Duration</label>
                      <span className="text-sm text-muted-foreground">{tempSettings.breakDuration} minutes</span>
                    </div>
                    <Slider 
                      value={[tempSettings.breakDuration]} 
                      min={1} 
                      max={15} 
                      step={1} 
                      onValueChange={updateBreakDuration}
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  {isSettingsChanged && (
                    <button
                      onClick={saveSettings}
                      className="flex items-center gap-2 px-4 py-2 bg-focus-purple text-white rounded-md hover:bg-focus-purple-dark transition-colors"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-white rounded-xl shadow-sm">
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
                </div>
                
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Focus deeply, then take mindful breaks to stay energized.
                </p>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
