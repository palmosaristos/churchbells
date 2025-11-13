import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';

/**
 * Hook pour la reprogrammation automatique nocturne des notifications
 * Vérifie l'heure toutes les 30 minutes et déclenche une reprogrammation à 3h du matin
 */
export const useNightlyRescheduler = (triggerReschedule: () => void) => {
  const lastRescheduleRef = useRef<string | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const checkAndReschedule = () => {
      const now = new Date();
      const hour = now.getHours();
      const today = now.toDateString();

      // Charger la dernière date de reprogrammation
      const storedLastReschedule = localStorage.getItem('lastReschedule');
      if (storedLastReschedule && !lastRescheduleRef.current) {
        lastRescheduleRef.current = storedLastReschedule;
      }

      // Entre 3h et 4h du matin ET pas encore fait aujourd'hui
      if (hour === 3 && lastRescheduleRef.current !== today) {
        console.log('🌙 Nightly rescheduling triggered at 3am');
        lastRescheduleRef.current = today;
        localStorage.setItem('lastReschedule', today);
        triggerReschedule();
      }
    };

    // Vérifier toutes les 30 minutes
    const interval = setInterval(checkAndReschedule, 30 * 60 * 1000);
    
    // Vérification immédiate au montage
    checkAndReschedule();

    return () => clearInterval(interval);
  }, [triggerReschedule]);
};
