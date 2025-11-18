import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

/**
 * Listener système pour l'annulation des notifications backup
 * Enregistré au démarrage de l'app, reste actif même en arrière-plan
 * NE GÈRE PAS les toasts (c'est le rôle de useNotificationListener.tsx)
 */
export const setupNotificationSystemListener = () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('⚠️ Not native platform, skipping system listener setup');
    return;
  }

  console.log('🔧 Setting up permanent notification system listener...');

  // Listener pour les notifications reçues (logs uniquement)
  LocalNotifications.addListener('localNotificationReceived', async (notification: any) => {
    const { extra } = notification;
    
    if (!extra || !extra.type) {
      return;
    }

    // Calculer le délai entre l'heure prévue et l'arrivée réelle
    const scheduledTime = new Date(extra.scheduledTime || Date.now());
    const delay = (Date.now() - scheduledTime.getTime()) / 1000;

    // Log pour diagnostic
    console.log(`📬 [SYSTEM] Notification received: type=${extra.type}, delay=${delay.toFixed(1)}s`);
  });

  console.log('✅ Permanent system listener registered');
};
