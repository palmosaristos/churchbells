import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { BellSoundSelection } from "@/components/BellSoundSelection";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { bellTraditions } from "@/data/bellTraditions";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [selectedBellTradition, setSelectedBellTradition] = useState<string>("cathedral-bell");
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("20:00");
  const [halfHourChimes, setHalfHourChimes] = useState<boolean>(false);
  const [pauseEnabled, setPauseEnabled] = useState<boolean>(false);
  const [pauseStartTime, setPauseStartTime] = useState<string>("12:00");
  const [pauseEndTime, setPauseEndTime] = useState<string>("14:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
  const { playAudio } = useAudioPlayer();
  const { toast } = useToast();

  const handleBellPlay = async (traditionId: string) => {
    const tradition = bellTraditions.find(t => t.id === traditionId);
    if (tradition?.audioSample) {
      await playAudio(tradition.audioSample);
    }
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been saved successfully"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-cinzel font-bold text-foreground">
            Settings
          </h1>
          <p className="text-xl text-muted-foreground font-cormorant">
            When should your bells ring?
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
      </div>
    </div>
  );
};

export default Settings;
