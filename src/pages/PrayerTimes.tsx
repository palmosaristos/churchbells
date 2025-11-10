import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
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

    const {
      toggleAudio,
      isPlaying,
      currentAudioUrl
    } = useAudioPlayer();

  // Auto-save on unmount
  useEffect(() => {
    return () => {
      localStorage.setItem("prayerName", prayerName);
      localStorage.setItem("prayerTime", prayerTime);
      localStorage.setItem("prayerBellVolume", bellVolume.toString());
      localStorage.setItem("prayerReminderEnabled", String(reminderEnabled));
      localStorage.setItem("prayerReminderMinutes", reminderMinutes.toString());
      localStorage.setItem("prayerReminderNotifications", JSON.stringify(reminderNotifications));
      localStorage.setItem("prayerReminderWithBell", String(reminderWithBell));
      localStorage.setItem("prayersConfigured", "true");
    };
  }, [prayerName, prayerTime, bellVolume, reminderEnabled, reminderMinutes, reminderNotifications, reminderWithBell]);
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
              <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/90 dark:to-orange-950/90 rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-800/30 px-8 pt-8 pb-4 md:px-12 md:pt-12 md:pb-6 relative">
                <img src={churchBellTransparent} alt="Church bell" className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
                <img src={churchBellNew} alt="Church bell" className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
                <h1 className="text-5xl md:text-6xl font-cinzel font-bold text-foreground text-center leading-none">Set your Prayer Bells</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 space-y-10">

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Accordion Layout */}
            <Accordion type="multiple" defaultValue={["prayer-times", "bell-sound", "prayer-reminder"]} className="space-y-4">
              {/* Set Your Prayer Times Section */}
              <AccordionItem value="prayer-times" className="border-none">
                <AccordionTrigger className="bg-[#FAF8F3] dark:bg-amber-950/30 hover:bg-[#F5F1E8] dark:hover:bg-amber-900/40 border-2 border-[#d4a574] dark:border-amber-700 rounded-lg px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md data-[state=open]:bg-white dark:data-[state=open]:bg-background data-[state=open]:rounded-b-none data-[state=open]:border-b-0 [&[data-state=open]>svg]:rotate-180">
                  <div className="flex items-center gap-3 font-cormorant text-3xl font-bold text-foreground">
                    <Clock className="w-6 h-6 text-primary" />
                    Set Your Prayer Times
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-white dark:bg-background border-2 border-t-0 border-[#d4a574] dark:border-amber-700 rounded-b-lg p-5 animate-accordion-down">
                  <div className="space-y-6">
                    <div className="max-w-2xl mx-auto">
                      <div className="space-y-4 group p-5 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border-2 border-[#d4a574] dark:border-amber-700">
                        <Label htmlFor="prayer-name" className="text-base font-cormorant text-muted-foreground">
                          Prayer name (optional)
                        </Label>
                        <Input 
                          id="prayer-name" 
                          type="text" 
                          value={prayerName} 
                          onChange={e => setPrayerName(e.target.value)} 
                          placeholder="Prayer" 
                          className="w-full text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors" 
                          aria-label="Name your prayer" 
                        />
                        <TimeInputAmPm 
                          value={prayerTime}
                          onChange={(value) => setPrayerTime(value)}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Bell Call Sound Section */}
              <AccordionItem value="bell-sound" className="border-none">
                <AccordionTrigger className="bg-[#FAF8F3] dark:bg-amber-950/30 hover:bg-[#F5F1E8] dark:hover:bg-amber-900/40 border-2 border-[#d4a574] dark:border-amber-700 rounded-lg px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md data-[state=open]:bg-white dark:data-[state=open]:bg-background data-[state=open]:rounded-b-none data-[state=open]:border-b-0 [&[data-state=open]>svg]:rotate-180">
                  <div className="flex items-center gap-3 font-cormorant text-3xl font-bold text-foreground">
                    <Volume2 className="w-6 h-6 text-primary" />
                    Bell Call Sound
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-white dark:bg-background border-2 border-t-0 border-[#d4a574] dark:border-amber-700 rounded-b-lg p-5 animate-accordion-down">
                  <div className="max-w-2xl mx-auto space-y-6">
                    {/* Volume Control */}
                    <div className="space-y-3 p-4 rounded-lg border-2 border-border bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bell-volume" className="flex items-center gap-2 font-cormorant text-lg font-semibold text-foreground">
                          <Volume2 className="w-5 h-5 text-primary" />
                          Volume
                        </Label>
                        <span className="font-cormorant text-base text-muted-foreground">{Math.round(bellVolume * 100)}%</span>
                      </div>
                      <Slider 
                        id="bell-volume" 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        value={[bellVolume]} 
                        onValueChange={value => setBellVolume(value[0])} 
                        className="w-full" 
                        aria-label="Adjust bell volume" 
                      />
                    </div>

                    {/* Bell Sound */}
                    <div className="flex items-center justify-between space-x-3 p-4 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border-2 border-[#d4a574] dark:border-amber-700">
                      <Label className="font-cormorant text-xl font-semibold">
                        Bell sound
                      </Label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="font-cinzel shadow-md hover:shadow-lg transition-all hover:scale-[1.02]" 
                        onClick={() => toggleAudio({ 
                          audioUrl: "/audio/short-call.mp3", 
                          traditionName: "Call", 
                          type: 'prayer', 
                          volume: bellVolume 
                        })} 
                        aria-label="Preview bell call sound"
                      >
                        <Volume2 className="w-4 h-4 mr-2" />
                        {isPlaying && currentAudioUrl === "/audio/short-call.mp3" ? "Stop" : "Listen"}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Prayer Reminder Section */}
              <AccordionItem value="prayer-reminder" className="border-none">
                <AccordionTrigger className="bg-[#FAF8F3] dark:bg-amber-950/30 hover:bg-[#F5F1E8] dark:hover:bg-amber-900/40 border-2 border-[#d4a574] dark:border-amber-700 rounded-lg px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md data-[state=open]:bg-white dark:data-[state=open]:bg-background data-[state=open]:rounded-b-none data-[state=open]:border-b-0 [&[data-state=open]>svg]:rotate-180">
                  <div className="flex items-center gap-3 font-cormorant text-3xl font-bold text-foreground">
                    Prayer Reminder
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-white dark:bg-background border-2 border-t-0 border-[#d4a574] dark:border-amber-700 rounded-b-lg p-5 animate-accordion-down">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="space-y-4 p-5 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border-2 border-[#d4a574] dark:border-amber-700">
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold font-cormorant text-foreground">
                          Enable reminder
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-cormorant text-muted-foreground">OFF</span>
                          <Switch 
                            checked={reminderEnabled} 
                            onCheckedChange={setReminderEnabled} 
                            aria-label="Enable prayer reminder" 
                          />
                          <span className="text-sm font-cormorant text-muted-foreground">ON</span>
                        </div>
                      </div>
                      
                      {reminderEnabled && (
                        <>
                          {/* Reminder Timing */}
                          <div className="space-y-3 pt-4 border-t border-amber-300/50 dark:border-amber-700/50">
                            <Label className="font-cormorant text-lg font-semibold text-foreground">
                              Reminder Timing
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                              {[5, 10, 15, 20].map((minutes) => (
                                <button
                                  key={minutes}
                                  onClick={() => setReminderMinutes(minutes)}
                                  className={`p-3 rounded-lg border-2 font-cormorant text-base font-semibold transition-all ${
                                    reminderMinutes === minutes
                                      ? 'bg-primary text-primary-foreground border-primary'
                                      : 'bg-white/50 dark:bg-slate-800/30 border-amber-200/30 dark:border-amber-800/20 hover:border-primary'
                                  }`}
                                >
                                  {minutes} min
                                </button>
                              ))}
                            </div>
                            <p className="text-sm font-cormorant text-muted-foreground italic mt-2">
                              Get a notification {reminderMinutes} {reminderMinutes === 1 ? 'minute' : 'minutes'} before your prayer time
                            </p>
                          </div>

                          {/* Bell option */}
                          <div className="flex items-center justify-between pt-4 border-t border-amber-300/50 dark:border-amber-700/50">
                            <Label className="font-cormorant text-lg font-semibold text-foreground">
                              With bell sound
                            </Label>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-cormorant text-muted-foreground">OFF</span>
                              <Switch 
                                checked={reminderWithBell} 
                                onCheckedChange={setReminderWithBell} 
                                aria-label="Enable bell sound for reminder" 
                              />
                              <span className="text-sm font-cormorant text-muted-foreground">ON</span>
                            </div>
                          </div>

                          {/* Additional notification slider */}
                          <div className="space-y-3 pt-4 border-t border-amber-300/50 dark:border-amber-700/50">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="additional-notification" className="font-cormorant text-lg font-semibold text-foreground">
                                Additional Notification
                              </Label>
                              {additionalNotification > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setAdditionalNotification(0)}
                                  className="h-8 px-2 text-xs"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              )}
                            </div>
                            {additionalNotification === 0 ? (
                              <p className="text-sm font-cormorant text-muted-foreground italic">
                                No additional notification
                              </p>
                            ) : (
                              <p className="text-sm font-cormorant text-muted-foreground italic">
                                Get notified {additionalNotification} {additionalNotification === 1 ? 'minute' : 'minutes'} before your prayer time
                              </p>
                            )}
                            <Slider 
                              id="additional-notification" 
                              min={0} 
                              max={30} 
                              step={1} 
                              value={[additionalNotification]} 
                              onValueChange={value => setAdditionalNotification(value[0])} 
                              className="w-full" 
                              aria-label="Set additional notification time in minutes" 
                            />
                          </div>
                        </>
                      )}
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
                  The sound of bells has called people to prayer for centuries. Share this app with your community and strengthen your shared spiritual journey.
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
  export default PrayerTimes;