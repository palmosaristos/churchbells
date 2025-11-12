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
  const isConfigured = prayerEnabled && !!prayerTime;
  
  // CORRECTION 1 : Persiste l'état de configuration pour le planificateur
  useEffect(() => {
    localStorage.setItem("prayersConfigured", String(isConfigured));
    if (import.meta.env.DEV) {
      console.log(`🔔 Prayer configuration: ${isConfigured ? 'ACTIVE' : 'INACTIVE'}`);
    }
  }, [isConfigured, prayerName, prayerTime, callType, reminders, reminderWithBell]);

  const current = useCurrentTime({ timeZone });
  
  // CORRECTION 2 : Formatage robuste de l'heure
  const displayTime = useMemo(() => {
    if (!prayerEnabled || !prayerTime) {
      return { time: "Bells silent", subtitle: "Prayer notifications disabled" };
    }
    
    try {
      const [h, m] = prayerTime.split(':').map(Number);
      
      if (isNaN(h) || isNaN(m)) {
        return { time: "Invalid time", subtitle: "Please check settings" };
      }
      
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHours = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const formattedTime = `${displayHours}:${m.toString().padStart(2, '0')} ${period}`;
      
      const tzDisplay = timeZone !== 'UTC' && current.isValidTZ 
        ? ` (${timeZone.split('/').pop()?.replace('_', ' ')})` 
        : '';
      
      const callTypeText = callType === 'long' ? 'Long call' : 'Short call';
      
      return {
        time: formattedTime + tzDisplay,
        subtitle: callTypeText
      };
    } catch (error) {
      console.error('❌ Time formatting error:', error);
      return { time: "Error", subtitle: "Invalid time format" };
    }
  }, [prayerEnabled, prayerTime, timeZone, current.isValidTZ, callType]);

  // Récupération du volume des rappels (défini AVANT son utilisation)
  const getReminderVolume = () => {
    try {
      const prayerVol = parseFloat(localStorage.getItem('prayerBellVolume') || '0.7');
      const reminderVol = parseFloat(localStorage.getItem('prayerReminderVolume') || '0.5');
      return Math.min(prayerVol * reminderVol, 1);
    } catch {
      return 0.5;
    }
  };

  // Formatage des rappels avec types corrects
  const reminderText = useMemo(() => {
    if (!prayerEnabled || reminders.length === 0) return null;
    
    const reminderType = reminderWithBell ? 'bell' : 'visual';
    const volume = reminderWithBell ? getReminderVolume() : 0;
    
    const formatReminders = () => {
      if (reminders.length === 1) {
        return `with ${reminders[0]} min ${reminderType} reminder`;
      }
      const sorted = [...reminders].sort((a, b) => Number(a) - Number(b));
      const first = sorted[0];
      const rest = sorted.slice(1);
      return `with ${first} min ${reminderType} reminder${rest.length > 0 ? ` and another ${rest.join(', ')} min ${reminderType} reminder` : ''}`;
    };
    
    return {
      text: formatReminders(),
      volume
    };
  }, [prayerEnabled, reminders, reminderWithBell]);

  return (
    <Card className="bg-gradient-to-br from-amber-50/80 to-secondary/30 dark:from-amber-950/30 dark:to-secondary/10 border-amber-200/30 dark:border-amber-800/20 shadow-warm backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-5 space-y-4">
        {/* État de la prière */}
        <div className={`flex items-center justify-between p-4 rounded-lg border shadow-sm transition-all ${
          isConfigured 
            ? 'bg-white/70 dark:bg-slate-800/70 border-amber-300/50 dark:border-amber-700/50' 
            : 'bg-gray-50 dark:bg-slate-800/30 border-border'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${isConfigured ? 'bg-primary/10' : 'bg-gray-200 dark:bg-slate-700'}`}>
              <Bell className={`w-6 h-6 ${isConfigured ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="font-cormorant text-xl font-bold text-foreground">
                {isConfigured ? prayerName : 'Prayer not configured'}
              </p>
              <p className={`font-cormorant text-lg ${isConfigured ? 'text-foreground' : 'text-muted-foreground'}`}>
                {displayTime.time}
              </p>
              {isConfigured && (
                <p className="text-sm text-muted-foreground font-medium">
                  {displayTime.subtitle}
                </p>
              )}
            </div>
          </div>
          
          {isConfigured && (
            <div className="flex items-center gap-2">
              <Volume2 className={`w-4 h-4 ${reminderWithBell ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                reminderWithBell 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-gray-100 dark:bg-slate-700 text-muted-foreground'
              }`}>
                {reminderWithBell ? 'Sound ON' : 'Silent'}
              </span>
            </div>
          )}
        </div>

        {/* Rappels configurés */}
        {isConfigured && reminderText && (
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-sm font-cormorant font-semibold text-foreground">
              {reminderText.text}
            </p>
            {reminderWithBell && (
              <span className="text-xs text-muted-foreground">
                ({Math.round(reminderText.volume * 100)}% vol)
              </span>
            )}
          </div>
        )}

        {/* Bouton d'action */}
        <div className="text-center pt-2">
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

        {/* Debugging info (dev only) */}
        {import.meta.env.DEV && isConfigured && (
          <div className="mt-2 p-2 text-xs bg-gray-100 dark:bg-slate-800 rounded text-muted-foreground font-mono">
            <div>ID: prayer-main</div>
            <div>Type: {callType}</div>
            <div>Reminders: {reminders.join(',') || 'none'}</div>
            <div>Bell: {reminderWithBell ? 'yes' : 'no'}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
