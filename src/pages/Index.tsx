import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { CurrentConfiguration } from "@/components/CurrentConfiguration";
import { HeroSection } from "@/components/HeroSection";
import { LocationPermission } from "@/components/LocationPermission";
import { AudioPermission } from "@/components/AudioPermission";
import heroImage from "/lovable-uploads/church-bells-hero-hq.jpg";

const Index = () => {
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
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>(() => {
    return localStorage.getItem("timeZone") || "";
  });
  const [audioPermissionGranted, setAudioPermissionGranted] = useState<boolean>(() => {
    return localStorage.getItem("audioPermission") === "granted";
  });
  const [isAppEnabled, setIsAppEnabled] = useState<boolean>(() => {
    return localStorage.getItem("appEnabled") !== "false";
  });

  // Listen for settings changes
  useEffect(() => {
    const reloadSettings = () => {
      setSelectedBellTradition(localStorage.getItem("bellTradition") || "cathedral-bell");
      setStartTime(localStorage.getItem("startTime") || "08:00");
      setEndTime(localStorage.getItem("endTime") || "20:00");
      setHalfHourChimes(localStorage.getItem("halfHourChimes") === "true");
    };

    // Listen for storage changes from other tabs
    window.addEventListener("storage", reloadSettings);
    
    // Listen for page visibility changes (when user comes back to this page)
    window.addEventListener("visibilitychange", reloadSettings);
    
    // Listen for focus events (when user navigates back)
    window.addEventListener("focus", reloadSettings);

    return () => {
      window.removeEventListener("storage", reloadSettings);
      window.removeEventListener("visibilitychange", reloadSettings);
      window.removeEventListener("focus", reloadSettings);
    };
  }, []);

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
