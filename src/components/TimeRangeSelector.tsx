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

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${hour}:00` };
});

export const TimeRangeSelector = ({ 
  startTime, 
  endTime, 
  onStartTimeChange, 
  onEndTimeChange 
}: TimeRangeSelectorProps) => {
  return (
    <Card className="w-full">
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