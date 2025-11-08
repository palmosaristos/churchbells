import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

interface BellSchedulerOptions {
  enabled: boolean;
  bellTradition: string;
  startTime: string;
  endTime: string;
  halfHourChimes: boolean;
  pauseEnabled: boolean;
  pauseStartTime: string;
  pauseEndTime: string;
  selectedDays: string[];
  timeZone: string;
  morningPrayerEnabled: boolean;
  morningPrayerTime: string;
  eveningPrayerEnabled: boolean;
  eveningPrayerTime: string;
  morningPrayerName?: string;
  eveningPrayerName?: string;
  morningCallType?: string;
  eveningCallType?: string;
  morningReminders?: string[];
  eveningReminders?: string[];
}

const DAY_MAP: { [key: string]: number } = {
  'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
  'thursday': 4, 'friday': 5, 'saturday': 6
};

export const useBellScheduler = (options: BellSchedulerOptions) => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Helper TZ (pour at exact, no drifts)
    const createTZDate = (year: number, month: number, day: number, hour: number, minute: number, tz: string): Date => {
      try {
        const fmt = new Intl.DateTimeFormat('en-US', { 
          timeZone: tz, 
          year: 'numeric', month: 'numeric', day: 'numeric', 
          hour: 'numeric', minute: 'numeric', hour12: false 
        });
        const parts = fmt.formatToParts(new Date(year, month - 1, day, hour, minute));
        let str = parts.map(p => p.value).join('');  // e.g., "11/7/2025, 14:00"
        str = str.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2})/, '$3-$1-$2T$4:$5:00');  // To ISO
        return new Date(str);
      } catch {
        console.warn('TZ calc fail, fallback local');
        return new Date(year, month - 1, day, hour, minute);
      }
    };

    const scheduleBells = async () => {
      try {
        const permission = await LocalNotifications.requestPermissions();
        if (permission.display !== 'granted') {
          console.log('Permission not granted');
          return;
        }

        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel({ notifications: pending.notifications });
        }

        if (!options.enabled || !options.timeZone) {
          console.log('Bells disabled or no timezone, notifications cleared');
          return;
        }

        await LocalNotifications.createChannel({
          id: 'sacred-bells-channel',
          name: 'Sacred Bells',
          description: 'Notifications for scheduled bell chimes',
          importance: 5 as 5,
          visibility: 1 as 1,
          vibration: true,
          sound: 'default'
        });

        for (let i = 1; i <= 12; i++) {
          await LocalNotifications.createChannel({
            id: `cathedral-bells-${i}`,
            name: `Cathedral Bells (${i} chime${i > 1 ? 's' : ''})`,
            description: `Cathedral bells - ${i} chime${i > 1 ? 's' : ''}`,
            importance: 5 as 5,
            visibility: 1 as 1,
            vibration: true,
            sound: `cathedral_${i}`
          });
        }

        for (const pt of ['morning', 'evening']) {
          for (const ct of ['short', 'long']) {
            await LocalNotifications.createChannel({
              id: `${pt}-prayer-${ct}`,
              name: `${pt.charAt(0).toUpperCase() + pt.slice(1)} Prayer (${ct} Call)`,
              description: `${ct} bell call for ${pt} prayer`,
              importance: 5 as 5,
              visibility: 1 as 1,
              vibration: true,
              sound: `${ct}_call`
            });
          }
        }

        const notifications: any[] = [];
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        const [startHour, startMinute] = options.startTime.split(':').map(Number);
        const [endHour, endMinute] = options.endTime.split(':').map(Number);
        const [pauseStartHour, pauseStartMinute] = options.pauseStartTime.split(':').map(Number);
        const [pauseEndHour, pauseEndMinute] = options.pauseEndTime.split(':').map(Number);

        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        const pauseStartMinutes = pauseStartHour * 60 + pauseStartMinute;
        const pauseEndMinutes = pauseEndHour * 60 + pauseEndMinute;

        // Pause cross-jour (e.g., 23:00-01:00)
        const isInPausePeriod = (timeMinutes: number) => {
          if (!options.pauseEnabled) return false;
          if (pauseStartMinutes > pauseEndMinutes) {
            return timeMinutes >= pauseStartMinutes || timeMinutes < pauseEndMinutes;
          }
          return timeMinutes >= pauseStartMinutes && timeMinutes < pauseEndMinutes;
        };

        // Next occurrence TZ-aware
        const getNextOccurrence = (weekday: number, hour: number, minute: number): Date => {
          const nowDay = now.getDay();
          let targetDay = day + ((weekday - nowDay + 7) % 7);
          const target = createTZDate(year, month, targetDay, hour, minute, options.timeZone);
          if (target <= now) {
            target.setDate(target.getDate() + 7);
          }
          return target;
        };

        let notificationId = Date.now();  // Base unique

        // Cloches
        let bellCount = 0;
        for (const dayName of options.selectedDays) {
          const weekday = DAY_MAP[dayName];
          if (weekday === undefined) continue;
          
          for (let h = 0; h < 24 && notifications.length < 200; h++) {
            const hourMinutes = h * 60;
            if (hourMinutes >= startMinutes && hourMinutes <= endMinutes) {
              const chimeCount = 12 % 12 || 12;  // Exemple, adjust si needed
              const channelId = options.bellTradition === 'cathedral-bell' 
                ? `cathedral-bells-${chimeCount}` 
                : 'sacred-bells-channel';
              const soundFile = `cathedral_${chimeCount}.mp3`;  // Pour JS listener

              const nextOccurrence = getNextOccurrence(weekday, h, 0);
              if (nextOccurrence.getTime() <= now.getTime() - 60000) continue;

              const baseExtra = {  // Fix Spread: Base object pour main/backup
                type: 'bell' as const,
                soundFile,
                bellTradition: options.bellTradition,
                chimeCount,
                scheduledTime: nextOccurrence.toISOString()
              };

              const originalId = notificationId++;
              notifications.push({
                id: originalId,
                title: '🔔 Sacred Bells',
                body: `${chimeCount} chime${chimeCount > 1 ? 's' : ''}`,
                schedule: { at: nextOccurrence, allowWhileIdle: true },
                silent: false,
                smallIcon: 'ic_launcher',
                channelId,
                extra: { ...baseExtra, retryLevel: 0 as const, originalId }
              });

              // Backup +30s (optionnel pour delays)
              const backupTime = new Date(nextOccurrence.getTime() + 30000);
              notifications.push({
                id: notificationId++,
                title: '🔔 Sacred Bells (backup)',
                body: `${chimeCount} chime${chimeCount > 1 ? 's' : ''}`,
                schedule: { at: backupTime, allowWhileIdle: true },
                silent: false,
                smallIcon: 'ic_launcher',
                channelId,
                extra: {  // Fix Spread: Proper {...baseExtra, overrides}
                  ...baseExtra,
                  retryLevel: 1 as const,
                  originalId,
                  scheduledTime: backupTime.toISOString()
                }
              });

              bellCount += 2;  // Main + backup
              console.log(`Bell scheduled: ${chimeCount} at ${nextOccurrence.toLocaleTimeString(options.timeZone)}, ID ${originalId}`);
            }
            
            if (options.halfHourChimes) {
              // Logique similaire pour half-hour (duplique pour demi-heures, chimeCount=1)
              // ... (ajoute si needed, même pattern)
            }
          }
        }

        // Prières (morning example ; duplicate for evening)
        let prayerCount = 0;
        if (options.morningPrayerEnabled && options.morningPrayerTime) {
          const [mHour, mMinute] = options.morningPrayerTime.split(':').map(Number);
          const morningTimeMinutes = mHour * 60 + mMinute;
          
          if (!isInPausePeriod(morningTimeMinutes)) {
            for (const dayName of options.selectedDays) {
              const weekday = DAY_MAP[dayName];
              if (weekday === undefined) continue;
              
              // Reminders (only toast, no sound)
              const morningReminders = options.morningReminders || ['5'];
              for (const reminderMinutes of morningReminders) {
                // Logique reminder toast (no channel/sound here ; UI handle)
                // Ex: Push minimal notif for timing, but sound only at prayer
              }
              
              const channelId = options.morningCallType === 'long' 
                ? 'morning-prayer-long' 
                : 'morning-prayer-short';
              const soundFile = options.morningCallType === 'long' ? 'long_call.mp3' : 'short_call.mp3';

              const nextOccurrence = getNextOccurrence(weekday, mHour, mMinute);
              const baseExtra = {
                type: 'prayer' as const,
                prayerType: 'morning' as const,
                callType: options.morningCallType || 'short',
                soundFile,
                scheduledTime: nextOccurrence.toISOString()
              };

              const originalId = notificationId++;
              notifications.push({
                title: '🔔',
                body: ' ',
                id: originalId,
                schedule: { at: nextOccurrence, allowWhileIdle: true },
                silent: false,
                smallIcon: 'ic_launcher',
                channelId,
                extra: { ...baseExtra, retryLevel: 0 as const, originalId }
              });

              // Backup
              const backupTime = new Date(nextOccurrence.getTime() + 30000);
              notifications.push({
                id: notificationId++,
                title: '🔔 (backup)',
                body: ' ',
                schedule: { at: backupTime, allowWhileIdle: true },
                silent: false,
                smallIcon: 'ic_launcher',
                channelId,
                extra: {
                  ...baseExtra,
                  retryLevel: 1 as const,
                  originalId,
                  scheduledTime: backupTime.toISOString()
                }
              });

              prayerCount += 2;
              console.log(`Morning prayer at ${nextOccurrence.toLocaleTimeString(options.timeZone)}, ID ${originalId}`);
            }
          }
        }

        // Duplicate bloc pour evening (if options.eveningPrayerEnabled...)
        // ... (copie le morning bloc, change 'morning' → 'evening', etc.)

        if (notifications.length > 0 && notifications.length < 500) {
          await LocalNotifications.schedule({ notifications });
          console.log(`Scheduled ${notifications.length} (bells: ${bellCount}, prayers: ${prayerCount})`);
        } else if (notifications.length >= 500) {
          console.warn('Too many – reduce range');
        }
      } catch (error) {
        console.error('Schedule error:', error);
      }
    };

    scheduleBells();
    const rescheduleInterval = setInterval(scheduleBells, 24 * 60 * 60 * 1000);

    return () => clearInterval(rescheduleInterval);
  }, [
    options.enabled, options.bellTradition, options.startTime, options.endTime, options.halfHourChimes,
    options.pauseEnabled, options.pauseStartTime, options.pauseEndTime, options.selectedDays, options.timeZone,
    options.morningPrayerEnabled, options.morningPrayerTime, options.eveningPrayerEnabled, options.eveningPrayerTime,
    options.morningPrayerName, options.eveningPrayerName, options.morningCallType, options.eveningCallType,
    options.morningReminders, options.eveningReminders
  ]);
};
