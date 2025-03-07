
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
import ChatBubble from "@/components/Chat/ChatBubble";

const Index: React.FC = () => {
  const [settings, setSettings] = useState<TimerSettings>(defaultTimerSettings);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  useEffect(() => {
    if (timerState.mode === 'break' && timerState.completed) {
      openTimerPopup();
    }
  }, [timerState.mode, timerState.completed]);

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

  const openTimerPopup = () => {
    setIsTimerOpen(true);
    setIsChatOpen(false); // Close chat when timer is opened
  };

  const closeTimerPopup = () => {
    setIsTimerOpen(false);
  };

  const handleStartTimer = () => {
    startTimer();
    if (timerState.mode === 'focus') {
      closeTimerPopup();
    }
  };

  const handleReturnFromGame = () => {
    selectBreakActivity(null);
  };

  // Pass state setters to ChatBubble
  const handleOpenChat = () => {
    setIsChatOpen(true);
    setIsTimerOpen(false); // Close timer when chat is opened
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  if (timerState.mode === 'break' && timerState.breakActivity === 'game') {
    return <PlatformerGame onReturn={handleReturnFromGame} timerState={timerState} onStart={startTimer} onPause={pauseTimer} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FigmaBackground />
      
      <ChatBubble 
        isOpen={isChatOpen}
        onOpen={handleOpenChat}
        onClose={handleCloseChat}
      />
      
      <FloatingTimer 
        isOpen={isTimerOpen} 
        timerState={timerState} 
        togglePopup={openTimerPopup} 
      />
      
      {isTimerOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-scale-in">
          <Card className="glass-panel w-[420px] p-8 shadow-xl px-[24px] py-[24px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-focus-purple">FocusFlow</h1>
                <p className="text-sm text-gray-500 mt-1">Stay focused, take mindful breaks, and boost productivity.</p>
              </div>
              
              <div className="flex space-x-2">
                <button onClick={closeTimerPopup} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close Timer">
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {timerState.mode === 'focus' 
              ? <FocusMode 
                  timerState={timerState} 
                  onStart={handleStartTimer} 
                  onPause={pauseTimer} 
                  onReset={() => resetTimer('focus')} 
                  focusDuration={settings.focusDuration} 
                  breakDuration={settings.breakDuration} 
                  onChangeFocusDuration={handleFocusDurationChange} 
                  onChangeBreakDuration={handleBreakDurationChange} 
                /> 
              : <BreakMode 
                  timerState={timerState} 
                  onStart={handleStartTimer} 
                  onPause={pauseTimer} 
                  onReset={() => resetTimer('break')} 
                  onSelectActivity={selectBreakActivity} 
                  breakDuration={settings.breakDuration} 
                  onChangeBreakDuration={handleBreakDurationChange} 
                />
            }
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
