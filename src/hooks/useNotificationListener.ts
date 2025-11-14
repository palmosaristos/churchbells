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

      // ✅ Reminders de prière (toast sans vibration par défaut, Cathedral_1 si withBell)
      if (extra.type === 'prayer-reminder') {
        const prayerName = extra.prayerName || 'Prayer';
        const minutesUntil = extra.minutesUntil || '5';
        
        // Le son Cathedral_1 est joué automatiquement par le channel Android si withBell=true
        // On affiche juste le toast pour les notifications sans son
        if (!extra.withBell) {
          toast({
            title: `🔔 Your ${prayerName} starts in ${minutesUntil} minute${minutesUntil === '1' ? '' : 's'}`,
            variant: 'prayer-reminder',
            duration: 8000,
          });
        }
        console.log(`🔔 Prayer reminder${extra.withBell ? ' WITH BELL (Cathedral_1)' : ''}: ${prayerName} in ${minutesUntil} minutes`);
        return;
      }

      if (!extra.soundFile) return;

      try {
        const scheduledTime = new Date(extra.scheduledTime || Date.now());
        const delay = (Date.now() - scheduledTime.getTime()) / 1000;
        
        // ✅ Annuler les backups dès que le principal arrive (bells ET prayers)
        if (extra.retryLevel === 0 && extra.originalId) {
          console.log(`Main notification fired (delay: ${delay}s) – cancelling backup notification`);
          await LocalNotifications.cancel({ notifications: [{ id: extra.originalId + 1 }] });
        }

        // ✅ Les prayers sont déjà joués par le channel Android - on skip toggleAudio()
        if (extra.type === 'prayer' && extra.soundFile) {
          console.log(`🔔 Prayer notification received (${extra.soundFile} joué par channel Android)`);
          return;
        }

        // ✅ Pour les bells, le son est joué par le channel Android - on skip toggleAudio()
        if (extra.type === 'bell') {
          console.log(`🔔 Bell notification received (${extra.soundFile} joué par channel Android)`);
          return;
        }

        // ✅ Récupérer le volume pour les bells (code mort maintenant, mais on garde pour cohérence)
        let volume: number | undefined;
        if (extra.type === 'bell' && extra.bellTradition) {
          const bellVolumes = JSON.parse(localStorage.getItem('bellVolumes') || '{}');
          volume = bellVolumes[extra.bellTradition];
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
          title: `🔔 Your ${prayerName} starts in ${minutesUntil} minute${minutesUntil === '1' ? '' : 's'}`,
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
