import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { BellSoundSelection } from "@/components/BellSoundSelection";
import { Button } from "@/components/ui/button";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { bellTraditions } from "@/data/bellTraditions";
import { useToast } from "@/hooks/use-toast";
import { Volume2, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";

const Settings = () => {
  // Store initial values
  const initialSettings = useMemo(() => {
    const savedBellVolumes = localStorage.getItem("bellVolumes");
    return {
      bellTradition: localStorage.getItem("bellTradition") || "cathedral-bell",
      startTime: localStorage.getItem("startTime") || "08:00",
      endTime: localStorage.getItem("endTime") || "20:00",
      halfHourChimes: localStorage.getItem("halfHourChimes") === "true",
      pauseEnabled: localStorage.getItem("pauseEnabled") === "true",
      pauseStartTime: localStorage.getItem("pauseStartTime") || "12:00",
      pauseEndTime: localStorage.getItem("pauseEndTime") || "14:00",
      selectedDays: JSON.parse(localStorage.getItem("selectedDays") || '["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]'),
      bellsEnabled: localStorage.getItem("bellsEnabled") !== "false",
      bellVolumes: savedBellVolumes ? JSON.parse(savedBellVolumes) : {
        'cathedral-bell': 0.7,
        'village-bell': 0.7,
        'carillon-bell': 0.7
      }
    };
  }, []);

  const [selectedBellTradition, setSelectedBellTradition] = useState<string>(initialSettings.bellTradition);
  const [startTime, setStartTime] = useState<string>(initialSettings.startTime);
  const [endTime, setEndTime] = useState<string>(initialSettings.endTime);
  const [halfHourChimes, setHalfHourChimes] = useState<boolean>(initialSettings.halfHourChimes);
  const [pauseEnabled, setPauseEnabled] = useState<boolean>(initialSettings.pauseEnabled);
  const [pauseStartTime, setPauseStartTime] = useState<string>(initialSettings.pauseStartTime);
  const [pauseEndTime, setPauseEndTime] = useState<string>(initialSettings.pauseEndTime);
  const [selectedDays, setSelectedDays] = useState<string[]>(initialSettings.selectedDays);
  const [bellsEnabled, setBellsEnabled] = useState<boolean>(initialSettings.bellsEnabled);
  const [bellVolumes, setBellVolumes] = useState<Record<string, number>>(initialSettings.bellVolumes);
  
  const { toggleAudio } = useAudioPlayer();
  const { toast } = useToast();

  // Save bellsEnabled immediately to localStorage when it changes
  const handleBellsEnabledChange = (enabled: boolean) => {
    setBellsEnabled(enabled);
    localStorage.setItem("bellsEnabled", String(enabled));
  };

  // Handle bell volume changes
  const handleBellVolumeChange = (bellId: string, volume: number) => {
    setBellVolumes(prev => ({
      ...prev,
      [bellId]: volume
    }));
  };

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
      JSON.stringify(selectedDays) !== JSON.stringify(initialSettings.selectedDays) ||
      JSON.stringify(bellVolumes) !== JSON.stringify(initialSettings.bellVolumes)
    );
  }, [
    selectedBellTradition, startTime, endTime, halfHourChimes, 
    pauseEnabled, pauseStartTime, pauseEndTime, selectedDays, bellsEnabled, bellVolumes,
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
    localStorage.setItem("bellVolumes", JSON.stringify(bellVolumes));
    localStorage.setItem("settingsConfigured", "true");
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been saved successfully"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 space-y-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/90 dark:to-orange-950/90 rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-800/30 px-8 md:px-12 py-1 md:py-2 relative">
            <img src={churchBellTransparent} alt="Church bell" className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
            <img src={churchBellNew} alt="Church bell" className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-cinzel font-bold text-foreground text-center py-2 md:py-3">
              Set Your Bell Times
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Accordion Layout */}
          <Accordion type="single" collapsible defaultValue="bell-sound" className="space-y-4">
            {/* Choose Your Bell Sound Section */}
            <AccordionItem value="bell-sound" className="border-none">
              <AccordionTrigger className="bg-[#FAF8F3] dark:bg-amber-950/30 hover:bg-[#F5F1E8] dark:hover:bg-amber-900/40 border-2 border-[#d4a574] dark:border-amber-700 rounded-lg px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md data-[state=open]:bg-white dark:data-[state=open]:bg-background data-[state=open]:rounded-b-none data-[state=open]:border-b-0 [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-3 font-cormorant text-3xl font-bold text-foreground">
                  <Volume2 className="w-6 h-6 text-primary" />
                  Choose Your Bell Sound
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white dark:bg-background border-2 border-t-0 border-[#d4a574] dark:border-amber-700 rounded-b-lg p-5 animate-accordion-down">
                <BellSoundSelection 
                  selectedBellTradition={selectedBellTradition}
                  onSelect={setSelectedBellTradition}
                  onPlay={handleBellPlay}
                  bellVolumes={bellVolumes}
                  onVolumeChange={handleBellVolumeChange}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Daily Bell Schedule Section */}
            <AccordionItem value="bell-schedule" className="border-none">
              <AccordionTrigger className="bg-[#FAF8F3] dark:bg-amber-950/30 hover:bg-[#F5F1E8] dark:hover:bg-amber-900/40 border-2 border-[#d4a574] dark:border-amber-700 rounded-lg px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md data-[state=open]:bg-white dark:data-[state=open]:bg-background data-[state=open]:rounded-b-none data-[state=open]:border-b-0 [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-3 font-cormorant text-2xl font-semibold text-foreground">
                  <Clock className="w-6 h-6 text-primary" />
                  Daily Bell Schedule
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white dark:bg-background border-2 border-t-0 border-[#d4a574] dark:border-amber-700 rounded-b-lg p-5 animate-accordion-down">
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
                  onBellsEnabledChange={handleBellsEnabledChange}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Save Button */}
          <div className="max-w-4xl mx-auto py-6">
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges}
              className={`w-full text-3xl font-cormorant py-8 shadow-lg transition-all duration-300 border-2 ${
                hasChanges 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:shadow-xl hover:scale-[1.02] border-amber-400/30' 
                  : 'bg-muted text-muted-foreground border-border cursor-not-allowed'
              }`}
              size="lg"
              aria-label="Sauvegarder les paramètres"
            >
              Save Bell Settings
            </Button>
          </div>
        </div>

        {/* Share Banner */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-vespers border-burgundy/20 rounded-[2rem] shadow-2xl border-2 p-8 md:p-10 flex items-center justify-center max-w-2xl mx-auto">
            <div className="text-center space-y-4">
              <h3 className="text-3xl md:text-4xl font-cinzel font-bold text-burgundy-foreground">
                Share the Bells
              </h3>
              <p className="text-xl md:text-2xl font-cormorant text-burgundy-foreground/90 leading-relaxed max-w-2xl mx-auto">
                Bells have united communities for centuries, bring the sacred sound of church bells to your loved ones
              </p>
              <div className="mt-4 space-y-3">
                <p className="text-lg font-cormorant text-burgundy-foreground/80">
                  share our app via
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button 
                    onClick={() => {
                      const text = encodeURIComponent(`🔔 Check out Sacred Bells! It's like having a church bell tower in your pocket. Beautiful way to mark the time throughout the day: ${window.location.origin}`);
                      window.open(`https://wa.me/?text=${text}`, '_blank');
                    }}
                    className="text-lg font-cormorant px-6 py-5 bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    size="lg"
                  >
                    WhatsApp
                  </Button>
                  <Button 
                    onClick={() => {
                      const subject = encodeURIComponent('A beautiful app I thought you\'d appreciate');
                      const body = encodeURIComponent(`Hi,

I wanted to share something special with you. I've been using Sacred Bells, an app that recreates the traditional rhythm of church bells throughout the day.

It's been a wonderful way to stay connected to the sacred rhythm that churches have maintained for centuries.

I think you might enjoy it too!

Download: ${window.location.origin}

Blessings`);
                      window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    }}
                    className="text-lg font-cormorant px-6 py-5 bg-slate-700 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    size="lg"
                  >
                    Email
                  </Button>
                  <Button 
                    onClick={() => {
                      const text = encodeURIComponent(`🔔 Check out Sacred Bells! It's like having a church bell tower in your pocket. Beautiful way to mark the time throughout the day: ${window.location.origin}`);
                      window.location.href = `sms:?body=${text}`;
                    }}
                    className="text-lg font-cormorant px-6 py-5 bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    size="lg"
                  >
                    SMS
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
