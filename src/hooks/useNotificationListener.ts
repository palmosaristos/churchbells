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

    // Gestion correcte des listeners Capacitor
    const setupListeners = async () => {
      const receivedListener = await LocalNotifications.addListener(
        'localNotificationReceived', 
        handleNotificationReceived
      );
      
      const actionListener = await LocalNotifications.addListener(
        'localNotificationActionPerformed', 
        handleNotificationAction
      );

      return () => {
        receivedListener.remove();
        actionListener.remove();
      };
    };

    setupListeners();

    // Gestionnaire de notification reçue
    async function handleNotificationReceived(notification: any) {
      const { extra } = notification;
      if (!extra || !extra.type) return;

      // Reminders de prière (toast seulement)
      if (extra.type === 'prayer-reminder') {
        const prayerName = extra.prayerName || 'Prayer';
        const minutesUntil = extra.minutesUntil || '5';
        
        toast({
          title: `Your ${prayerName} starts in ${minutesUntil} minute${minutesUntil === '1' ? '' : 's'}`,
          variant: 'prayer-reminder',
          duration: 8000,
        });
        
        console.log(`🔔 Prayer reminder: ${prayerName} in ${minutesUntil} minutes`);
        return;
      }

      // Gestion des sons de cloche et prière
      if (!extra.soundFile) return;

      try {
        const scheduledTime = new Date(extra.scheduledTime || Date.now());
        const delay = (Date.now() - scheduledTime.getTime()) / 1000;
        
        // Annuler les backups si le principal est trop en retard
        if (extra.retryLevel === 0 && delay > 30) {
          console.warn(`Main notification delayed ${delay}s – cancelling backup`);
          if (extra.originalId) {
            await LocalNotifications.cancel({ notifications: [{ id: extra.originalId + 1 }] });
          }
          return;
        }

        // Récupérer le volume selon le type
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

    // Gestionnaire de tap sur notification
    async function handleNotificationAction(notification: any) {
      const { extra } = notification.notification;
      if (!extra || !extra.soundFile || !extra.type || isPlaying) return;

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
  }, [toggleAudio, isPlaying]);
};
