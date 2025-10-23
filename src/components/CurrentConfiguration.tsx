import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
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
}

export const CurrentConfiguration = ({
  selectedBellTradition,
  startTime,
  endTime,
  halfHourChimes,
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
      <CardHeader className="text-center">
        <CardTitle className="text-5xl md:text-6xl font-cinzel font-bold text-foreground text-center leading-tight">
          {!settingsConfigured ? "Set your sacred bells schedule" : "Your Sacred Bells schedule"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-amber-200/30 dark:border-amber-800/20 shadow-sm">
            <img 
              src={getBellImage(selectedBellTradition)} 
              alt="Selected Bell" 
              className="w-8 h-8 object-contain filter drop-shadow-sm flex-shrink-0"
            />
            <p className="font-cinzel text-2xl text-foreground">
              {selectedBell?.name}
            </p>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-amber-200/30 dark:border-amber-800/20 shadow-sm">
            <img 
              src={churchClockImage} 
              alt="Church Clock" 
              className="w-8 h-8 object-contain filter drop-shadow-sm flex-shrink-0"
            />
            <div className="flex flex-col items-start">
              <p className="text-lg font-cinzel text-foreground">Daily schedule</p>
              <p className="font-cinzel text-2xl text-foreground">{startTime} - {endTime}</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4 p-3 rounded-lg bg-gradient-dawn border">
          <p className="text-2xl text-foreground font-cinzel">
            Will ring every {halfHourChimes ? 'half hour' : 'hour'} from {startTime} to {endTime}
          </p>
        </div>

        <div className="text-center mt-6">
          <Link to="/settings">
            <Button variant="outline" className="gap-2 text-xl font-cinzel py-6">
              <Settings className="w-5 h-5" />
              Customize your bells
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
