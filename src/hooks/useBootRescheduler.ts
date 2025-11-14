import { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Hook to detect when the app is launched after device boot
 * and trigger notification rescheduling automatically
 */
export const useBootRescheduler = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const checkBootLaunch = async () => {
      try {
        // Check if app was launched by BootReceiver
        const urlOpen = await CapApp.getLaunchUrl();
        
        if (urlOpen?.url?.includes('BOOT_COMPLETED')) {
          console.log('App launched after boot, checking if rescheduling needed');
          
          const lastReschedule = localStorage.getItem('lastReschedule');
          const now = new Date();
          
          // Reprogrammer si pas de dernière programmation OU si > 12h
          let needsReschedule = false;
          if (!lastReschedule) {
            needsReschedule = true;
            console.log('No previous reschedule found, triggering reschedule');
          } else {
            const lastDate = new Date(lastReschedule);
            const hoursSinceLastReschedule = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
            if (hoursSinceLastReschedule > 12) {
              needsReschedule = true;
              console.log(`Last reschedule was ${hoursSinceLastReschedule.toFixed(1)}h ago, triggering reschedule`);
            } else {
              console.log(`Last reschedule was ${hoursSinceLastReschedule.toFixed(1)}h ago, no reschedule needed`);
            }
          }
          
          if (needsReschedule) {
            localStorage.setItem('needsRescheduling', 'true');
            localStorage.setItem('lastReschedule', now.toISOString());
          }
          
          // After 2 seconds, close the app if it was launched in background
          setTimeout(() => {
            if (document.hidden) {
              CapApp.exitApp();
            }
          }, 2000);
        }
      } catch (error) {
        console.error('Error checking boot launch:', error);
      }
    };

    checkBootLaunch();
  }, []);
};
