import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';

interface DNDDetectorPlugin {
  isDNDActive(): Promise<{ isDNDActive: boolean; interruptionFilter: number }>;
}

const DNDDetector = registerPlugin<DNDDetectorPlugin>('DNDDetector');

/**
 * Hook to detect Do Not Disturb (DND) mode on Android
 * Requires ACCESS_NOTIFICATION_POLICY permission
 */
export const useDNDDetection = (respectDND: boolean) => {
  const [isDNDActive, setIsDNDActive] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android' || !respectDND) {
      setIsDNDActive(false);
      return;
    }

    const checkDNDStatus = async () => {
      try {
        const result = await DNDDetector.isDNDActive();
        setIsDNDActive(result.isDNDActive);
        console.log('📵 DND Status:', result.isDNDActive, '| Filter:', result.interruptionFilter);
      } catch (error) {
        console.error('📵 Error checking DND status:', error);
        setIsDNDActive(false);
      }
    };

    checkDNDStatus();

    // Check periodically (every 30 seconds)
    const interval = setInterval(checkDNDStatus, 30000);

    return () => clearInterval(interval);
  }, [respectDND]);

  return {
    isDNDActive,
    shouldBlockNotifications: respectDND && isDNDActive
  };
};
