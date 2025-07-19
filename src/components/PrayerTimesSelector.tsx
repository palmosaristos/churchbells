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

const prayerTraditions: PrayerTradition[] = [
  {
    name: "Roman Catholic",
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Cross structure */}
      <path d="M13.5 2h-3v6.5H4v3h6.5V22h3V11.5H20v-3h-6.5V2z" />
      {/* Christ figure */}
      <circle cx="12" cy="9" r="1.2" fill="currentColor" />
      <ellipse cx="12" cy="13" rx="1.5" ry="2.5" fill="currentColor" />
      <path d="M9.5 11.5l2.5 1.5 2.5-1.5" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <path d="M11 16.5v2.5M13 16.5v2.5" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
    </svg>,
    color: "burgundy",
    times: [
      { name: "Matins", time: "00:00", description: "Office of Readings during the night" },
      { name: "Lauds", time: "06:00", description: "Morning prayer at dawn" },
      { name: "Prime", time: "06:00", description: "First hour (historical)" },
      { name: "Tierce", time: "09:00", description: "Mid-morning prayer" },
      { name: "Sexte", time: "12:00", description: "Midday prayer" },
      { name: "None", time: "15:00", description: "Mid-afternoon prayer" },
      { name: "Vespers", time: "18:00", description: "Evening prayer at sunset" },
      { name: "Compline", time: "21:00", description: "Night prayer before rest" }
    ]
  },
  {
    name: "Orthodox",
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2v20M8 6h8M8 12h8M9 18h6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M9 18l6-2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>,
    color: "primary",
    times: [
      { name: "Midnight Office", time: "00:00", description: "Nocturnal prayer" },
      { name: "Matins", time: "04:00", description: "Pre-dawn prayer" },
      { name: "Prime", time: "06:00", description: "First hour" },
      { name: "Tierce", time: "09:00", description: "Third hour" },
      { name: "Sexte", time: "12:00", description: "Sixth hour" },
      { name: "None", time: "15:00", description: "Ninth hour" },
      { name: "Vespers", time: "18:00", description: "Evening prayer at sunset" },
      { name: "Compline", time: "21:00", description: "Prayer before rest" }
    ]
  },
  {
    name: "Anglican",
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 2h-3v6.5H4v3h6.5V22h3V11.5H20v-3h-6.5V2z" />
    </svg>,
    color: "amber",
    times: [
      { name: "Morning Prayer", time: "08:00", description: "Daily morning worship" },
      { name: "Evening Prayer", time: "17:00", description: "Daily evening worship" }
    ]
  }
];

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
  return (
    <div className="space-y-6">
      {/* Simple Prayer Time Selector */}
      <Card className="w-full bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Clock className="w-5 h-5 text-primary" />
            Custom Prayer Times
          </CardTitle>
          <CardDescription>
            Set your daily prayer times simply
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Choose the time when the bells will call you to your morning prayer
              </label>
              <input 
                type="time" 
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                defaultValue="06:00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Choose the time when the bells will call you to your evening prayer
              </label>
              <input 
                type="time" 
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                defaultValue="18:00"
              />
            </div>
          </div>
          <Button variant="sacred" className="w-full">
            Use These Times
          </Button>
        </CardContent>
      </Card>

      {/* Traditional Prayer Times */}
      <Card className="w-full bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Clock className="w-5 h-5 text-primary" />
          Prayer Times Traditions
        </CardTitle>
        <CardDescription>
          Choose from traditional Christian prayer schedules or create your own custom times
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTradition} onValueChange={onTraditionSelect} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {prayerTraditions.map((tradition) => (
              <TabsTrigger 
                key={tradition.name} 
                value={tradition.name}
                className="flex items-center gap-2"
              >
                {tradition.icon}
                <span className="hidden sm:inline">{tradition.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {prayerTraditions.map((tradition) => (
            <TabsContent key={tradition.name} value={tradition.name} className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {tradition.times.map((prayerTime, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs font-medium">
                          {prayerTime.time}
                        </Badge>
                        <span className="font-medium text-sm">{prayerTime.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {prayerTime.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="sacred" 
                className="w-full mt-4"
                onClick={() => onTimesSelect(tradition.times)}
              >
                Use {tradition.name} Schedule
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
    </div>
  );
};