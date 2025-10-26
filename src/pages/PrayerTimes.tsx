import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { PrayerTimesSelector } from "@/components/PrayerTimesSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Clock, Sun, Moon, Volume2, BellRing } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const [morningReminderMinutes, setMorningReminderMinutes] = useState<string>(() => {
    return localStorage.getItem("morningReminderMinutes") || "5";
  });
  const [eveningReminderMinutes, setEveningReminderMinutes] = useState<string>(() => {
    return localStorage.getItem("eveningReminderMinutes") || "5";
  });
  const [morningBellVolume, setMorningBellVolume] = useState<number>(() => {
    const saved = localStorage.getItem("morningBellVolume");
    return saved ? parseFloat(saved) : 0.7;
  });
  const [eveningBellVolume, setEveningBellVolume] = useState<number>(() => {
    const saved = localStorage.getItem("eveningBellVolume");
    return saved ? parseFloat(saved) : 0.7;
  });
  
  const { toast } = useToast();
  const { toggleAudio, isPlaying, currentAudioUrl } = useAudioPlayer();
  
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
    localStorage.setItem("morningReminderMinutes", morningReminderMinutes);
    localStorage.setItem("eveningReminderMinutes", eveningReminderMinutes);
    localStorage.setItem("morningBellVolume", morningBellVolume.toString());
    localStorage.setItem("eveningBellVolume", eveningBellVolume.toString());
    localStorage.setItem("prayersConfigured", "true");
    
    toast({
      title: "Prayer settings saved",
      description: "Your prayer times have been saved successfully"
    });
  };
  
  const handlePrayerTimesSelect = (times: PrayerTime[]) => {
    toast({
      title: "Prayer times applied",
      description: `${times.length} prayer times have been configured for the bells`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 space-y-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/90 dark:to-orange-950/90 rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-800/30 p-8 md:p-12 relative">
            <img src={churchBellTransparent} alt="Church bell" className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
            <img src={churchBellNew} alt="Church bell" className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-cinzel font-bold text-foreground text-center leading-tight">
              When should the Bells<br />call you to prayer?
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <PrayerTimesSelector 
            selectedTradition={selectedPrayerTradition} 
            onTraditionSelect={setSelectedPrayerTradition} 
            onTimesSelect={handlePrayerTimesSelect} 
          />

          {/* Accordion Layout */}
          <Accordion type="single" collapsible defaultValue="prayer-times" className="space-y-4">
            {/* Set Your Prayer Times Section */}
            <AccordionItem value="prayer-times" className="border-none">
              <AccordionTrigger className="bg-[#FAF8F3] dark:bg-amber-950/30 hover:bg-[#F5F1E8] dark:hover:bg-amber-900/40 border-2 border-[#d4a574] dark:border-amber-700 rounded-lg px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md data-[state=open]:bg-white dark:data-[state=open]:bg-background data-[state=open]:rounded-b-none data-[state=open]:border-b-0 [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-3 font-cormorant text-2xl font-semibold text-foreground">
                  <Clock className="w-6 h-6 text-primary" />
                  Set Your Prayer Times
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white dark:bg-background border-2 border-t-0 border-[#d4a574] dark:border-amber-700 rounded-b-lg p-5 animate-accordion-down">
                <div className="space-y-6">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4 group">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-2xl font-bold font-cormorant">
                          <Sun className="w-5 h-5 text-amber transition-transform group-hover:scale-110 group-hover:rotate-12" />
                          Morning Prayer
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-cormorant text-muted-foreground">OFF</span>
                          <Switch 
                            checked={morningPrayerEnabled} 
                            onCheckedChange={setMorningPrayerEnabled}
                            aria-label="Enable morning prayer" 
                          />
                          <span className="text-sm font-cormorant text-muted-foreground">ON</span>
                        </div>
                      </div>
                      <Label htmlFor="morning-prayer-name" className="text-base font-cormorant text-muted-foreground">
                        Prayer name (optional)
                      </Label>
                      <Input
                        id="morning-prayer-name" 
                        type="text" 
                        value={morningPrayerName} 
                        onChange={e => setMorningPrayerName(e.target.value)} 
                        placeholder="Morning Prayer" 
                        className="w-full text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors" 
                        aria-label="Name your morning prayer" 
                      />
                      <p className="text-lg text-foreground font-cormorant font-semibold italic mt-1">
                        Suggestions: Matins, Lauds or Prime
                      </p>
                      <div className="relative">
                        <Input 
                          id="morning-prayer-time" 
                          type="time" 
                          step="900" 
                          value={morningPrayerTime} 
                          onChange={e => {
                            setMorningPrayerTime(e.target.value);
                            setTimeError("");
                          }} 
                          className="w-full text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors cursor-pointer" 
                          aria-label="Select morning prayer time" 
                          required 
                        />
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="space-y-4 group">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-2xl font-bold font-cormorant">
                          <Moon className="w-5 h-5 text-primary transition-transform group-hover:scale-110 group-hover:-rotate-12" />
                          Evening Prayer
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-cormorant text-muted-foreground">OFF</span>
                          <Switch 
                            checked={eveningPrayerEnabled} 
                            onCheckedChange={setEveningPrayerEnabled}
                            aria-label="Enable evening prayer" 
                          />
                          <span className="text-sm font-cormorant text-muted-foreground">ON</span>
                        </div>
                      </div>
                      <Label htmlFor="evening-prayer-name" className="text-base font-cormorant text-muted-foreground">
                        Prayer name (optional)
                      </Label>
                      <Input
                        id="evening-prayer-name" 
                        type="text" 
                        value={eveningPrayerName} 
                        onChange={e => setEveningPrayerName(e.target.value)} 
                        placeholder="Evening Prayer" 
                        className="w-full text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors" 
                        aria-label="Name your evening prayer" 
                      />
                      <p className="text-lg text-foreground font-cormorant font-semibold italic mt-1">
                        Suggestions: Vespers or Compline
                      </p>
                      <div className="relative">
                        <Input 
                          id="evening-prayer-time" 
                          type="time" 
                          step="900" 
                          value={eveningPrayerTime} 
                          onChange={e => {
                            setEveningPrayerTime(e.target.value);
                            setTimeError("");
                          }} 
                          className="w-full text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors cursor-pointer" 
                          aria-label="Select evening prayer time" 
                          required 
                        />
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  
                  {timeError && (
                    <p className="text-sm text-destructive font-cormorant italic text-center animate-fade-in-up">
                      {timeError}
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Bell Call Sound Section */}
            <AccordionItem value="bell-sound" className="border-none">
              <AccordionTrigger className="bg-[#FAF8F3] dark:bg-amber-950/30 hover:bg-[#F5F1E8] dark:hover:bg-amber-900/40 border-2 border-[#d4a574] dark:border-amber-700 rounded-lg px-5 py-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md data-[state=open]:bg-white dark:data-[state=open]:bg-background data-[state=open]:rounded-b-none data-[state=open]:border-b-0 [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-3 font-cormorant text-2xl font-semibold text-foreground">
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
                      <Slider 
                        id="morning-bell-volume"
                        min={0} 
                        max={1} 
                        step={0.01} 
                        value={[morningBellVolume]} 
                        onValueChange={(value) => setMorningBellVolume(value[0])}
                        className="w-full"
                        aria-label="Adjust morning bell volume"
                      />
                    </div>
                    
                    <RadioGroup
                      value={morningCallType} 
                      onValueChange={setMorningCallType} 
                      className="space-y-4" 
                      aria-label="Choisir la durée de l'appel pour la prière du matin"
                    >
                      <div className="flex items-center justify-between space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
                        <div className="flex items-center space-x-3 flex-1">
                          <RadioGroupItem value="short" id="morning-short-call" aria-label="Appel court du matin" />
                          <Label htmlFor="morning-short-call" className="cursor-pointer font-cormorant text-xl font-semibold">
                            Short Call (~15 seconds)
                          </Label>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="font-cinzel shadow-md hover:shadow-lg transition-all hover:scale-[1.02]" 
                          onClick={() => toggleAudio("/audio/summoning-bell.mp3", "Short Call", morningBellVolume)} 
                          aria-label="Preview short bell call sound"
                        >
                          <Volume2 className="w-4 h-4 mr-2" />
                          {isPlaying && currentAudioUrl === "/audio/summoning-bell.mp3" ? "Stop" : "Listen"}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
                        <div className="flex items-center space-x-3 flex-1">
                          <RadioGroupItem value="long" id="morning-long-call" aria-label="Appel long du matin" />
                          <Label htmlFor="morning-long-call" className="cursor-pointer font-cormorant text-xl font-semibold">
                            Long Call (~30 seconds)
                          </Label>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="font-cinzel shadow-md hover:shadow-lg transition-all hover:scale-[1.02]" 
                          onClick={() => toggleAudio("/audio/cathedral-bell.mp3", "Long Call", morningBellVolume)} 
                          aria-label="Preview long bell call sound"
                        >
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
                    <div className="space-y-3 p-4 rounded-lg border-2 border-border bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="evening-bell-volume" className="flex items-center gap-2 font-cormorant text-lg font-semibold text-foreground">
                          <Volume2 className="w-5 h-5 text-primary" />
                          Volume
                        </Label>
                        <span className="font-cormorant text-base text-muted-foreground">{Math.round(eveningBellVolume * 100)}%</span>
                      </div>
                      <Slider 
                        id="evening-bell-volume"
                        min={0} 
                        max={1} 
                        step={0.01} 
                        value={[eveningBellVolume]} 
                        onValueChange={(value) => setEveningBellVolume(value[0])}
                        className="w-full"
                        aria-label="Adjust evening bell volume"
                      />
                    </div>
                    
                    <RadioGroup
                      value={eveningCallType} 
                      onValueChange={setEveningCallType} 
                      className="space-y-4" 
                      aria-label="Choisir la durée de l'appel pour la prière du soir"
                    >
                      <div className="flex items-center justify-between space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
                        <div className="flex items-center space-x-3 flex-1">
                          <RadioGroupItem value="short" id="evening-short-call" aria-label="Appel court du soir" />
                          <Label htmlFor="evening-short-call" className="cursor-pointer font-cormorant text-xl font-semibold">
                            Short Call (~15 seconds)
                          </Label>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="font-cinzel shadow-md hover:shadow-lg transition-all hover:scale-[1.02]" 
                          onClick={() => toggleAudio("/audio/summoning-bell.mp3", "Short Call", eveningBellVolume)} 
                          aria-label="Preview short bell call sound"
                        >
                          <Volume2 className="w-4 h-4 mr-2" />
                          {isPlaying && currentAudioUrl === "/audio/summoning-bell.mp3" ? "Stop" : "Listen"}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
                        <div className="flex items-center space-x-3 flex-1">
                          <RadioGroupItem value="long" id="evening-long-call" aria-label="Appel long du soir" />
                          <Label htmlFor="evening-long-call" className="cursor-pointer font-cormorant text-xl font-semibold">
                            Long Call (~30 seconds)
                          </Label>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="font-cinzel shadow-md hover:shadow-lg transition-all hover:scale-[1.02]" 
                          onClick={() => toggleAudio("/audio/cathedral-bell.mp3", "Long Call", eveningBellVolume)} 
                          aria-label="Preview long bell call sound"
                        >
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
                <div className="flex items-center gap-3 font-cormorant text-2xl font-semibold text-foreground">
                  <BellRing className="w-6 h-6 text-primary" />
                  Prayer Reminder
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white dark:bg-background border-2 border-t-0 border-[#d4a574] dark:border-amber-700 rounded-b-lg p-5 animate-accordion-down">
                <div className="space-y-6">
                  <div className="grid grid-cols-[auto_1fr] gap-6 items-center">
                    {/* Header Row */}
                    <div className="font-cormorant text-xl font-semibold text-foreground">Prayer Time</div>
                    <div className="font-cormorant text-xl font-semibold text-foreground">Reminder</div>
                    
                    {/* Morning Prayer Row */}
                    <div className="flex items-center gap-2 font-cormorant text-xl text-foreground">
                      <Sun className="w-5 h-5 text-amber" />
                      {morningPrayerName}
                    </div>
                    <RadioGroup 
                      value={morningReminderMinutes} 
                      onValueChange={setMorningReminderMinutes} 
                      className="flex gap-4" 
                      aria-label="Choisir le rappel pour la prière du matin"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5" id="morning-reminder-5" aria-label="5 minutes avant" />
                        <Label htmlFor="morning-reminder-5" className="cursor-pointer font-cormorant text-lg">
                          5min before
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="10" id="morning-reminder-10" aria-label="10 minutes avant" />
                        <Label htmlFor="morning-reminder-10" className="cursor-pointer font-cormorant text-lg">
                          10min
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="15" id="morning-reminder-15" aria-label="15 minutes avant" />
                        <Label htmlFor="morning-reminder-15" className="cursor-pointer font-cormorant text-lg">
                          15min
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {/* Evening Prayer Row */}
                    <div className="flex items-center gap-2 font-cormorant text-xl text-foreground">
                      <Moon className="w-5 h-5 text-primary" />
                      {eveningPrayerName}
                    </div>
                    <RadioGroup 
                      value={eveningReminderMinutes} 
                      onValueChange={setEveningReminderMinutes} 
                      className="flex gap-4" 
                      aria-label="Choisir le rappel pour la prière du soir"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5" id="evening-reminder-5" aria-label="5 minutes avant" />
                        <Label htmlFor="evening-reminder-5" className="cursor-pointer font-cormorant text-lg">
                          5min before
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="10" id="evening-reminder-10" aria-label="10 minutes avant" />
                        <Label htmlFor="evening-reminder-10" className="cursor-pointer font-cormorant text-lg">
                          10min
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="15" id="evening-reminder-15" aria-label="15 minutes avant" />
                        <Label htmlFor="evening-reminder-15" className="cursor-pointer font-cormorant text-lg">
                          15min
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Sticky Save Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent py-4 px-4 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={handleSave}
              className="w-full text-3xl font-cormorant py-8 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 border-amber-400/30"
              size="lg"
              aria-label="Save prayer settings"
            >
              Save Prayer Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;
