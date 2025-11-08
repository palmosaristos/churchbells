import { useEffect, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';

export const useExactAlarmPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  const checkPermission = async () => {
    if (!Capacitor.isNativePlatform()) {
      setHasPermission(true);
      return;
    }

    try {
      const result = await LocalNotifications.checkExactNotificationSetting();
      const granted = result.exact_alarm === 'granted';
      setHasPermission(granted);
      
      if (!granted) {
        setShowPermissionDialog(true);
      }
      
      return granted;
    } catch (error) {
      console.error('Error checking exact alarm permission:', error);
      setHasPermission(true);
    }
  };

  const requestPermission = async () => {
    try {
      await LocalNotifications.changeExactNotificationSetting();
      setShowPermissionDialog(false);
    } catch (error) {
      console.error('Error requesting exact alarm permission:', error);
    }
  };

  useEffect(() => {
    checkPermission();

    if (Capacitor.isNativePlatform()) {
      const listener = CapApp.addListener('appStateChange', async (state) => {
        if (state.isActive) {
          await checkPermission();
        }
      });

      return () => {
        listener.then(l => l.remove());
      };
    }
  }, []);

  return {
    hasPermission,
    showPermissionDialog,
    requestPermission,
    dismissDialog: () => setShowPermissionDialog(false)
  };
};
