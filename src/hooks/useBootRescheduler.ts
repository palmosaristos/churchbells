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
        
        // Set a flag in localStorage to trigger rescheduling
        // This will be picked up by useBellScheduler
        if (urlOpen?.url?.includes('BOOT_COMPLETED')) {
          console.log('App launched after boot, triggering notification rescheduling');
          localStorage.setItem('needsRescheduling', 'true');
          
          // The useBellScheduler hook will detect this flag and reschedule
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
