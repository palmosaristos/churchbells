import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { debugLog, hashParams, calculateMsUntil3am } from '@/utils/debugLog';

/**
 * Hook pour la reprogrammation automatique nocturne des notifications
 * Optimisé pour minimiser la consommation batterie :
 * - Un seul setTimeout calculé jusqu'à 3h (au lieu d'interval de 30 min)
 * - Comparaison de hash des paramètres pour éviter reprogrammation inutile
 */
export const useNightlyRescheduler = (triggerReschedule: () => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const scheduleNext3amCheck = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const msUntil3am = calculateMsUntil3am();
      debugLog(`⏰ Next 3am check scheduled in ${(msUntil3am / 1000 / 60 / 60).toFixed(1)} hours`);

      timeoutRef.current = setTimeout(() => {
        const today = new Date().toDateString();
        const lastReschedule = localStorage.getItem('lastReschedule');
        
        // Éviter de reprogrammer plusieurs fois le même jour
        if (lastReschedule === today) {
          debugLog('✅ Already rescheduled today, skipping');
          scheduleNext3amCheck(); // Schedule for tomorrow
          return;
        }

        // Calculer le hash des paramètres actuels
        const currentHash = hashParams(localStorage);
        const lastHash = localStorage.getItem('lastParamsHash');

        if (currentHash !== lastHash) {
          debugLog('🔄 Params changed, rescheduling at 3am');
          localStorage.setItem('lastParamsHash', currentHash);
          localStorage.setItem('lastReschedule', today);
          triggerReschedule();
        } else {
          debugLog('✅ Params unchanged, skipping reschedule');
          localStorage.setItem('lastReschedule', today); // Mark as checked
        }

        // Schedule next check for tomorrow 3am
        scheduleNext3amCheck();
      }, msUntil3am);
    };

    // Initial scheduling
    scheduleNext3amCheck();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [triggerReschedule]);
};
