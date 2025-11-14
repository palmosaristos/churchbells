import { useState, useEffect } from "react";
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Navigation } from "@/components/Navigation";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { BellSoundSelection } from "@/components/BellSoundSelection";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { bellTraditions } from "@/data/bellTraditions";
import { Volume2, Clock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";
import heroImage from "/lovable-uploads/church-bells-hero-hq.jpg";

const Settings = () => {
    const savedBellVolumes = localStorage.getItem("bellVolumes");
    const appEnabledValue = localStorage.getItem("appEnabled");

    const [selectedBellTradition, setSelectedBellTradition] = useState<string>(localStorage.getItem("bellTradition") || "cathedral-bell");
    const [startTime, setStartTime] = useState<string>(localStorage.getItem("startTime") || "08:00");
    const [endTime, setEndTime] = useState<string>(localStorage.getItem("endTime") || "20:00");
    const [halfHourChimes, setHalfHourChimes] = useState<boolean>(localStorage.getItem("halfHourChimes") === "true");
    const [pauseEnabled, setPauseEnabled] = useState<boolean>(localStorage.getItem("pauseEnabled") === "true");
    const [pauseStartTime, setPauseStartTime] = useState<string>(localStorage.getItem("pauseStartTime") || "12:00");
    const [pauseEndTime, setPauseEndTime] = useState<string>(localStorage.getItem("pauseEndTime") || "14:00");
    const [selectedDays, setSelectedDays] = useState<string[]>(JSON.parse(localStorage.getItem("selectedDays") || '["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]'));
    const [appEnabled, setAppEnabled] = useState<boolean>(appEnabledValue !== "false");
    const [bellVolumes, setBellVolumes] = useState<Record<string, number>>(savedBellVolumes ? JSON.parse(savedBellVolumes) : {
      'cathedral-bell': 0.7,
      'village-bell': 0.7,
      'carillon-bell': 0.7
    });
    const {
      toggleAudio,
      isPlaying,
      currentAudioUrl
    } = useAudioPlayer();
    // Auto-save settings to localStorage
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
      localStorage.setItem("appEnabled", String(appEnabled));
    }, [appEnabled]);

    useEffect(() => {
      localStorage.setItem("bellVolumes", JSON.stringify(bellVolumes));
    }, [bellVolumes]);

    const handleAppEnabledChange = (enabled: boolean) => {
      setAppEnabled(enabled);
    };

    const handleBellVolumeChange = (bellId: string, volume: number) => {
      setBellVolumes(prev => ({
        ...prev,
        [bellId]: volume
      }));
    };

    return <div className="min-h-screen bg-gradient-subtle pb-24">
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
              <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/90 dark:to-orange-950/90 rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-800/30 px-8 md:px-12 py-1 md:py-2 relative">
                <img src={churchBellTransparent} alt="Church bell" className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
                <img src={churchBellNew} alt="Church bell" className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
                <h1 className="text-5xl md:text-6xl font-cinzel font-bold text-foreground text-center py-2 md:py-3">Set your Bell Times</h1>
              </div>

              {/* Bell Toggle - Always Visible */}
              <div className="flex items-center justify-end gap-3 px-4 mt-2">
                <Label htmlFor="bells-main-toggle" className="text-xl font-cormorant font-semibold text-foreground">
                  Bells
                </Label>
                <Switch 
                  id="bells-main-toggle" 
                  checked={appEnabled} 
                  onCheckedChange={handleAppEnabledChange}
                  className="data-[state=checked]:bg-primary"
                />
                <span className="text-lg font-cormorant font-semibold text-foreground min-w-[40px]">
                  {appEnabled ? 'ON' : 'OFF'}
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
                    Choose Your Bell Sound
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
                    Daily Bell Schedule
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-white dark:bg-background border-2 border-t-0 border-[#d4a574] dark:border-amber-700 rounded-b-lg p-5 animate-accordion-down">
                  <TimeRangeSelector startTime={startTime} endTime={endTime} onStartTimeChange={setStartTime} onEndTimeChange={setEndTime} halfHourChimes={halfHourChimes} onHalfHourChimesChange={setHalfHourChimes} pauseEnabled={pauseEnabled} onPauseEnabledChange={setPauseEnabled} pauseStartTime={pauseStartTime} pauseEndTime={pauseEndTime} onPauseStartTimeChange={setPauseStartTime} onPauseEndTimeChange={setPauseEndTime} selectedDays={selectedDays} onSelectedDaysChange={setSelectedDays} bellsEnabled={appEnabled} onBellsEnabledChange={handleAppEnabledChange} />
                </AccordionContent>
              </AccordionItem>

              {/* System Diagnostic Section */}
              <AccordionItem value="diagnostic" className="border-none">
                <AccordionTrigger className="bg-[#FAF8F3] dark:bg-amber-950/30 hover:bg-[#F5F1E8] dark:hover:bg-amber-900/40 border-2 border-[#d4a574] dark:border-amber-700 rounded-lg px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md data-[state=open]:bg-white dark:data-[state=open]:bg-background data-[state=open]:rounded-b-none data-[state=open]:border-b-0 [&[data-state=open]>svg]:rotate-180">
                  <div className="flex items-center gap-3 font-cormorant text-3xl font-bold text-foreground">
                    <Activity className="w-6 h-6 text-primary" />
                    System Status
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-white dark:bg-background border-2 border-t-0 border-[#d4a574] dark:border-amber-700 rounded-b-lg p-5 animate-accordion-down">
                  <div className="space-y-3">
                    <DiagnosticItem 
                      label="App Enabled" 
                      status={appEnabled}
                      description="Main switch to enable/disable all bells"
                    />
                    <DiagnosticItem 
                      label="Onboarding Complete" 
                      status={localStorage.getItem("onboardingComplete") === "true"}
                      description="Initial setup completed"
                    />
                    <DiagnosticItem 
                      label="Audio Permission" 
                      status={localStorage.getItem("audioPermission") === "granted"}
                      description="Permission to play sounds"
                    />
                    <DiagnosticItem 
                      label="Exact Alarm Permission" 
                      status={localStorage.getItem("exactAlarmGranted") === "true"}
                      description="Required for precise scheduling on Android 12+"
                    />
                    <DiagnosticItem 
                      label="Time Zone" 
                      status={!!localStorage.getItem("timeZone")}
                      description={localStorage.getItem("timeZone") || "Not detected"}
                    />
                    <DiagnosticItem 
                      label="Notifications Scheduled" 
                      status={scheduledCount !== null && scheduledCount > 0}
                      description={scheduledCount === null ? "Checking..." : `${scheduledCount} notification${scheduledCount !== 1 ? 's' : ''} scheduled`}
                    />
                    <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
                      <p className="text-sm font-cormorant text-muted-foreground">
                        All indicators must be green for notifications to work properly. If notifications scheduled is 0, check all other conditions above.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Share Banner */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-vespers border-burgundy/20 rounded-[2rem] shadow-2xl border-2 p-8 md:p-10 flex items-center justify-center max-w-2xl mx-auto">
              <div className="text-center space-y-4">
                <h3 className="text-3xl md:text-4xl font-cinzel font-bold text-burgundy-foreground">
                  Share the Bells
                </h3>
                <p className="text-xl md:text-2xl font-cormorant text-burgundy-foreground/90 leading-relaxed max-w-2xl mx-auto">
                  Bells have united communities for centuries, bring the sacred sound of church bells to your loved ones
                </p>
                <div className="mt-4 space-y-3">
                  <p className="text-lg font-cormorant text-burgundy-foreground/80">
                    share our app via
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button onClick={() => {
                    const text = encodeURIComponent(`🔔 Check out Sacred Bells! It's like having a church bell tower in your pocket. Beautiful way to mark the time throughout the day: ${window.location.origin}`);
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }} className="text-lg font-cormorant px-6 py-5 bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" size="lg">
                      WhatsApp
                    </Button>
                    <Button onClick={() => {
                    const subject = encodeURIComponent('A beautiful app I thought you\'d appreciate');
                    const body = encodeURIComponent(`Hi,

  I wanted to share something special with you. I've been using Sacred Bells, an app that recreates the traditional rhythm of church bells throughout the day.

  It's been a wonderful way to stay connected to the sacred rhythm that churches have maintained for centuries.

  I think you might enjoy it too!

  Download: ${window.location.origin}

  Blessings`);
                    window.location.href = `mailto:?subject=${subject}&body=${body}`;
                  }} className="text-lg font-cormorant px-6 py-5 bg-slate-700 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" size="lg">
                      Email
                    </Button>
                    <Button onClick={() => {
                    const text = encodeURIComponent(`🔔 Check out Sacred Bells! It's like having a church bell tower in your pocket. Beautiful way to mark the time throughout the day: ${window.location.origin}`);
                    window.location.href = `sms:?body=${text}`;
                  }} className="text-lg font-cormorant px-6 py-5 bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" size="lg">
                      SMS
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>;
  };
  export default Settings;