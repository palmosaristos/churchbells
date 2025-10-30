import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bell, Sun, Moon } from "lucide-react";

interface PrayerConfigurationProps {
  morningPrayerEnabled: boolean;
  eveningPrayerEnabled: boolean;
  morningPrayerName: string;
  eveningPrayerName: string;
  morningPrayerTime: string;
  eveningPrayerTime: string;
}

export const PrayerConfiguration = ({
  morningPrayerEnabled,
  eveningPrayerEnabled,
  morningPrayerName,
  eveningPrayerName,
  morningPrayerTime,
  eveningPrayerTime,
}: PrayerConfigurationProps) => {
  const prayersConfigured = localStorage.getItem("prayersConfigured") === "true";

  return (
    <Card className="bg-gradient-to-br from-amber-50/80 to-secondary/30 dark:from-amber-950/30 dark:to-secondary/10 border-amber-200/30 dark:border-amber-800/20 shadow-warm backdrop-blur-sm">
      <CardContent className="p-5 space-y-2">
        <div className="grid gap-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-amber-200/30 dark:border-amber-800/20 shadow-sm">
            <div className="flex items-center gap-3">
              <Sun className="w-6 h-6 text-amber" />
              <div>
                <p className="font-cormorant text-xl text-foreground font-semibold">
                  {morningPrayerName}
                </p>
                <p className="font-cormorant text-xl text-foreground">
                  {morningPrayerEnabled 
                    ? `Bells ringing at ${morningPrayerTime}` 
                    : "Bells silent"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-amber-200/30 dark:border-amber-800/20 shadow-sm">
            <div className="flex items-center gap-3">
              <Moon className="w-6 h-6 text-primary" />
              <div>
                <p className="font-cormorant text-xl text-foreground font-semibold">
                  {eveningPrayerName}
                </p>
                <p className="font-cormorant text-xl text-foreground">
                  {eveningPrayerEnabled 
                    ? `Bells ringing at ${eveningPrayerTime}` 
                    : "Bells silent"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/prayer-times">
            <Button variant="amber" size="lg" className="gap-3 font-cormorant text-lg font-semibold">
              <Bell className="w-5 h-5" />
              Set prayer times
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
