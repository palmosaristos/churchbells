import { useState, useEffect, useRef } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRetried, setHasRetried] = useState(false);
  const [waitingForPermission, setWaitingForPermission] = useState(false);
  const completedRef = useRef(false);
  const { toast } = useToast();
  const { hasPermission: hasExactAlarm, requestPermission: requestExactAlarm } = useExactAlarmPermission();

  // Check initial state - SE FIER À L'OS RÉEL (hasExactAlarm), pas au localStorage
  useEffect(() => {
    // Éviter les appels multiples si déjà complété
    if (completedRef.current) return;
    
    const audioUnlocked = localStorage.getItem('audioUnlocked') === 'true';
    const isAndroid = Capacitor.getPlatform() === 'android';
    
    // Sur Android : vérifier hasExactAlarm (état OS réel)
    if (isAndroid) {
      if (hasExactAlarm && audioUnlocked) {
        // Permission déjà accordée (dans l'OS) - passer l'onboarding
        localStorage.setItem('exactAlarmGranted', 'true');
        completedRef.current = true;
        onAudioPermissionGranted({ audio: true, exactAlarm: true });
        return;
      }
      if (!hasExactAlarm) {
        // Permission manquante - afficher le dialogue
        setIsOpen(true);
        return;
      }
    }
    
    // Sur iOS/web : pas de permission Exact Alarm nécessaire
    if (!isAndroid && audioUnlocked) {
      completedRef.current = true;
      onAudioPermissionGranted({ audio: true, exactAlarm: true });
      return;
    }
    
    setIsOpen(true);
  }, [hasExactAlarm]);

  // Écouter les changements de hasExactAlarm (quand l'utilisateur revient des Settings)
  useEffect(() => {
    if (waitingForPermission) {
      if (hasExactAlarm) {
        // ✅ Permission accordée !
        console.log('✅ Exact Alarm permission granted - completing onboarding');
        
        localStorage.setItem('audioUnlocked', 'true');
        localStorage.setItem('exactAlarmGranted', 'true');
        
        completedRef.current = true;
        onAudioPermissionGranted({ audio: true, exactAlarm: true });
        
        setIsOpen(false);
        setWaitingForPermission(false);
        setIsLoading(false);
        
        toast({
          title: (
            <div className="flex items-center gap-3 font-cormorant text-2xl">
              <img src={realisticBellIcon} alt="" className="w-10 h-10" />
              Permissions accordées
            </div>
          ) as any,
          description: 'Les cloches sonneront à l\'heure exacte, même application fermée !',
          variant: 'onboarding',
          duration: 4000
        });
        
      } else {
        // ⚠️ Utilisateur revenu sans activer - permettre de réessayer
        console.log('⚠️ User returned without granting permission - allowing retry');
        
        // Timeout pour détecter le retour de l'app (après quelques secondes)
        const timeoutId = setTimeout(() => {
          if (!hasExactAlarm && waitingForPermission) {
            setWaitingForPermission(false);
            setIsLoading(false);
            setHasRetried(true);
            
            toast({
              title: "Permission non activée",
              description: "Veuillez activer 'Alarmes et rappels' pour que les cloches sonnent à l'heure exacte.",
              variant: "destructive",
              duration: 6000
            });
          }
        }, 3000);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [waitingForPermission, hasExactAlarm, toast]);

  const handleAudioRequest = async () => {
    setIsLoading(true);

    try {
      // 1. Audio unlock (web uniquement, pour autoplay policy)
      if (!Capacitor.isNativePlatform()) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGm98OGeUhELTqXh8bllHgU2jdXu0H4pBSh+zPLaizsIHGS57OihUxELTqXh8bllHgU2jdXu0H4pBSh+zPLaizsIHGS57OihUxELTqXh8bllHgU2jdXu0H4pBSh+zPLaizsI');
        audio.volume = 0;
        await audio.play();
      }

      // Set default volumes
      localStorage.setItem('bellVolume', '0.7');
      localStorage.setItem('morningPrayerVolume', '0.7');
      localStorage.setItem('eveningPrayerVolume', '0.7');

      // 2. Exact Alarm request (Android uniquement)
      const isAndroid = Capacitor.getPlatform() === 'android';
      
      if (isAndroid) {
        console.log('🔔 Opening Android Settings for Exact Alarm permission...');
        
        // Ouvrir les Settings Android (ne retourne pas le résultat immédiatement)
        await requestExactAlarm();
        
        // Marquer qu'on attend le retour de l'utilisateur
        setWaitingForPermission(true);
        
        // Afficher un message d'attente
        toast({
          title: "⏰ Activez la permission",
          description: "Dans les paramètres qui viennent de s'ouvrir, activez 'Alarmes et rappels', puis revenez à l'application.",
          variant: "default",
          duration: 10000
        });
        
        // Le useEffect ci-dessus détectera quand hasExactAlarm devient true
        
      } else {
        // Sur iOS/web, pas de permission Exact Alarm nécessaire
        localStorage.setItem('audioUnlocked', 'true');
        localStorage.setItem('exactAlarmGranted', 'true');
        completedRef.current = true;
        onAudioPermissionGranted({ audio: true, exactAlarm: true });
        setIsOpen(false);
        
        toast({
          title: (
            <div className="flex items-center gap-3 font-cormorant text-2xl">
              <img src={realisticBellIcon} alt="" className="w-10 h-10" />
              Ready!
            </div>
          ) as any,
          description: 'The bells will chime at the scheduled times.',
          variant: 'onboarding',
          duration: 4000
        });
        
        setIsLoading(false);
      }
      
      setHasRetried(false);
      
    } catch (error) {
      console.error('Permission error:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir les paramètres. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000
      });
      setHasRetried(true);
      setIsLoading(false);
      setWaitingForPermission(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-md border-2 border-amber-700/50 dark:border-amber-600/30">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 justify-center font-cormorant text-3xl">
            <img src={realisticBellIcon} alt="" className="w-12 h-12" />
            Required Permissions
            <img src={churchClock} alt="" className="w-12 h-12" />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg font-cormorant space-y-3">
            <p>
              To make the bells chime at the exact time, two permissions are required:
            </p>
            <div className="text-left bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg space-y-2 text-base">
              <p>🔔 <strong>Audio</strong>: To play the bell sounds</p>
              <p>⏰ <strong>Alarms and Reminders</strong>: To ring at the precise time (otherwise, delays of several minutes)</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Without these permissions, the application cannot function properly.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2">
          <Button 
            onClick={handleAudioRequest} 
            disabled={isLoading || waitingForPermission}
            className="w-full gap-2"
            variant={hasRetried ? "secondary" : "default"}
          >
            {waitingForPermission ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                En attente de la permission...
              </>
            ) : isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Ouverture des paramètres...
              </>
            ) : (
              <>
                <img src={realisticBellIcon} alt="" className="h-4 w-4" />
                {hasRetried ? 'Retry' : 'Grant Permissions'}
              </>
            )}
          </Button>
          {(hasRetried || waitingForPermission) && (
            <Button 
              variant="outline" 
              onClick={() => {
                // Permettre de continuer SANS la permission Exact Alarm
                console.warn('⚠️ User skipped Exact Alarm permission - bells may be delayed');
                localStorage.setItem('audioUnlocked', 'true');
                localStorage.setItem('exactAlarmGranted', 'false');
                
                // Finaliser l'onboarding sans la permission
                completedRef.current = true;
                onAudioPermissionGranted({ audio: true, exactAlarm: false });
                
                setIsOpen(false);
                setWaitingForPermission(false);
                setIsLoading(false);
                
                toast({
                  title: "⚠️ Précision réduite",
                  description: "Les cloches pourront être retardées de plusieurs minutes. Vous pouvez activer la permission plus tard dans les paramètres Android.",
                  variant: "destructive",
                  duration: 8000
                });
              }} 
              className="w-full"
            >
              Passer (les cloches risquent d'être retardées)
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
