import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Sunrise, Sunset, Clock, Sun, Moon } from "lucide-react";

interface TimeRangeSelectorProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  halfHourChimes?: boolean;
  onHalfHourChimesChange?: (enabled: boolean) => void;
  morningPrayerTime?: string;
  eveningPrayerTime?: string;
  onMorningPrayerTimeChange?: (time: string) => void;
  onEveningPrayerTimeChange?: (time: string) => void;
}

const timeOptions = [
  { value: "05:00", label: "5:00 AM" },
  { value: "05:30", label: "5:30 AM" },
  { value: "06:00", label: "6:00 AM" },
  { value: "06:30", label: "6:30 AM" },
  { value: "07:00", label: "7:00 AM" },
  { value: "07:30", label: "7:30 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "08:30", label: "8:30 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "09:30", label: "9:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "13:30", label: "1:30 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "14:30", label: "2:30 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "15:30", label: "3:30 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "16:30", label: "4:30 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "17:30", label: "5:30 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "18:30", label: "6:30 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "19:30", label: "7:30 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "20:30", label: "8:30 PM" },
  { value: "21:00", label: "9:00 PM" },
  { value: "21:30", label: "9:30 PM" },
  { value: "22:00", label: "10:00 PM" },
  { value: "22:30", label: "10:30 PM" },
  { value: "23:00", label: "11:00 PM" },
  { value: "23:30", label: "11:30 PM" },
  { value: "00:00", label: "12:00 AM" },
  { value: "00:30", label: "12:30 AM" },
];

export const TimeRangeSelector = ({ 
  startTime, 
  endTime, 
  onStartTimeChange, 
  onEndTimeChange,
  halfHourChimes = false,
  onHalfHourChimesChange,
  morningPrayerTime = "06:00",
  eveningPrayerTime = "18:00",
  onMorningPrayerTimeChange,
  onEveningPrayerTimeChange
}: TimeRangeSelectorProps) => {
  return (
    <div className="space-y-6">
      <Card className="w-full bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-cinzel">
            <Sunrise className="w-5 h-5 text-amber" />
            Daily Bell Schedule
          </CardTitle>
          <CardDescription className="font-cormorant text-base text-foreground">
            Set the hours during which church bells will chime
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-time" className="flex items-center gap-2 text-base font-cormorant text-foreground">
                <Sunrise className="w-4 h-4 text-amber" />
                Start Time
              </Label>
              <Select value={startTime} onValueChange={onStartTimeChange}>
                <SelectTrigger id="start-time">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-time" className="flex items-center gap-2 text-base font-cormorant text-foreground">
                <Sunset className="w-4 h-4 text-burgundy" />
                End Time
              </Label>
              <Select value={endTime} onValueChange={onEndTimeChange}>
                <SelectTrigger id="end-time">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-dawn border">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <Label htmlFor="half-hour-switch" className="text-base font-cormorant text-foreground">
                Chime every half hour
              </Label>
            </div>
            <Switch
              id="half-hour-switch"
              checked={halfHourChimes}
              onCheckedChange={onHalfHourChimesChange}
              disabled={!onHalfHourChimesChange}
            />
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-dawn border">
            <p className="text-base text-foreground font-cormorant text-center">
              Bells will chime every {halfHourChimes ? 'half hour' : 'hour'} from{' '}
              <span className="font-cinzel font-semibold text-primary">{startTime}</span> to{' '}
              <span className="font-cinzel font-semibold text-primary">{endTime}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Prayer Times Selector */}
      <Card className="w-full bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-cormorant text-xl text-foreground">
            <Clock className="w-5 h-5 text-primary" />
            Prayer Times
          </CardTitle>
          <CardDescription className="font-cormorant text-base text-foreground">
            Set your preferred times for morning and evening prayers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="morning-prayer" className="flex items-center gap-2 text-base font-cormorant text-foreground">
                <Sun className="w-4 h-4 text-amber-500" />
                Morning Prayer
              </Label>
              <Input
                id="morning-prayer"
                type="time"
                value={morningPrayerTime}
                onChange={(e) => onMorningPrayerTimeChange?.(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="evening-prayer" className="flex items-center gap-2 text-base font-cormorant text-foreground">
                <Moon className="w-4 h-4 text-blue-500" />
                Evening Prayer
              </Label>
              <Input
                id="evening-prayer"
                type="time"
                value={eveningPrayerTime}
                onChange={(e) => onEveningPrayerTimeChange?.(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};