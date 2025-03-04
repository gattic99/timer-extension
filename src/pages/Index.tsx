
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { defaultTimerSettings } from "@/utils/timerUtils";
import { useTimer } from "@/hooks/useTimer";
import FocusMode from "@/components/FocusMode";
import BreakMode from "@/components/BreakMode";
import { TimerSettings, TimerMode } from "@/types";
import { Timer as TimerIcon, X } from "lucide-react";
import FigmaBackground from "@/components/FigmaBackground";
import FloatingTimer from "@/components/FloatingTimer";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    // Reset the timer when settings change
    resetTimer(timerState.mode);
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === 'focus' || value === 'break') {
      resetTimer(value as TimerMode);
    }
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
                Focus Timer
              </h1>
              
              <div className="flex space-x-2">
                <button 
                  onClick={togglePopup}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close Timer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <Tabs 
              defaultValue={timerState.mode} 
              className="w-full"
              onValueChange={handleTabChange}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger 
                  value="focus"
                  className="data-[state=active]:bg-dark-green data-[state=active]:text-white"
                >
                  Focus Timer
                </TabsTrigger>
                <TabsTrigger 
                  value="break"
                  className="data-[state=active]:bg-dark-green data-[state=active]:text-white"
                >
                  Break Timer
                </TabsTrigger>
              </TabsList>
              
              <div className="p-4 bg-white rounded-xl shadow-sm h-[720px] overflow-auto">
                <TabsContent value="focus" className="mt-0 h-full">
                  <FocusMode
                    timerState={timerState}
                    onStart={startTimer}
                    onPause={pauseTimer}
                    onReset={() => resetTimer('focus')}
                    focusDuration={settings.focusDuration}
                    onDurationChange={(value) => updateSettings({ focusDuration: value })}
                  />
                </TabsContent>
                
                <TabsContent value="break" className="mt-0 h-full">
                  <BreakMode
                    timerState={timerState}
                    onStart={startTimer}
                    onPause={pauseTimer}
                    onReset={() => resetTimer('break')}
                    onSelectActivity={selectBreakActivity}
                    breakDuration={settings.breakDuration}
                    onDurationChange={(value) => updateSettings({ breakDuration: value })}
                  />
                </TabsContent>
              </div>
            </Tabs>
            
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
