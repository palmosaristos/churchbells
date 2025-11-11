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
import { useBellScheduler } from "@/hooks/useBellScheduler";

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
  const [prayerEnabled, setPrayerEnabled] = useState<boolean>(() => {
    return localStorage.getItem("prayerEnabled") !== "false";
  });
  const [prayerName, setPrayerName] = useState<string>(() => {
    return localStorage.getItem("prayerName") || "Prayer";
  });
  const [prayerTime, setPrayerTime] = useState<string>(() => {
    return localStorage.getItem("prayerTime") || "06:00";
  });
  const [isPremiumMember, setIsPremiumMember] = useState<boolean>(() => {
    return localStorage.getItem("isPremiumMember") === "true";
  });
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(() => {
    return localStorage.getItem("onboardingComplete") === "true";
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
  const [callType, setCallType] = useState<string>(() => {
    return localStorage.getItem("prayerCallType") || "short";
  });
  const [prayerReminders, setPrayerReminders] = useState<string[]>(() => {
    const saved = localStorage.getItem("prayerReminderNotifications");
    return saved ? JSON.parse(saved) : ["5"];
  });
  const [reminderWithBell, setReminderWithBell] = useState<boolean>(() => {
    return localStorage.getItem("prayerReminderWithBell") === "true";
  });

  useBellScheduler({
    enabled: isAppEnabled && onboardingComplete && audioPermissionGranted,
    bellTradition: selectedBellTradition,
    startTime,
    endTime,
    halfHourChimes,
    pauseEnabled,
    pauseStartTime,
    pauseEndTime,
    selectedDays,
    timeZone: selectedTimeZone,
    prayerEnabled,
    prayerTime,
    prayerName,
    callType,
    prayerReminders,
    prayerReminderWithBell: reminderWithBell
  });

  // Listen for settings changes
  useEffect(() => {
    const reloadSettings = () => {
      setSelectedBellTradition(localStorage.getItem("bellTradition") || "cathedral-bell");
      setStartTime(localStorage.getItem("startTime") || "08:00");
      setEndTime(localStorage.getItem("endTime") || "20:00");
      setHalfHourChimes(localStorage.getItem("halfHourChimes") === "true");
      setPrayerEnabled(localStorage.getItem("prayerEnabled") !== "false");
      setPrayerName(localStorage.getItem("prayerName") || "Prayer");
      setPrayerTime(localStorage.getItem("prayerTime") || "06:00");
      setIsPremiumMember(localStorage.getItem("isPremiumMember") === "true");
      setPauseEnabled(localStorage.getItem("pauseEnabled") === "true");
      setPauseStartTime(localStorage.getItem("pauseStartTime") || "12:00");
      setPauseEndTime(localStorage.getItem("pauseEndTime") || "14:00");
      setCallType(localStorage.getItem("prayerCallType") || "short");
      const savedDays = localStorage.getItem("selectedDays");
      setSelectedDays(savedDays ? JSON.parse(savedDays) : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
      const savedReminders = localStorage.getItem("prayerReminderNotifications");
      setPrayerReminders(savedReminders ? JSON.parse(savedReminders) : ["5"]);
      setReminderWithBell(localStorage.getItem("prayerReminderWithBell") === "true");
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
              <AccordionTrigger className="font-cormorant text-3xl font-bold text-foreground">Your Prayer</AccordionTrigger>
              <AccordionContent>
                <PrayerConfiguration
                  prayerEnabled={prayerEnabled}
                  prayerName={prayerName}
                  prayerTime={prayerTime}
                  callType={callType as 'short' | 'long'}
                  timeZone={selectedTimeZone}
                  reminders={prayerReminders}
                  reminderWithBell={reminderWithBell}
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
