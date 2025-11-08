import { useState, useEffect, useCallback } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';

export const useExactAlarmPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);  // Init false (conservatif pour scheduler)
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  // Check stable (exact_alarm 'granted' pour at précis)
  const checkPermission = useCallback(async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      setHasPermission(true);  // Web/non-native OK (no Doze)
      return true;
    }

    try {
      const result = await LocalNotifications.checkExactNotificationSetting();
      const granted = result.exact_alarm === 'granted';
      setHasPermission(granted);
      
      if (!granted && import.meta.env.DEV) {
        console.warn('Exact alarm denied – scheduling may drift (Doze delays up to 15min; bells/prayers timing imprecise)');
      }
      
      return granted;
    } catch (error) {
      console.error('Error checking exact alarm:', error);
      setHasPermission(true);  // Fallback true (best effort, older Android no need)
      return true;
    }
  }, []);

  // Request + re-check (pour scheduler one-call)
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      setShowPermissionDialog(false);
      return true;
    }

    try {
      await LocalNotifications.changeExactNotificationSetting('enabled');  // Explicit to granted
      await new Promise(resolve => setTimeout(resolve, 500));  // Buffer for system
      const granted = await checkPermission();
      if (granted) {
        setShowPermissionDialog(false);
      } else {
        setShowPermissionDialog(true);  // Still show if denied
      }
      return granted;
    } catch (error) {
      console.error('Error requesting exact alarm:', error);
      setShowPermissionDialog(false);
      return await checkPermission();  // Fallback check
    }
  }, [checkPermission]);

  // Combined for scheduler (check then request if needed)
  const requestAndCheck = useCallback(async (): Promise<boolean> => {
    const has = await checkPermission();
    if (!has) {
      return await requestPermission();
    }
    return has;
  }, [checkPermission, requestPermission]);

  useEffect(() => {
    const initCheck = async () => {
      await requestAndCheck();  // Initial + auto-request if denied (user-friendly pour precise plays)
    };
    initCheck();

    if (Capacitor.isNativePlatform()) {
      const listener = CapApp.addListener('appStateChange', async (state) => {
        if (state.isActive) {
          await new Promise(resolve => setTimeout(resolve, 500));  // Post-sleep buffer
          await checkPermission();
        }
      });

      return () => {
        listener.then(l => l.remove?.()).catch(console.warn);  // Safe remove
      };
    }
  }, [requestAndCheck, checkPermission]);

  const dismissDialog = useCallback(() => {
    setShowPermissionDialog(false);
  }, []);

  return {
    hasPermission,
    showPermissionDialog,
    requestPermission,
    requestAndCheck,  // Expose pour scheduler
    dismissDialog
  };
};
