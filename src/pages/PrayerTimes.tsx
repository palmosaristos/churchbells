import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { PrayerTimesSelector } from "@/components/PrayerTimesSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock, Sun, Moon, Bell, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

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
  const { toast } = useToast();
  const { playAudio } = useAudioPlayer();

  const handleSave = () => {
    localStorage.setItem("prayerTradition", selectedPrayerTradition);
    localStorage.setItem("morningPrayerTime", morningPrayerTime);
    localStorage.setItem("eveningPrayerTime", eveningPrayerTime);
    localStorage.setItem("morningPrayerName", morningPrayerName);
    localStorage.setItem("eveningPrayerName", eveningPrayerName);
    localStorage.setItem("morningPrayerEnabled", String(morningPrayerEnabled));
    localStorage.setItem("eveningPrayerEnabled", String(eveningPrayerEnabled));
    localStorage.setItem("callType", callType);
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
      description: `${morningPrayerName}: ${morningPrayerTime} • ${eveningPrayerName}: ${eveningPrayerTime}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/30 via-background to-amber-50/20 dark:from-sky-950/10 dark:via-background dark:to-amber-950/10">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Header with bell icon */}
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/5 border-2 border-primary/10">
              <Bell className="w-12 h-12 text-primary animate-bell-ring" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground/60 font-cormorant uppercase tracking-widest">
            Daily Prayer Times
          </p>
          <h1 className="text-5xl md:text-6xl font-cinzel font-bold text-foreground leading-tight px-4">
            When should the Bells<br />call you to prayer?
          </h1>
          <p className="text-base text-muted-foreground italic font-cormorant max-w-md mx-auto">
            Morning and evening bells to guide your spiritual journey
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <PrayerTimesSelector 
            selectedTradition={selectedPrayerTradition} 
            onTraditionSelect={setSelectedPrayerTradition} 
            onTimesSelect={handlePrayerTimesSelect} 
          />

          {/* Custom Prayer Times */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber/5 to-secondary/10 dark:from-amber/5 dark:to-secondary/5 border-2 border-amber/20 dark:border-amber/10 shadow-warm backdrop-blur-sm transition-all hover:shadow-xl hover:border-amber/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,220,120,0.1),transparent)] pointer-events-none" />
            
            <CardHeader className="space-y-3 relative">
              <CardTitle className="flex items-center gap-3 font-cinzel text-2xl">
                <Clock className="w-6 h-6 text-primary" />
                Custom Prayer Times
              </CardTitle>
              <CardDescription className="font-cormorant text-base">
                Set your preferred times for morning and evening prayers
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 relative">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4 group">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="morning-prayer-name" className="flex items-center gap-2 text-base font-medium font-cormorant">
                      <Sun className="w-5 h-5 text-amber transition-transform group-hover:scale-110 group-hover:rotate-12" />
                      Morning Prayer
                    </Label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={morningPrayerEnabled}
                        onChange={(e) => setMorningPrayerEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-cormorant text-muted-foreground">Enable</span>
                    </label>
                  </div>
                  <Input
                    id="morning-prayer-name"
                    type="text"
                    value={morningPrayerName}
                    onChange={(e) => setMorningPrayerName(e.target.value)}
                    placeholder="e.g., Angélus du Matin"
                    className="w-full font-cormorant border-2 focus:border-amber transition-colors"
                    aria-label="Name your morning prayer"
                  />
                  <div className="relative">
                    <Input
                      id="morning-prayer-time"
                      type="time"
                      step="900"
                      value={morningPrayerTime}
                      onChange={(e) => {
                        setMorningPrayerTime(e.target.value);
                        setTimeError("");
                      }}
                      className="w-full text-lg font-cormorant border-2 focus:border-amber transition-colors cursor-pointer"
                      aria-label="Select morning prayer time"
                      required
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-4 group">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="evening-prayer-name" className="flex items-center gap-2 text-base font-medium font-cormorant">
                      <Moon className="w-5 h-5 text-primary transition-transform group-hover:scale-110 group-hover:-rotate-12" />
                      Evening Prayer
                    </Label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eveningPrayerEnabled}
                        onChange={(e) => setEveningPrayerEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-cormorant text-muted-foreground">Enable</span>
                    </label>
                  </div>
                  <Input
                    id="evening-prayer-name"
                    type="text"
                    value={eveningPrayerName}
                    onChange={(e) => setEveningPrayerName(e.target.value)}
                    placeholder="e.g., Angélus du Soir"
                    className="w-full font-cormorant border-2 focus:border-primary transition-colors"
                    aria-label="Name your evening prayer"
                  />
                  <div className="relative">
                    <Input
                      id="evening-prayer-time"
                      type="time"
                      step="900"
                      value={eveningPrayerTime}
                      onChange={(e) => {
                        setEveningPrayerTime(e.target.value);
                        setTimeError("");
                      }}
                      className="w-full text-lg font-cormorant border-2 focus:border-primary transition-colors cursor-pointer"
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
              
              <Button 
                className="w-full md:w-auto md:mx-auto flex items-center justify-center md:px-12 py-6 text-base font-cinzel shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]" 
                onClick={validateAndApplyTimes}
                aria-label="Apply custom prayer times"
              >
                Apply Custom Times
              </Button>
            </CardContent>
          </Card>

          {/* Bell Sound Selection */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 border-2 border-primary/20 dark:border-primary/10 shadow-warm backdrop-blur-sm transition-all hover:shadow-xl hover:border-primary/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,180,255,0.1),transparent)] pointer-events-none" />
            
            <CardHeader className="space-y-3 relative">
              <CardTitle className="flex items-center gap-3 font-cinzel text-2xl">
                <Volume2 className="w-6 h-6 text-primary" />
                Bell Call Sound
              </CardTitle>
              <CardDescription className="font-cormorant text-base">
                Choose the duration of your prayer call bell
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 relative">
              <RadioGroup value={callType} onValueChange={setCallType} className="space-y-4">
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="short" id="short-call" />
                  <Label htmlFor="short-call" className="flex-1 cursor-pointer font-cormorant text-base">
                    <span className="font-semibold">Short Call</span>
                    <span className="block text-sm text-muted-foreground">Brief bell chime (~5 seconds)</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="long" id="long-call" />
                  <Label htmlFor="long-call" className="flex-1 cursor-pointer font-cormorant text-base">
                    <span className="font-semibold">Long Call</span>
                    <span className="block text-sm text-muted-foreground">Extended bell sequence (~15 seconds)</span>
                  </Label>
                </div>
              </RadioGroup>
              
              <Button 
                variant="outline"
                className="w-full md:w-auto md:mx-auto flex items-center justify-center gap-2 md:px-8 py-5 text-base font-cinzel shadow-md hover:shadow-lg transition-all hover:scale-[1.02]" 
                onClick={() => {
                  const audioUrl = callType === "short" 
                    ? "/audio/summoning-bell.mp3" 
                    : "/audio/cathedral-bell.mp3";
                  playAudio(audioUrl, `${callType === "short" ? "Short" : "Long"} Call`);
                }}
                aria-label="Preview bell call sound"
              >
                <Volume2 className="w-5 h-5" />
                Listen to {callType === "short" ? "Short" : "Long"} Call
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="text-center">
            <Button 
              onClick={handleSave}
              variant="sacred"
              size="lg"
              className="gap-2 font-cinzel text-lg px-12 py-6 shadow-xl"
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
