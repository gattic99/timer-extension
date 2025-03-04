
import React, { useState } from "react";
import { Coffee, ArrowLeft, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface BreakDurationSettingsProps {
  breakDuration: number;
  onChangeBreakDuration: (newDuration: number) => void;
}

const BreakDurationSettings: React.FC<BreakDurationSettingsProps> = ({
  breakDuration,
  onChangeBreakDuration,
}) => {
  const [tempDuration, setTempDuration] = useState<number>(breakDuration);
  const navigate = useNavigate();
  const isDurationChanged = tempDuration !== breakDuration;
  
  const handleDurationChange = (value: number[]) => {
    setTempDuration(value[0]);
  };
  
  const handleSave = () => {
    onChangeBreakDuration(tempDuration);
    toast.success("Break duration updated successfully");
    navigate("/");
  };
  
  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center">
      <Card className="glass-panel w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="hover:bg-muted/30"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-break-green">Break Duration</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
        
        <div className="flex items-center justify-center py-6">
          <div className="w-32 h-32 rounded-full bg-break-green bg-opacity-20 flex items-center justify-center">
            <Coffee className="text-break-green" size={40} />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-muted-foreground mb-2">
            Set how long your break periods should last
          </p>
          <div className="text-4xl font-bold text-break-green mb-2">
            {tempDuration} <span className="text-2xl">minutes</span>
          </div>
        </div>
        
        <div className="space-y-6 mb-8">
          <Slider
            value={[tempDuration]}
            min={1}
            max={15}
            step={1}
            onValueChange={handleDurationChange}
            className="mt-6"
          />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>1 min</span>
            <span>15 min</span>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={handleSave}
            disabled={!isDurationChanged}
            className="w-full bg-break-green text-white hover:bg-break-green-dark"
          >
            <Save className="mr-2" size={18} />
            Save Changes
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-6">
          Taking regular breaks improves focus and productivity during work sessions.
        </p>
      </Card>
    </div>
  );
};

export default BreakDurationSettings;
