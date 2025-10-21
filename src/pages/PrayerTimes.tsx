import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { PrayerTimesSelector } from "@/components/PrayerTimesSelector";
import { useToast } from "@/hooks/use-toast";

interface PrayerTime {
  name: string;
  time: string;
  description: string;
}

const PrayerTimes = () => {
  const [selectedPrayerTradition, setSelectedPrayerTradition] = useState<string>("Roman Catholic");
  const { toast } = useToast();

  const handlePrayerTimesSelect = (times: PrayerTime[]) => {
    toast({
      title: "Temps de prière appliqués",
      description: `${times.length} temps de prière ont été configurés pour les sonneries`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-cinzel font-bold text-foreground">
            Temps de Prière
          </h1>
          <p className="text-xl text-muted-foreground font-cormorant">
            Choisissez vos moments de prière pour les sonneries
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <PrayerTimesSelector 
            selectedTradition={selectedPrayerTradition} 
            onTraditionSelect={setSelectedPrayerTradition} 
            onTimesSelect={handlePrayerTimesSelect} 
          />
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;
