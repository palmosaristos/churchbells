import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { CurrentConfiguration } from "@/components/CurrentConfiguration";
import { HeroSection } from "@/components/HeroSection";
import { LocationPermission } from "@/components/LocationPermission";
import { AudioPermission } from "@/components/AudioPermission";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "/lovable-uploads/church-bells-hero-hq.jpg";

const Index = () => {
  const [selectedBellTradition] = useState<string>("cathedral-bell");
  const [startTime] = useState<string>("08:00");
  const [endTime] = useState<string>("20:00");
  const [halfHourChimes] = useState<boolean>(false);
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>(() => {
    return localStorage.getItem("timeZone") || "";
  });
  const [audioPermissionGranted, setAudioPermissionGranted] = useState<boolean>(() => {
    return localStorage.getItem("audioPermission") === "granted";
  });
  const [isAppEnabled, setIsAppEnabled] = useState<boolean>(() => {
    return localStorage.getItem("appEnabled") !== "false";
  });
  const { toast } = useToast();

  const handleTimeZoneDetected = (timeZone: string) => {
    setSelectedTimeZone(timeZone);
    localStorage.setItem("timeZone", timeZone);
  };

  const handleAudioPermissionGranted = () => {
    setAudioPermissionGranted(true);
    localStorage.setItem("audioPermission", "granted");
  };

  const handleAppToggle = (enabled: boolean) => {
    setIsAppEnabled(enabled);
    localStorage.setItem("appEnabled", String(enabled));
    toast({
      title: enabled ? "App Activated" : "App Deactivated",
      description: enabled 
        ? "Sacred Bells will now ring at scheduled times" 
        : "All bell notifications are paused",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <HeroSection heroImage={heroImage} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* App Enable/Disable Toggle */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-2 border-primary/30 shadow-sacred">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,180,255,0.15),transparent)] pointer-events-none" />
          
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 font-cinzel text-2xl">
              {isAppEnabled ? (
                <Bell className="w-6 h-6 text-primary" />
              ) : (
                <BellOff className="w-6 h-6 text-muted-foreground" />
              )}
              App Status
            </CardTitle>
            <CardDescription className="font-cormorant text-base">
              {isAppEnabled 
                ? "Sacred Bells is active and will ring at scheduled times"
                : "All bell notifications are currently paused"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative">
            <div className="flex items-center justify-between p-4 rounded-lg border-2 border-border bg-card">
              <Label htmlFor="app-toggle" className="flex flex-col gap-1 cursor-pointer">
                <span className="font-semibold font-cinzel text-lg">
                  {isAppEnabled ? "App is ON" : "App is OFF"}
                </span>
                <span className="text-sm text-muted-foreground font-cormorant">
                  Toggle to {isAppEnabled ? "pause" : "activate"} all notifications
                </span>
              </Label>
              <Switch 
                id="app-toggle"
                checked={isAppEnabled}
                onCheckedChange={handleAppToggle}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardContent>
        </Card>

        {isAppEnabled && !selectedTimeZone && (
          <LocationPermission onTimeZoneDetected={handleTimeZoneDetected} />
        )}

        {isAppEnabled && selectedTimeZone && !audioPermissionGranted && (
          <AudioPermission onAudioPermissionGranted={handleAudioPermissionGranted} />
        )}

        {isAppEnabled && selectedTimeZone && audioPermissionGranted && (
          <CurrentConfiguration
            selectedBellTradition={selectedBellTradition}
            startTime={startTime}
            endTime={endTime}
            halfHourChimes={halfHourChimes}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
