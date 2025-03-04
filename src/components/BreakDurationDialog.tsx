
import React, { useState } from "react";
import { Coffee, Minus, Plus, ArrowLeft, Save } from "lucide-react";
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
          className="w-full p-4 flex items-center justify-between bg-break-green bg-opacity-20 hover:bg-opacity-30 text-break-green rounded-lg transition-all duration-200 shadow-sm"
          disabled={disabled}
        >
          <div className="flex items-center">
            <Coffee className="mr-2" size={20} />
            <span className="font-medium">Break duration</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">{breakDuration} minutes</span>
            <ArrowRight size={18} />
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
              className="hover:bg-muted/30"
            >
              <ArrowLeft size={20} />
            </Button>
            <DialogTitle className="text-2xl font-bold text-break-green">Break duration</DialogTitle>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </DialogHeader>
          
          <div className="mt-4 mb-8">
            <p className="text-muted-foreground text-center mb-8">
              The break will start automatically after the focus timer ends.
            </p>
            
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-break-green mb-6">
                {tempDuration} <span className="text-2xl">minutes</span>
              </div>
              
              <div className="flex justify-center gap-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decreaseDuration}
                  disabled={tempDuration <= 1}
                  className="rounded-full h-12 w-12 text-lg bg-muted/30 hover:bg-muted/50"
                >
                  <Minus size={24} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={increaseDuration}
                  disabled={tempDuration >= 15}
                  className="rounded-full h-12 w-12 text-lg bg-muted/30 hover:bg-muted/50"
                >
                  <Plus size={24} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between space-x-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-break-green text-white hover:bg-break-green-dark"
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
