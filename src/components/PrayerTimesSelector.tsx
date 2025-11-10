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

// timeOptions dupliqué de TimeRangeSelector (labels AM/PM, values 24h – maintenu)
const timeOptions = [
  { value: "00:00", label: "12:00 AM" },
  { value: "00:30", label: "12:30 AM" },
  // ... (full list from previous TimeRangeSelector, e.g., { value: "06:00", label: "6:00 AM" }, up to "23:30" "11:30 PM")
  // Assure full 24h coverage pour prayers (dawn/nocturnal)
];

interface PrayerTime {
  name: string;
  time: string;  // 24h "HH:MM" interne
  description: string;
  selected?: boolean;
}

interface PrayerTradition {
  name: string;
  icon: React.ReactNode;
  color: string;
  times: PrayerTime[];
}

const prayerTraditions: PrayerTradition[] = [  // Inchangé
  // ... (Roman Catholic, Orthodox, Anglican comme fourni – times en 24h "HH:MM")
  {
    name: "Roman Catholic",
    icon: /* SVG croix */,
    color: "burgundy",
    times: [
      { name: "Matins", time: "00:00", description: "Office of Readings during the night" },
      { name: "Lauds", time: "06:00", description: "Morning prayer at dawn" },
      // ... (autres times en 24h)
    ]
  },
  // ... (Orthodox, Anglican)
];

interface PrayerTimesSelectorProps {
  // ... (props idem précédent)
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

  // Current time pour validation
  const current = useCurrentTime({ timeZone });

  useEffect(() => {
    const tradition = prayerTraditions.find(t => t.name === selectedTradition);
    if (tradition) {
      setLocalTimes(tradition.times.map(t => ({ ...t, selected: false })));
    }
  }, [selectedTradition]);

  // ... (handleTraditionSelect, toggleTimeSelect, handleReminderChange inchangés)

  // getTimeDisplay : Maintenir AM/PM (toLocaleTimeString hour12: true)
  const getTimeDisplay = (time: string, name: string): string => {
    if (!time) return `${name}: Not set`;
    
    const [h, m] = time.split(':').map(Number);
    const todayPrayer = new Date(current.raw);  // Base today TZ
    todayPrayer.setHours(h, m, 0, 0);
    
    const isPast = todayPrayer < current.raw;
    const isSoon = Math.abs(todayPrayer.getTime() - current.raw.getTime()) < 300000;  // <5min
    
    // AM/PM display (user-friendly)
    const ampmTime = todayPrayer.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true,  // Force AM/PM
      timeZone 
    }).toLowerCase();  // e.g., "6:00 am"
    
    let display = `${name} at ${ampmTime.toUpperCase()}`;  // "LAUDS AT 6:00 AM"
    
    if (current.isValidTZ && timeZone !== 'UTC') {
      display += ` (${timeZone.replace('/', ' ')})`;
    }
    
    if (isPast) {
      const next = new Date(todayPrayer);
      next.setDate(next.getDate() + 1);
      const nextAmpm = next.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true, 
        timeZone 
      }).toLowerCase();
      display += ` (next day at ${nextAmpm.toUpperCase()})`;
    } else if (isSoon) {
      display = `Now! ${display}`;
    }
    
    return display;
  };

  // ... (useEffect persistence inchangé – config avec 24h times)

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 to-secondary/30 dark:from-amber-950/20 dark:to-secondary/10 border-2 border-amber-200/30 dark:border-amber-800/20 shadow-warm backdrop-blur-sm transition-all hover:shadow-xl hover:border-amber-300/40">
      <CardHeader>
        <CardTitle className="text-2xl font-cormorant text-center">Prayer Times</CardTitle>
        <CardDescription>Select tradition and times for bell calls (AM/PM times)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tabs Traditions inchangé */}
        
        {prayerTraditions.map(trad => (
          <TabsContent key={trad.name} value={trad.name} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Select Times</Label>
              {trad.times.map((time, idx) => (
                <div key={time.name} className="flex items-center space-x-2 p-2 rounded-md bg-white/50 dark:bg-slate-800/50">
                  <Checkbox id={`time-${idx}`} checked={localTimes[idx]?.selected || false} onCheckedChange={() => toggleTimeSelect(idx)} />
                  <Label htmlFor={`time-${idx}`} className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">{getTimeDisplay(time.time, time.name)}</p>  {/* AM/PM here */}
                      <p className="text-sm text-muted-foreground">{time.description}</p>
                    </div>
                  </Label>
                  {/* Custom Select: Labels AM/PM, value 24h */}
                  <Select value={time.time} onValueChange={(newTime) => {  // newTime = "06:00"
                    const updated = [...localTimes];
                    updated[idx].time = newTime;  // Keep 24h internal
                    setLocalTimes(updated);
                  }}>
                    <SelectTrigger className="w-32">  {/* Wider for AM/PM label */}
                      <SelectValue />
