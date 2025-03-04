import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { defaultTimerSettings } from "@/utils/timerUtils";
import { useTimer } from "@/hooks/useTimer";
import FocusMode from "@/components/FocusMode";
import BreakMode from "@/components/BreakMode";
import { TimerSettings } from "@/types";
import { Sliders, X, Save } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import FigmaBackground from "@/components/FigmaBackground";
import FloatingTimer from "@/components/FloatingTimer";
import { toast } from "sonner";
import { Route, Routes } from "react-router-dom";
import BreakDurationSettings from "./BreakDurationSettings";

const Index: React.FC = () => {
  const [settings, setSettings] = useState<TimerSettings>(defaultTimerSettings);
  const [tempSettings, setTempSettings] = useState<TimerSettings>(defaultTimerSettings);
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsChanged, setIsSettingsChanged] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { 
    timerState, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    selectBreakActivity,
    updateFocusDuration,
    updateBreakDuration
  } = useTimer({ settings });
  
  useEffect(() => {
    setTempSettings(settings);
  }, [isDialogOpen]);
  
  useEffect(() => {
    const hasChanged = 
      tempSettings.focusDuration !== settings.focusDuration || 
      tempSettings.breakDuration !== settings.breakDuration;
    
    setIsSettingsChanged(hasChanged);
  }, [tempSettings, settings]);
  
  const updateFocusDurationSetting = (value: number[]) => {
    setTempSettings({
      ...tempSettings,
      focusDuration: value[0]
    });
  };
  
  const updateBreakDurationSetting = (value: number[]) => {
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
  };
  
  const handleFocusDurationChange = (newDuration: number) => {
    const newSettings = { ...settings, focusDuration: newDuration };
    setSettings(newSettings);
    updateFocusDuration(newDuration);
  };
  
  const handleBreakDurationChange = (newDuration: number) => {
    const newSettings = { ...settings, breakDuration: newDuration };
    setSettings(newSettings);
    updateBreakDuration(newDuration);
  };
  
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      <FigmaBackground />
      
      <Routes>
        <Route path="/" element={
          <>
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
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                                <span className="text-sm text-muted-foreground">{tempSettings.focusDuration} minutes</span>
                              </div>
                              <Slider 
                                value={[tempSettings.focusDuration]} 
                                min={5} 
                                max={60} 
                                step={5} 
                                onValueChange={updateFocusDurationSetting}
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
                                onValueChange={updateBreakDurationSetting}
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            {isSettingsChanged && (
                              <button
                                onClick={saveSettings}
                                className="flex items-center gap-2 px-4 py-2 bg-focus-purple text-white rounded-md hover:bg-focus-purple-dark transition-colors"
                              >
                                <Save size={16} />
                                Save Changes
                              </button>
                            )}
                          </DialogFooter>
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
                      breakDuration={settings.breakDuration}
                      onChangeFocusDuration={handleFocusDurationChange}
                      onChangeBreakDuration={handleBreakDurationChange}
                    />
                  ) : (
                    <BreakMode
                      timerState={timerState}
                      onStart={startTimer}
                      onPause={pauseTimer}
                      onReset={() => resetTimer('break')}
                      onSelectActivity={selectBreakActivity}
                      breakDuration={settings.breakDuration}
                      onChangeBreakDuration={handleBreakDurationChange}
                    />
                  )}
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Focus deeply, then take mindful breaks to stay energized.
                  </p>
                </Card>
              </div>
            )}
          </>
        } />
        <Route path="/break-duration" element={
          <BreakDurationSettings 
            breakDuration={settings.breakDuration}
            onChangeBreakDuration={handleBreakDurationChange}
          />
        } />
      </Routes>
    </div>
  );
};

export default Index;
