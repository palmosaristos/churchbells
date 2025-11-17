import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, Bell } from "lucide-react";
import { bellTraditions } from "@/data/bellTraditions";
import churchClockImage from "@/assets/church-clock.jpg";
import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";
import carillonBells from "@/assets/carillon-bells.png";

interface CurrentConfigurationProps {
  selectedBellTradition: string;
  startTime: string;
  endTime: string;
  halfHourChimes: boolean;
  selectedDays?: string[];
  pauseEnabled?: boolean;
  pauseStartTime?: string;
  pauseEndTime?: string;
  bellsEnabled?: boolean;
}

// Generate all time options (every 30 minutes from 12:00 AM to 11:30 PM)
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMinute = String(minute).padStart(2, '0');
      const period = hour < 12 ? 'AM' : 'PM';
      const label = `${displayHour}:${displayMinute} ${period}`;
      options.push({ value, label });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

const daysOfWeek = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
  { id: 'saturday', label: 'Sat' },
  { id: 'sunday', label: 'Sun' }
];

export const CurrentConfiguration = ({
  selectedBellTradition,
  startTime,
  endTime,
  halfHourChimes,
  selectedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  pauseEnabled = false,
  pauseStartTime = "12:00",
  pauseEndTime = "14:00",
  bellsEnabled = true,
}: CurrentConfigurationProps) => {
  const getBellImage = (id: string) => {
    if (id === 'carillon-bell') return carillonBells;
    if (id === 'village-bell') return churchBellTransparent;
    return churchBellNew;
  };

  const selectedBell = bellTraditions.find(t => t.id === selectedBellTradition);
  const settingsConfigured = localStorage.getItem("settingsConfigured") === "true";

  return (
    <Card className="bg-gradient-to-br from-slate-50/80 to-amber-50/80 dark:from-slate-900/80 dark:to-amber-950/30 border-amber-200/30 dark:border-amber-800/20 shadow-lg backdrop-blur-sm">
      <CardContent className="space-y-2 p-2">
        {!settingsConfigured ? (
          <div className="text-center py-3">
            <Link to="/settings">
              <Button variant="amber" size="lg" className="text-xl px-12 py-8 h-auto rounded-2xl gap-4">
                <Bell className="w-6 h-6" />
                Set your Bells
                <Bell className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-amber-200/30 dark:border-amber-800/20 shadow-sm">
                <img 
                  src={getBellImage(selectedBellTradition)} 
                  alt="Selected Bell" 
                  className="w-8 h-8 object-contain filter drop-shadow-sm flex-shrink-0"
                />
                <p className="font-cormorant text-xl text-foreground">
                  {selectedBell?.name}
                </p>
              </div>
              
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-amber-200/30 dark:border-amber-800/20 shadow-sm">
                <img 
                  src={churchClockImage} 
                  alt="Church Clock" 
                  className="w-8 h-8 object-contain filter drop-shadow-sm flex-shrink-0"
                />
                <div className="flex flex-col items-start">
                  <p className="text-lg font-cormorant text-foreground">Daily schedule</p>
                  <p className="font-cormorant text-xl text-foreground">{startTime} - {endTime}</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-2 p-4 rounded-lg bg-gradient-dawn border">
              <p className="text-xl text-foreground font-cormorant text-center">
                {bellsEnabled 
                  ? `Bells will chime every ${halfHourChimes ? 'half hour' : 'hour'} from ${timeOptions.find(t => t.value === startTime)?.label || startTime} to ${timeOptions.find(t => t.value === endTime)?.label || endTime}`
                  : 'Bells disabled (no sounds scheduled)'
                }
                {selectedDays.length > 0 && (
                  <>
                    {' '}on {selectedDays.length === 7 ? (
                      <span className="font-cinzel font-semibold">EVERY DAY</span>
                    ) : selectedDays.length === 2 && selectedDays.includes('saturday') && selectedDays.includes('sunday') ? (
                      <span className="font-cinzel font-semibold">WEEKENDS</span>
                    ) : selectedDays.length === 5 && !selectedDays.includes('saturday') && !selectedDays.includes('sunday') ? (
                      <span className="font-cinzel font-semibold">WEEKDAYS</span>
                    ) : (
                      <span className="font-cinzel font-semibold">
                        {selectedDays.map(day => daysOfWeek.find(d => d.id === day)?.label).join(', ').toUpperCase()}
                      </span>
                    )}
                  </>
                )}
                {pauseEnabled && (
                  <>
                    , with a pause from{' '}
                    <span className="font-cinzel font-semibold text-primary">{timeOptions.find(t => t.value === pauseStartTime)?.label || pauseStartTime}</span> to{' '}
                    <span className="font-cinzel font-semibold text-primary">{timeOptions.find(t => t.value === pauseEndTime)?.label || pauseEndTime}</span>
                    {pauseStartTime > pauseEndTime ? ' (overnight)' : ''}
                  </>
                )}
              </p>
            </div>

            <div className="text-center mt-3">
              <Link to="/settings">
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Customize your bells
                </Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
