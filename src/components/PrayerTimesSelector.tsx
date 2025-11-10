import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";  // Pour select multiple times
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";  // Pour custom minutes reminders
import { Label } from "@/components/ui/label";
import { Clock, Volume2, Bell } from "lucide-react";
import { useCurrentTime } from "@/hooks/useCurrentTime";  // Validation TZ/next
import { useState, useEffect } from "react";  // Local state pour selects/checks

interface PrayerTime {
  name: string;
  time: string;  // HH:MM 24h
  description: string;
  selected?: boolean;  // Ajout pour multi-select
}

interface PrayerTradition {
  name: string;
  icon: React.ReactNode;
  color: string;
  times: PrayerTime[];
}

const prayerTraditions: PrayerTradition[] = [  // Inchangé (Roman/Orthodox/Anglican)
  // ... (copie les définitions fournies)
  {
    name: "Roman Catholic",
    icon: /* SVG croix */,
    color: "burgundy",
    times: [
      { name: "Matins", time: "00:00", description: "Office of Readings during the night" },
      { name: "Lauds", time: "06:00", description: "Morning prayer at dawn" },  // Map to morning
      { name: "Prime", time: "06:00", description: "First hour (historical)" },
      { name: "Tierce", time: "09:00", description: "Mid-morning prayer" },
      { name: "Sexte", time: "12:00", description: "Midday prayer" },
      { name: "None", time: "15:00", description: "Mid-afternoon prayer" },
      { name: "Vespers", time: "18:00", description: "Evening prayer at sunset" },  // Map to evening
      { name: "Compline", time: "21:00", description: "Night prayer before rest" }
    ]
  },
  // ... (Orthodox et Anglican similaires, focus Lauds/Matins→morning, Vespers/Compline→evening)
];

interface PrayerTimesSelectorProps {
  selectedTradition: string;
  onTraditionSelect: (tradition: string) => void;
  onTimesSelect: (times: PrayerTime[]) => void;  // Selected times array
  morningCallType?: 'short' | 'long';  // Sound for morning
  eveningCallType?: 'short' | 'long';  // Sound for evening
  onCallTypeChange?: (type: { morning: 'short' | 'long', evening: 'short' | 'long' }) => void;
  morningReminders?: string[];  // e.g., ["5","10"]
  eveningReminders?: string[];  // Minutes before
  onRemindersChange?: (reminders: { morning: string[], evening: string[] }) => void;
  timeZone?: string;  // TZ for display/validation
  onPrayerConfigChange?: (config: Partial<{ morningPrayerTime: string, eveningPrayerTime: string, morningPrayerName: string, eveningPrayerName: string, reminders: { morning: string[], evening: string[] }, callType: { morning: string, evening: string } }>) => void;  // Batch persist
}

export const PrayerTimesSelector = ({
  selectedTradition = 'Roman Catholic',
  onTraditionSelect,
  onTimesSelect,
  morningCallType = 'short',
  eveningCallType = 'short',
  onCallTypeChange,
  morningReminders = ['5'],
  eveningReminders = ['5'],
  onRemindersChange,
  timeZone = 'UTC',
  onPrayerConfigChange
}: PrayerTimesSelectorProps) => {
  const [localTimes, setLocalTimes] = useState<PrayerTime[]>(prayerTraditions.find(t => t.name === selectedTradition)?.times || []);
  const [callTypes, setCallTypes] = useState({ morning: morningCallType, evening: eveningCallType });
  const [reminders, setReminders] = useState({ morning: morningReminders, evening: eveningReminders });

  // Current time pour next validation
  const current = useCurrentTime({ timeZone });

  useEffect(() => {
    const tradition = prayerTraditions.find(t => t.name === selectedTradition);
    if (tradition) {
      setLocalTimes(tradition.times.map(t => ({ ...t, selected: false })));  // Reset selects
    }
  }, [selectedTradition]);

  // Persistence (batch pour parent/scheduler)
  useEffect(() => {
    const config = {
      morningPrayerTime: /* map Lauds/Matins time */,
      eveningPrayerTime: /* map Vespers/Compline */,
      morningPrayerName: 'Morning Prayer',  // From selected
      eveningPrayerName: 'Evening Prayer',
      reminders,
      callType: callTypes
    };
    if (onPrayerConfigChange) onPrayerConfigChange(config);
    localStorage.setItem('prayerConfig', JSON.stringify(config));
    if (onRemindersChange) onRemindersChange(reminders);
    if (onCallTypeChange) onCallTypeChange(callTypes);
  }, [localTimes, callTypes, reminders]);

  const handleTraditionSelect = (trad: string) => {
    onTraditionSelect(trad);
  };

  const toggleTimeSelect = (index: number) => {
    const updated = [...localTimes];
    updated[index].selected = !updated[index].selected;
    setLocalTimes(updated);
    const selectedTimes = updated.filter(t => t.selected);
    onTimesSelect(selectedTimes);  // Output selected (parent map to morning/evening)
  };

  const getTimeDisplay = (time: string, name: string): string => {
    const [h, m] = time.split(':').map(Number);
    const todayPrayer = new Date();
    todayPrayer.setHours(h, m, 0, 0);
    const isPast = todayPrayer < current.raw;
    let display = `${name} at ${time}`;
    if (current.isValidTZ && timeZone !== 'UTC') {
      display += ` (${timeZone.replace('/', ' ')})`;
    }
    if (isPast) {
      const next = new Date(todayPrayer);
      next.setDate(next.getDate() + 1);
      display += ` (next day)`;
    }
    return display;
  };

  const handleReminderChange = (type: 'morning' | 'evening', value: string) => {
    const newRem = [...reminders[type]];
    const idx = newRem.indexOf(value);
    if (idx > -1) newRem.splice(idx, 1);
    else newRem.push(value);
    setReminders({ ...reminders, [type]: newRem });
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 to-secondary/30 dark:from-amber-950/20 dark:to-secondary/10 border-2 border-amber-200/30 dark:border-amber-800/20 shadow-warm backdrop-blur-sm transition-all hover:shadow-xl hover:border-amber-300/40">
      <CardHeader>
        <CardTitle className="text-2xl font-cormorant text-center">Prayer Times</CardTitle>
        <CardDescription>Select tradition and times for bell calls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tabs for Traditions */}
        <Tabs value={selectedTradition} onValueChange={handleTraditionSelect} className="w-full">
          <TabsList className="grid w-full grid-cols-3">  // 3 cols for traditions
            {prayerTraditions.map(trad => (
              <TabsTrigger key={trad.name} value={trad.name} className={`data-[state=active]:bg-${trad.color}-500 data-[state=active]:text-white`}>
                {trad.icon} {trad.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {prayerTraditions.map(trad => (
            <TabsContent key={trad.name} value={trad.name} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-lg font-semibold">Select Times</Label>
                {trad.times.map((time, idx) => (
                  <div key={time.name} className="flex items-center space-x-2 p-2 rounded-md bg-white/50 dark:bg-slate-800/50">
                    <Checkbox id={`time-${idx}`} checked={localTimes[idx]?.selected || false} onCheckedChange={() => toggleTimeSelect(idx)} />
                    <Label htmlFor={`time-${idx}`} className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">{getTimeDisplay(time.time, time.name)}</p>  // With validation
                        <p className="text-sm text-muted-foreground">{time.description}</p>
                      </div>
                    </Label>
                    {/* Custom time override? */}
                    <Select value={time.time} onValueChange={(newTime) => {
                      const updated = [...localTimes];
                      updated[idx].time = newTime;
                      setLocalTimes(updated);
                    }}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {/* timeOptions from TimeRangeSelector */}
                        {timeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              {/* Call Types */}
              <div className="space-y-2">
                <Label>Morning Call Type</Label>
                <div className="flex gap-2">
                  {['short', 'long'].map(type => (
                    <Button key={type} variant={callTypes.morning === type ? 'default' : 'outline'} onClick={() => setCallTypes({ ...callTypes, morning: type as any })}>
                      {type.charAt(0).toUpperCase() + type.slice(1)} Call
                    </Button>
                  ))}
                </div>
                <Label>Evening Call Type</Label>
                <div className="flex gap-2">
                  {['short', 'long'].map(type => (
                    <Button key={type} variant={callTypes.evening === type ? 'default' : 'outline'} onClick={() => setCallTypes({ ...callTypes, evening: type as any })}>
                      {type.charAt(0).toUpperCase() + type.slice(1)} Call
                    </Button>
                  ))}
                </div>
              </div>

              {/* Reminders (Toasts only) */}
              <div className="space-y-2">
                <Label>Morning Reminders (minutes before, toasts only)</Label>
                <div className="flex gap-2 flex-wrap">
                  {['5', '10', '15', '30'].map(min => (
                    <Badge key={min} variant={reminders.morning.includes(min) ? 'default' : 'secondary'} 
                           onClick={() => handleReminderChange('morning', min)}>
                      {min}min
                    </Badge>
                  ))}
                  <Input placeholder="Custom min" className="w-20" onKeyDown={(e) => { if (e.key === 'Enter') handleReminderChange('morning', e.currentTarget.value); }} />
                </div>
                {/* Similar for evening */}
                <Label className="mt-4">Evening Reminders</Label>
                <div className="flex gap-2 flex-wrap">
                  {['5', '10', '15', '30'].map(min => (
                    <Badge key={min} variant={reminders.evening.includes(min) ? 'default' : 'secondary'} 
                           onClick={() => handleReminderChange('evening', min)}>
                      {min}min
                    </Badge>
                  ))}
                  <Input placeholder="Custom min" className="w-20" onKeyDown={(e) => { if (e.key === 'Enter') handleReminderChange('evening', e.currentTarget.value); }} />
                </div>
              </div>

              <Button onClick={() => onTimesSelect(localTimes.filter(t => t.selected))} className="w-full">
                <Bell className="w-4 h-4 mr-2" /> Apply Selected Times
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
