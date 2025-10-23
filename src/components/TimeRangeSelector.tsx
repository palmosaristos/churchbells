import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Volume2 } from "lucide-react";
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
  onSelectedDaysChange
}: TimeRangeSelectorProps) => {
  const handleDayToggle = (dayId: string) => {
    if (!onSelectedDaysChange) return;
    if (selectedDays.includes(dayId)) {
      onSelectedDaysChange(selectedDays.filter(d => d !== dayId));
    } else {
      onSelectedDaysChange([...selectedDays, dayId]);
    }
  };
  return <div className="space-y-6">
      <Card className="w-full bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-cormorant text-3xl text-foreground text-center">
            Daily Bell Schedule
          </CardTitle>
          <CardDescription className="font-cormorant text-xl text-foreground">Set the hours when bells will ring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-time" className="flex items-center gap-2 text-3xl font-cormorant text-foreground">
                <img src={ultraRealisticBellIcon} alt="Start Bell" className="w-10 h-10 object-contain" />
                Start Time
              </Label>
              <Select value={startTime} onValueChange={onStartTimeChange}>
                <SelectTrigger id="start-time">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-time" className="flex items-center gap-2 text-3xl font-cormorant text-foreground">
                <img src={ultraRealisticBellIcon} alt="End Bell" className="w-10 h-10 object-contain" />
                End Time
              </Label>
              <Select value={endTime} onValueChange={onEndTimeChange}>
                <SelectTrigger id="end-time">
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

          {/* Quick Configurations */}
          <div className="space-y-3">
            <Label className="text-3xl font-cormorant text-foreground">Quick Configurations</Label>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  onStartTimeChange("00:00");
                  onEndTimeChange("23:30");
                  if (onSelectedDaysChange) {
                    onSelectedDaysChange(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
                  }
                }}
                className="px-4 py-2 rounded-lg font-cormorant text-lg bg-primary/10 hover:bg-primary/20 text-foreground transition-all"
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
                className="px-4 py-2 rounded-lg font-cormorant text-lg bg-primary/10 hover:bg-primary/20 text-foreground transition-all"
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
                className="px-4 py-2 rounded-lg font-cormorant text-lg bg-primary/10 hover:bg-primary/20 text-foreground transition-all"
                aria-label="Configuration week-end uniquement"
              >
                Only the weekend
              </button>
            </div>
          </div>

          {/* Days of Week Selector */}
          <div className="space-y-3">
            <Label className="text-3xl font-cormorant text-foreground">Active Days</Label>
            <div className="flex flex-wrap gap-2 justify-center">
              {daysOfWeek.map(day => <button key={day.id} type="button" onClick={() => handleDayToggle(day.id)} className={`px-4 py-2 rounded-lg font-cormorant text-lg transition-all ${selectedDays.includes(day.id) ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                  {day.label}
                </button>)}
            </div>
          </div>
          
          {/* Pause Period */}
          <div className="space-y-4 p-4 rounded-lg border bg-gradient-to-br from-red-50/30 to-orange-50/30 dark:from-red-950/10 dark:to-orange-950/10">
            <div className="flex items-center justify-between">
              <Label htmlFor="pause-switch" className="text-xl font-cormorant text-foreground">
                Enable pause period
              </Label>
              <Switch id="pause-switch" checked={pauseEnabled} onCheckedChange={onPauseEnabledChange} disabled={!onPauseEnabledChange} />
            </div>
            
            {pauseEnabled && <div className="grid gap-4 md:grid-cols-2 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="pause-start-time" className="flex items-center gap-2 text-lg font-cormorant text-foreground">
                    <Clock className="w-5 h-5 text-red-600" />
                    Pause Start
                  </Label>
                  <Select value={pauseStartTime} onValueChange={onPauseStartTimeChange}>
                    <SelectTrigger id="pause-start-time">
                      <SelectValue placeholder="Select pause start time" />
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
                  <span className="font-cinzel font-semibold text-red-600">{pauseStartTime}</span> to{' '}
                  <span className="font-cinzel font-semibold text-green-600">{pauseEndTime}</span>
                </p>
              </div>}
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-dawn border">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <Label htmlFor="half-hour-switch" className="text-xl font-cormorant text-foreground">
                Chime every half hour
              </Label>
            </div>
            <Switch id="half-hour-switch" checked={halfHourChimes} onCheckedChange={onHalfHourChimesChange} disabled={!onHalfHourChimesChange} />
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-dawn border">
            <p className="text-xl text-foreground font-cormorant text-center">
              Bells will chime every {halfHourChimes ? 'half hour' : 'hour'} from{' '}
              <span className="font-cinzel font-semibold text-primary">{startTime}</span> to{' '}
              <span className="font-cinzel font-semibold text-primary">{endTime}</span>
            </p>
          </div>
        </CardContent>
        </Card>
    </div>;
};