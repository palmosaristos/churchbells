import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { PrayerTimesSelector } from "@/components/PrayerTimesSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, Sun, Moon } from "lucide-react";
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
  const { toast } = useToast();

  const handlePrayerTimesSelect = (times: PrayerTime[]) => {
    toast({
      title: "Prayer times applied",
      description: `${times.length} prayer times have been configured for the bells`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs text-muted-foreground/60 font-cormorant uppercase tracking-widest">
            Daily Prayer Times
          </p>
          <h1 className="text-5xl font-cinzel font-bold text-foreground">
            When should the Bells call you to prayer ?
          </h1>
          <p className="text-sm text-muted-foreground italic font-cormorant">
            Morning and evening bells
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <PrayerTimesSelector 
            selectedTradition={selectedPrayerTradition} 
            onTraditionSelect={setSelectedPrayerTradition} 
            onTimesSelect={handlePrayerTimesSelect} 
          />

          {/* Custom Prayer Times */}
          <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-cinzel">
                <Clock className="w-5 h-5 text-primary" />
                Custom Prayer Times
              </CardTitle>
              <CardDescription className="font-cormorant">
                Set your preferred times for morning and evening prayers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="morning-prayer" className="flex items-center gap-2 text-sm font-medium">
                    <Sun className="w-4 h-4 text-amber-500" />
                    Morning Prayer
                  </Label>
                  <Input
                    id="morning-prayer"
                    type="time"
                    value={morningPrayerTime}
                    onChange={(e) => setMorningPrayerTime(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="evening-prayer" className="flex items-center gap-2 text-sm font-medium">
                    <Moon className="w-4 h-4 text-blue-500" />
                    Evening Prayer
                  </Label>
                  <Input
                    id="evening-prayer"
                    type="time"
                    value={eveningPrayerTime}
                    onChange={(e) => setEveningPrayerTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              <Button 
                className="w-full mt-6" 
                onClick={() => toast({
                  title: "Prayer Times Set",
                  description: `Morning: ${morningPrayerTime}, Evening: ${eveningPrayerTime}`
                })}
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
