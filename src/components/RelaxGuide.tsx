
import React, { useState } from "react";
import { getRelaxationSteps } from "@/utils/timerUtils";
import { ChevronLeft, ChevronRight, Yoga } from "lucide-react";

interface RelaxGuideProps {
  onReturn: () => void;
}

const RelaxGuide: React.FC<RelaxGuideProps> = ({ onReturn }) => {
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
    <div className="break-card p-8 w-full max-w-xl mx-auto animate-scale-in">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Yoga className="text-break-green mr-2" size={24} />
          <h2 className="text-2xl font-bold text-dark-text">Relax & Stretch</h2>
        </div>
        <p className="text-muted-foreground">
          Take a moment to relax your mind and body with these exercises.
        </p>
      </div>
      
      <div className="p-6 bg-white bg-opacity-60 rounded-lg shadow-sm mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {relaxSteps.length}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={goToPrevStep}
              disabled={currentStep === 0}
              className={`p-1 rounded ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-break-green'}`}
              aria-label="Previous step"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNextStep}
              disabled={currentStep === relaxSteps.length - 1}
              className={`p-1 rounded ${currentStep === relaxSteps.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-break-green'}`}
              aria-label="Next step"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="min-h-[200px]">
          <h3 className="text-xl font-semibold mb-3">{relaxSteps[currentStep].title}</h3>
          <p className="text-dark-text leading-relaxed">{relaxSteps[currentStep].description}</p>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={onReturn} 
          className="btn-secondary"
        >
          Return to Timer
        </button>
      </div>
    </div>
  );
};

export default RelaxGuide;
