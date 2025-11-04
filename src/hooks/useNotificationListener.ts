import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const useNotificationListener = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const handleNotificationAction = async (notification: any) => {
      const { extra } = notification.notification;
      
      if (extra && extra.type === 'prayer' && extra.soundFile) {
        try {
          const audio = new Audio(`/audio/${extra.soundFile}`);
          const volume = extra.prayerType === 'morning' 
            ? parseFloat(localStorage.getItem('morningBellVolume') || '0.7')
            : parseFloat(localStorage.getItem('eveningBellVolume') || '0.7');
          
          audio.volume = volume;
          await audio.play();
          
          console.log(`Playing ${extra.callType} call for ${extra.prayerType} prayer`);
        } catch (error) {
          console.error('Error playing prayer bell sound:', error);
        }
      }
    };

    LocalNotifications.addListener('localNotificationActionPerformed', handleNotificationAction);

    return () => {
      LocalNotifications.removeAllListeners();
    };
  }, []);
};
