
import React, { useState } from "react";
import { Coffee, Minus, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface BreakDurationDialogProps {
  breakDuration: number;
  onChangeBreakDuration: (newDuration: number) => void;
  disabled?: boolean;
}

const BreakDurationDialog: React.FC<BreakDurationDialogProps> = ({
  breakDuration,
  onChangeBreakDuration,
  disabled = false
}) => {
  const [tempDuration, setTempDuration] = useState<number>(breakDuration);
  const [isOpen, setIsOpen] = useState(false);
  
  const decreaseDuration = () => {
    if (tempDuration > 1) {
      setTempDuration(tempDuration - 1);
    }
  };
  
  const increaseDuration = () => {
    if (tempDuration < 15) {
      setTempDuration(tempDuration + 1);
    }
  };
  
  const handleSave = () => {
    onChangeBreakDuration(tempDuration);
    setIsOpen(false);
  };
  
  const handleCancel = () => {
    setTempDuration(breakDuration);
    setIsOpen(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTempDuration(breakDuration);
    }
  };
  
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={handleOpenChange}
      className="w-full rounded-xl overflow-hidden"
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-xl transition-all duration-200"
          disabled={disabled}
        >
          <div className="flex items-center">
            <Coffee className="mr-2 text-focus-purple" size={18} />
            <span className="font-medium">Break duration</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">{breakDuration} minutes</span>
            {isOpen ? <ChevronUp className="text-focus-purple" size={16} /> : <ChevronDown className="text-focus-purple" size={16} />}
          </div>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="bg-gray-100 border border-t-0 border-gray-200 rounded-b-xl">
        <div className="p-5">
          <p className="text-muted-foreground text-center text-sm mb-5">
            The break will start automatically after the focus timer ends.
          </p>
          
          {/* Horizontal layout for duration selection */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <button
              onClick={decreaseDuration}
              disabled={tempDuration <= 1}
              className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              <Minus size={18} />
            </button>
            
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-focus-purple">{tempDuration}</span>
              <span className="text-lg ml-2 text-focus-purple">minutes</span>
            </div>
            
            <button
              onClick={increaseDuration}
              disabled={tempDuration >= 15}
              className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="py-2 px-4 text-gray-700 border-gray-200 bg-gray-50 hover:bg-gray-200 rounded-xl"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="py-2 px-4 bg-focus-purple text-white hover:bg-focus-purple-dark rounded-xl"
              onClick={handleSave}
              disabled={tempDuration === breakDuration}
            >
              Save
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BreakDurationDialog;
