import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface LocationPermissionProps {
  onTimeZoneDetected: (timeZone: string) => void;
}

export const LocationPermission = ({ onTimeZoneDetected }: LocationPermissionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleLocationRequest = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Available",
        description: "Your browser does not support geolocation",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        onTimeZoneDetected(timeZone);
        setIsOpen(false);
        toast({
          title: "Location Detected",
          description: `Time zone set to: ${timeZone}`
        });
        setIsLoading(false);
      },
      (error) => {
        toast({
          title: "Location Error",
          description: "Unable to detect your location",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location Permission Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            We need your location to automatically determine your time zone and schedule the bells at the correct times.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button 
            onClick={handleLocationRequest} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Detecting...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Allow Location Access
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
