import { useState, useEffect, useCallback } from 'react';
import { debugLog } from '@/utils/debugLog';

interface TimeSyncResult {
  offset: number;        // Offset en millisecondes (local - serveur)
  isSynced: boolean;     // True si la sync a réussi
  lastSyncAt: Date | null;
  syncNow: () => Promise<void>;
}

const SYNC_STORAGE_KEY = 'timeSync_offset';
const SYNC_TIMESTAMP_KEY = 'timeSync_lastSync';
const SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000; // Re-sync toutes les 24h

/**
 * Hook pour synchroniser l'heure locale avec un serveur de temps externe.
 * Calcule un offset à appliquer lors du scheduling des notifications.
 */
export const useTimeSync = (): TimeSyncResult => {
  const [offset, setOffset] = useState<number>(() => {
    const saved = localStorage.getItem(SYNC_STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isSynced, setIsSynced] = useState<boolean>(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(() => {
    const saved = localStorage.getItem(SYNC_TIMESTAMP_KEY);
    return saved ? new Date(parseInt(saved, 10)) : null;
  });

  const fetchServerTime = useCallback(async (): Promise<number | null> => {
    // Essayer plusieurs APIs pour la fiabilité
    const apis = [
      {
        url: 'https://worldtimeapi.org/api/ip',
        parse: (data: any) => new Date(data.utc_datetime).getTime()
      },
      {
        url: 'https://timeapi.io/api/Time/current/zone?timeZone=UTC',
        parse: (data: any) => new Date(data.dateTime + 'Z').getTime()
      }
    ];

    for (const api of apis) {
      try {
        const beforeFetch = Date.now();
        const response = await fetch(api.url, { 
          signal: AbortSignal.timeout(5000) // Timeout 5s
        });
        const afterFetch = Date.now();
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const serverTime = api.parse(data);
        
        // Compenser la latence réseau (approximation: moitié du RTT)
        const networkLatency = (afterFetch - beforeFetch) / 2;
        const adjustedServerTime = serverTime + networkLatency;
        
        debugLog('[TimeSync] Server time fetched:', {
          api: api.url,
          serverTime: new Date(serverTime).toISOString(),
          latencyMs: afterFetch - beforeFetch
        });
        
        return adjustedServerTime;
      } catch (err) {
        debugLog('[TimeSync] API failed:', api.url, err);
        continue;
      }
    }
    return null;
  }, []);

  const syncNow = useCallback(async () => {
    const serverTime = await fetchServerTime();
    if (serverTime === null) {
      debugLog('[TimeSync] All APIs failed, using previous offset');
      return;
    }

    const localTime = Date.now();
    const newOffset = localTime - serverTime;
    
    debugLog('[TimeSync] Offset calculated:', {
      offsetMs: newOffset,
      offsetSec: (newOffset / 1000).toFixed(2),
      localAhead: newOffset > 0
    });

    setOffset(newOffset);
    setIsSynced(true);
    setLastSyncAt(new Date());
    
    localStorage.setItem(SYNC_STORAGE_KEY, newOffset.toString());
    localStorage.setItem(SYNC_TIMESTAMP_KEY, Date.now().toString());
  }, [fetchServerTime]);

  // Sync au démarrage si nécessaire
  useEffect(() => {
    const shouldSync = !lastSyncAt || 
      (Date.now() - lastSyncAt.getTime() > SYNC_INTERVAL_MS);
    
    if (shouldSync) {
      syncNow();
    } else {
      setIsSynced(true); // Utiliser l'offset sauvegardé
    }
  }, [syncNow, lastSyncAt]);

  return { offset, isSynced, lastSyncAt, syncNow };
};

/**
 * Retourne le timestamp actuel corrigé par l'offset de synchronisation.
 * À utiliser pour scheduler les notifications avec précision.
 */
export const getSyncedTime = (): number => {
  const savedOffset = localStorage.getItem(SYNC_STORAGE_KEY);
  const offset = savedOffset ? parseInt(savedOffset, 10) : 0;
  return Date.now() - offset;
};

/**
 * Retourne une Date corrigée par l'offset de synchronisation.
 */
export const getSyncedDate = (): Date => {
  return new Date(getSyncedTime());
};
