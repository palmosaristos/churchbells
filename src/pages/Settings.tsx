import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { BellSoundSelection } from "@/components/BellSoundSelection";
import { Button } from "@/components/ui/button";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { bellTraditions } from "@/data/bellTraditions";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const [selectedBellTradition, setSelectedBellTradition] = useState<string>(() => {
    return localStorage.getItem("bellTradition") || "cathedral-bell";
  });
  const [startTime, setStartTime] = useState<string>(() => {
    return localStorage.getItem("startTime") || "08:00";
  });
  const [endTime, setEndTime] = useState<string>(() => {
    return localStorage.getItem("endTime") || "20:00";
  });
  const [halfHourChimes, setHalfHourChimes] = useState<boolean>(() => {
    return localStorage.getItem("halfHourChimes") === "true";
  });
  const [pauseEnabled, setPauseEnabled] = useState<boolean>(() => {
    return localStorage.getItem("pauseEnabled") === "true";
  });
  const [pauseStartTime, setPauseStartTime] = useState<string>(() => {
    return localStorage.getItem("pauseStartTime") || "12:00";
  });
  const [pauseEndTime, setPauseEndTime] = useState<string>(() => {
    return localStorage.getItem("pauseEndTime") || "14:00";
  });
  const [selectedDays, setSelectedDays] = useState<string[]>(() => {
    const saved = localStorage.getItem("selectedDays");
    return saved ? JSON.parse(saved) : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  });
  const { toggleAudio } = useAudioPlayer();
  const { toast } = useToast();

  const handleBellPlay = async (traditionId: string) => {
    const tradition = bellTraditions.find(t => t.id === traditionId);
    if (tradition?.audioSample) {
      await toggleAudio(tradition.audioSample);
    }
  };

  const handleSave = () => {
    localStorage.setItem("bellTradition", selectedBellTradition);
    localStorage.setItem("startTime", startTime);
    localStorage.setItem("endTime", endTime);
    localStorage.setItem("halfHourChimes", String(halfHourChimes));
    localStorage.setItem("pauseEnabled", String(pauseEnabled));
    localStorage.setItem("pauseStartTime", pauseStartTime);
    localStorage.setItem("pauseEndTime", pauseEndTime);
    localStorage.setItem("selectedDays", JSON.stringify(selectedDays));
    localStorage.setItem("settingsConfigured", "true");
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been saved successfully"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 space-y-10">
        {/* Header with settings icon */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/5 border-2 border-primary/10">
              <SettingsIcon className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground/60 font-cormorant uppercase tracking-widest">
            Bell Settings
          </p>
          <h1 className="text-5xl md:text-6xl font-cinzel font-bold text-foreground leading-tight px-4">
            When should your<br />Bells ring?
          </h1>
          <p className="text-base text-muted-foreground italic font-cormorant max-w-md mx-auto">
            Configure your daily bell schedule and sound preferences
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <TimeRangeSelector 
            startTime={startTime} 
            endTime={endTime} 
            onStartTimeChange={setStartTime} 
            onEndTimeChange={setEndTime}
            halfHourChimes={halfHourChimes}
            onHalfHourChimesChange={setHalfHourChimes}
            pauseEnabled={pauseEnabled}
            onPauseEnabledChange={setPauseEnabled}
            pauseStartTime={pauseStartTime}
            pauseEndTime={pauseEndTime}
            onPauseStartTimeChange={setPauseStartTime}
            onPauseEndTimeChange={setPauseEndTime}
            selectedDays={selectedDays}
            onSelectedDaysChange={setSelectedDays}
          />
        </div>

        <BellSoundSelection 
          selectedBellTradition={selectedBellTradition}
          onSelect={setSelectedBellTradition}
          onPlay={handleBellPlay}
        />

        <div className="max-w-md mx-auto">
          <Button 
            onClick={handleSave} 
            className="w-full"
            size="lg"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
