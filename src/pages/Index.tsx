import { useState } from "react";
import { PrayerTimesSelector } from "@/components/PrayerTimesSelector";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { BackgroundRemovalDemo } from "@/components/BackgroundRemovalDemo";
import { Navigation } from "@/components/Navigation";
import { TimeDisplay } from "@/components/TimeDisplay";
import { BellSoundSelection } from "@/components/BellSoundSelection";
import { CurrentConfiguration } from "@/components/CurrentConfiguration";
import { HeroSection } from "@/components/HeroSection";
import { PremiumPreview } from "@/components/PremiumPreview";
import { useToast } from "@/hooks/use-toast";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { bellTraditions } from "@/data/bellTraditions";
import heroImage from "/lovable-uploads/e28b4ae8-b1de-4d7c-8027-4d7157a1625c.png";

interface PrayerTime {
  name: string;
  time: string;
  description: string;
}

const Index = () => {
  const [selectedBellTradition, setSelectedBellTradition] = useState<string>("cathedral-bell");
  const [selectedPrayerTradition, setSelectedPrayerTradition] = useState<string>("Roman Catholic");
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("20:00");
  const [halfHourChimes, setHalfHourChimes] = useState<boolean>(false);
  const [pauseEnabled, setPauseEnabled] = useState<boolean>(false);
  const [pauseStartTime, setPauseStartTime] = useState<string>("12:00");
  const [pauseEndTime, setPauseEndTime] = useState<string>("14:00");
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("America/New_York");
  const { toast } = useToast();
  const { playAudio } = useAudioPlayer();

  const handleBellPlay = async (traditionId: string) => {
    const tradition = bellTraditions.find(t => t.id === traditionId);
    if (tradition?.audioSample) {
      await playAudio(tradition.audioSample);
    }
  };

  const handlePrayerTimesSelect = (times: PrayerTime[]) => {
    toast({
      title: "Prayer Times Applied",
      description: `${times.length} prayer times have been set for bell chiming`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <HeroSection heroImage={heroImage} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        <TimeDisplay 
          selectedTimeZone={selectedTimeZone} 
          onTimeZoneChange={setSelectedTimeZone} 
        />

        {/* Time Configuration */}
        <div className="grid gap-8 lg:grid-cols-2">
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
          />
          
          <PrayerTimesSelector selectedTradition={selectedPrayerTradition} onTraditionSelect={setSelectedPrayerTradition} onTimesSelect={handlePrayerTimesSelect} />
        </div>

        <BellSoundSelection 
          selectedBellTradition={selectedBellTradition}
          onSelect={setSelectedBellTradition}
          onPlay={handleBellPlay}
        />

        <CurrentConfiguration
          selectedBellTradition={selectedBellTradition}
          startTime={startTime}
          endTime={endTime}
          halfHourChimes={halfHourChimes}
        />

        <BackgroundRemovalDemo />

        <PremiumPreview />
      </div>
    </div>
  );
};

export default Index;
