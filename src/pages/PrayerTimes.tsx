import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { PrayerTimesSelector } from "@/components/PrayerTimesSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Clock, Sun, Moon, Volume2, BellRing, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface PrayerTime {
  name: string;
  time: string;
  description: string;
}
const PrayerTimes = () => {
  const [selectedPrayerTradition, setSelectedPrayerTradition] = useState<string>(() => {
    return localStorage.getItem("prayerTradition") || "Roman Catholic";
  });
  const [morningPrayerTime, setMorningPrayerTime] = useState<string>(() => {
    return localStorage.getItem("morningPrayerTime") || "06:00";
  });
  const [eveningPrayerTime, setEveningPrayerTime] = useState<string>(() => {
    return localStorage.getItem("eveningPrayerTime") || "18:00";
  });
  const [morningPrayerName, setMorningPrayerName] = useState<string>(() => {
    return localStorage.getItem("morningPrayerName") || "Morning Prayer";
  });
  const [eveningPrayerName, setEveningPrayerName] = useState<string>(() => {
    return localStorage.getItem("eveningPrayerName") || "Evening Prayer";
  });
  const [morningPrayerEnabled, setMorningPrayerEnabled] = useState<boolean>(() => {
    return localStorage.getItem("morningPrayerEnabled") === "true";
  });
  const [eveningPrayerEnabled, setEveningPrayerEnabled] = useState<boolean>(() => {
    return localStorage.getItem("eveningPrayerEnabled") === "true";
  });
  const [timeError, setTimeError] = useState<string>("");
  const [morningCallType, setMorningCallType] = useState<string>(() => {
    return localStorage.getItem("morningCallType") || "short";
  });
  const [eveningCallType, setEveningCallType] = useState<string>(() => {
    return localStorage.getItem("eveningCallType") || "short";
  });
  const [morningReminders, setMorningReminders] = useState<string[]>(() => {
    const saved = localStorage.getItem("morningReminders");
    return saved ? JSON.parse(saved) : ["5"];
  });
  const [eveningReminders, setEveningReminders] = useState<string[]>(() => {
    const saved = localStorage.getItem("eveningReminders");
    return saved ? JSON.parse(saved) : ["5"];
  });
  const [morningBellVolume, setMorningBellVolume] = useState<number>(() => {
    const saved = localStorage.getItem("morningBellVolume");
    return saved ? parseFloat(saved) : 0.7;
  });
  const [eveningBellVolume, setEveningBellVolume] = useState<number>(() => {
    const saved = localStorage.getItem("eveningBellVolume");
    return saved ? parseFloat(saved) : 0.7;
  });
  const {
    toast
  } = useToast();
  const {
    toggleAudio,
    isPlaying,
    currentAudioUrl
  } = useAudioPlayer();

  // Track initial state to detect changes
  const [initialState, setInitialState] = useState({
    prayerTradition: selectedPrayerTradition,
    morningPrayerTime,
    eveningPrayerTime,
    morningPrayerName,
    eveningPrayerName,
    morningPrayerEnabled,
    eveningPrayerEnabled,
    morningCallType,
    eveningCallType,
    morningReminders: JSON.stringify(morningReminders),
    eveningReminders: JSON.stringify(eveningReminders),
    morningBellVolume,
    eveningBellVolume
  });

  // Check if there are any changes
  const hasChanges = selectedPrayerTradition !== initialState.prayerTradition || morningPrayerTime !== initialState.morningPrayerTime || eveningPrayerTime !== initialState.eveningPrayerTime || morningPrayerName !== initialState.morningPrayerName || eveningPrayerName !== initialState.eveningPrayerName || morningPrayerEnabled !== initialState.morningPrayerEnabled || eveningPrayerEnabled !== initialState.eveningPrayerEnabled || morningCallType !== initialState.morningCallType || eveningCallType !== initialState.eveningCallType || JSON.stringify(morningReminders) !== initialState.morningReminders || JSON.stringify(eveningReminders) !== initialState.eveningReminders || morningBellVolume !== initialState.morningBellVolume || eveningBellVolume !== initialState.eveningBellVolume;
  const handleSave = () => {
    localStorage.setItem("prayerTradition", selectedPrayerTradition);
    localStorage.setItem("morningPrayerTime", morningPrayerTime);
    localStorage.setItem("eveningPrayerTime", eveningPrayerTime);
    localStorage.setItem("morningPrayerName", morningPrayerName);
    localStorage.setItem("eveningPrayerName", eveningPrayerName);
    localStorage.setItem("morningPrayerEnabled", String(morningPrayerEnabled));
    localStorage.setItem("eveningPrayerEnabled", String(eveningPrayerEnabled));
    localStorage.setItem("morningCallType", morningCallType);
    localStorage.setItem("eveningCallType", eveningCallType);
    localStorage.setItem("morningReminders", JSON.stringify(morningReminders));
    localStorage.setItem("eveningReminders", JSON.stringify(eveningReminders));
    localStorage.setItem("morningBellVolume", morningBellVolume.toString());
    localStorage.setItem("eveningBellVolume", eveningBellVolume.toString());
    localStorage.setItem("prayersConfigured", "true");

    // Update initial state after saving
    setInitialState({
      prayerTradition: selectedPrayerTradition,
      morningPrayerTime,
      eveningPrayerTime,
      morningPrayerName,
      eveningPrayerName,
      morningPrayerEnabled,
      eveningPrayerEnabled,
      morningCallType,
      eveningCallType,
      morningReminders: JSON.stringify(morningReminders),
      eveningReminders: JSON.stringify(eveningReminders),
      morningBellVolume,
      eveningBellVolume
    });
    toast({
      title: "Prayer settings saved",
      description: "Your prayer times have been saved successfully"
    });
  };
  const addMorningReminder = () => {
    if (morningReminders.length < 6) {
      setMorningReminders([...morningReminders, "5"]);
    }
  };
  const removeMorningReminder = (index: number) => {
    setMorningReminders(morningReminders.filter((_, i) => i !== index));
  };
  const updateMorningReminder = (index: number, value: string) => {
    const updated = [...morningReminders];
    updated[index] = value;
    setMorningReminders(updated);
  };
  const addEveningReminder = () => {
    if (eveningReminders.length < 6) {
      setEveningReminders([...eveningReminders, "5"]);
    }
  };
  const removeEveningReminder = (index: number) => {
    setEveningReminders(eveningReminders.filter((_, i) => i !== index));
  };
  const updateEveningReminder = (index: number, value: string) => {
    const updated = [...eveningReminders];
    updated[index] = value;
    setEveningReminders(updated);
  };
  const handlePrayerTimesSelect = (times: PrayerTime[]) => {
    toast({
      title: "Prayer times applied",
      description: `${times.length} prayer times have been configured for the bells`
    });
  };
  return <div className="min-h-screen bg-gradient-subtle pb-24">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 space-y-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/90 dark:to-orange-950/90 rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-800/30 px-8 pt-8 pb-4 md:px-12 md:pt-12 md:pb-6 relative">
            <img src={churchBellTransparent} alt="Church bell" className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
            <img src={churchBellNew} alt="Church bell" className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-cinzel font-bold text-foreground text-center leading-none">Set your Prayer Bells</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Accordion Layout */}
          <Accordion type="single" collapsible defaultValue="prayer-times" className="space-y-4">
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
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4 group p-5 rounded-lg border-2 border-[#d4a574] dark:border-amber-700 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-2xl font-bold font-cormorant">
                          <Sun className="w-5 h-5 text-amber transition-transform group-hover:scale-110 group-hover:rotate-12" />
                          Morning Prayer
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-cormorant text-muted-foreground">OFF</span>
                          <Switch checked={morningPrayerEnabled} onCheckedChange={setMorningPrayerEnabled} aria-label="Enable morning prayer" />
                          <span className="text-sm font-cormorant text-muted-foreground">ON</span>
                        </div>
                      </div>
                      <Label htmlFor="morning-prayer-name" className="text-base font-cormorant text-muted-foreground">
                        Prayer name (optional)
                      </Label>
                      <Input id="morning-prayer-name" type="text" value={morningPrayerName} onChange={e => setMorningPrayerName(e.target.value)} placeholder="Morning Prayer" className="w-full text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors" aria-label="Name your morning prayer" />
                      <Input id="morning-prayer-time" type="time" step="900" value={morningPrayerTime} onChange={e => {
                      setMorningPrayerTime(e.target.value);
                      setTimeError("");
                    }} className="w-44 text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors cursor-pointer" aria-label="Select morning prayer time" required />
                    </div>
                    
                    <div className="space-y-4 group p-5 rounded-lg border-2 border-[#d4a574] dark:border-amber-700 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-2xl font-bold font-cormorant">
                          <Moon className="w-5 h-5 text-primary transition-transform group-hover:scale-110 group-hover:-rotate-12" />
                          Evening Prayer
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-cormorant text-muted-foreground">OFF</span>
                          <Switch checked={eveningPrayerEnabled} onCheckedChange={setEveningPrayerEnabled} aria-label="Enable evening prayer" />
                          <span className="text-sm font-cormorant text-muted-foreground">ON</span>
                        </div>
                      </div>
                      <Label htmlFor="evening-prayer-name" className="text-base font-cormorant text-muted-foreground">
                        Prayer name (optional)
                      </Label>
                      <Input id="evening-prayer-name" type="text" value={eveningPrayerName} onChange={e => setEveningPrayerName(e.target.value)} placeholder="Evening Prayer" className="w-full text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors" aria-label="Name your evening prayer" />
                      <Input id="evening-prayer-time" type="time" step="900" value={eveningPrayerTime} onChange={e => {
                      setEveningPrayerTime(e.target.value);
                      setTimeError("");
                    }} className="w-44 text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors cursor-pointer" aria-label="Select evening prayer time" required />
                    </div>
                  </div>
                  
                  {timeError && <p className="text-sm text-destructive font-cormorant italic text-center animate-fade-in-up">
                      {timeError}
                    </p>}
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
                <div className="space-y-6">
                  <p className="font-cormorant text-xl text-foreground italic mb-2">
                    Configure bell sounds for each prayer time
                  </p>
                  
                  {/* Morning Prayer Bell */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-cormorant text-2xl font-semibold text-foreground">
                      <Sun className="w-5 h-5 text-amber" />
                      {morningPrayerName}
                    </h3>
                    
                    {/* Morning Volume Control */}
                    <div className="space-y-3 p-4 rounded-lg border-2 border-border bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="morning-bell-volume" className="flex items-center gap-2 font-cormorant text-lg font-semibold text-foreground">
                          <Volume2 className="w-5 h-5 text-amber" />
                          Volume
                        </Label>
                        <span className="font-cormorant text-base text-muted-foreground">{Math.round(morningBellVolume * 100)}%</span>
                      </div>
                      <Slider id="morning-bell-volume" min={0} max={1} step={0.01} value={[morningBellVolume]} onValueChange={value => setMorningBellVolume(value[0])} className="w-full" aria-label="Adjust morning bell volume" />
                    </div>
                    
                    <RadioGroup value={morningCallType} onValueChange={setMorningCallType} className="space-y-4" aria-label="Choisir la durée de l'appel pour la prière du matin">
                      <div className="flex items-center justify-between space-x-3 p-4 rounded-lg border-2 border-[#d4a574] dark:border-amber-700 hover:border-primary/50 transition-colors">
                        <div className="flex items-center space-x-3 flex-1">
                          <RadioGroupItem value="short" id="morning-short-call" aria-label="Appel court du matin" />
                          <Label htmlFor="morning-short-call" className="cursor-pointer font-cormorant text-xl font-semibold">
                            Short Call (~15 seconds)
                          </Label>
                        </div>
                        <Button variant="outline" size="sm" className="font-cinzel shadow-md hover:shadow-lg transition-all hover:scale-[1.02]" onClick={() => toggleAudio("/audio/summoning-bell.mp3", "Short Call", morningBellVolume)} aria-label="Preview short bell call sound">
                          <Volume2 className="w-4 h-4 mr-2" />
                          {isPlaying && currentAudioUrl === "/audio/summoning-bell.mp3" ? "Stop" : "Listen"}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between space-x-3 p-4 rounded-lg border-2 border-[#d4a574] dark:border-amber-700 hover:border-primary/50 transition-colors">
                        <div className="flex items-center space-x-3 flex-1">
                          <RadioGroupItem value="long" id="morning-long-call" aria-label="Appel long du matin" />
                          <Label htmlFor="morning-long-call" className="cursor-pointer font-cormorant text-xl font-semibold">
                            Long Call (~30 seconds)
                          </Label>
                        </div>
                        <Button variant="outline" size="sm" className="font-cinzel shadow-md hover:shadow-lg transition-all hover:scale-[1.02]" onClick={() => toggleAudio("/audio/cathedral-bell.mp3", "Long Call", morningBellVolume)} aria-label="Preview long bell call sound">
                          <Volume2 className="w-4 h-4 mr-2" />
                          {isPlaying && currentAudioUrl === "/audio/cathedral-bell.mp3" ? "Stop" : "Listen"}
                        </Button>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Evening Prayer Bell */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-cormorant text-2xl font-semibold text-foreground">
                      <Moon className="w-5 h-5 text-primary" />
                      {eveningPrayerName}
                    </h3>
                    
                    {/* Evening Volume Control */}
                    <div className="space-y-3 p-4 rounded-lg border-2 border-border bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="evening-bell-volume" className="flex items-center gap-2 font-cormorant text-lg font-semibold text-foreground">
                          <Volume2 className="w-5 h-5 text-primary" />
                          Volume
                        </Label>
                        <span className="font-cormorant text-base text-muted-foreground">{Math.round(eveningBellVolume * 100)}%</span>
                      </div>
                      <Slider id="evening-bell-volume" min={0} max={1} step={0.01} value={[eveningBellVolume]} onValueChange={value => setEveningBellVolume(value[0])} className="w-full" aria-label="Adjust evening bell volume" />
                    </div>
                    
                    <RadioGroup value={eveningCallType} onValueChange={setEveningCallType} className="space-y-4" aria-label="Choisir la durée de l'appel pour la prière du soir">
                      <div className="flex items-center justify-between space-x-3 p-4 rounded-lg border-2 border-[#d4a574] dark:border-amber-700 hover:border-primary/50 transition-colors">
                        <div className="flex items-center space-x-3 flex-1">
                          <RadioGroupItem value="short" id="evening-short-call" aria-label="Appel court du soir" />
                          <Label htmlFor="evening-short-call" className="cursor-pointer font-cormorant text-xl font-semibold">
                            Short Call (~15 seconds)
                          </Label>
                        </div>
                        <Button variant="outline" size="sm" className="font-cinzel shadow-md hover:shadow-lg transition-all hover:scale-[1.02]" onClick={() => toggleAudio("/audio/summoning-bell.mp3", "Short Call", eveningBellVolume)} aria-label="Preview short bell call sound">
                          <Volume2 className="w-4 h-4 mr-2" />
                          {isPlaying && currentAudioUrl === "/audio/summoning-bell.mp3" ? "Stop" : "Listen"}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between space-x-3 p-4 rounded-lg border-2 border-[#d4a574] dark:border-amber-700 hover:border-primary/50 transition-colors">
                        <div className="flex items-center space-x-3 flex-1">
                          <RadioGroupItem value="long" id="evening-long-call" aria-label="Appel long du soir" />
                          <Label htmlFor="evening-long-call" className="cursor-pointer font-cormorant text-xl font-semibold">
                            Long Call (~30 seconds)
                          </Label>
                        </div>
                        <Button variant="outline" size="sm" className="font-cinzel shadow-md hover:shadow-lg transition-all hover:scale-[1.02]" onClick={() => toggleAudio("/audio/cathedral-bell.mp3", "Long Call", eveningBellVolume)} aria-label="Preview long bell call sound">
                          <Volume2 className="w-4 h-4 mr-2" />
                          {isPlaying && currentAudioUrl === "/audio/cathedral-bell.mp3" ? "Stop" : "Listen"}
                        </Button>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Prayer Reminder Section */}
            <AccordionItem value="prayer-reminder" className="border-none">
              <AccordionTrigger className="bg-[#FAF8F3] dark:bg-amber-950/30 hover:bg-[#F5F1E8] dark:hover:bg-amber-900/40 border-2 border-[#d4a574] dark:border-amber-700 rounded-lg px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md data-[state=open]:bg-white dark:data-[state=open]:bg-background data-[state=open]:rounded-b-none data-[state=open]:border-b-0 [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-3 font-cormorant text-3xl font-bold text-foreground">
                  <BellRing className="w-6 h-6 text-primary" />
                  Prayer Reminder
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white dark:bg-background border-2 border-t-0 border-[#d4a574] dark:border-amber-700 rounded-b-lg p-5 animate-accordion-down">
                <div className="space-y-8">
                  {/* Morning Prayer Reminders */}
                  <div className="space-y-4 p-5 rounded-lg border-2 border-[#d4a574] dark:border-amber-700 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-cormorant text-2xl font-semibold text-foreground">
                        <Sun className="w-5 h-5 text-amber" />
                        {morningPrayerName}
                      </h3>
                      <Button variant="outline" size="sm" onClick={addMorningReminder} disabled={morningReminders.length >= 6} className="font-cormorant">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Reminder
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {morningReminders.map((minutes, index) => <div key={index} className="flex items-center gap-3">
                          <Label className="font-cormorant text-lg text-muted-foreground min-w-[120px]">
                            Reminder {index + 1}:
                          </Label>
                          <Select value={minutes} onValueChange={value => updateMorningReminder(index, value)}>
                            <SelectTrigger className="w-[180px] font-cormorant text-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5" className="font-cormorant text-lg">5 min before</SelectItem>
                              <SelectItem value="10" className="font-cormorant text-lg">10 min before</SelectItem>
                              <SelectItem value="15" className="font-cormorant text-lg">15 min before</SelectItem>
                              <SelectItem value="20" className="font-cormorant text-lg">20 min before</SelectItem>
                              <SelectItem value="25" className="font-cormorant text-lg">25 min before</SelectItem>
                              <SelectItem value="30" className="font-cormorant text-lg">30 min before</SelectItem>
                            </SelectContent>
                          </Select>
                          {morningReminders.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeMorningReminder(index)} className="text-destructive hover:text-destructive">
                              <X className="w-4 h-4" />
                            </Button>}
                        </div>)}
                    </div>
                  </div>

                  {/* Evening Prayer Reminders */}
                  <div className="space-y-4 p-5 rounded-lg border-2 border-[#d4a574] dark:border-amber-700 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-cormorant text-2xl font-semibold text-foreground">
                        <Moon className="w-5 h-5 text-primary" />
                        {eveningPrayerName}
                      </h3>
                      <Button variant="outline" size="sm" onClick={addEveningReminder} disabled={eveningReminders.length >= 6} className="font-cormorant">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Reminder
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {eveningReminders.map((minutes, index) => <div key={index} className="flex items-center gap-3">
                          <Label className="font-cormorant text-lg text-muted-foreground min-w-[120px]">
                            Reminder {index + 1}:
                          </Label>
                          <Select value={minutes} onValueChange={value => updateEveningReminder(index, value)}>
                            <SelectTrigger className="w-[180px] font-cormorant text-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5" className="font-cormorant text-lg">5 min before</SelectItem>
                              <SelectItem value="10" className="font-cormorant text-lg">10 min before</SelectItem>
                              <SelectItem value="15" className="font-cormorant text-lg">15 min before</SelectItem>
                              <SelectItem value="20" className="font-cormorant text-lg">20 min before</SelectItem>
                              <SelectItem value="25" className="font-cormorant text-lg">25 min before</SelectItem>
                              <SelectItem value="30" className="font-cormorant text-lg">30 min before</SelectItem>
                            </SelectContent>
                          </Select>
                          {eveningReminders.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeEveningReminder(index)} className="text-destructive hover:text-destructive">
                              <X className="w-4 h-4" />
                            </Button>}
                        </div>)}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Save Button */}
          <div className="max-w-4xl mx-auto py-6">
            <Button onClick={handleSave} disabled={!hasChanges} className={`w-full text-3xl font-cormorant py-8 shadow-lg transition-all duration-300 border-2 ${hasChanges ? 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:shadow-xl hover:scale-[1.02] border-amber-400/30' : 'bg-muted text-muted-foreground border-border cursor-not-allowed'}`} size="lg" aria-label="Save prayer settings">
              Save Prayer Settings
            </Button>
          </div>
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