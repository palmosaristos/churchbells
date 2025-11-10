import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bell, Sun, Moon, Clock } from "lucide-react";
import { useCurrentTime } from "@/hooks/useCurrentTime";  // Intègre pour validation TZ/time

interface PrayerConfigurationProps {
  morningPrayerEnabled: boolean;
  eveningPrayerEnabled: boolean;
  morningPrayerName: string;
  eveningPrayerName: string;
  morningPrayerTime: string;
  eveningPrayerTime: string;
  morningCallType?: 'short' | 'long';  // Pour soundFile (indirect display)
  eveningCallType?: 'short' | 'long';
  timeZone?: string;  // TZ pour display/scheduler align
  morningReminders?: string[];  // For toasts only ("5min reminder")
  eveningReminders?: string[];
}

export const PrayerConfiguration = ({
  morningPrayerEnabled,
  eveningPrayerEnabled,
  morningPrayerName,
  eveningPrayerName,
  morningPrayerTime,
  eveningPrayerTime,
  morningCallType = 'short',  // Default basic
  eveningCallType = 'short',
  timeZone = 'UTC',  // Fallback, from user settings
  morningReminders = [],
  eveningReminders = [],
}: PrayerConfigurationProps) => {
  // Prayers configured: Based on enabled + times/names (persistent)
  const isConfigured = morningPrayerEnabled || eveningPrayerEnabled;
  useEffect(() => {
    localStorage.setItem("prayersConfigured", isConfigured.toString());
  }, [isConfigured]);

  // Current time TZ pour validate "next occurrence"
  const current = useCurrentTime({ timeZone });
  const getDisplayTime = (prayerTime: string, isMorning: boolean): string => {
    if (!prayerTime) return "Not set";
    
    // Parse prayerTime (assume HH:MM to 24h Date)
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
      })})`;  // Text only, no alert
    } else if (Math.abs(todayPrayer.getTime() - current.raw.getTime()) < 60000) {
      display = `Now! ${display}`;
    }
    
    // Append callType/reminders (text, no visuals)
    const callText = callType === 'long' ? ' (Long call)' : ' (Short call)';
    const remText = (reminders.length > 0) ? ` with ${reminders.join(', ')}min toast` : '';
    
    return `${display}${callText}${remText}`;
  };

  const morningDisplay = getDisplayTime(morningPrayerTime, true);
  const eveningDisplay = getDisplayTime(eveningPrayerTime, false);

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
                    ? morningDisplay 
                    : "Bells silent"}
                </p>
                {morningReminders.length > 0 && (
                  <p className="text-sm text-muted-foreground">Toast reminders: {morningReminders.join(', ')} min before</p>
                )}
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
                    ? eveningDisplay 
                    : "Bells silent"}
                </p>
                {eveningReminders.length > 0 && (
                  <p className="text-sm text-muted-foreground">Toast reminders: {eveningReminders.join(', ')} min before</p>
                )}
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
