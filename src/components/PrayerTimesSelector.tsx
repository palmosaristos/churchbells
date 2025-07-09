import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Cross, Church, Star } from "lucide-react";

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
    icon: <Cross className="w-4 h-4" />,
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
    icon: <Star className="w-4 h-4" />,
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
    icon: <Church className="w-4 h-4" />,
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
    <Card className="w-full">
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
  );
};