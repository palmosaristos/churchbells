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

  // ✅ CORRECTION : Volume cohérent avec useAudioPlayer/scheduler (utilise 'prayerBellVolume' direct pour reminders avec bell, car cathedral_1.mp3 est un bell sound ; fallback 0.5 si absent)
  const getReminderVolume = () => {
    try {
      return parseFloat(localStorage.getItem('prayerBellVolume') || '0.5');
    } catch {
      return 0.5;
    }
  };

  // ✅ LOGIQUE LOVABLE : Formatage robuste des reminders avec tri (inchangé, gère string[] bien)
  const reminderText = useMemo(() => {
    if (!prayerEnabled || reminders.length === 0) return null;
    
    const volume = reminderWithBell ? getReminderVolume() : 0;
    
    const formatReminders = () => {
      if (reminders.length === 1) {
        return `with ${reminders[0]} min ${reminderWithBell ? 'bell' : 'visual'} reminder`;
      }
      
      // Tri numérique (ex: "5", "10", "15" → [5, 10, 15])
      const sorted = [...reminders].sort((a, b) => Number(a) - Number(b));
      const first = sorted[0];
      const rest = sorted.slice(1);
      
      return `with ${first} min ${reminderWithBell ? 'bell' : 'visual'} reminder${rest.length > 0 ? ` and another ${rest.join(', ')} min ${reminderWithBell ? 'bell' : 'visual'} reminder` : ''}`;
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

        {/* Rappels configurés (logique Lovable améliorée) */}
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
