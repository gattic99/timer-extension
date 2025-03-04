
import React, { useState } from "react";
import { Coffee, Minus, Plus, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
  const [open, setOpen] = useState(false);
  
  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setTempDuration(breakDuration);
    }
    setOpen(isOpen);
  };
  
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
    toast.success("Break duration updated");
    setOpen(false);
  };
  
  const handleCancel = () => {
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
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
            <ChevronRight className="text-focus-purple" size={18} />
          </div>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="p-0 max-w-md rounded-lg">
        <div className="p-6">
          <DialogHeader className="flex-row justify-between items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="text-gray-500 hover:bg-gray-100"
            >
              <X size={20} />
            </Button>
            <DialogTitle className="text-2xl font-bold text-focus-purple">Break duration</DialogTitle>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </DialogHeader>
          
          <div className="mt-4 mb-8">
            <p className="text-muted-foreground text-center mb-8">
              The break will start automatically after the focus timer ends.
            </p>
            
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-focus-purple mb-6">
                {tempDuration} <span className="text-3xl">minutes</span>
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
      </DialogContent>
    </Dialog>
  );
};

export default BreakDurationDialog;
