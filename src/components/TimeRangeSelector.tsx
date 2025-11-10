import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Volume2, Check } from "lucide-react";
import { useCurrentTime } from "@/hooks/useCurrentTime";  // Intègre pour validation TZ/next occurrence
import { useEffect } from "react";  // Pour persistence localStorage
// ... (imports images inchangés)

interface TimeRangeSelectorProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  halfHourChimes?: boolean;
  onHalfHourChimesChange?: (enabled: boolean) => void;
  pauseEnabled?: boolean;
  onPauseEnabledChange?: (enabled: boolean) => void;
  pauseStartTime?: string;
  pauseEndTime?: string;
  onPauseStartTimeChange?: (time: string) => void;
  onPauseEndTimeChange?: (time: string) => void;
  selectedDays?: string[];
  onSelectedDaysChange?: (days: string[]) => void;
  bellsEnabled?: boolean;
  onBellsEnabledChange?: (enabled: boolean) => void;
  timeZone?: string;  // TZ pour display/validation (e.g., "Europe/Paris")
  bellTradition?: string;  // Link à sounds (indirect extras.soundFile)
  onBellTraditionChange?: (tradition: string) => void;  // Optional persist
}

const timeOptions = [ /* ... (inchangé) */ ];
const daysOfWeek = [ /* ... (inchangé) */ ];

const DAY_MAP = {  // Pour scheduler align (current.raw.getDay() vs selected)
  'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
  'friday': 5, 'saturday': 6, 'sunday': 0
};

export const TimeRangeSelector = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  halfHourChimes = false,
  onHalfHourChimesChange,
  pauseEnabled = false,
  onPauseEnabledChange,
  pauseStartTime = "12:00",
  pauseEndTime = "14:00",
  onPauseStartTimeChange,
  onPauseEndTimeChange,
  selectedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  onSelectedDaysChange,
  bellsEnabled = true,
  onBellsEnabledChange,
  timeZone = 'UTC',  // Fallback
  bellTradition = 'sacred-bells',  // Default
  onBellTraditionChange
}: TimeRangeSelectorProps) => {
  // Persistence localStorage (pour scheduler options reload)
  useEffect(() => {
    if (bellsEnabled) {
      const config = { startTime, endTime, halfHourChimes, pauseEnabled, pauseStartTime, pauseEndTime, selectedDays, timeZone, bellTradition };
      localStorage.setItem('bellConfig', JSON.stringify(config));
    }
  }, [startTime, endTime, halfHourChimes, pauseEnabled, pauseStartTime, pauseEndTime, selectedDays, timeZone, bellTradition, bellsEnabled]);

  // Current time pour validation next chime
  const current = useCurrentTime({ timeZone });

  // Helper: Get next chime display (in text, vs current.raw)
  const getNextChimeDisplay = (): string => {
    if (!bellsEnabled) return '';
    
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const nowMinutes = current.raw.getHours() * 60 + current.raw.getMinutes();
    const todayDayNum = current.raw.getDay();  // 0=Sun

    // Find if today active day
    const todayDayName = Object.keys(DAY_MAP).find(key => DAY_MAP[key] === todayDayNum);
    const isTodayActive = todayDayName && selectedDays.includes(todayDayName);
    
    // Next possible chime (simplifié : nearest hour in range)
    let nextText = '';
    if (isTodayActive && nowMinutes >= sh * 60 + sm && nowMinutes <= eh * 60 + em) {
      // Today in range : next hour
      const nextHour = Math.ceil((nowMinutes + 1) / 60) * 60 / 60;  // Next full hour
      if (halfHourChimes) nextText = ` (next half-hour chime at ${String(nextHour).padStart(2, '0')}:30)`;
      else nextText = ` (next chime at ${String(nextHour).padStart(2, '0')}:00)`;
    } else {
      // Next day : first in range
      nextText = ` (next on ${selectedDays[0] || 'day'} at ${startTime})`;
    }
    
    if (current.isValidTZ && timeZone !== 'UTC') {
      nextText += ` (${timeZone.replace('/', ' ')})`;
    }

    return nextText;
  };

  const nextChimeText = getNextChimeDisplay();

  const handleDayToggle = (dayId: string) => {
    if (!onSelectedDaysChange) return;
    if (selectedDays.includes(dayId)) {
      onSelectedDaysChange(selectedDays.filter(d => d !== dayId));
    } else {
      onSelectedDaysChange([...selectedDays, dayId]);
    }
  };

  const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const is24_7Active = startTime === "00:00" && endTime === "23:30" && selectedDays.length === 7 && allDays.every(day => selectedDays.includes(day));  // Fix end to 23:30 for half
  const is7to10Active = startTime === "07:00" && endTime === "22:00" && selectedDays.length === 7 && allDays.every(day => selectedDays.includes(day));
  const isWeekendActive = startTime === "07:00" && endTime === "22:00" && selectedDays.length === 2 && selectedDays.includes('saturday') && selectedDays.includes('sunday');

  // ... (reste du JSX inchangé, sauf summary finale)

  return <div className="space-y-6">
      {/* ... (Quick Configurations, Custom Schedule, Days of Week Selector, Pause Period, Bell frequency – inchangés) */}
      
      {/* Summary amélioré avec validation */}
      <div className="p-4 rounded-lg bg-gradient-dawn border">
        <p className="text-xl text-foreground font-cormorant text-center">
          {bellsEnabled 
            ? `Bells will chime every ${halfHourChimes ? 'half hour' : 'hour'} from ${timeOptions.find(t => t.value === startTime)?.label || startTime} to ${timeOptions.find(t => t.value === endTime)?.label || endTime}${nextChimeText}`  // Add nextChimeText
            : 'Bells disabled (no sounds scheduled)'
          }
          {selectedDays.length > 0 && !nextChimeText.includes('next on') && (
            <>
              {' '}on {selectedDays.length === 7 ? (
                <span className="font-cinzel font-semibold">every day</span>
              ) : /* ... (inchangé) */}
            </>
          )}
          {pauseEnabled && (
            <>
              , with a pause from{' '}
              <span className="font-cinzel font-semibold text-primary">{timeOptions.find(t => t.value === pauseStartTime)?.label || pauseStartTime}</span> to{' '}
              <span className="font-cinzel font-semibold text-primary">{timeOptions.find(t => t.value === pauseEndTime)?.label || pauseEndTime}</span>
              {pauseStartTime > pauseEndTime ? ' (overnight)' : ''}  {/* Cross-day hint */}
            </>
          )}
          {bellTradition && (
            <span className="block text-sm text-muted-foreground mt-1">Using {bellTradition} tradition (sounds will play as configured)</span>
          )}
        </p>
      </div>
    </div>;
};
