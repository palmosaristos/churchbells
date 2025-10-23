import { useState, useEffect } from "react";
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
            className="w-full text-3xl font-cormorant py-8 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 border-amber-400/30"
            size="lg"
            aria-label="Sauvegarder les paramètres"
          >
            Save Settings
          </Button>
        </div>

        {/* Share Banner */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90 dark:from-blue-950/60 dark:via-indigo-950/60 dark:to-purple-950/60 rounded-2xl shadow-2xl border-2 border-blue-300/50 dark:border-blue-700/50 p-8 md:p-10 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <h3 className="text-3xl md:text-4xl font-cinzel font-bold text-foreground">
                  Share the Bells
                </h3>
              </div>
              <p className="text-xl md:text-2xl font-cormorant text-foreground leading-relaxed max-w-2xl mx-auto">
                Do you know someone who appreciates living <span className="font-cinzel font-semibold italic text-blue-600 dark:text-blue-400">close to the church</span>? Share this app with them and bring the sound of bells into their daily rhythm.
              </p>
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin);
                  toast({
                    title: "Link copied!",
                    description: "Share it with your community"
                  });
                }}
                className="mt-4 text-xl font-cormorant px-8 py-6 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
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
