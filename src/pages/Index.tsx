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
import { useNotificationListener } from "@/hooks/useNotificationListener";

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
  const [callType, setCallType] = useState<'short' | 'long'>(() => {
    return (localStorage.getItem("prayerCallType") as 'short' | 'long') || 'short';
  });
  const [prayerReminders, setPrayerReminders] = useState<string[]>(() => {
    const saved = localStorage.getItem("prayerReminderNotifications");
    return saved ? JSON.parse(saved) : ["5"];
  });
  const [reminderWithBell, setReminderWithBell] = useState<boolean>(() => {
    return localStorage.getItem("prayerReminderWithBell") === "true";
  });

  // Activation des hooks Capacitor
  useNotificationListener();
  
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

  // ... (reste du code identique) ...

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation isAppEnabled={isAppEnabled} onAppToggle={handleAppToggle} />
      
      <HeroSection heroImage={heroImage} />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-4 pb-16 space-y-10">
        {/* ... (reste du JSX) ... */}
      </div>

      <Footer />
    </div>
  );
};

export default Index;
