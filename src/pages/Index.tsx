import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CurrentConfiguration } from "@/components/CurrentConfiguration";
import { PrayerConfiguration } from "@/components/PrayerConfiguration";
import { HeroSection } from "@/components/HeroSection";
import { LocationPermission } from "@/components/LocationPermission";
import { AudioPermission } from "@/components/AudioPermission";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { PremiumConfiguration } from "@/components/PremiumConfiguration";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  const [morningPrayerEnabled, setMorningPrayerEnabled] = useState<boolean>(() => {
    return localStorage.getItem("morningPrayerEnabled") === "true";
  });
  const [eveningPrayerEnabled, setEveningPrayerEnabled] = useState<boolean>(() => {
    return localStorage.getItem("eveningPrayerEnabled") === "true";
  });
  const [morningPrayerName, setMorningPrayerName] = useState<string>(() => {
    return localStorage.getItem("morningPrayerName") || "Morning Prayer";
  });
  const [eveningPrayerName, setEveningPrayerName] = useState<string>(() => {
    return localStorage.getItem("eveningPrayerName") || "Evening Prayer";
  });
  const [morningPrayerTime, setMorningPrayerTime] = useState<string>(() => {
    return localStorage.getItem("morningPrayerTime") || "06:00";
  });
  const [eveningPrayerTime, setEveningPrayerTime] = useState<string>(() => {
    return localStorage.getItem("eveningPrayerTime") || "18:00";
  });
  const [isPremiumMember, setIsPremiumMember] = useState<boolean>(() => {
    return localStorage.getItem("isPremiumMember") === "true";
  });
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(() => {
    return localStorage.getItem("onboardingComplete") === "true";
  });

  // Listen for settings changes
  useEffect(() => {
    const reloadSettings = () => {
      setSelectedBellTradition(localStorage.getItem("bellTradition") || "cathedral-bell");
      setStartTime(localStorage.getItem("startTime") || "08:00");
      setEndTime(localStorage.getItem("endTime") || "20:00");
      setHalfHourChimes(localStorage.getItem("halfHourChimes") === "true");
      setMorningPrayerEnabled(localStorage.getItem("morningPrayerEnabled") === "true");
      setEveningPrayerEnabled(localStorage.getItem("eveningPrayerEnabled") === "true");
      setMorningPrayerName(localStorage.getItem("morningPrayerName") || "Morning Prayer");
      setEveningPrayerName(localStorage.getItem("eveningPrayerName") || "Evening Prayer");
      setMorningPrayerTime(localStorage.getItem("morningPrayerTime") || "06:00");
      setEveningPrayerTime(localStorage.getItem("eveningPrayerTime") || "18:00");
      setIsPremiumMember(localStorage.getItem("isPremiumMember") === "true");
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

  const handleWelcomeComplete = () => {
    setOnboardingComplete(true);
    localStorage.setItem("onboardingComplete", "true");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation isAppEnabled={isAppEnabled} onAppToggle={handleAppToggle} />
      
      <HeroSection heroImage={heroImage} />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-4 pb-16 space-y-10">
        {isAppEnabled && !onboardingComplete && (
          <WelcomeScreen isOpen={true} onComplete={handleWelcomeComplete} />
        )}

        {isAppEnabled && onboardingComplete && !selectedTimeZone && (
          <LocationPermission onTimeZoneDetected={handleTimeZoneDetected} />
        )}

        {isAppEnabled && onboardingComplete && selectedTimeZone && !audioPermissionGranted && (
          <AudioPermission onAudioPermissionGranted={handleAudioPermissionGranted} />
        )}

        {isAppEnabled && onboardingComplete && selectedTimeZone && audioPermissionGranted && (
          <Accordion 
            type="single" 
            collapsible 
            defaultValue="bells-schedule"
            className="w-full"
          >
            <AccordionItem value="bells-schedule">
              <AccordionTrigger className="font-cormorant text-3xl font-bold text-foreground">Your Sacred Bells schedule</AccordionTrigger>
              <AccordionContent>
                <CurrentConfiguration
                  selectedBellTradition={selectedBellTradition}
                  startTime={startTime}
                  endTime={endTime}
                  halfHourChimes={halfHourChimes}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="prayers">
              <AccordionTrigger className="font-cormorant text-3xl font-bold text-foreground">Your Prayers</AccordionTrigger>
              <AccordionContent>
                <PrayerConfiguration
                  morningPrayerEnabled={morningPrayerEnabled}
                  eveningPrayerEnabled={eveningPrayerEnabled}
                  morningPrayerName={morningPrayerName}
                  eveningPrayerName={eveningPrayerName}
                  morningPrayerTime={morningPrayerTime}
                  eveningPrayerTime={eveningPrayerTime}
                />
              </AccordionContent>
            </AccordionItem>

        <AccordionItem value="premium">
          <AccordionTrigger className="font-cormorant text-3xl font-bold text-foreground">Your Premium Status</AccordionTrigger>
          <AccordionContent>
                <PremiumConfiguration isPremiumMember={isPremiumMember} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Index;
