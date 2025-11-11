import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bell, Clock } from "lucide-react";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useEffect } from "react";

interface PrayerConfigurationProps {
  prayerEnabled: boolean;
  prayerName: string;
  prayerTime: string;
  callType?: 'short' | 'long';
  timeZone?: string;
  reminders?: string[];
}

export const PrayerConfiguration = ({
  prayerEnabled,
  prayerName,
  prayerTime,
  callType = 'short',
  timeZone = 'UTC',
  reminders = [],
}: PrayerConfigurationProps) => {
  const isConfigured = prayerEnabled;
  useEffect(() => {
    localStorage.setItem("prayersConfigured", isConfigured.toString());
  }, [isConfigured]);

  const current = useCurrentTime({ timeZone });
  const getDisplayTime = (): string => {
    if (!prayerTime) return "Not set";
    
    const [h, m] = prayerTime.split(':').map(Number);
    const todayPrayer = new Date();
    todayPrayer.setHours(h, m, 0, 0);
    const isPast = todayPrayer < current.raw;
    
    let display = `${prayerTime}`;
    if (timeZone !== 'UTC' && current.isValidTZ) {
      display += ` (${timeZone.replace('/', ' ')})`;
    }
    if (isPast) {
      const next = new Date(todayPrayer);
      next.setDate(next.getDate() + 1);
      display += ` (next day at ${next.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        timeZone,
        hour12: false 
      })})`;
    } else if (Math.abs(todayPrayer.getTime() - current.raw.getTime()) < 60000) {
      display = `Now! ${display}`;
    }
    
    const callText = callType === 'long' ? ' (Long call)' : ' (Short call)';
    const remText = (reminders.length > 0) ? ` with ${reminders.join(', ')}min toast` : '';
    
    return `${display}${callText}${remText}`;
  };

  const displayTime = getDisplayTime();

  return (
    <Card className="bg-gradient-to-br from-amber-50/80 to-secondary/30 dark:from-amber-950/30 dark:to-secondary/10 border-amber-200/30 dark:border-amber-800/20 shadow-warm backdrop-blur-sm">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-amber-200/30 dark:border-amber-800/20 shadow-sm">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-primary" />
            <div>
              <p className="font-cormorant text-xl text-foreground font-semibold">
                {prayerName}
              </p>
              <p className="font-cormorant text-xl text-foreground">
                {prayerEnabled 
                  ? displayTime 
                  : "Bells silent"}
              </p>
              {reminders.length > 0 && (
                <p className="text-sm text-muted-foreground">Toast reminders: {reminders.join(', ')} min before</p>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/prayer-times">
            <Button variant="amber" size="lg" className="gap-3 font-cormorant text-lg font-semibold">
              <Clock className="w-5 h-5" />
              Set prayer time
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
