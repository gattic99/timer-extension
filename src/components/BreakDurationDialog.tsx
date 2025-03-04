
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
          className="w-full px-3 py-2 flex items-center justify-between bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-full transition-all duration-200 text-xs"
          disabled={disabled}
        >
          <div className="flex items-center">
            <Coffee className="mr-1 text-focus-purple" size={15} />
            <span className="font-medium">Break duration</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">{breakDuration} min</span>
            {isOpen ? <ChevronUp className="text-focus-purple" size={14} /> : <ChevronDown className="text-focus-purple" size={14} />}
          </div>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="bg-gray-100 border border-t-0 border-gray-200 rounded-b-xl">
        <div className="p-3">
          <p className="text-muted-foreground text-center text-xs mb-3">
            The break will start automatically after the focus timer ends.
          </p>
          
          <div className="flex items-center justify-center gap-3 mb-3">
            <button
              onClick={decreaseDuration}
              disabled={tempDuration <= 1}
              className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              <Minus size={16} />
            </button>
            
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-focus-purple">{tempDuration}</span>
              <span className="text-sm ml-1 text-focus-purple">min</span>
            </div>
            
            <button
              onClick={increaseDuration}
              disabled={tempDuration >= 15}
              className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="py-1.5 px-3 text-gray-700 border-gray-200 bg-gray-50 hover:bg-gray-200 rounded-full text-xs"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="py-1.5 px-3 bg-focus-purple text-white hover:bg-focus-purple-dark rounded-full text-xs"
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
