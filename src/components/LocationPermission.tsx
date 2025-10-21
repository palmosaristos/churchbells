import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface LocationPermissionProps {
  onTimeZoneDetected: (timeZone: string) => void;
}

export const LocationPermission = ({ onTimeZoneDetected }: LocationPermissionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLocationRequest = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Géolocalisation non disponible",
        description: "Votre navigateur ne supporte pas la géolocalisation",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        onTimeZoneDetected(timeZone);
        toast({
          title: "Localisation détectée",
          description: `Fuseau horaire défini : ${timeZone}`
        });
        setIsLoading(false);
      },
      (error) => {
        toast({
          title: "Erreur de localisation",
          description: "Impossible de détecter votre position",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Autorisation de localisation
        </CardTitle>
        <CardDescription>
          Nous avons besoin de votre localisation pour déterminer automatiquement votre fuseau horaire et programmer les sonneries aux bons moments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleLocationRequest} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Détection en cours...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Autoriser la localisation
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
