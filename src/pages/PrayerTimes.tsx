import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { PrayerTimesSelector } from "@/components/PrayerTimesSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, Sun, Moon, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrayerTime {
  name: string;
  time: string;
  description: string;
}

const PrayerTimes = () => {
  const [selectedPrayerTradition, setSelectedPrayerTradition] = useState<string>("Roman Catholic");
  const [morningPrayerTime, setMorningPrayerTime] = useState<string>("06:00");
  const [eveningPrayerTime, setEveningPrayerTime] = useState<string>("18:00");
  const [morningPrayerName, setMorningPrayerName] = useState<string>("Morning Prayer");
  const [eveningPrayerName, setEveningPrayerName] = useState<string>("Evening Prayer");
  const [timeError, setTimeError] = useState<string>("");
  const { toast } = useToast();

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
                  <Label htmlFor="morning-prayer-name" className="flex items-center gap-2 text-base font-medium font-cormorant">
                    <Sun className="w-5 h-5 text-amber transition-transform group-hover:scale-110 group-hover:rotate-12" />
                    Morning Prayer
                  </Label>
                  <Input
                    id="morning-prayer-name"
                    type="text"
                    value={morningPrayerName}
                    onChange={(e) => setMorningPrayerName(e.target.value)}
                    placeholder="e.g., Angélus du Matin"
                    className="w-full font-cormorant border-2 focus:border-amber transition-colors"
                    aria-label="Name your morning prayer"
                  />
                  <Input
                    id="morning-prayer-time"
                    type="time"
                    value={morningPrayerTime}
                    onChange={(e) => {
                      setMorningPrayerTime(e.target.value);
                      setTimeError("");
                    }}
                    className="w-full text-lg font-cormorant border-2 focus:border-amber transition-colors"
                    aria-label="Select morning prayer time"
                  />
                </div>
                
                <div className="space-y-4 group">
                  <Label htmlFor="evening-prayer-name" className="flex items-center gap-2 text-base font-medium font-cormorant">
                    <Moon className="w-5 h-5 text-primary transition-transform group-hover:scale-110 group-hover:-rotate-12" />
                    Evening Prayer
                  </Label>
                  <Input
                    id="evening-prayer-name"
                    type="text"
                    value={eveningPrayerName}
                    onChange={(e) => setEveningPrayerName(e.target.value)}
                    placeholder="e.g., Angélus du Soir"
                    className="w-full font-cormorant border-2 focus:border-primary transition-colors"
                    aria-label="Name your evening prayer"
                  />
                  <Input
                    id="evening-prayer-time"
                    type="time"
                    value={eveningPrayerTime}
                    onChange={(e) => {
                      setEveningPrayerTime(e.target.value);
                      setTimeError("");
                    }}
                    className="w-full text-lg font-cormorant border-2 focus:border-primary transition-colors"
                    aria-label="Select evening prayer time"
                  />
                </div>
              </div>
              
              {timeError && (
                <p className="text-sm text-destructive font-cormorant italic text-center animate-fade-in-up">
                  {timeError}
                </p>
              )}
              
              <Button 
                className="w-full md:w-auto md:mx-auto md:block md:px-12 py-6 text-base font-cinzel shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]" 
                onClick={validateAndApplyTimes}
                aria-label="Apply custom prayer times"
              >
                Apply Custom Times
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;
