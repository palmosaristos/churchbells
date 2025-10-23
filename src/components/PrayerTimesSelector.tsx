import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
interface PrayerTime {
  name: string;
  time: string;
  description: string;
}
interface PrayerTradition {
  name: string;
  icon: React.ReactNode;
  color: string;
  times: PrayerTime[];
}
const prayerTraditions: PrayerTradition[] = [{
  name: "Roman Catholic",
  icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Cross structure */}
      <path d="M13.5 2h-3v6.5H4v3h6.5V22h3V11.5H20v-3h-6.5V2z" />
      {/* Christ figure */}
      <circle cx="12" cy="9" r="1.2" fill="currentColor" />
      <ellipse cx="12" cy="13" rx="1.5" ry="2.5" fill="currentColor" />
      <path d="M9.5 11.5l2.5 1.5 2.5-1.5" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M11 16.5v2.5M13 16.5v2.5" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>,
  color: "burgundy",
  times: [{
    name: "Matins",
    time: "00:00",
    description: "Office of Readings during the night"
  }, {
    name: "Lauds",
    time: "06:00",
    description: "Morning prayer at dawn"
  }, {
    name: "Prime",
    time: "06:00",
    description: "First hour (historical)"
  }, {
    name: "Tierce",
    time: "09:00",
    description: "Mid-morning prayer"
  }, {
    name: "Sexte",
    time: "12:00",
    description: "Midday prayer"
  }, {
    name: "None",
    time: "15:00",
    description: "Mid-afternoon prayer"
  }, {
    name: "Vespers",
    time: "18:00",
    description: "Evening prayer at sunset"
  }, {
    name: "Compline",
    time: "21:00",
    description: "Night prayer before rest"
  }]
}, {
  name: "Orthodox",
  icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2v20M8 6h8M8 12h8M9 18h6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M9 18l6-2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>,
  color: "primary",
  times: [{
    name: "Midnight Office",
    time: "00:00",
    description: "Nocturnal prayer"
  }, {
    name: "Matins",
    time: "04:00",
    description: "Pre-dawn prayer"
  }, {
    name: "Prime",
    time: "06:00",
    description: "First hour"
  }, {
    name: "Tierce",
    time: "09:00",
    description: "Third hour"
  }, {
    name: "Sexte",
    time: "12:00",
    description: "Sixth hour"
  }, {
    name: "None",
    time: "15:00",
    description: "Ninth hour"
  }, {
    name: "Vespers",
    time: "18:00",
    description: "Evening prayer at sunset"
  }, {
    name: "Compline",
    time: "21:00",
    description: "Prayer before rest"
  }]
}, {
  name: "Anglican",
  icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 2h-3v6.5H4v3h6.5V22h3V11.5H20v-3h-6.5V2z" />
    </svg>,
  color: "amber",
  times: [{
    name: "Morning Prayer",
    time: "08:00",
    description: "Daily morning worship"
  }, {
    name: "Evening Prayer",
    time: "17:00",
    description: "Daily evening worship"
  }]
}];
interface PrayerTimesSelectorProps {
  selectedTradition: string;
  onTraditionSelect: (tradition: string) => void;
  onTimesSelect: (times: PrayerTime[]) => void;
}
export const PrayerTimesSelector = ({
  selectedTradition,
  onTraditionSelect,
  onTimesSelect
}: PrayerTimesSelectorProps) => {
  return <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 border-2 border-primary/20 dark:border-primary/10 shadow-warm backdrop-blur-sm transition-all hover:shadow-xl hover:border-primary/30">
      
      
    </Card>;
};