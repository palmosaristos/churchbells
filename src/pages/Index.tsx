import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { LocationPermission } from "@/components/LocationPermission";
import { AudioPermission } from "@/components/AudioPermission";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { BellSoundSelection } from "@/components/BellSoundSelection";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNotificationListener } from "@/hooks/useNotificationListener";
import { useNightlyRescheduler } from "@/hooks/useNightlyRescheduler";
import { useBellScheduler } from "@/hooks/useBellScheduler";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useCinemaMode } from "@/hooks/useCinemaMode";
import { TimeDisplay } from "@/components/TimeDisplay";
import { Volume2, Clock } from "lucide-react";
import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";
import heroImage from "/lovable-uploads/church-bells-hero-hq.jpg";
const Index = () => {
  const {
    t
  } = useTranslation();
  const location = useLocation();
  const savedBellVolumes = localStorage.getItem("bellVolumes");

  // Configuration states
  const [selectedBellTradition, setSelectedBellTradition] = useState<string>(() => localStorage.getItem("bellTradition") || "cathedral-bell");
  const [startTime, setStartTime] = useState<string>(() => localStorage.getItem("startTime") || "08:00");
  const [endTime, setEndTime] = useState<string>(() => localStorage.getItem("endTime") || "20:00");
  const [halfHourChimes, setHalfHourChimes] = useState<boolean>(() => localStorage.getItem("halfHourChimes") === "true");
  const [pauseEnabled, setPauseEnabled] = useState<boolean>(() => localStorage.getItem("pauseEnabled") === "true");
  const [pauseStartTime, setPauseStartTime] = useState<string>(() => localStorage.getItem("pauseStartTime") || "12:00");
  const [pauseEndTime, setPauseEndTime] = useState<string>(() => localStorage.getItem("pauseEndTime") || "14:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(() => {
    const saved = localStorage.getItem("selectedDays");
    return saved ? JSON.parse(saved) : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  });

  // App state
  const [appEnabled, setAppEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("appEnabled");
    return saved !== "false";
  });
  const [bellVolumes, setBellVolumes] = useState<Record<string, number>>(savedBellVolumes ? JSON.parse(savedBellVolumes) : {
    'cathedral-bell': 0.7,
    'village-bell': 0.7,
    'carillon-bell': 0.7
  });
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>(() => localStorage.getItem("timeZone") || "");
  const [audioPermissionGranted, setAudioPermissionGranted] = useState<boolean>(() => localStorage.getItem("audioPermission") === "granted");
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(() => localStorage.getItem("onboardingComplete") === "true");
  const [respectDND, setRespectDND] = useState<boolean>(() => localStorage.getItem("respectDND") === "true");
  const [isSaved, setIsSaved] = useState(false);

  // Cinema mode hook
  const {
    isActive: cinemaModeActive
  } = useCinemaMode();

  // Reset isSaved when any setting changes
  useEffect(() => {
    if (isSaved) {
      setIsSaved(false);
    }
  }, [selectedBellTradition, startTime, endTime, halfHourChimes, pauseEnabled, pauseStartTime, pauseEndTime, selectedDays, bellVolumes]);
  const {
    toggleAudio,
    isPlaying,
    currentAudioUrl
  } = useAudioPlayer();

  // Activation des hooks Capacitor
  useNotificationListener();

  // Hook pour la reprogrammation nocturne automatique
  useNightlyRescheduler(() => {
    // Trigger reload when needed
    reloadSettings();
  });
  useBellScheduler({
    enabled: appEnabled && onboardingComplete && audioPermissionGranted,
    bellsEnabled: appEnabled,
    bellTradition: selectedBellTradition,
    startTime,
    endTime,
    halfHourChimes,
    pauseEnabled,
    pauseStartTime,
    pauseEndTime,
    selectedDays,
    timeZone: selectedTimeZone,
    prayerEnabled: false,
    prayerTime: "",
    prayerName: "",
    callType: 'short',
    prayerReminders: [],
    prayerReminderWithBell: false,
    scheduleKey: 0,
    cinemaModeActive,
    respectDND
  });

  // Auto-save settings to localStorage
  useEffect(() => {
    localStorage.setItem("appEnabled", String(appEnabled));
  }, [appEnabled]);
  useEffect(() => {
    localStorage.setItem("bellVolumes", JSON.stringify(bellVolumes));
  }, [bellVolumes]);
  useEffect(() => {
    localStorage.setItem("bellTradition", selectedBellTradition);
    localStorage.setItem("settingsConfigured", "true");
  }, [selectedBellTradition]);
  useEffect(() => {
    localStorage.setItem("startTime", startTime);
  }, [startTime]);
  useEffect(() => {
    localStorage.setItem("endTime", endTime);
  }, [endTime]);
  useEffect(() => {
    localStorage.setItem("halfHourChimes", String(halfHourChimes));
  }, [halfHourChimes]);
  useEffect(() => {
    localStorage.setItem("pauseEnabled", String(pauseEnabled));
  }, [pauseEnabled]);
  useEffect(() => {
    localStorage.setItem("pauseStartTime", pauseStartTime);
  }, [pauseStartTime]);
  useEffect(() => {
    localStorage.setItem("pauseEndTime", pauseEndTime);
  }, [pauseEndTime]);
  useEffect(() => {
    localStorage.setItem("selectedDays", JSON.stringify(selectedDays));
  }, [selectedDays]);
  useEffect(() => {
    localStorage.setItem("respectDND", String(respectDND));
  }, [respectDND]);

  // Rechargement des paramètres depuis localStorage
  const reloadSettings = () => {
    setSelectedBellTradition(localStorage.getItem("bellTradition") || "cathedral-bell");
    setStartTime(localStorage.getItem("startTime") || "08:00");
    setEndTime(localStorage.getItem("endTime") || "20:00");
    setHalfHourChimes(localStorage.getItem("halfHourChimes") === "true");
    setPauseEnabled(localStorage.getItem("pauseEnabled") === "true");
    setPauseStartTime(localStorage.getItem("pauseStartTime") || "12:00");
    setPauseEndTime(localStorage.getItem("pauseEndTime") || "14:00");
    const savedDays = localStorage.getItem("selectedDays");
    setSelectedDays(savedDays ? JSON.parse(savedDays) : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);

    // Paramètres critiques pour le scheduler
    setSelectedTimeZone(localStorage.getItem("timeZone") || "");
    setAudioPermissionGranted(localStorage.getItem("audioPermission") === "granted");
    setOnboardingComplete(localStorage.getItem("onboardingComplete") === "true");
    const appEnabledValue = localStorage.getItem("appEnabled");
    setAppEnabled(appEnabledValue !== "false");
  };

  // Recharger quand on navigue vers cette page
  useEffect(() => {
    reloadSettings();
  }, [location.pathname]);

  // Écoute des changements de settings (événements web)
  useEffect(() => {
    window.addEventListener("storage", reloadSettings);
    window.addEventListener("visibilitychange", reloadSettings);
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
    setAppEnabled(enabled);
  };
  const handleBellVolumeChange = (bellId: string, volume: number) => {
    setBellVolumes(prev => ({
      ...prev,
      [bellId]: volume
    }));
  };
  const handleWelcomeComplete = () => {
    setOnboardingComplete(true);
    localStorage.setItem("onboardingComplete", "true");
  };
  const handleTimeZoneChange = (timeZone: string) => {
    setSelectedTimeZone(timeZone);
    localStorage.setItem("timeZone", timeZone);
  };
  return <div className="min-h-screen bg-gradient-subtle pb-24">
      <Navigation isAppEnabled={appEnabled} onAppToggle={handleAppToggle} />
      
      {/* Welcome Screen */}
      {appEnabled && !onboardingComplete && <WelcomeScreen isOpen={true} onComplete={handleWelcomeComplete} />}

      {/* Location Permission */}
      {appEnabled && onboardingComplete && !selectedTimeZone && <LocationPermission onTimeZoneDetected={handleTimeZoneDetected} />}

      {/* Audio Permission */}
      {appEnabled && onboardingComplete && selectedTimeZone && !audioPermissionGranted && <AudioPermission onAudioPermissionGranted={handleAudioPermissionGranted} />}

      {/* Main Content - Only show when all permissions are granted */}
      {onboardingComplete && selectedTimeZone && audioPermissionGranted && <>
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
                <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/90 dark:to-orange-950/90 rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-800/30 px-8 md:px-12 py-1 md:py-2 relative">
                  <img src={churchBellTransparent} alt={t('app.title')} className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
                  <img src={churchBellNew} alt={t('app.title')} className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
                  <h1 className="text-5xl md:text-6xl font-cinzel font-bold text-foreground text-center py-2 md:py-3">
                    {t('app.title')}
                  </h1>
                  <p className="italic font-bold text-xl md:text-2xl font-cormorant text-foreground/90 text-center leading-relaxed max-w-2xl mx-auto">
                    {t('hero.subtitle')}
                  </p>
                </div>

                {/* Bell Toggle - Always Visible */}
                <div className="flex items-center justify-end gap-3 px-4 mt-2">
                  <Label htmlFor="bells-main-toggle" className="text-xl font-cormorant font-semibold text-foreground">
                    {t('settings.bells')}
                  </Label>
                  <Switch id="bells-main-toggle" checked={appEnabled} onCheckedChange={handleAppToggle} className="data-[state=checked]:bg-primary" />
                  <span className="text-lg font-cormorant font-semibold text-foreground min-w-[40px]">
                    {appEnabled ? t('settings.on') : t('settings.off')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-6 space-y-[10px]">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Accordion Layout */}
              <Accordion type="multiple" defaultValue={["bell-sound", "bell-schedule"]} className="space-y-4">
                
                {/* Choose Your Bell Sound Section */}
                <AccordionItem value="bell-sound" className="border-none">
                  <AccordionTrigger className="bg-[#FAF8F3] dark:bg-amber-950/30 hover:bg-[#F5F1E8] dark:hover:bg-amber-900/40 border-2 border-[#d4a574] dark:border-amber-700 rounded-lg px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md data-[state=open]:bg-white dark:data-[state=open]:bg-background data-[state=open]:rounded-b-none data-[state=open]:border-b-0 [&[data-state=open]>svg]:rotate-180">
                    <div className="flex items-center gap-3 font-cormorant text-3xl font-bold text-foreground">
                      <Volume2 className="w-6 h-6 text-primary" />
                      {t('settings.chooseBellSound')}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-white dark:bg-background border-2 border-t-0 border-[#d4a574] dark:border-amber-700 rounded-b-lg p-5 animate-accordion-down">
                    <BellSoundSelection selectedBellTradition={selectedBellTradition} onSelect={setSelectedBellTradition} toggleAudio={toggleAudio} bellVolumes={bellVolumes} onVolumeChange={handleBellVolumeChange} isPlaying={isPlaying} currentAudioUrl={currentAudioUrl} />
                  </AccordionContent>
                </AccordionItem>

                {/* Daily Bell Schedule Section */}
                <AccordionItem value="bell-schedule" className="border-none">
                  <AccordionTrigger className="bg-[#FAF8F3] dark:bg-amber-950/30 hover:bg-[#F5F1E8] dark:hover:bg-amber-900/40 border-2 border-[#d4a574] dark:border-amber-700 rounded-lg px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md data-[state=open]:bg-white dark:data-[state=open]:bg-background data-[state=open]:rounded-b-none data-[state=open]:border-b-0 [&[data-state=open]>svg]:rotate-180">
                    <div className="flex items-center gap-3 font-cormorant text-3xl font-bold text-foreground">
                      <Clock className="w-6 h-6 text-primary" />
                      {t('settings.dailyBellSchedule')}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-white dark:bg-background border-2 border-t-0 border-[#d4a574] dark:border-amber-700 rounded-b-lg p-5 animate-accordion-down">
                    <TimeRangeSelector startTime={startTime} endTime={endTime} onStartTimeChange={setStartTime} onEndTimeChange={setEndTime} halfHourChimes={halfHourChimes} onHalfHourChimesChange={setHalfHourChimes} pauseEnabled={pauseEnabled} onPauseEnabledChange={setPauseEnabled} pauseStartTime={pauseStartTime} pauseEndTime={pauseEndTime} onPauseStartTimeChange={setPauseStartTime} onPauseEndTimeChange={setPauseEndTime} selectedDays={selectedDays} onSelectedDaysChange={setSelectedDays} bellsEnabled={appEnabled} onBellsEnabledChange={handleAppToggle} timeZone={selectedTimeZone} respectDND={respectDND} onRespectDNDChange={setRespectDND} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Validation Button */}
            <div className="max-w-4xl mx-auto flex justify-center">
              <Button size="lg" className={`text-xl font-cormorant px-16 py-6 shadow-xl transition-all duration-500 ${isSaved ? 'bg-transparent border-2 border-primary/30 text-primary/50 hover:bg-transparent' : 'bg-[hsl(33,92%,49%)] hover:bg-[hsl(33,92%,44%)] text-white hover:shadow-2xl hover:scale-105'}`} onClick={() => {
            setIsSaved(true);
          }}>
                {t('common.saveBells')}
              </Button>
            </div>

            {/* Share Banner */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-vespers border-burgundy/20 rounded-[2rem] shadow-2xl border-2 p-8 md:p-10 flex items-center justify-center max-w-2xl mx-auto">
                <div className="text-center space-y-4">
                  <h3 className="text-3xl md:text-4xl font-cinzel font-bold text-burgundy-foreground">
                    {t('settings.shareBells')}
                  </h3>
                  <p className="text-xl md:text-2xl font-cormorant text-burgundy-foreground/90 leading-relaxed max-w-2xl mx-auto">
                    {t('settings.shareBellsDescription')}
                  </p>
                  <div className="mt-4 space-y-3">
                    <p className="text-lg font-cormoant text-burgundy-foreground/80">
                      {t('settings.shareVia')}
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button onClick={() => {
                    const text = encodeURIComponent(t('settings.shareMessage', {
                      url: window.location.origin
                    }));
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }} className="text-lg font-cormorant px-6 py-5 bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" size="lg">
                        {t('settings.whatsapp')}
                      </Button>
                      <Button onClick={() => {
                    const subject = encodeURIComponent(t('settings.shareEmailSubject'));
                    const body = encodeURIComponent(t('settings.shareEmailBody', {
                      url: window.location.origin
                    }));
                    window.location.href = `mailto:?subject=${subject}&body=${body}`;
                  }} className="text-lg font-cormorant px-6 py-5 bg-slate-700 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" size="lg">
                        {t('settings.email')}
                      </Button>
                      <Button onClick={() => {
                    const text = encodeURIComponent(t('settings.shareMessage', {
                      url: window.location.origin
                    }));
                    window.location.href = `sms:?body=${text}`;
                  }} className="text-lg font-cormorant px-6 py-5 bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" size="lg">
                        {t('settings.sms')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>}
    </div>;
};
export default Index;