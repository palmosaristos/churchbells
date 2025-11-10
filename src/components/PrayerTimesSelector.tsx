import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bell, Church, Cross } from "lucide-react";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useState, useEffect } from "react";

const timeOptions = [
  { value: "00:00", label: "12:00 AM" },
  { value: "00:30", label: "12:30 AM" },
  { value: "01:00", label: "1:00 AM" },
  { value: "01:30", label: "1:30 AM" },
  { value: "02:00", label: "2:00 AM" },
  { value: "02:30", label: "2:30 AM" },
  { value: "03:00", label: "3:00 AM" },
  { value: "03:30", label: "3:30 AM" },
  { value: "04:00", label: "4:00 AM" },
  { value: "04:30", label: "4:30 AM" },
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
];

interface PrayerTime {
  name: string;
  time: string;
  description: string;
  selected?: boolean;
}

interface PrayerTradition {
  name: string;
  icon: React.ReactNode;
  color: string;
  times: PrayerTime[];
}

const prayerTraditions: PrayerTradition[] = [
  {
    name: "Roman Catholic",
    icon: <Cross className="h-5 w-5" />,
    color: "burgundy",
    times: [
      { name: "Matins", time: "00:00", description: "Office of Readings during the night" },
      { name: "Lauds", time: "06:00", description: "Morning prayer at dawn" },
      { name: "Prime", time: "07:00", description: "First hour" },
      { name: "Terce", time: "09:00", description: "Third hour" },
      { name: "Sext", time: "12:00", description: "Sixth hour (midday)" },
      { name: "None", time: "15:00", description: "Ninth hour" },
      { name: "Vespers", time: "18:00", description: "Evening prayer" },
      { name: "Compline", time: "21:00", description: "Night prayer" },
    ]
  },
  {
    name: "Orthodox",
    icon: <Church className="h-5 w-5" />,
    color: "gold",
    times: [
      { name: "Midnight Office", time: "00:00", description: "Vigil prayer" },
      { name: "Orthros", time: "06:00", description: "Morning office" },
      { name: "First Hour", time: "07:00", description: "Early morning" },
      { name: "Third Hour", time: "09:00", description: "Mid-morning" },
      { name: "Sixth Hour", time: "12:00", description: "Midday" },
      { name: "Ninth Hour", time: "15:00", description: "Afternoon" },
      { name: "Vespers", time: "18:00", description: "Evening service" },
      { name: "Apodeipnon", time: "21:00", description: "Compline" },
    ]
  },
  {
    name: "Anglican",
    icon: <Bell className="h-5 w-5" />,
    color: "blue",
    times: [
      { name: "Morning Prayer", time: "06:00", description: "Dawn worship" },
      { name: "Midday Prayer", time: "12:00", description: "Noon devotion" },
      { name: "Evening Prayer", time: "18:00", description: "Evensong" },
      { name: "Compline", time: "21:00", description: "Night prayer" },
    ]
  },
];

interface PrayerTimesSelectorProps {
  selectedTradition?: string;
  onTraditionSelect?: (tradition: string) => void;
  onTimesSelect?: (times: PrayerTime[]) => void;
  morningCallType?: string;
  eveningCallType?: string;
  onCallTypeChange?: (type: 'morning' | 'evening', callType: string) => void;
  morningReminders?: string[];
  eveningReminders?: string[];
  onRemindersChange?: (type: 'morning' | 'evening', reminders: string[]) => void;
  timeZone?: string;
  onPrayerConfigChange?: (config: any) => void;
}

export const PrayerTimesSelector = ({
  selectedTradition = 'Roman Catholic',
  onTraditionSelect,
  onTimesSelect,
  timeZone = 'UTC',
}: PrayerTimesSelectorProps) => {
  const tradition = prayerTraditions.find(t => t.name === selectedTradition) || prayerTraditions[0];
  const [localTimes, setLocalTimes] = useState<PrayerTime[]>(
    tradition.times.map(t => ({ ...t, selected: false }))
  );

  const current = useCurrentTime({ timeZone });

  useEffect(() => {
    const trad = prayerTraditions.find(t => t.name === selectedTradition);
    if (trad) {
      setLocalTimes(trad.times.map(t => ({ ...t, selected: false })));
    }
  }, [selectedTradition]);

  const toggleTimeSelect = (idx: number) => {
    const updated = [...localTimes];
    updated[idx].selected = !updated[idx].selected;
    setLocalTimes(updated);
    onTimesSelect?.(updated.filter(t => t.selected));
  };

  const handleTimeChange = (idx: number, newTime: string) => {
    const updated = [...localTimes];
    updated[idx].time = newTime;
    setLocalTimes(updated);
  };

  const getTimeDisplay = (time: string, name: string): string => {
    if (!time) return `${name}: Not set`;
    
    const [h, m] = time.split(':').map(Number);
    const todayPrayer = new Date(current.raw);
    todayPrayer.setHours(h, m, 0, 0);
    
    const isPast = todayPrayer < current.raw;
    
    const ampmTime = todayPrayer.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true,
      timeZone 
    });
    
    let display = `${name} at ${ampmTime}`;
    
    if (current.isValidTZ && timeZone !== 'UTC') {
      display += ` (${timeZone.replace('/', ' ')})`;
    }
    
    if (isPast) {
      display += ` (next day)`;
    }
    
    return display;
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 to-secondary/30 dark:from-amber-950/20 dark:to-secondary/10 border-2 border-amber-200/30 dark:border-amber-800/20 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:border-amber-300/40">
      <CardHeader>
        <CardTitle className="text-2xl font-cormorant text-center">Prayer Times</CardTitle>
        <CardDescription className="text-center">Select tradition and times for bell calls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={selectedTradition} onValueChange={onTraditionSelect}>
          <TabsList className="grid w-full grid-cols-3">
            {prayerTraditions.map(trad => (
              <TabsTrigger key={trad.name} value={trad.name} className="flex items-center gap-2">
                {trad.icon}
                <span className="hidden sm:inline">{trad.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {prayerTraditions.map(trad => (
            <TabsContent key={trad.name} value={trad.name} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-lg font-semibold">Select Times</Label>
                {trad.times.map((time, idx) => (
                  <div key={time.name} className="flex items-center space-x-2 p-3 rounded-md bg-background/50 border border-border/50">
                    <Checkbox 
                      id={`time-${idx}`} 
                      checked={localTimes[idx]?.selected || false} 
                      onCheckedChange={() => toggleTimeSelect(idx)} 
                    />
                    <Label htmlFor={`time-${idx}`} className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">{getTimeDisplay(time.time, time.name)}</p>
                        <p className="text-sm text-muted-foreground">{time.description}</p>
                      </div>
                    </Label>
                    <Select value={time.time} onValueChange={(newTime) => handleTimeChange(idx, newTime)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
