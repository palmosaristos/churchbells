import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Volume2, Check } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import sunImage from "@/assets/sun-prayer-realistic.png";
import moonImage from "@/assets/moon-prayer-full.png";
import bellStartImage from "@/assets/bell-start.png";
import bellEndImage from "@/assets/bell-end.png";
import ultraRealisticBellIcon from "@/assets/ultra-realistic-bell-icon.png";
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
}
const timeOptions = [{
  value: "05:00",
  label: "5:00 AM"
}, {
  value: "05:30",
  label: "5:30 AM"
}, {
  value: "06:00",
  label: "6:00 AM"
}, {
  value: "06:30",
  label: "6:30 AM"
}, {
  value: "07:00",
  label: "7:00 AM"
}, {
  value: "07:30",
  label: "7:30 AM"
}, {
  value: "08:00",
  label: "8:00 AM"
}, {
  value: "08:30",
  label: "8:30 AM"
}, {
  value: "09:00",
  label: "9:00 AM"
}, {
  value: "09:30",
  label: "9:30 AM"
}, {
  value: "10:00",
  label: "10:00 AM"
}, {
  value: "10:30",
  label: "10:30 AM"
}, {
  value: "11:00",
  label: "11:00 AM"
}, {
  value: "11:30",
  label: "11:30 AM"
}, {
  value: "12:00",
  label: "12:00 PM"
}, {
  value: "12:30",
  label: "12:30 PM"
}, {
  value: "13:00",
  label: "1:00 PM"
}, {
  value: "13:30",
  label: "1:30 PM"
}, {
  value: "14:00",
  label: "2:00 PM"
}, {
  value: "14:30",
  label: "2:30 PM"
}, {
  value: "15:00",
  label: "3:00 PM"
}, {
  value: "15:30",
  label: "3:30 PM"
}, {
  value: "16:00",
  label: "4:00 PM"
}, {
  value: "16:30",
  label: "4:30 PM"
}, {
  value: "17:00",
  label: "5:00 PM"
}, {
  value: "17:30",
  label: "5:30 PM"
}, {
  value: "18:00",
  label: "6:00 PM"
}, {
  value: "18:30",
  label: "6:30 PM"
}, {
  value: "19:00",
  label: "7:00 PM"
}, {
  value: "19:30",
  label: "7:30 PM"
}, {
  value: "20:00",
  label: "8:00 PM"
}, {
  value: "20:30",
  label: "8:30 PM"
}, {
  value: "21:00",
  label: "9:00 PM"
}, {
  value: "21:30",
  label: "9:30 PM"
}, {
  value: "22:00",
  label: "10:00 PM"
}, {
  value: "22:30",
  label: "10:30 PM"
}, {
  value: "23:00",
  label: "11:00 PM"
}, {
  value: "23:30",
  label: "11:30 PM"
}, {
  value: "00:00",
  label: "12:00 AM"
}, {
  value: "00:30",
  label: "12:30 AM"
}];
const daysOfWeek = [{
  id: 'monday',
  label: 'Mon'
}, {
  id: 'tuesday',
  label: 'Tue'
}, {
  id: 'wednesday',
  label: 'Wed'
}, {
  id: 'thursday',
  label: 'Thu'
}, {
  id: 'friday',
  label: 'Fri'
}, {
  id: 'saturday',
  label: 'Sat'
}, {
  id: 'sunday',
  label: 'Sun'
}];
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
  onBellsEnabledChange
}: TimeRangeSelectorProps) => {
  const handleDayToggle = (dayId: string) => {
    if (!onSelectedDaysChange) return;
    if (selectedDays.includes(dayId)) {
      onSelectedDaysChange(selectedDays.filter(d => d !== dayId));
    } else {
      onSelectedDaysChange([...selectedDays, dayId]);
    }
  };

  const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const is24_7Active = startTime === "00:00" && endTime === "23:00" && selectedDays.length === 7 && allDays.every(day => selectedDays.includes(day));
  const is7to10Active = startTime === "07:00" && endTime === "22:00" && selectedDays.length === 7 && allDays.every(day => selectedDays.includes(day));
  const isWeekendActive = startTime === "07:00" && endTime === "22:00" && selectedDays.length === 2 && selectedDays.includes('saturday') && selectedDays.includes('sunday');
  return <div className="space-y-6">
      <Card className="w-full bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
        <CardContent className="space-y-6 pt-6">
          {/* Quick Configurations */}
          <div className="space-y-3">
            <Label className="text-3xl font-cormorant text-foreground text-center italic block">Quick Configurations</Label>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  onStartTimeChange("00:00");
                  onEndTimeChange("23:00");
                  if (onSelectedDaysChange) {
                    onSelectedDaysChange(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
                  }
                }}
                className={`px-6 py-3 rounded-xl font-cormorant text-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-foreground shadow-md hover:shadow-lg hover:shadow-amber-500/20 hover:scale-105 transition-all duration-300 ${
                  is24_7Active 
                    ? 'border-4 border-amber-500' 
                    : 'border border-amber-300/50 dark:border-amber-700/50'
                }`}
                aria-label="Configuration 24/7"
              >
                24/7
              </button>
              <button
                type="button"
                onClick={() => {
                  onStartTimeChange("07:00");
                  onEndTimeChange("22:00");
                  if (onSelectedDaysChange) {
                    onSelectedDaysChange(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
                  }
                }}
                className={`px-6 py-3 rounded-xl font-cormorant text-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-foreground shadow-md hover:shadow-lg hover:shadow-amber-500/20 hover:scale-105 transition-all duration-300 ${
                  is7to10Active 
                    ? 'border-4 border-amber-500' 
                    : 'border border-amber-300/50 dark:border-amber-700/50'
                }`}
                aria-label="Configuration de 7h à 22h"
              >
                From 7 AM to 10 PM
              </button>
              <button
                type="button"
                onClick={() => {
                  onStartTimeChange("07:00");
                  onEndTimeChange("22:00");
                  if (onSelectedDaysChange) {
                    onSelectedDaysChange(['saturday', 'sunday']);
                  }
                }}
                className={`px-6 py-3 rounded-xl font-cormorant text-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-foreground shadow-md hover:shadow-lg hover:shadow-amber-500/20 hover:scale-105 transition-all duration-300 ${
                  isWeekendActive 
                    ? 'border-4 border-amber-500' 
                    : 'border border-amber-300/50 dark:border-amber-700/50'
                }`}
                aria-label="Configuration week-end uniquement"
              >
                Only the weekend
              </button>
            </div>
          </div>

          {/* Tailor your schedule section */}
          <div className="space-y-3">
            <Label className="text-3xl font-cormorant text-foreground">Custom Schedule</Label>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex items-end gap-2 flex-1">
              <Label htmlFor="start-time" className="text-2xl font-cormorant text-foreground whitespace-nowrap">
                Start:
              </Label>
              <Select value={startTime} onValueChange={onStartTimeChange}>
                <SelectTrigger id="start-time" aria-label="Sélectionner l'heure de début" className="w-[140px]">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end gap-2 flex-1">
              <Label htmlFor="end-time" className="text-2xl font-cormorant text-foreground whitespace-nowrap">
                End:
              </Label>
              <Select value={endTime} onValueChange={onEndTimeChange}>
                <SelectTrigger id="end-time" aria-label="Sélectionner l'heure de fin" className="w-[140px]">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Days of Week Selector */}
          <div className="space-y-3">
            <Label className="text-3xl font-cormorant text-foreground">Active Days</Label>
            <div className="flex flex-wrap gap-3 justify-center">
              {daysOfWeek.map(day => <button key={day.id} type="button" onClick={() => handleDayToggle(day.id)} className={`w-16 h-16 rounded-full font-cormorant text-lg transition-all flex items-center justify-center gap-0.5 ${selectedDays.includes(day.id) ? 'bg-amber-100 dark:bg-amber-900/40 border-4 border-amber-500 text-amber-900 dark:text-amber-100 shadow-md' : 'bg-white/50 dark:bg-slate-800/50 border-2 border-amber-300/50 dark:border-amber-700/30 text-muted-foreground hover:border-amber-400'}`}>
                  <span>{day.label}</span>
                  {selectedDays.includes(day.id) && (
                    <Check className="w-4 h-4 text-amber-500" strokeWidth={3} />
                  )}
                </button>)}
            </div>
          </div>
          
          {/* Pause Period */}
          <div className="space-y-4 p-4 rounded-lg border bg-gradient-to-br from-red-50/30 to-orange-50/30 dark:from-red-950/10 dark:to-orange-950/10">
            <div className="flex items-center justify-between">
              <Label htmlFor="pause-switch" className="text-xl font-cormorant text-foreground">
                🔕 Quiet Hours (optional)
              </Label>
              <Switch id="pause-switch" checked={pauseEnabled} onCheckedChange={onPauseEnabledChange} disabled={!onPauseEnabledChange} />
            </div>
            
            {pauseEnabled && <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="pause-start-time" className="text-lg font-cormorant text-foreground whitespace-nowrap">
                    Pause Bells from:
                  </Label>
                  <Select value={pauseStartTime} onValueChange={onPauseStartTimeChange}>
                    <SelectTrigger id="pause-start-time" className="w-[130px]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map(time => <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="pause-end-time" className="text-lg font-cormorant text-foreground whitespace-nowrap">
                    Resume Bells at:
                  </Label>
                  <Select value={pauseEndTime} onValueChange={onPauseEndTimeChange}>
                    <SelectTrigger id="pause-end-time" className="w-[130px]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map(time => <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>}
            
            {pauseEnabled && <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <p className="text-lg text-foreground font-cormorant text-center">
                  Bells will be silent from{' '}
                  <span className="font-cinzel font-semibold text-red-600">{timeOptions.find(t => t.value === pauseStartTime)?.label || pauseStartTime}</span> to{' '}
                  <span className="font-cinzel font-semibold text-green-600">{timeOptions.find(t => t.value === pauseEndTime)?.label || pauseEndTime}</span>
                </p>
              </div>}
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-red-50/30 to-orange-50/30 dark:from-red-950/10 dark:to-orange-950/10 border">
            <Label className="text-xl font-cormorant text-foreground">
              Bell frequency
            </Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => onHalfHourChimesChange?.(false)}
                disabled={!onHalfHourChimesChange}
                className="flex items-center gap-2 text-lg font-cormorant text-foreground"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  !halfHourChimes 
                    ? 'border-primary bg-primary' 
                    : 'border-muted-foreground/30'
                }`}>
                  {!halfHourChimes && <div className="w-2.5 h-2.5 rounded-full bg-background" />}
                </div>
                Every hour
              </button>
              <button
                type="button"
                onClick={() => onHalfHourChimesChange?.(true)}
                disabled={!onHalfHourChimesChange}
                className="flex items-center gap-2 text-lg font-cormorant text-foreground"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  halfHourChimes 
                    ? 'border-primary bg-primary' 
                    : 'border-muted-foreground/30'
                }`}>
                  {halfHourChimes && <div className="w-2.5 h-2.5 rounded-full bg-background" />}
                </div>
                Every half hour
              </button>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-dawn border">
            <p className="text-xl text-foreground font-cormorant text-center">
              Bells will chime every {halfHourChimes ? 'half hour' : 'hour'} from{' '}
              <span className="font-cinzel font-semibold text-primary">{timeOptions.find(t => t.value === startTime)?.label || startTime}</span> to{' '}
              <span className="font-cinzel font-semibold text-primary">{timeOptions.find(t => t.value === endTime)?.label || endTime}</span>
              {selectedDays.length > 0 && (
                <>
                  {' '}on {selectedDays.length === 7 ? (
                    <span className="font-cinzel font-semibold">every day</span>
                  ) : selectedDays.length === 2 && selectedDays.includes('saturday') && selectedDays.includes('sunday') ? (
                    <span className="font-cinzel font-semibold">weekends</span>
                  ) : selectedDays.length === 5 && !selectedDays.includes('saturday') && !selectedDays.includes('sunday') ? (
                    <span className="font-cinzel font-semibold">weekdays</span>
                  ) : (
                    <span className="font-cinzel font-semibold">
                      {selectedDays.map(day => daysOfWeek.find(d => d.id === day)?.label).join(', ')}
                    </span>
                  )}
                </>
              )}
              {pauseEnabled && (
                <>
                  , with a pause from{' '}
                  <span className="font-cinzel font-semibold text-primary">{timeOptions.find(t => t.value === pauseStartTime)?.label || pauseStartTime}</span> to{' '}
                  <span className="font-cinzel font-semibold text-primary">{timeOptions.find(t => t.value === pauseEndTime)?.label || pauseEndTime}</span>
                </>
              )}
            </p>
          </div>
        </CardContent>
        </Card>
    </div>;
};