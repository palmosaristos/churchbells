import { useState, useEffect } from "react";
import { BellTraditionCard } from "@/components/BellTraditionCard";
import { PrayerTimesSelector } from "@/components/PrayerTimesSelector";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Clock, Settings, Play, Pause, Volume2, Globe, Crown, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import heroImage from "@/assets/church-bells-hero.jpg";
interface BellTradition {
  id: string;
  name: string;
  description: string;
  tradition: string;
  audioSample?: string;
}
interface PrayerTime {
  name: string;
  time: string;
  description: string;
}
const bellTraditions: BellTradition[] = [{
  id: "carillon",
  name: "Carillon",
  description: "Melodic sequences played on tuned bells, creating beautiful harmonies that echo through the countryside.",
  tradition: "European"
}, {
  id: "grand-volley",
  name: "Grand Volleys",
  description: "French tradition of synchronized bell ringing in powerful, rhythmic patterns that announce sacred moments.",
  tradition: "French"
}, {
  id: "change-ringing",
  name: "Changing bells",
  description: "English art of ringing bells in mathematical sequences, creating intricate patterns that tell stories through sound.",
  tradition: "English"
}, {
  id: "zvon",
  name: "Zvon",
  description: "Russian Orthodox technique of rhythmic bell ringing that creates cascading waves of sound for worship.",
  tradition: "Russian"
}, {
  id: "byzantine",
  name: "Byzantine Bells",
  description: "Ancient Eastern Christian tradition of solemn, meditative bell sounds that call the faithful to prayer.",
  tradition: "Byzantine"
}];
const Index = () => {
  const [selectedBellTradition, setSelectedBellTradition] = useState<string>("carillon");
  const [selectedPrayerTradition, setSelectedPrayerTradition] = useState<string>("Roman Catholic");
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("20:00");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("America/New_York");
  const {
    toast
  } = useToast();

  const timeZones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Europe/Rome", label: "Central European Time (CET)" },
    { value: "Europe/Athens", label: "Eastern European Time (EET)" },
    { value: "Europe/Moscow", label: "Moscow Time (MSK)" },
    { value: "Asia/Jerusalem", label: "Israel Standard Time (IST)" },
    { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
    { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
    { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  ];
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        timeZone: selectedTimeZone
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedTimeZone]);
  const handleBellPlay = (traditionId: string) => {
    const tradition = bellTraditions.find(t => t.id === traditionId);
    toast({
      title: "Playing Bell Sample",
      description: `Listening to ${tradition?.name} - ${tradition?.tradition} tradition`
    });
  };
  const handlePrayerTimesSelect = (times: PrayerTime[]) => {
    toast({
      title: "Prayer Times Applied",
      description: `${times.length} prayer times have been set for bell chiming`
    });
  };
  const toggleBellSystem = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Bell System Paused" : "Bell System Activated",
      description: isActive ? "Church bells are now silent" : `Church bells will chime from ${startTime} to ${endTime}`
    });
  };
  return <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="h-96 bg-cover bg-center bg-no-repeat relative" style={{
        backgroundImage: `url(${heroImage})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-cinzel font-bold text-foreground mb-4 drop-shadow-lg">
                Sacred Bells
              </h1>
              <p className="text-xl text-foreground font-cormorant max-w-2xl leading-relaxed drop-shadow-md">Let the sacred sound of churchbells accompany you through the day and invite you to connect with God</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Sacred Time Display */}
        <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
          <CardContent className="pt-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-full p-6 border border-amber-200/50 dark:border-amber-700/50">
                    <Clock className="w-12 h-12 text-amber-700 dark:text-amber-300" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-serif font-bold text-amber-800 dark:text-amber-200 tracking-wide">
                  {currentTime}
                </h3>
                <p className="text-amber-600 dark:text-amber-400 font-medium">Sacred Hour</p>
              </div>
              
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/20 rounded-full border border-amber-200/30 dark:border-amber-700/30">
                  <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
                    <SelectTrigger className="border-0 bg-transparent text-amber-700 dark:text-amber-300 font-medium focus:ring-0 p-0 h-auto">
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 dark:bg-black/95 backdrop-blur-md border-amber-200/50 dark:border-amber-800/50">
                      {timeZones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value} className="text-amber-800 dark:text-amber-200">
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Promotion */}
        <Card className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/30 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-6 h-6 text-amber-600" />
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                Discover Premium Bell Traditions
              </h3>
              <p className="text-amber-700 dark:text-amber-300 max-w-lg mx-auto">
                Unlock sacred bell traditions from around the world. Experience authentic Carillon melodies, Russian Zvon, Byzantine chants, and more.
              </p>
              <Button asChild variant="amber" size="lg" className="font-semibold">
                <Link to="/premium" className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Explore Premium Traditions
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Time Configuration */}
        <div className="grid gap-8 lg:grid-cols-2">
          <TimeRangeSelector startTime={startTime} endTime={endTime} onStartTimeChange={setStartTime} onEndTimeChange={setEndTime} />
          
          <PrayerTimesSelector selectedTradition={selectedPrayerTradition} onTraditionSelect={setSelectedPrayerTradition} onTimesSelect={handlePrayerTimesSelect} />
        </div>

        {/* Settings Summary */}
        <Card className="bg-gradient-vespers border-burgundy/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-burgundy-foreground font-serif">
              <Settings className="w-5 h-5" />
              Current Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-burgundy-foreground/10">
                <Bell className="w-6 h-6 text-burgundy-foreground mx-auto mb-2" />
                <p className="font-medium text-burgundy-foreground">
                  {bellTraditions.find(t => t.id === selectedBellTradition)?.name}
                </p>
                <p className="text-sm text-burgundy-foreground/80">Bell Tradition</p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-burgundy-foreground/10">
                <Clock className="w-6 h-6 text-burgundy-foreground mx-auto mb-2" />
                <p className="font-medium text-burgundy-foreground">{startTime} - {endTime}</p>
                <p className="text-sm text-burgundy-foreground/80">Daily Schedule</p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-burgundy-foreground/10">
                <Volume2 className="w-6 h-6 text-burgundy-foreground mx-auto mb-2" />
                <p className="font-medium text-burgundy-foreground">{selectedPrayerTradition}</p>
                <p className="text-sm text-burgundy-foreground/80">Prayer Tradition</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Index;