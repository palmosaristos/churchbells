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
  prayerEnabled: boolean;
  prayerTime: string;
  prayerName?: string;
  callType?: string;
  prayerReminders?: string[];
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
        let str = parts.map(p => p.value).join('');
        str = str.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2})/, '$3-$1-$2T$4:$5:00');
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

        // Channels avec low prio
        const lowPrio = { importance: 2 as any, visibility: 0 as any, vibration: false };
        await LocalNotifications.createChannel({
          id: 'sacred-bells-channel',
          name: 'Sacred Bells',
          description: 'Notifications for scheduled bell chimes',
          ...lowPrio,
          sound: 'default'
        });

        for (let i = 1; i <= 12; i++) {
          await LocalNotifications.createChannel({
            id: `cathedral-bells-${i}`,
            name: `Cathedral Bells (${i} chime${i > 1 ? 's' : ''})`,
            description: `Cathedral bells - ${i} chime${i > 1 ? 's' : ''}`,
            ...lowPrio,
            sound: `cathedral_${i}`
          });
        }

        try {
          // Prayer reminder channel
          await LocalNotifications.createChannel({
            id: 'prayer-reminder',
            name: 'Prayer Reminders',
            description: 'Reminders before prayer times',
            importance: 3 as any,
            visibility: 1 as any,
            sound: undefined
          });

          // Prayer channels
          for (const ct of ['short', 'long']) {
            await LocalNotifications.createChannel({
              id: `prayer-${ct}`,
              name: `Prayer (${ct} Call)`,
              description: `${ct} bell call for prayer`,
              ...lowPrio,
              sound: `${ct}_call`
            });
          }
        } catch (chanErr) {
          console.warn('Channel create fail (OK if already exist):', chanErr);
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

        const isInPausePeriod = (timeMinutes: number) => {
          if (!options.pauseEnabled) return false;
          if (pauseStartMinutes > pauseEndMinutes) {
            return timeMinutes >= pauseStartMinutes || timeMinutes < pauseEndMinutes;
          }
          return timeMinutes >= pauseStartMinutes && timeMinutes < pauseEndMinutes;
        };

        const getNextOccurrence = (weekday: number, hour: number, minute: number): Date => {
          const nowDay = now.getDay();
          let daysUntilTarget = (weekday - nowDay + 7) % 7;
          let target = createTZDate(year, month, day + daysUntilTarget, hour, minute, options.timeZone);
          if (target <= now) {
            target = createTZDate(year, month, day + daysUntilTarget + 7, hour, minute, options.timeZone);
          }
          return target;
        };

        let notificationId = Date.now();

        // Cloches
        let bellCount = 0;
        for (const dayName of options.selectedDays) {
          const weekday = DAY_MAP[dayName];
          if (weekday === undefined) continue;

          for (let h = 0; h < 24 && notifications.length < 200; h++) {
            const hourMinutes = h * 60;
            if (hourMinutes >= startMinutes && hourMinutes <= endMinutes) {
              const chimeCount = h % 12 || 12;
              const channelId = options.bellTradition === 'cathedral-bell' 
                ? `cathedral-bells-${chimeCount}` 
                : 'sacred-bells-channel';
              const soundFile = `cathedral_${chimeCount}.mp3`;

              const nextOccurrence = getNextOccurrence(weekday, h, 0);
              if (nextOccurrence.getTime() <= now.getTime() - 60000) continue;

              const baseExtra = {
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

              const backupTime = new Date(nextOccurrence.getTime() + 30000);
              notifications.push({
                id: notificationId++,
                title: '🔔 Sacred Bells (backup)',
                body: `${chimeCount} chime${chimeCount > 1 ? 's' : ''}`,
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

              bellCount += 2;
              console.log(`Bell scheduled: ${chimeCount} at ${nextOccurrence.toLocaleTimeString(options.timeZone)}, ID ${originalId}`);
            }

            if (options.halfHourChimes) {
              // Half hour logic here if needed
            }
          }
        }

        // Prayer scheduling
        let prayerCount = 0;
        if (options.prayerEnabled && options.prayerTime) {
          const [pHour, pMinute] = options.prayerTime.split(':').map(Number);
          const prayerTimeMinutes = pHour * 60 + pMinute;

          if (!isInPausePeriod(prayerTimeMinutes)) {
            for (const dayName of options.selectedDays) {
              const weekday = DAY_MAP[dayName];
              if (weekday === undefined) continue;

              // Reminders
              const prayerReminders = options.prayerReminders || [];
              for (const reminderMinutes of prayerReminders) {
                const reminderTime = new Date(pHour * 3600000 + (pMinute - parseInt(reminderMinutes)) * 60000);
                const reminderOccurrence = getNextOccurrence(weekday, reminderTime.getHours(), reminderTime.getMinutes());

                notifications.push({
                  id: notificationId++,
                  title: '🔔',
                  body: ' ',
                  schedule: { at: reminderOccurrence, allowWhileIdle: true },
                  silent: true,
                  smallIcon: 'ic_launcher',
                  channelId: 'prayer-reminder',
                  extra: {
                    type: 'prayer-reminder' as const,
                    prayerName: options.prayerName || 'Prayer',
                    minutesUntil: reminderMinutes,
                    scheduledTime: reminderOccurrence.toISOString()
                  }
                });
              }

              const channelId = options.callType === 'long' 
                ? 'prayer-long' 
                : 'prayer-short';
              const soundFile = options.callType === 'long' ? 'long_call.mp3' : 'short_call.mp3';

              const nextOccurrence = getNextOccurrence(weekday, pHour, pMinute);
              const baseExtra = {
                type: 'prayer' as const,
                callType: options.callType || 'short',
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
              console.log(`Prayer at ${nextOccurrence.toLocaleTimeString(options.timeZone)}, ID ${originalId}`);
            }
          }
        }

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
    options.prayerEnabled, options.prayerTime, options.prayerName, options.callType, options.prayerReminders
  ]);
};
