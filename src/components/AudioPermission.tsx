import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import realisticBellIcon from "@/assets/realistic-bell-icon.png";
import churchClock from "@/assets/church-clock.png";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Capacitor } from '@capacitor/core';
import { useExactAlarmPermission } from "@/hooks/useExactAlarmPermission";

interface AudioPermissionProps {
  onAudioPermissionGranted: (status: { audio: boolean; exactAlarm: boolean }) => void;  // Étendu pour status
}

export const AudioPermission = ({ onAudioPermissionGranted }: AudioPermissionProps) => {
  const [isOpen, setIsOpen] = useState(false);  // Default false
  const [isLoading, setIsLoading] = useState(false);
  const [hasRetried, setHasRetried] = useState(false);  // Pour retry optional
  const { toast } = useToast();
  const { hasPermission: hasExactAlarm, requestPermission: requestExactAlarm } = useExactAlarmPermission();

  useEffect(() => {
    const audioUnlocked = localStorage.getItem('audioUnlocked') === 'true';
    const exactGranted = localStorage.getItem('exactAlarmGranted') === 'true' || hasExactAlarm;
    if (audioUnlocked && exactGranted) {
      onAudioPermissionGranted({ audio: true, exactAlarm: true });
      return;
    }
    setIsOpen(true);  // Show si missing (first load ou denied)
  }, [hasExactAlarm]);

  const handleAudioRequest = async () => {
    setIsLoading(true);
    let audioGranted = false;
    let exactGranted = false;

    try {
      // Web/Silent test pour audio context unlock (inaudible, no perturb)
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGm98OGeUhELTqXh8bllHgU2jdXu0H4pBSh+zPLaizsIHGS57OihUxELTqXh8bllHgU2jdXu0H4pBSh+zPLaizsIHGS57OihUxELTqXh8bllHgU2jdXu0H4pBSh+zPLaizsI');
      await audio.play();
      audioGranted = true;

      // Set defaults volumes au grant (pour useAudioPlayer plays)
      localStorage.setItem('bellVolume', '0.7');
      localStorage.setItem('morningPrayerVolume', '0.7');
      localStorage.setItem('eveningPrayerVolume', '0.7');

      // Exact Alarm request (pour scheduler at précis, no drifts)
      if (!hasExactAlarm) {
        exactGranted = await requestExactAlarm();  // Hook return bool
      } else {
        exactGranted = true;
      }

      // Persist
      localStorage.setItem('audioUnlocked', 'true');
      localStorage.setItem('exactAlarmGranted', exactGranted.toString());

      // Callback étendu
      onAudioPermissionGranted({ audio: true, exactAlarm: exactGranted });

      setIsOpen(false);
      setHasRetried(false);
      
      toast({
        title: (
          <div className="flex items-center gap-3 font-cormorant text-2xl">
            <img src={realisticBellIcon} alt="" className="w-10 h-10" />
            Audio & Scheduling Ready
          </div>
        ) as any,
        description: `Bell and prayer sounds will play at exact scheduled times${!exactGranted ? ' (exact alarm optional for best timing)' : ''}`,
        variant: 'onboarding',
        duration: 4000
      });
    } catch (error) {
      console.error('Permission error:', error);
      audioGranted = false;
      toast({
        title: "Audio Permission Needed",
        description: "Allow audio for scheduled bell sounds. Exact alarm improves timing accuracy.",
        variant: "destructive",
        duration: 5000
      });
      setHasRetried(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-md border-2 border-amber-700/50 dark:border-amber-600/30">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 justify-center font-cormorant text-3xl">
            <img src={realisticBellIcon} alt="" className="w-12 h-12" />
            Audio Access Required
            <img src={churchClock} alt="" className="w-12 h-12" />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg font-cormorant">
            Grant permission to play bell sounds at your scheduled times (e.g., hourly chimes or prayers). This unlocks audio and improves timing accuracy. No ads or spam.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2">
          <Button 
            onClick={handleAudioRequest} 
            disabled={isLoading}
            className="w-full gap-2"
            variant={hasRetried ? "secondary" : "default"}  // Retry style
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Requesting...
              </>
            ) : (
              <>
                <img src={realisticBellIcon} alt="" className="h-4 w-4" />
                {hasRetried ? 'Retry Audio & Timing' : 'Allow Audio Playback'}
              </>
            )}
          </Button>
          {hasRetried && (
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)} 
              className="w-full"
            >
              Skip (sounds may be delayed)
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
