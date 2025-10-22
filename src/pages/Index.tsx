import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { CurrentConfiguration } from "@/components/CurrentConfiguration";
import { HeroSection } from "@/components/HeroSection";
import { LocationPermission } from "@/components/LocationPermission";
import { AudioPermission } from "@/components/AudioPermission";
import heroImage from "/lovable-uploads/church-bells-hero-hq.jpg";

const Index = () => {
  const [selectedBellTradition] = useState<string>("cathedral-bell");
  const [startTime] = useState<string>("08:00");
  const [endTime] = useState<string>("20:00");
  const [halfHourChimes] = useState<boolean>(false);
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>(() => {
    return localStorage.getItem("timeZone") || "";
  });
  const [audioPermissionGranted, setAudioPermissionGranted] = useState<boolean>(() => {
    return localStorage.getItem("audioPermission") === "granted";
  });
  const [isAppEnabled, setIsAppEnabled] = useState<boolean>(() => {
    return localStorage.getItem("appEnabled") !== "false";
  });

  const handleTimeZoneDetected = (timeZone: string) => {
    setSelectedTimeZone(timeZone);
    localStorage.setItem("timeZone", timeZone);
  };

  const handleAudioPermissionGranted = () => {
    setAudioPermissionGranted(true);
    localStorage.setItem("audioPermission", "granted");
  };

  const handleAppToggle = (enabled: boolean) => {
    setIsAppEnabled(enabled);
    localStorage.setItem("appEnabled", String(enabled));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation isAppEnabled={isAppEnabled} onAppToggle={handleAppToggle} />
      
      <HeroSection heroImage={heroImage} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {isAppEnabled && !selectedTimeZone && (
          <LocationPermission onTimeZoneDetected={handleTimeZoneDetected} />
        )}

        {isAppEnabled && selectedTimeZone && !audioPermissionGranted && (
          <AudioPermission onAudioPermissionGranted={handleAudioPermissionGranted} />
        )}

        {isAppEnabled && selectedTimeZone && audioPermissionGranted && (
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
