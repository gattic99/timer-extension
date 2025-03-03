
import React, { useState } from "react";
import { getRelaxationSteps } from "@/utils/timerUtils";
import { ChevronLeft, ChevronRight, Dumbbell } from "lucide-react";
import { TimerState } from "@/types";
import { formatTime } from "@/utils/timerUtils";

interface RelaxGuideProps {
  onReturn: () => void;
  timerState: TimerState;
}

const RelaxGuide: React.FC<RelaxGuideProps> = ({ onReturn, timerState }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const relaxSteps = getRelaxationSteps();
  
  const goToNextStep = () => {
    if (currentStep < relaxSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="break-card p-4 w-full max-w-md mx-auto animate-scale-in">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <Dumbbell className="text-break-green mr-2" size={20} />
          <h2 className="text-xl font-bold text-dark-text">Relax & Stretch</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Take a moment to relax your mind and body with these exercises.
        </p>
      </div>
      
      <div className="p-4 bg-white bg-opacity-60 rounded-lg shadow-sm mb-4 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {relaxSteps.length}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={goToPrevStep}
              disabled={currentStep === 0}
              className={`p-1 rounded ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-break-green'}`}
              aria-label="Previous step"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={goToNextStep}
              disabled={currentStep === relaxSteps.length - 1}
              className={`p-1 rounded ${currentStep === relaxSteps.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-break-green'}`}
              aria-label="Next step"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        <div className="min-h-[150px]">
          <h3 className="text-lg font-semibold mb-2">{relaxSteps[currentStep].title}</h3>
          <p className="text-dark-text text-sm leading-relaxed">{relaxSteps[currentStep].description}</p>
        </div>
        
        {/* Timer in bottom left */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs">
          {formatTime(timerState.timeRemaining)}
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={onReturn} 
          className="btn-secondary text-sm py-2 px-4"
        >
          Return to Timer
        </button>
      </div>
    </div>
  );
};

export default RelaxGuide;
