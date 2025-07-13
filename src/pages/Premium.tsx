import { useState } from "react";
import { BellTraditionCard } from "@/components/BellTraditionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Settings, Bell, Clock, Volume2, Crown, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface BellTradition {
  id: string;
  name: string;
  description: string;
  tradition: string;
  audioSample?: string;
}

const bellTraditions: BellTradition[] = [
  {
    id: "carillon",
    name: "Carillon",
    description: "Melodic sequences played on tuned bells, creating beautiful harmonies that echo through the countryside.",
    tradition: "European"
  },
  {
    id: "grand-volley",
    name: "Grand Volleys",
    description: "French tradition of synchronized bell ringing in powerful, rhythmic patterns that announce sacred moments.",
    tradition: "French"
  },
  {
    id: "change-ringing",
    name: "Changing bells",
    description: "English art of ringing bells in mathematical sequences, creating intricate patterns that tell stories through sound.",
    tradition: "English"
  },
  {
    id: "zvon",
    name: "Zvon",
    description: "Russian Orthodox technique of rhythmic bell ringing that creates cascading waves of sound for worship.",
    tradition: "Russian"
  },
  {
    id: "byzantine",
    name: "Byzantine Bells",
    description: "Ancient Eastern Christian tradition of solemn, meditative bell sounds that call the faithful to prayer.",
    tradition: "Byzantine"
  }
];

const Premium = () => {
  const [selectedBellTradition, setSelectedBellTradition] = useState<string>("carillon");
  const { toast } = useToast();

  const handleBellPlay = (traditionId: string) => {
    const tradition = bellTraditions.find(t => t.id === traditionId);
    toast({
      title: "Playing Bell Sample",
      description: `Listening to ${tradition?.name} - ${tradition?.tradition} tradition`
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
                description={tradition.description}
                tradition={tradition.tradition}
                isSelected={selectedBellTradition === tradition.id}
                onSelect={() => setSelectedBellTradition(tradition.id)}
                onPlay={() => handleBellPlay(tradition.id)}
              />
            ))}
          </div>
        </div>

        {/* Selected Tradition Display */}
        <Card className="bg-gradient-vespers border-burgundy/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-burgundy-foreground font-serif">
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
      </div>
    </div>
  );
};

export default Premium;