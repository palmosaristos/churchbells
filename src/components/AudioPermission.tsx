import { useState, useEffect } from "react";
import { Volume2, Loader2 } from "lucide-react";
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

interface AudioPermissionProps {
  onAudioPermissionGranted: () => void;
}

export const AudioPermission = ({ onAudioPermissionGranted }: AudioPermissionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleAudioRequest = async () => {
    setIsLoading(true);
    
    try {
      // Test audio playback with a short silent audio to unlock audio context
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGm98OGeUhELTqXh8bllHgU2jdXu0H4pBSh+zPLaizsIHGS57OihUxELTqXh8bllHgU2jdXu0H4pBSh+zPLaizsIHGS57OihUxELTqXh8bllHgU2jdXu0H4pBSh+zPLaizsI');
      await audio.play();
      
      onAudioPermissionGranted();
      setIsOpen(false);
      toast({
        title: "Audio Permission Granted",
        description: "Bell sounds will play at scheduled times"
      });
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Audio Permission Required",
        description: "Please allow audio playback to hear the bells",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Audio Permission Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            We need permission to play bell sounds at scheduled times. Please allow audio playback to use this app.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button 
            onClick={handleAudioRequest} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                Allow Audio Playback
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
