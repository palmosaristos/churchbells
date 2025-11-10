import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { useAudioPlayer } from './useAudioPlayer';  // Intègre previous hook

export const useNotificationListener = () => {
  const { toggleAudio, isPlaying } = useAudioPlayer();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Handle received (main trigger: play at schedule.at, fg/bg exact)
    const handleNotificationReceived = async (notification: any) => {
      const { extra } = notification;
      if (!extra || !extra.soundFile || !extra.type) return;

      try {
        // Check delay (pour backups)
        const scheduledTime = new Date(extra.scheduledTime || Date.now());
        const delay = (Date.now() - scheduledTime.getTime()) / 1000;
        if (extra.retryLevel === 0 && delay > 30) {
          console.warn(`Main notif delayed ${delay}s – canceling backups`);
          if (extra.originalId) {
            await LocalNotifications.cancel({ notifications: [{ id: extra.originalId + 1 }] });  // Cancel +30s backup
          }
          return;
        }

        // App state: Fg = JS play ; Bg/Closed = natif channel (sound auto)
        const appState = await CapApp.getState();
        const isFg = appState.isActive;  // Active = foreground

        if (isFg && !isPlaying) {  // Fg: JS play (no visuals auréolées)
          const options = {
            audioUrl: `/audio/${extra.soundFile}`,
            type: extra.type as 'bell' | 'prayer',
            isScheduled: true  // No toast – silent play au moment requis
          };
          toggleAudio(options);
          console.log(`Playing ${extra.type} ${extra.soundFile} on receive (fg, delay: ${Math.round(delay)}s)`);
        } else if (!isFg) {
          console.log(`Natif play ${extra.soundFile} on receive (bg/closed)`);  // Channel sound auto
        }

        // Backup check: Si retry>0, log mais joue
        if (extra.retryLevel > 0) {
          console.log(`Backup play triggered (level ${extra.retryLevel})`);
          // Optional: Cancel further backups if +60s
          if (extra.originalId) {
            await LocalNotifications.cancel({ notifications: [{ id: extra.originalId + 2 }] });
          }
        }
      } catch (error) {
        console.error('Received play error:', error);
      }
    };

    // Handle tap/action (optional replay if user taps notif)
    const handleNotificationAction = async (notification: any) => {
      const { extra } = notification.notification;
      if (!extra || !extra.soundFile || !extra.type) return;

      // Replay via player (si !playing, no disrupt)
      if (!isPlaying) {
        const options = {
          audioUrl: `/audio/${extra.soundFile}`,
          type: extra.type as 'bell' | 'prayer',
          isScheduled: false  // Allow toast si manual tap (mais optional)
        };
        toggleAudio(options);
        console.log(`Replay on tap: ${extra.type} ${extra.soundFile}`);
      }
    };

    // Add listeners
    LocalNotifications.addListener('localNotificationReceived', handleNotificationReceived);
    LocalNotifications.addListener('localNotificationActionPerformed', handleNotificationAction);

    return () => {
      LocalNotifications.removeAllListeners();
    };
  }, [toggleAudio, isPlaying]);  // Deps stable (player callback)
};
