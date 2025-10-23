import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, Sun, Moon } from "lucide-react";

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
      <CardHeader className="text-center">
        <CardTitle className="text-center text-amber-800 dark:text-amber-200 font-cormorant text-3xl">
          {!prayersConfigured ? "Set your daily prayer times" : "Your Prayers"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-amber-200/30 dark:border-amber-800/20 shadow-sm">
            <div className="flex items-center gap-3">
              <Sun className="w-6 h-6 text-amber" />
              <div>
                <p className="font-cormorant text-xl text-foreground font-semibold">
                  {morningPrayerName}
                </p>
                {morningPrayerEnabled && (
                  <p className="font-cormorant text-sm text-muted-foreground">
                    {morningPrayerTime}
                  </p>
                )}
              </div>
            </div>
            <span className={`text-sm font-cormorant px-3 py-1 rounded-full ${
              morningPrayerEnabled 
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}>
              {morningPrayerEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-amber-200/30 dark:border-amber-800/20 shadow-sm">
            <div className="flex items-center gap-3">
              <Moon className="w-6 h-6 text-primary" />
              <div>
                <p className="font-cormorant text-xl text-foreground font-semibold">
                  {eveningPrayerName}
                </p>
                {eveningPrayerEnabled && (
                  <p className="font-cormorant text-sm text-muted-foreground">
                    {eveningPrayerTime}
                  </p>
                )}
              </div>
            </div>
            <span className={`text-sm font-cormorant px-3 py-1 rounded-full ${
              eveningPrayerEnabled 
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}>
              {eveningPrayerEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/prayer-times">
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Configure Prayer Times
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
