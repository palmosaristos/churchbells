import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { useAudioPlayer } from './useAudioPlayer';
import { useToast } from '@/hooks/use-toast';

export const useNotificationListener = () => {
  const { toggleAudio, isPlaying } = useAudioPlayer();
  const { toast } = useToast();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // ✅ Gestionnaire de notification reçue
    async function handleNotificationReceived(notification: any) {
      const { extra } = notification;
      if (!extra || !extra.type) return;

      // ✅ Reminders de prière (toast seulement ou avec bell)
      if (extra.type === 'prayer-reminder') {
        const prayerName = extra.prayerName || 'Prayer';
        const minutesUntil = extra.minutesUntil || '5';
        
        // ✅ Jouer le son si "withBell" est activé
        if (extra.withBell) {
          const options = {
            audioUrl: `/audio/cathedral_1.mp3`,
            type: 'prayer' as const,
            volume: 0.5,
            isScheduled: true
          };
          toggleAudio(options);
          console.log(`🔔 Prayer reminder WITH BELL: ${prayerName} in ${minutesUntil} minutes`);
        } else {
          // Sinon, juste afficher le toast
          toast({
            title: `Your ${prayerName} starts in ${minutesUntil} minute${minutesUntil === '1' ? '' : 's'}`,
            variant: 'prayer-reminder',
            duration: 8000,
          });
          console.log(`🔔 Prayer reminder: ${prayerName} in ${minutesUntil} minutes`);
        }
        return;
      }

      // ✅ Gestion des sons de cloche et prière
      if (!extra.soundFile) return;

      try {
        const scheduledTime = new Date(extra.scheduledTime || Date.now());
        const delay = (Date.now() - scheduledTime.getTime()) / 1000;
        
        // ✅ Annuler les backups si le principal est trop en retard
        if (extra.retryLevel === 0 && delay > 30) {
          console.warn(`Main notification delayed ${delay}s – cancelling backup`);
          if (extra.originalId) {
            await LocalNotifications.cancel({ notifications: [{ id: extra.originalId + 1 }] });
          }
          return;
        }

        // ✅ Récupérer le volume selon le type
        let volume: number | undefined;
        if (extra.type === 'bell' && extra.bellTradition) {
          const bellVolumes = JSON.parse(localStorage.getItem('bellVolumes') || '{}');
          volume = bellVolumes[extra.bellTradition];
        } else if (extra.type === 'prayer') {
          const saved = localStorage.getItem('prayerBellVolume');
          volume = saved ? parseFloat(saved) : undefined;
        }

        const options = {
          audioUrl: `/audio/${extra.soundFile}`,
          type: extra.type as 'bell' | 'prayer',
          volume,
          isScheduled: true
        };
        
        toggleAudio(options);
        console.log(`🔊 Playing ${extra.type} ${extra.soundFile} (vol: ${volume || 'default'})`);

      } catch (error) {
        console.error('❌ Notification handling error:', error);
      }
    }

    // ✅ Gestionnaire de tap sur notification
    async function handleNotificationAction(notification: any) {
      const { extra } = notification.notification;
      if (!extra || !extra.type) return;

      // ✅ Prayer reminder visuel (sans son) - afficher le toast au tap
      if (extra.type === 'prayer-reminder' && !extra.withBell) {
        const prayerName = extra.prayerName || 'Prayer';
        const minutesUntil = extra.minutesUntil || '5';
        toast({
          title: `Your ${prayerName} starts in ${minutesUntil} minute${minutesUntil === '1' ? '' : 's'}`,
          variant: 'prayer-reminder',
          duration: 8000,
        });
        console.log(`📱 Tap on prayer reminder: ${prayerName} in ${minutesUntil} minutes`);
        return;
      }

      // ✅ Additional notification visuelle uniquement
      if (extra.type === 'additional-notification') {
        toast({
          title: extra.title || 'Prayer Notification',
          description: extra.message || '',
          variant: 'prayer',
          duration: 10000,
        });
        console.log(`📱 Tap on additional notification`);
        return;
      }

      // Pour les sons, vérifier qu'on a un soundFile et qu'on ne joue pas déjà
      if (!extra.soundFile || isPlaying) return;

      let volume: number | undefined;
      
      if (extra.type === 'bell' && extra.bellTradition) {
        const bellVolumes = JSON.parse(localStorage.getItem('bellVolumes') || '{}');
        volume = bellVolumes[extra.bellTradition];
      } else if (extra.type === 'prayer') {
        const saved = localStorage.getItem('prayerBellVolume');
        volume = saved ? parseFloat(saved) : undefined;
      }

      const options = {
        audioUrl: `/audio/${extra.soundFile}`,
        type: extra.type as 'bell' | 'prayer',
        volume,
        isScheduled: false
      };
      
      toggleAudio(options);
      console.log(`🔄 Replay on tap: ${extra.type} ${extra.soundFile}`);
    }

    // Setup notification listeners avec cleanup approprié
    let receivedListener: any;
    let actionListener: any;

    const setupListeners = async () => {
      receivedListener = await LocalNotifications.addListener(
        'localNotificationReceived', 
        handleNotificationReceived
      );
      
      actionListener = await LocalNotifications.addListener(
        'localNotificationActionPerformed', 
        handleNotificationAction
      );
    };

    setupListeners();

    return () => {
      if (receivedListener) {
        receivedListener.remove();
      }
      if (actionListener) {
        actionListener.remove();
      }
    };
  }, [toggleAudio, isPlaying, toast]);
};
