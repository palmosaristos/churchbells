/**
 * Utility for conditional logging based on environment
 * Logs only in development mode to reduce production overhead
 */
export const debugLog = (...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

/**
 * Hash function to create a fingerprint of notification parameters
 * Used to detect changes and avoid unnecessary rescheduling
 */
export const hashParams = (storage: Storage): string => {
  const params = [
    storage.getItem('bellTradition'),
    storage.getItem('startTime'),
    storage.getItem('endTime'),
    storage.getItem('halfHourChimes'),
    storage.getItem('bellsEnabled'),
    storage.getItem('timeZone'),
    storage.getItem('pauseEnabled'),
    storage.getItem('pauseStartTime'),
    storage.getItem('pauseEndTime'),
    storage.getItem('selectedDays'),
    storage.getItem('prayerEnabled'),
    storage.getItem('prayerName'),
    storage.getItem('prayerTime'),
    storage.getItem('prayerCallType'),
    storage.getItem('prayerReminderNotifications'),
    storage.getItem('prayerReminderWithBell'),
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < params.length; i++) {
    const char = params.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

/**
 * Calculate milliseconds until next 3 AM
 */
export const calculateMsUntil3am = (): number => {
  const now = new Date();
  const next3am = new Date();
  next3am.setHours(3, 0, 0, 0);
  
  // If it's already past 3 AM today, schedule for tomorrow
  if (now.getHours() >= 3) {
    next3am.setDate(next3am.getDate() + 1);
  }
  
  return next3am.getTime() - now.getTime();
};
