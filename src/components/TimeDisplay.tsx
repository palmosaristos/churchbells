import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { timeZones } from "@/data/timeZones";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import churchClockImage from "@/assets/church-clock.jpg";

interface TimeDisplayProps {
  selectedTimeZone: string;
  onTimeZoneChange: (timeZone: string) => void;
}

export const TimeDisplay = ({ selectedTimeZone, onTimeZoneChange }: TimeDisplayProps) => {
  const currentTime = useCurrentTime(selectedTimeZone);

  return (
    <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-cinzel font-bold text-amber-800 dark:text-amber-200 mb-4">
            Your time zone
          </h2>
          <div className="flex items-center justify-center gap-6">
            <div className="relative">
              <img 
                src={churchClockImage} 
                alt="Church Clock" 
                className="w-20 h-20 object-contain filter drop-shadow-lg"
              />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-6xl font-cinzel font-bold text-amber-800 dark:text-amber-200 tracking-wide">
                {currentTime}
              </h3>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/20 rounded-full border border-amber-200/30 dark:border-amber-700/30">
              <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <Select value={selectedTimeZone} onValueChange={onTimeZoneChange}>
                <SelectTrigger className="border-0 bg-transparent text-amber-700 dark:text-amber-300 font-cormorant focus:ring-0 p-0 h-auto">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-black/95 backdrop-blur-md border-amber-200/50 dark:border-amber-800/50">
                  {timeZones.map(tz => (
                    <SelectItem key={tz.value} value={tz.value} className="text-amber-800 dark:text-amber-200">
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
