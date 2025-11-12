Voici la version **finale optimale** qui fusionne vos corrections avec les améliorations de Lovable :

---

## Fichier final : `src/pages/PrayerTimes.tsx`

```typescript
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Clock, Volume2, BellRing, Plus, X } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TimeInputAmPm } from "@/components/TimeInputAmPm";
import heroImage from "/lovable-uploads/church-bells-hero-hq.jpg";

const PrayerTimes = () => {
  const [prayerName, setPrayerName] = useState<string>(() => {
    return localStorage.getItem("prayerName") || "Prayer";
  });
  const [prayerTime, setPrayerTime] = useState<string>(() => {
    return localStorage.getItem("prayerTime") || "06:00";
  });
  const [bellVolume, setBellVolume] = useState<number>(() => {
    const saved = localStorage.getItem("prayerBellVolume");
    return saved ? parseFloat(saved) : 0.7;
  });
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(() => {
    return localStorage.getItem("prayerReminderEnabled") === "true";
  });
  const [reminderMinutes, setReminderMinutes] = useState<number>(() => {
    const saved = localStorage.getItem("prayerReminderMinutes");
    return saved ? parseInt(saved) : 5;
  });
  const [reminderNotifications, setReminderNotifications] = useState<number[]>(() => {
    const saved = localStorage.getItem("prayerReminderNotifications");
    return saved ? JSON.parse(saved) : [5];
  });
  const [reminderWithBell, setReminderWithBell] = useState<boolean>(() => {
    return localStorage.getItem("prayerReminderWithBell") === "true";
  });
  const [additionalNotification, setAdditionalNotification] = useState<number>(0);
  const [prayerEnabled, setPrayerEnabled] = useState<boolean>(() => {
    return localStorage.getItem("prayerEnabled") !== "false";
  });
  const [callType, setCallType] = useState<'short' | 'long'>(() => {
    return (localStorage.getItem("prayerCallType") as 'short' | 'long') || 'short';
  });

  const { toggleAudio, isPlaying, currentAudioUrl } = useAudioPlayer();

  // ✅ CORRECTION : Sauvegarde complète des reminders + logique Lovable
  useEffect(() => {
    localStorage.setItem("prayerName", prayerName);
    localStorage.setItem("prayerTime", prayerTime);
    localStorage.setItem("prayerBellVolume", bellVolume.toString());
    localStorage.setItem("prayerReminderEnabled", String(reminderEnabled));
    localStorage.setItem("prayerReminderMinutes", reminderMinutes.toString());
    localStorage.setItem("prayerReminderNotifications", JSON.stringify(reminderNotifications));
    // ✅ NOUVEAU : Sauvegarde des reminders pour le scheduler
    localStorage.setItem("prayerReminders", JSON.stringify(reminderNotifications));
    localStorage.setItem("prayerReminderWithBell", String(reminderWithBell));
    localStorage.setItem("prayerEnabled", String(prayerEnabled));
    localStorage.setItem("prayerCallType", callType);
    localStorage.setItem("prayersConfigured", "true");
  }, [prayerName, prayerTime, bellVolume, reminderEnabled, reminderMinutes, reminderNotifications, reminderWithBell, prayerEnabled, callType]);

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      <Navigation />

      {/* Hero Image */}
      <div className="relative overflow-hidden pt-2">
        <div className="h-48 md:h-96 bg-cover bg-top md:bg-bottom bg-no-repeat relative" style={{
          backgroundImage: `url(${heroImage})`
        }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/20 to-transparent" />
        </div>
      </div>

      {/* Header with overlap */}
      <div className="relative -mt-8 md:-mt-12 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/90 dark:to-orange-950/90 rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-800/30 px-8 pt-8 pb-4 md:px-12 md:pt-12 md:pb-6 relative">
              <img src={churchBellTransparent