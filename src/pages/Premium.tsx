import { useState } from "react";
import { BellTraditionCard } from "@/components/BellTraditionCard";
import { PremiumPrayerTimesSelector } from "@/components/PremiumPrayerTimesSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { Settings, Bell, Clock, Volume2, Crown, ArrowLeft, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface BellTradition {
  id: string;
  name: string;
  description: string;
  tradition: string;
  audioSample?: string;
}

interface PrayerTime {
  name: string;
  time: string;
  description: string;
}

const bellTraditions: BellTradition[] = [
  {
    id: "village-bell",
    name: "Cloche de Village (Mi)",
    description: "Le son authentique et chaleureux d'une cloche de village, rappelant les traditions rurales et la simplicité de la vie communautaire.",
    tradition: "Village",
    audioSample: "cloche village Mi UNIQUE.mp3"
  },
  {
    id: "cathedral-bell",
    name: "Cloche Classique (Do)", 
    description: "La majesté et la profondeur d'une grande cloche traditionnelle en note Do, évoquant la grandeur spirituelle.",
    tradition: "Cathédrale",
    audioSample: "cloche en DO.mp3"
  }
];

const Premium = () => {
  const [selectedBellTradition, setSelectedBellTradition] = useState<string>("village-bell");
  const [selectedPrayerTradition, setSelectedPrayerTradition] = useState<string>("Roman Catholic");
  const [morningPrayerTime, setMorningPrayerTime] = useState<string>("06:00");
  const [eveningPrayerTime, setEveningPrayerTime] = useState<string>("18:00");
  const { toast } = useToast();

  const handleBellPlay = async (traditionId: string) => {
    const tradition = bellTraditions.find(t => t.id === traditionId);
    if (tradition?.audioSample) {
      try {
        const { data } = supabase.storage
          .from('CHURCH BELL SOUNDS')
          .getPublicUrl(tradition.audioSample);
        
        const audio = new Audio(data.publicUrl);
        await audio.play();
        toast({
          title: "Lecture de l'échantillon",
          description: `Écoute de ${tradition?.name} - tradition ${tradition?.tradition}`
        });
      } catch (error) {
        console.error("Error playing audio:", error);
        toast({
          title: "Erreur de lecture",
          description: "Impossible de lire l'échantillon audio",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Échantillon non disponible",
        description: "Aucun fichier audio pour cette tradition",
        variant: "destructive"
      });
    }
  };

  const handlePrayerTimesSelect = (times: PrayerTime[]) => {
    toast({
      title: "Premium Prayer Times Applied",
      description: `${times.length} prayer times have been configured for bell chiming`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="w-8 h-8 text-primary" />
                <Badge variant="secondary" className="text-lg px-4 py-2">Premium</Badge>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-4">
                Sacred Bell Traditions
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Unlock the full collection of sacred bell traditions from around the world
              </p>
              
              <div className="mt-8">
                <Button variant="outline" asChild className="gap-2">
                  <Link to="/">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Bell Traditions Selection */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
              Choose Your Bell Tradition
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each tradition brings its own sacred sound and spiritual significance
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bellTraditions.map(tradition => (
              <BellTraditionCard
                key={tradition.id}
                title={tradition.name}
                image={tradition.id === 'village-bell' ? '/src/assets/church-bell-1.png' : '/src/assets/church-bell-2.png'}
                isSelected={selectedBellTradition === tradition.id}
                onSelect={() => setSelectedBellTradition(tradition.id)}
                onPlay={() => handleBellPlay(tradition.id)}
              />
            ))}
          </div>
        </div>

        {/* Premium Prayer Times Selector */}
        <PremiumPrayerTimesSelector 
          selectedTradition={selectedPrayerTradition}
          onTraditionSelect={setSelectedPrayerTradition}
          onTimesSelect={handlePrayerTimesSelect}
        />

        {/* Selected Tradition Display */}
        <Card className="bg-gradient-vespers border-burgundy/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-burgundy-foreground font-cinzel">
              <Settings className="w-5 h-5" />
              Selected Bell Tradition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4 rounded-lg bg-burgundy-foreground/10">
              <Bell className="w-8 h-8 text-burgundy-foreground mx-auto mb-2" />
              <p className="font-medium text-burgundy-foreground text-lg">
                {bellTraditions.find(t => t.id === selectedBellTradition)?.name}
              </p>
              <p className="text-sm text-burgundy-foreground/80">
                {bellTraditions.find(t => t.id === selectedBellTradition)?.tradition} Tradition
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Prayer Times */}
        <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-cinzel">
              <Clock className="w-5 h-5 text-primary" />
              Custom Prayer Times
            </CardTitle>
            <CardDescription className="font-cormorant">
              Set your preferred times for morning and evening prayers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="morning-prayer" className="flex items-center gap-2 text-sm font-medium">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Morning Prayer
                </Label>
                <Input
                  id="morning-prayer"
                  type="time"
                  value={morningPrayerTime}
                  onChange={(e) => setMorningPrayerTime(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="evening-prayer" className="flex items-center gap-2 text-sm font-medium">
                  <Moon className="w-4 h-4 text-blue-500" />
                  Evening Prayer
                </Label>
                <Input
                  id="evening-prayer"
                  type="time"
                  value={eveningPrayerTime}
                  onChange={(e) => setEveningPrayerTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <Button 
              className="w-full mt-6" 
              onClick={() => toast({
                title: "Prayer Times Set",
                description: `Morning: ${morningPrayerTime}, Evening: ${eveningPrayerTime}`
              })}
            >
              Apply Custom Times
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Premium;