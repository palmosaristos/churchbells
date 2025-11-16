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

  // Listener pour les notifications reçues (annulation des backups)
  LocalNotifications.addListener('localNotificationReceived', async (notification: any) => {
    const { extra } = notification;
    
    if (!extra || !extra.type) {
      return;
    }

    // Calculer le délai entre l'heure prévue et l'arrivée réelle
    const scheduledTime = new Date(extra.scheduledTime || Date.now());
    const delay = (Date.now() - scheduledTime.getTime()) / 1000;

    // Convertir retryLevel en nombre (peut arriver en string depuis l'APK)
    const retryLevel = Number(extra.retryLevel);
    const backupId = Number(extra.backupId);

    // Log pour diagnostic avec types
    console.log(`📬 [SYSTEM] Notification received: type=${extra.type}, retryLevel=${retryLevel} (raw: ${extra.retryLevel}, type: ${typeof extra.retryLevel}), delay=${delay.toFixed(1)}s`);

    // Annuler le backup si c'est la notification principale (retryLevel === 0)
    if (retryLevel === 0 && backupId) {
      console.log(`🚫 [SYSTEM] Main notification fired (delay: ${delay.toFixed(1)}s) – cancelling backup ID: ${backupId}`);
      try {
        await LocalNotifications.cancel({ notifications: [{ id: backupId }] });
        console.log(`✅ [SYSTEM] Backup ${backupId} cancelled successfully`);
      } catch (error) {
        console.error(`❌ [SYSTEM] Failed to cancel backup ${backupId}:`, error);
      }
    } else if (retryLevel === 1) {
      console.log(`⏰ [SYSTEM] Backup notification fired (main may have been missed or delayed)`);
    }
  });

  console.log('✅ Permanent system listener registered');
};
