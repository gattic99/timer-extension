
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
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full p-4 flex items-center justify-between bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-lg transition-all duration-200 shadow-sm"
          disabled={disabled}
        >
          <div className="flex items-center">
            <Coffee className="mr-2 text-focus-purple" size={20} />
            <span className="font-medium">Break duration</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">{breakDuration} minutes</span>
            {isOpen ? <ChevronUp className="text-focus-purple" size={18} /> : <ChevronDown className="text-focus-purple" size={18} />}
          </div>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="overflow-hidden">
        <div className="p-6 bg-white border border-gray-200 border-t-0 rounded-b-lg shadow-inner">
          <div className="mt-2 mb-6">
            <p className="text-muted-foreground text-center mb-6">
              The break will start automatically after the focus timer ends.
            </p>
            
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-focus-purple mb-6">
                {tempDuration} <span className="text-2xl">minutes</span>
              </div>
              
              <div className="flex justify-center gap-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decreaseDuration}
                  disabled={tempDuration <= 1}
                  className="rounded-full h-14 w-14 text-lg bg-gray-100 hover:bg-gray-200 border-gray-200"
                >
                  <Minus size={24} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={increaseDuration}
                  disabled={tempDuration >= 15}
                  className="rounded-full h-14 w-14 text-lg bg-gray-100 hover:bg-gray-200 border-gray-200"
                >
                  <Plus size={24} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="py-3 px-6 text-gray-700 border-gray-200 bg-gray-100 hover:bg-gray-200"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="py-3 px-6 bg-focus-purple text-white hover:bg-indigo-500"
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
