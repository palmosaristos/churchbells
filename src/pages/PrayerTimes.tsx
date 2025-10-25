import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { PrayerTimesSelector } from "@/components/PrayerTimesSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Clock, Sun, Moon, Bell, Volume2, BellRing } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";
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
  const [callType, setCallType] = useState<string>(() => {
    return localStorage.getItem("callType") || "short";
  });
  const [morningCallType, setMorningCallType] = useState<string>(() => {
    return localStorage.getItem("morningCallType") || "short";
  });
  const [eveningCallType, setEveningCallType] = useState<string>(() => {
    return localStorage.getItem("eveningCallType") || "short";
  });
  const [reminderMinutes, setReminderMinutes] = useState<string>(() => {
    return localStorage.getItem("reminderMinutes") || "5";
  });
  const [morningReminderMinutes, setMorningReminderMinutes] = useState<string>(() => {
    return localStorage.getItem("morningReminderMinutes") || "5";
  });
  const [eveningReminderMinutes, setEveningReminderMinutes] = useState<string>(() => {
    return localStorage.getItem("eveningReminderMinutes") || "5";
  });
  const {
    toast
  } = useToast();
  const {
    toggleAudio,
    isPlaying,
    currentAudioUrl
  } = useAudioPlayer();
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
  const validateAndApplyTimes = () => {
    // Convert times to comparable format
    const [morningHour, morningMinute] = morningPrayerTime.split(':').map(Number);
    const [eveningHour, eveningMinute] = eveningPrayerTime.split(':').map(Number);
    const morningMinutes = morningHour * 60 + morningMinute;
    const eveningMinutes = eveningHour * 60 + eveningMinute;
    if (eveningMinutes <= morningMinutes) {
      setTimeError("Evening prayer time must be after morning prayer time");
      toast({
        title: "Invalid Time Selection",
        description: "Evening prayer must be scheduled after morning prayer",
        variant: "destructive"
      });
      return;
    }
    setTimeError("");
    toast({
      title: "🔔 Prayer Times Configured",
      description: `${morningPrayerName}: ${morningPrayerTime} • ${eveningPrayerName}: ${eveningPrayerTime}`
    });
  };
  return <div className="min-h-screen bg-gradient-subtle">
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
          <PrayerTimesSelector selectedTradition={selectedPrayerTradition} onTraditionSelect={setSelectedPrayerTradition} onTimesSelect={handlePrayerTimesSelect} />

          {/* Custom Prayer Times */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 to-secondary/30 dark:from-amber-950/20 dark:to-secondary/10 border-2 border-amber-200/30 dark:border-amber-800/20 shadow-warm backdrop-blur-sm transition-all hover:shadow-xl hover:border-amber-300/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,180,255,0.08),transparent)] pointer-events-none" />
            
            <CardHeader className="space-y-3 relative">
              <CardTitle className="flex items-center gap-3 font-cormorant text-3xl">
                <Clock className="w-6 h-6 text-primary" />
                Set your prayer times
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-8 relative">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4 group">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="morning-prayer-name" className="flex items-center gap-2 text-2xl font-medium font-cormorant">
                      <Sun className="w-5 h-5 text-amber transition-transform group-hover:scale-110 group-hover:rotate-12" />
                      Morning Prayer <span className="text-base text-muted-foreground font-normal">(or name your prayer)</span>
                    </Label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={morningPrayerEnabled} onChange={e => setMorningPrayerEnabled(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" aria-label="Activer la prière du matin" />
                      <span className="text-sm font-cormorant text-muted-foreground">Enable</span>
                    </label>
                  </div>
                    <Input id="morning-prayer-name" type="text" value={morningPrayerName} onChange={e => setMorningPrayerName(e.target.value)} placeholder="Morning Prayer" className="w-full text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors" aria-label="Name your morning prayer" />
                    <p className="text-lg text-foreground font-cormorant italic mt-1">
                      Suggestions: Matins, Lauds or Prime
                    </p>
                  <div className="relative">
                    <Input id="morning-prayer-time" type="time" step="900" value={morningPrayerTime} onChange={e => {
                    setMorningPrayerTime(e.target.value);
                    setTimeError("");
                  }} className="w-full text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors cursor-pointer" aria-label="Select morning prayer time" required />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-4 group">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="evening-prayer-name" className="flex items-center gap-2 text-2xl font-medium font-cormorant">
                      <Moon className="w-5 h-5 text-primary transition-transform group-hover:scale-110 group-hover:-rotate-12" />
                      Evening Prayer <span className="text-base text-muted-foreground font-normal">(or name your prayer)</span>
                    </Label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={eveningPrayerEnabled} onChange={e => setEveningPrayerEnabled(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" aria-label="Activer la prière du soir" />
                      <span className="text-sm font-cormorant text-muted-foreground">Enable</span>
                    </label>
                  </div>
                  <Input id="evening-prayer-name" type="text" value={eveningPrayerName} onChange={e => setEveningPrayerName(e.target.value)} placeholder="Evening Prayer" className="w-full text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors" aria-label="Name your evening prayer" />
                  <p className="text-lg text-foreground font-cormorant italic mt-1">
                    Suggestions: Vespers or Compline
                  </p>
                  <div className="relative">
                    <Input id="evening-prayer-time" type="time" step="900" value={eveningPrayerTime} onChange={e => {
                    setEveningPrayerTime(e.target.value);
                    setTimeError("");
                  }} className="w-full text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors cursor-pointer" aria-label="Select evening prayer time" required />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
              
              {timeError && <p className="text-sm text-destructive font-cormorant italic text-center animate-fade-in-up">
                  {timeError}
                </p>}
            </CardContent>
          </Card>

          {/* Bell Sound Selection */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 to-secondary/30 dark:from-amber-950/20 dark:to-secondary/10 border-2 border-amber-200/30 dark:border-amber-800/20 shadow-warm backdrop-blur-sm transition-all hover:shadow-xl hover:border-amber-300/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,180,255,0.08),transparent)] pointer-events-none" />
            
            <CardHeader className="space-y-3 relative">
              <CardTitle className="flex items-center gap-3 font-cormorant text-3xl">
                <Volume2 className="w-6 h-6 text-primary" />
                Bell Call Sound
              </CardTitle>
              <CardDescription className="font-cormorant text-xl">
                Configure bell sounds for each prayer time
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 relative">
              {/* Morning Prayer Bell */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-cormorant text-2xl font-semibold text-foreground">
                  <Sun className="w-5 h-5 text-amber" />
                  {morningPrayerName}
                </h3>
                <RadioGroup value={morningCallType} onValueChange={setMorningCallType} className="space-y-4" aria-label="Choisir la durée de l'appel pour la prière du matin">
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
                      onClick={() => toggleAudio("/audio/summoning-bell.mp3", "Short Call")} 
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
                      onClick={() => toggleAudio("/audio/cathedral-bell.mp3", "Long Call")} 
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
                <RadioGroup value={eveningCallType} onValueChange={setEveningCallType} className="space-y-4" aria-label="Choisir la durée de l'appel pour la prière du soir">
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
                      onClick={() => toggleAudio("/audio/summoning-bell.mp3", "Short Call")} 
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
                      onClick={() => toggleAudio("/audio/cathedral-bell.mp3", "Long Call")} 
                      aria-label="Preview long bell call sound"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      {isPlaying && currentAudioUrl === "/audio/cathedral-bell.mp3" ? "Stop" : "Listen"}
                    </Button>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Prayer Reminder */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 to-secondary/30 dark:from-amber-950/20 dark:to-secondary/10 border-2 border-amber-200/30 dark:border-amber-800/20 shadow-warm backdrop-blur-sm transition-all hover:shadow-xl hover:border-amber-300/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,180,255,0.08),transparent)] pointer-events-none" />
            
            <CardHeader className="space-y-3 relative">
              <CardTitle className="flex items-center gap-3 font-cormorant text-3xl">
                <BellRing className="w-6 h-6 text-primary" />
                Prayer Reminder
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6 relative">
              <div className="grid grid-cols-[auto_1fr] gap-6 items-center">
                {/* Header Row */}
                <div className="font-cormorant text-xl font-semibold text-foreground">Prayer Time</div>
                <div className="font-cormorant text-xl font-semibold text-foreground">Reminder</div>
                
                {/* Morning Prayer Row */}
                <div className="flex items-center gap-2 font-cormorant text-xl text-foreground">
                  <Sun className="w-5 h-5 text-amber" />
                  {morningPrayerName}
                </div>
                <RadioGroup value={morningReminderMinutes} onValueChange={setMorningReminderMinutes} className="flex gap-4" aria-label="Choisir le rappel pour la prière du matin">
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
                <RadioGroup value={eveningReminderMinutes} onValueChange={setEveningReminderMinutes} className="flex gap-4" aria-label="Choisir le rappel pour la prière du soir">
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
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
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
    </div>;
};
export default PrayerTimes;