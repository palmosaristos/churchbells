import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { useAudioPlayer } from './useAudioPlayer';
import { ToastOptions, useToast } from '@/hooks/use-toast';

export const useNotificationListener = () => {
  const { toggleAudio, isPlaying } = useAudioPlayer();
  const { toast } = useToast();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // CORRECTION : Gestion robuste des notifications reçues
    const handleNotificationReceived = async (notification: any) => {
      const { extra } = notification;
      if (!extra || !extra.type) return;

      try {
        const appState = await CapApp.getState();
        const isForeground = appState.isActive;

        // PAUSE/RESUME handling
        if (extra.type === 'pause') {
          if (isForeground && !isPlaying) {
            const options = {
              audioUrl: `/audio/${extra.soundFile}`,
              type: 'bell' as const,
              volume: extra.volume,
              isScheduled: true
            };
            toggleAudio(options);
          }
          return;
        }

        // PRAYER REMINDERS (toast seulement)
        if (extra.type === 'prayer-reminder') {
          const prayerName = extra.prayerName || 'Prayer';
          const minutesUntil = extra.minutesUntil || '5';
          
          toast({
            title: `Your ${prayerName} starts in ${minutesUntil} minute${minutesUntil === '1' ? '' : 's'}`,
            variant: 'prayer-reminder',
            duration: 8000,
            style: {
              background: 'linear-gradient(135deg, #d4a574, #8b4513)',
              color: 'white',
              border: '1px solid rgba(212, 165, 116, 0.3)'
            }
          } as ToastOptions);
          
          console.log(`🔔 Prayer reminder: ${prayerName} in ${minutesUntil} minutes`);
          return;
        }

        // Vérification du délai pour les backups
        const scheduledTime = new Date(extra.scheduledTime || Date.now());
        const delay = (Date.now() - scheduledTime.getTime()) / 1000;
        
        if (extra.retryLevel === 0 && delay > 30) {
          console.warn(`Main notification delayed ${delay}s – cancelling backup`);
          if (extra.originalId) {
            await LocalNotifications.cancel({ notifications: [{ id: extra.originalId + 1 }] });
          }
          return;
        }

        // JOUER LE SON (foreground uniquement)
        if (isForeground && !isPlaying) {
          let volume: number | undefined;
          
          // Récupérer le volume configuré
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
          console.log(`🔊 Playing ${extra.type} ${extra.soundFile} (vol: ${volume || 'default'}) - FG delay: ${Math.round(delay)}s`);
        } else if (!isForeground) {
          console.log(`📱 Native play ${extra.soundFile} (BG/closed)`);
        }

        // Gestion des backups
        if (extra.retryLevel > 0) {
          console.log(`Backup triggered (level ${extra.retryLevel})`);
          if (extra.originalId) {
            await LocalNotifications.cancel({ notifications: [{ id: extra.originalId + 2 }] });
          }
        }
      } catch (error) {
        console.error('❌ Notification handling error:', error);
      }
    };

    // Gestion du tap sur notification
    const handleNotificationAction = async (notification: any) => {
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
    };

    // Enregistrer les listeners
    const receivedListener = await LocalNotifications.addListener('localNotificationReceived', handleNotificationReceived);
    const actionListener = await LocalNotifications.addListener('localNotificationActionPerformed', handleNotificationAction);

    return () => {
      receivedListener.remove();
      actionListener.remove();
    };
  }, [toggleAudio, isPlaying]);
};
