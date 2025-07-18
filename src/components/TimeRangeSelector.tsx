import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sunrise, Sunset } from "lucide-react";

interface TimeRangeSelectorProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

const timeOptions = [
  { value: "05:00", label: "5:00 AM" },
  { value: "06:00", label: "6:00 AM" },
  { value: "07:00", label: "7:00 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "21:00", label: "9:00 PM" },
  { value: "22:00", label: "10:00 PM" },
  { value: "23:00", label: "11:00 PM" },
  { value: "00:00", label: "12:00 AM" },
];

export const TimeRangeSelector = ({ 
  startTime, 
  endTime, 
  onStartTimeChange, 
  onEndTimeChange 
}: TimeRangeSelectorProps) => {
  return (
    <Card className="w-full bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Sunrise className="w-5 h-5 text-amber" />
          Daily Bell Schedule
        </CardTitle>
        <CardDescription>
          Set the hours during which church bells will chime
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="start-time" className="flex items-center gap-2 text-sm font-medium">
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
            <Label htmlFor="end-time" className="flex items-center gap-2 text-sm font-medium">
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
        
        <div className="p-4 rounded-lg bg-gradient-dawn border">
          <p className="text-sm text-primary text-center">
            Bells will chime every hour from{' '}
            <span className="font-semibold text-primary">{startTime}</span> to{' '}
            <span className="font-semibold text-primary">{endTime}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};