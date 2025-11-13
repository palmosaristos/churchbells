import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bell, Clock, Volume2 } from "lucide-react";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useEffect, useMemo } from "react";

interface PrayerConfigurationProps {
  prayerEnabled: boolean;
  prayerName: string;
  prayerTime: string;
  callType?: 'short' | 'long';
  timeZone?: string;
  reminders?: string[];
  reminderWithBell?: boolean;
}

export const PrayerConfiguration = ({
  prayerEnabled,
  prayerName,
  prayerTime,
  callType = 'short',
  timeZone = 'UTC',
  reminders = [],
  reminderWithBell = false,
}: PrayerConfigurationProps) => {
  // ✅ VALIDATION ROBUSTE (inchangée)
  const isValidTime = useMemo(() => {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(prayerTime);
  }, [prayerTime]);

  const isConfigured = prayerEnabled && !!prayerTime && isValidTime;
  
  // ✅ DEBUG PERSISTANT (inchangé, non-bloquant)
  useEffect(() => {
    const configState = {
      enabled: prayerEnabled,
      name: prayerName,
      time: prayerTime,
      valid: isConfigured,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem("prayersConfigured", String(isConfigured));
    localStorage.setItem("prayerConfigDebug", JSON.stringify(configState));
    
    if (import.meta.env.DEV) {
      console.log(`🔔 Prayer configuration: ${isConfigured ? 'ACTIVE' : 'INACTIVE'}`, configState);
    }
  }, [isConfigured, prayerName, prayerTime, callType, reminders, reminderWithBell]);

  const current = useCurrentTime({ timeZone });
  
  // ✅ FORMATAGE ROBUSTE (correction mineure : fallback si useCurrentTime échoue, pour éviter crash MVP)
  const displayTime = useMemo(() => {
    if (!prayerEnabled || !prayerTime || !isValidTime) {
      return { 
        time: "Bells silent", 
        subtitle: prayerEnabled ? "Invalid time" : "Prayer notifications disabled" 
      };
    }
    
    try {
      const [h, m] = prayerTime.split(':').map(Number);
      const now = current.raw || new Date(); // Fallback si useCurrentTime échoue
      const todayPrayer = new Date(now);
      todayPrayer.setHours(h, m, 0, 0);
      
      const isPast = todayPrayer < now;
      const ampmTime = todayPrayer.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true,
        timeZone 
      });
      
      let display = `${prayerName} at ${ampmTime}`;
      
      if (current.isValidTZ && timeZone !== 'UTC') {
        display += ` (${timeZone.split('/').pop()?.replace('_', ' ')})`;
      }
      
      if (isPast) {
        display += ` (tomorrow)`;
      }
      
      const callTypeText = callType === 'long' ? 'Long call' : 'Short call';
      
      return {
        time: display,
        subtitle: callTypeText
      };
    } catch (error) {
      console.error('❌ Time formatting error:', error);
      return { time: `${prayerName} (time error)`, subtitle: "Invalid time format" };
    }
  }, [prayerEnabled, prayerTime, timeZone, current.isValidTZ, callType, prayerName, isValidTime, current.raw]);

  // ✅ CORRECTION : Volume cohérent avec useAudioPlayer/scheduler
  const getReminderVolume = () => {
    try {
      return parseFloat(localStorage.getItem('prayerBellVolume') || '0.5');
    } catch {
      return 0.5;
    }
  };

  // ✅ Formatage des reminders : seul le premier peut être "bell", les autres sont toujours "visual"
  const formattedReminders = useMemo(() => {
    if (!prayerEnabled || reminders.length === 0) return [];
    
    const sorted = [...reminders].sort((a, b) => Number(a) - Number(b));
    const volume = reminderWithBell ? getReminderVolume() : 0;
    
    return sorted.map((minutes, index) => ({
      minutes,
      type: index === 0 && reminderWithBell ? 'bell' : 'visual',
      volume: index === 0 && reminderWithBell ? volume : undefined
    }));
  }, [prayerEnabled, reminders, reminderWithBell]);

  return (
    <Card className="bg-gradient-to-br from-amber-50/80 to-secondary/30 dark:from-amber-950/30 dark:to-secondary/10 border-amber-200/30 dark:border-amber-800/20 shadow-warm backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-5 space-y-3">
        {/* État de la prière */}
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${isConfigured ? 'bg-primary/10' : 'bg-gray-200 dark:bg-slate-700'}`}>
            <Bell className={`w-6 h-6 ${isConfigured ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="flex-1 space-y-2">
            {isConfigured ? (
              <>
                <p className="font-cormorant text-lg font-semibold text-foreground">
                  {displayTime.time}
                </p>
                
                {/* Reminders */}
                {formattedReminders.map((reminder, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      With a {reminder.type} reminder {reminder.minutes} min before
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <p className="font-cormorant text-lg text-muted-foreground">
                Prayer not configured
              </p>
            )}
          </div>
        </div>


        {/* Bouton d'action */}
        <div className="text-center pt-1">
          <Link to="/prayer-times">
            <Button 
              variant="amber" 
              size="lg" 
              className="gap-3 font-cormorant text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              aria-label="Configure prayer time"
            >
              <Clock className="w-5 h-5" />
              {isConfigured ? 'Modify prayer time' : 'Set prayer time'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
