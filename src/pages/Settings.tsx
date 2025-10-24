import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { BellSoundSelection } from "@/components/BellSoundSelection";
import { Button } from "@/components/ui/button";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { bellTraditions } from "@/data/bellTraditions";
import { useToast } from "@/hooks/use-toast";
import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";

const Settings = () => {
  // Store initial values
  const initialSettings = useMemo(() => ({
    bellTradition: localStorage.getItem("bellTradition") || "cathedral-bell",
    startTime: localStorage.getItem("startTime") || "08:00",
    endTime: localStorage.getItem("endTime") || "20:00",
    halfHourChimes: localStorage.getItem("halfHourChimes") === "true",
    pauseEnabled: localStorage.getItem("pauseEnabled") === "true",
    pauseStartTime: localStorage.getItem("pauseStartTime") || "12:00",
    pauseEndTime: localStorage.getItem("pauseEndTime") || "14:00",
    selectedDays: JSON.parse(localStorage.getItem("selectedDays") || '["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]'),
    bellsEnabled: localStorage.getItem("bellsEnabled") !== "false"
  }), []);

  const [selectedBellTradition, setSelectedBellTradition] = useState<string>(initialSettings.bellTradition);
  const [startTime, setStartTime] = useState<string>(initialSettings.startTime);
  const [endTime, setEndTime] = useState<string>(initialSettings.endTime);
  const [halfHourChimes, setHalfHourChimes] = useState<boolean>(initialSettings.halfHourChimes);
  const [pauseEnabled, setPauseEnabled] = useState<boolean>(initialSettings.pauseEnabled);
  const [pauseStartTime, setPauseStartTime] = useState<string>(initialSettings.pauseStartTime);
  const [pauseEndTime, setPauseEndTime] = useState<string>(initialSettings.pauseEndTime);
  const [selectedDays, setSelectedDays] = useState<string[]>(initialSettings.selectedDays);
  const [bellsEnabled, setBellsEnabled] = useState<boolean>(initialSettings.bellsEnabled);
  
  const { toggleAudio } = useAudioPlayer();
  const { toast } = useToast();

  // Check if any settings have changed
  const hasChanges = useMemo(() => {
    return (
      selectedBellTradition !== initialSettings.bellTradition ||
      startTime !== initialSettings.startTime ||
      endTime !== initialSettings.endTime ||
      halfHourChimes !== initialSettings.halfHourChimes ||
      pauseEnabled !== initialSettings.pauseEnabled ||
      pauseStartTime !== initialSettings.pauseStartTime ||
      pauseEndTime !== initialSettings.pauseEndTime ||
      bellsEnabled !== initialSettings.bellsEnabled ||
      JSON.stringify(selectedDays) !== JSON.stringify(initialSettings.selectedDays)
    );
  }, [
    selectedBellTradition, startTime, endTime, halfHourChimes, 
    pauseEnabled, pauseStartTime, pauseEndTime, selectedDays, bellsEnabled,
    initialSettings
  ]);

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
    localStorage.setItem("bellsEnabled", String(bellsEnabled));
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
        {/* Header */}
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/90 dark:to-orange-950/90 rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-800/30 p-8 md:p-12 relative">
            <img src={churchBellTransparent} alt="Church bell" className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
            <img src={churchBellNew} alt="Church bell" className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-cinzel font-bold text-foreground text-center pt-4 md:pt-6">
              SET YOUR BELLS
            </h1>
          </div>
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
            bellsEnabled={bellsEnabled}
            onBellsEnabledChange={setBellsEnabled}
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
            disabled={!hasChanges}
            className="w-full text-3xl font-cormorant py-8 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 border-amber-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            size="lg"
            aria-label="Sauvegarder les paramètres"
          >
            Save Settings
          </Button>
        </div>

        {/* Share Banner */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-vespers border-burgundy/20 rounded-full shadow-2xl border-2 p-8 md:p-10 aspect-[3/1] flex items-center justify-center max-w-3xl mx-auto">
            <div className="text-center space-y-4">
              <h3 className="text-3xl md:text-4xl font-cinzel font-bold text-burgundy-foreground">
                Share the Bells
              </h3>
              <p className="text-xl md:text-2xl font-cormorant text-burgundy-foreground/90 leading-relaxed max-w-2xl mx-auto">
                Do you know someone who appreciates living close to the church? Share this app with them and bring the sound of bells into their daily rhythm.
              </p>
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin);
                  toast({
                    title: "Link copied!",
                    description: "Share it with your community"
                  });
                }}
                className="mt-4 text-xl font-cormorant px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                size="lg"
              >
                Copy Link to Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
