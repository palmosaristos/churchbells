import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CurrentConfiguration } from "@/components/CurrentConfiguration";
import { HeroSection } from "@/components/HeroSection";
import { LocationPermission } from "@/components/LocationPermission";
import { AudioPermission } from "@/components/AudioPermission";
import heroImage from "/lovable-uploads/e28b4ae8-b1de-4d7c-8027-4d7157a1625c.png";

const Index = () => {
  const [selectedBellTradition] = useState<string>("cathedral-bell");
  const [startTime] = useState<string>("08:00");
  const [endTime] = useState<string>("20:00");
  const [halfHourChimes] = useState<boolean>(false);
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("");
  const [audioPermissionGranted, setAudioPermissionGranted] = useState<boolean>(false);

  const handleTimeZoneDetected = (timeZone: string) => {
    setSelectedTimeZone(timeZone);
  };

  const handleAudioPermissionGranted = () => {
    setAudioPermissionGranted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <HeroSection heroImage={heroImage} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {!selectedTimeZone && (
          <LocationPermission onTimeZoneDetected={handleTimeZoneDetected} />
        )}

        {selectedTimeZone && !audioPermissionGranted && (
          <AudioPermission onAudioPermissionGranted={handleAudioPermissionGranted} />
        )}

        {selectedTimeZone && audioPermissionGranted && (
          <CurrentConfiguration
            selectedBellTradition={selectedBellTradition}
            startTime={startTime}
            endTime={endTime}
            halfHourChimes={halfHourChimes}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
