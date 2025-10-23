import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Volume2 } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { formatTimeToAMPM } from "@/lib/utils";
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

  const applyPreset = (preset: 'weekend' | '24-7') => {
    if (preset === 'weekend') {
      onSelectedDaysChange?.(['saturday', 'sunday']);
      onStartTimeChange('08:00');
      onEndTimeChange('20:00');
      onPauseEnabledChange?.(false);
    } else if (preset === '24-7') {
      onSelectedDaysChange?.(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
      onStartTimeChange('00:00');
      onEndTimeChange('23:30');
      onPauseEnabledChange?.(false);
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
          {/* Quick Presets */}
          <div className="space-y-3">
            <Label className="text-lg font-cormorant text-muted-foreground text-center block">Quick Configurations</Label>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                type="button"
                variant="outline"
                onClick={() => applyPreset('weekend')}
                className="font-cormorant text-lg"
              >
                Weekend uniquement
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => applyPreset('24-7')}
                className="font-cormorant text-lg"
              >
                24/7
              </Button>
            </div>
          </div>
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

          {/* Days of Week Selector */}
          <div className="space-y-3">
            <Label className="text-xl font-cormorant text-foreground">Active Days</Label>
            <div className="flex flex-wrap gap-3 justify-center">
              {daysOfWeek.map(day => <button key={day.id} type="button" onClick={() => handleDayToggle(day.id)} className={`w-14 h-14 rounded-full font-cormorant text-lg transition-all border-2 ${selectedDays.includes(day.id) ? 'bg-primary text-primary-foreground border-amber-500 shadow-md' : 'bg-background text-muted-foreground border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600'}`}>
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
                
                <div className="space-y-2">
                  <Label htmlFor="pause-end-time" className="flex items-center gap-2 text-lg font-cormorant text-foreground">
                    <Clock className="w-5 h-5 text-green-600" />
                    Pause End
                  </Label>
                  <Select value={pauseEndTime} onValueChange={onPauseEndTimeChange}>
                    <SelectTrigger id="pause-end-time">
                      <SelectValue placeholder="Select pause end time" />
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
                  <span className="font-cinzel font-semibold text-red-600">{formatTimeToAMPM(pauseStartTime)}</span> to{' '}
                  <span className="font-cinzel font-semibold text-green-600">{formatTimeToAMPM(pauseEndTime)}</span>
                </p>
              </div>}
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-red-50/30 to-orange-50/30 dark:from-red-950/10 dark:to-orange-950/10 border">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <Label htmlFor="half-hour-switch" className="text-xl font-cormorant text-foreground">
                Chime every half hour
              </Label>
            </div>
            <Switch id="half-hour-switch" checked={halfHourChimes} onCheckedChange={onHalfHourChimesChange} disabled={!onHalfHourChimesChange} />
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-br from-red-50/30 to-orange-50/30 dark:from-red-950/10 dark:to-orange-950/10 border">
            <p className="text-xl text-foreground font-cormorant text-center">
              Bells will chime every {halfHourChimes ? 'half hour' : 'hour'} from{' '}
              <span className="font-cinzel font-semibold text-primary">{formatTimeToAMPM(startTime)}</span> to{' '}
              <span className="font-cinzel font-semibold text-primary">{formatTimeToAMPM(endTime)}</span>
            </p>
          </div>
        </CardContent>
        </Card>
    </div>;
};