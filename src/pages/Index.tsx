import { useState, useEffect } from "react";
import { BellTraditionCard } from "@/components/BellTraditionCard";
import { PrayerTimesSelector } from "@/components/PrayerTimesSelector";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { BackgroundRemovalDemo } from "@/components/BackgroundRemovalDemo";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Clock, Settings, Play, Pause, Volume2, Globe, Crown, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "/lovable-uploads/e28b4ae8-b1de-4d7c-8027-4d7157a1625c.png";
import churchClockImage from "@/assets/church-clock.png";
import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";
import carillonBells from "@/assets/carillon-bells.png";
import monasteryIcon from "@/assets/monastery-icon.png";

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
  id: "carillon-bell",
  name: "Carillon Bells",
  description: "Un système de trois cloches produisant un carillon harmonieux, créant une mélodie sacrée qui élève l'âme.",
  tradition: "Carillon",
  audioSample: "https://dtleakeiowgwlunabkrm.supabase.co/storage/v1/object/public/CHURCH%20BELL%20SOUNDS/CARILLON%20fois%20trois%20plus%20lent%20avec%20fondu%20sur%20les%20deux%20tiers.mp3"
}, {
  id: "village-bell",
  name: "Village Bell (in E)",
  description: "Le son authentique et chaleureux d'une cloche de village, rappelant les traditions rurales et la simplicité de la vie communautaire.",
  tradition: "Village",
  audioSample: "https://dtleakeiowgwlunabkrm.supabase.co/storage/v1/object/public/CHURCH%20BELL%20SOUNDS/cloche%20village%20Mi%20fois%203%20avec%20fondu%20en%20fermeture.mp3"
}, {
  id: "cathedral-bell",
  name: "Classic Bell (in C)",
  description: "La majesté et la profondeur d'une grande cloche traditionnelle en note Do, évoquant la grandeur spirituelle.",
  tradition: "Cathédrale",
  audioSample: "https://dtleakeiowgwlunabkrm.supabase.co/storage/v1/object/public/CHURCH%20BELL%20SOUNDS/cloche%20en%20DO%20TROIS%20FOIS%20avec%20fondu%20sur%20les%20deux%20tiers%20en%20fermeture.mp3"
}];

const Index = () => {
  const [selectedBellTradition, setSelectedBellTradition] = useState<string>("village-bell");
  const [selectedPrayerTradition, setSelectedPrayerTradition] = useState<string>("Roman Catholic");
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("20:00");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [halfHourChimes, setHalfHourChimes] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("America/New_York");
  const {
    toast
  } = useToast();

  const timeZones = [{
    value: "America/New_York",
    label: "Eastern Time (ET)"
  }, {
    value: "America/Chicago",
    label: "Central Time (CT)"
  }, {
    value: "America/Denver",
    label: "Mountain Time (MT)"
  }, {
    value: "America/Los_Angeles",
    label: "Pacific Time (PT)"
  }, {
    value: "Europe/London",
    label: "Greenwich Mean Time (GMT)"
  }, {
    value: "Europe/Paris",
    label: "Central European Time (CET)"
  }, {
    value: "Europe/Rome",
    label: "Central European Time (CET)"
  }, {
    value: "Europe/Athens",
    label: "Eastern European Time (EET)"
  }, {
    value: "Europe/Moscow",
    label: "Moscow Time (MSK)"
  }, {
    value: "Asia/Jerusalem",
    label: "Israel Standard Time (IST)"
  }, {
    value: "Asia/Dubai",
    label: "Gulf Standard Time (GST)"
  }, {
    value: "Asia/Kolkata",
    label: "India Standard Time (IST)"
  }, {
    value: "Asia/Shanghai",
    label: "China Standard Time (CST)"
  }, {
    value: "Asia/Tokyo",
    label: "Japan Standard Time (JST)"
  }, {
    value: "Australia/Sydney",
    label: "Australian Eastern Time (AET)"
  }];

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

  const handleBellPlay = async (traditionId: string) => {
    const tradition = bellTraditions.find(t => t.id === traditionId);
    if (tradition?.audioSample) {
      try {
        const audio = new Audio(tradition.audioSample);
        await audio.play();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
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
      
      {/* Hero Image */}
      <div className="relative overflow-hidden">
        <div className="h-96 bg-cover bg-bottom bg-no-repeat relative" style={{
          backgroundImage: `url(${heroImage})`
        }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/20 to-transparent" />
        </div>
      </div>

      {/* Hero Text Section */}
      <div className="relative -mt-12 z-10">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/90 dark:to-orange-950/90 rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-800/30 p-8 md:p-12">
            <div className="text-center space-y-6">
              <h1 className="text-6xl md:text-8xl font-cinzel font-bold text-foreground mb-4">
                Sacred Bells
              </h1>
              <div className="flex items-center justify-center gap-8 md:gap-12">
                <img src={churchBellTransparent} alt="Beautiful ornate church bell" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
                <img src={churchBellNew} alt="Beautiful ancient church bell" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
              </div>
              <p className="text-2xl md:text-3xl text-amber-800 dark:text-amber-200 font-cormorant max-w-4xl mx-auto leading-relaxed">
                Let the sacred sound of churchbells accompany you through the day and invite you to connect with God
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Sacred Time Display */}
        <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-cinzel font-bold text-amber-800 dark:text-amber-200 mb-4">
                Your time zone
              </h2>
              <div className="flex items-center justify-center gap-6">
                <div className="relative">
                  <img 
                    src={churchClockImage} 
                    alt="Church Clock" 
                    className="w-20 h-20 object-contain filter drop-shadow-lg"
                  />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-6xl font-cinzel font-bold text-amber-800 dark:text-amber-200 tracking-wide">
                    {currentTime}
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/20 rounded-full border border-amber-200/30 dark:border-amber-700/30">
                  <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
                    <SelectTrigger className="border-0 bg-transparent text-amber-700 dark:text-amber-300 font-cormorant focus:ring-0 p-0 h-auto">
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 dark:bg-black/95 backdrop-blur-md border-amber-200/50 dark:border-amber-800/50">
                      {timeZones.map(tz => <SelectItem key={tz.value} value={tz.value} className="text-amber-800 dark:text-amber-200">
                          {tz.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Configuration */}
        <div className="grid gap-8 lg:grid-cols-2">
          <TimeRangeSelector 
            startTime={startTime} 
            endTime={endTime} 
            onStartTimeChange={setStartTime} 
            onEndTimeChange={setEndTime}
            halfHourChimes={halfHourChimes}
            onHalfHourChimesChange={setHalfHourChimes}
          />
          
          <PrayerTimesSelector selectedTradition={selectedPrayerTradition} onTraditionSelect={setSelectedPrayerTradition} onTimesSelect={handlePrayerTimesSelect} />
        </div>

        {/* Bell Sound Selection */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-5xl font-cormorant font-bold text-foreground mb-2">
              Choose Your Bell Sound
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {bellTraditions.map(tradition => (
              <BellTraditionCard
                key={tradition.id}
                title={tradition.name}
                image={tradition.id === 'carillon-bell' ? carillonBells : tradition.id === 'village-bell' ? churchBellTransparent : churchBellNew}
                isSelected={selectedBellTradition === tradition.id}
                onSelect={() => setSelectedBellTradition(tradition.id)}
                onPlay={() => handleBellPlay(tradition.id)}
              />
            ))}
          </div>
        </div>

        {/* Current Configuration */}
        <Card className="bg-gradient-to-br from-slate-50/80 to-amber-50/80 dark:from-slate-900/80 dark:to-amber-950/30 border-amber-200/30 dark:border-amber-800/20 shadow-lg backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-center text-amber-800 dark:text-amber-200 font-cormorant text-3xl">
              Your Church Bells
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-amber-200/30 dark:border-amber-800/20 shadow-sm">
                <img 
                  src={selectedBellTradition === 'carillon-bell' ? carillonBells : selectedBellTradition === 'village-bell' ? churchBellTransparent : churchBellNew} 
                  alt="Selected Bell" 
                  className="w-8 h-8 object-contain mx-auto mb-2 filter drop-shadow-sm"
                />
                <p className="font-cormorant text-xl text-foreground">
                  {bellTraditions.find(t => t.id === selectedBellTradition)?.name}
                </p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-amber-200/30 dark:border-amber-800/20 shadow-sm">
                <img 
                  src={churchClockImage} 
                  alt="Church Clock" 
                  className="w-8 h-8 object-contain mx-auto mb-2 filter drop-shadow-sm"
                />
                <p className="font-cormorant text-xl text-foreground">{startTime} - {endTime}</p>
                <p className="text-xl text-foreground font-cormorant">Daily Schedule</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Background Removal Tool */}
        <BackgroundRemovalDemo />


        {/* Premium Prayer Traditions Preview */}
        <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-cormorant text-3xl text-foreground">
              <img src={monasteryIcon} alt="Monastery" className="w-8 h-8 object-contain" />
              Premium Prayer Traditions
              <span className="text-lg font-cormorant text-muted-foreground italic">(Coming Soon)</span>
            </CardTitle>
            <CardDescription className="font-cormorant text-xl text-foreground">
              Experience authentic Catholic and Orthodox prayer schedules with advanced features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-burgundy"></div>
                  <span className="font-cormorant text-xl text-foreground">Roman Catholic</span>
                </div>
                <p className="text-lg text-muted-foreground mb-3">Complete 8-prayer daily cycle including Matins, Lauds, Prime, Tierce, Sexte, None, Vespers, and Compline</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-lg">
                    <span>Matins</span>
                    <span className="text-muted-foreground">00:00</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Lauds</span>
                    <span className="text-muted-foreground">06:00</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Vespers</span>
                    <span className="text-muted-foreground">18:00</span>
                  </div>
                  <div className="text-lg text-muted-foreground">+ 5 more...</div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="font-cormorant text-xl text-foreground">Orthodox</span>
                </div>
                <p className="text-lg text-muted-foreground mb-3">Traditional Byzantine prayer hours with Midnight Office, Matins, and canonical hours</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-lg">
                    <span>Midnight Office</span>
                    <span className="text-muted-foreground">00:00</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Matins</span>
                    <span className="text-muted-foreground">04:00</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Vespers</span>
                    <span className="text-muted-foreground">18:00</span>
                  </div>
                  <div className="text-lg text-muted-foreground">+ 5 more...</div>
                </div>
              </div>
            </div>
            
          </CardContent>
        </Card>

      </div>
    </div>;
};

export default Index;
