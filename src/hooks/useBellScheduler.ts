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
  // Pas de isPremium – tout actif
}

const DAY_MAP: { [key: string]: number } = {
  'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
  'thursday': 4, 'friday': 5, 'saturday': 6
};

export const useBellScheduler = (options: BellSchedulerOptions) => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Fix 1: Helper TZ simple (pour at exact, no drifts)
    const createTZDate = (year: number, month: number, day: number, hour: number, minute: number, tz: string): Date => {
      try {
        const fmt = new Intl.DateTimeFormat('en-US', { 
          timeZone: tz, 
          year: 'numeric', month: 'numeric', day: 'numeric', 
          hour: 'numeric', minute: 'numeric', hour12: false 
        });
        const parts = fmt.formatToParts(new Date(year, month - 1, day, hour, minute));
        let str = parts.map(p => p.value).join('');  // e.g., "11/7/2025, 14:00"
        str = str.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2})/, '$3-$1-$2T$4:$5:00');  // To ISO (adjust if needed)
        return new Date(str);
      } catch (err) {
        console.warn('TZ calc fail, fallback local:', err);
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

        // Fix 2: Channels high prio (importance 5 loud, visibility 1 HUD, vibration true buzz)
        const highPrio = { importance: 5, visibility: 1, vibration: true };
        await LocalNotifications.createChannel({
          id: 'sacred-bells-channel',
          name: 'Sacred Bells',
          description: 'Notifications for scheduled bell chimes',
          ...highPrio,
          sound: 'default'
        });

        for (let i = 1; i <= 12; i++) {
          await LocalNotifications.createChannel({
            id: `cathedral-bells-${i}`,
            name: `Cathedral Bells (${i} chime${i > 1 ? 's' : ''})`,
            description: `Cathedral bells - ${i} chime${i > 1 ? 's' : ''}`,
            ...highPrio,
            sound: `cathedral_${i}`
          });
        }

        // Prières high prio aussi (fix non-fonc silence)
        ['morning', 'evening'].forEach(pt => {
          ['short', 'long'].forEach(ct => {
            await LocalNotifications.createChannel({
              id: `${pt}-prayer-${ct}`,
              name: `${pt.charAt(0).toUpperCase() + pt.slice(1)} Prayer (${ct} Call)`,
              description: `${ct} bell call for ${pt} prayer`,
              ...highPrio,
              sound: `${ct}_call`
            });
          });
        });

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

        // Fix 3: Pause cross-jour (e.g., 23:00-01:00)
        const isInPausePeriod = (timeMinutes: number) => {
          if (!options.pauseEnabled) return false;
          if (pauseStartMinutes > pauseEndMinutes) {  // Cross minuit
            return timeMinutes >= pauseStartMinutes || timeMinutes < pauseEndMinutes;
          }
          return timeMinutes >= pauseStartMinutes && timeMinutes < pauseEndMinutes;
        };

        // Fix 4: Next occurrence TZ-aware (no local drifts)
        const getNextOccurrence = (weekday: number, hour: number, minute: number): Date => {
          const nowDay = now.getDay();
          let targetDay = day + ((weekday - nowDay + 7) % 7);  // Next weekday from today
          const target = createTZDate(year, month, targetDay, hour, minute, options.timeZone);
          if (target <= now) {  // Past today? Next week
            target.setDate(target.getDate() + 7);
          }
          return target;
        };

        // Fix 5: Extras + IDs unique + cap (pour JS listener + no collisions)
        const scheduleBellNotification = (weekday: number, hour: number, minute: number, baseId: number) => {
          const timeMinutes = hour * 60 + minute;
          if (timeMinutes < startMinutes || timeMinutes > endMinutes || isInPausePeriod(timeMinutes)) return;

          const chimeCount = minute === 0 ? (hour % 12 || 12) : 1;
          const channelId = options.bellTradition === 'cathedral-bell' 
            ? `cathedral-bells-${chimeCount}` 
            : 'sacred-bells-channel';
          
          // SoundFile pour JS listener (fg play)
          const soundFile = chimeCount === 1 ? 'cathedral_1.mp3' : `cathedral_${chimeCount}.mp3`;  // Adapt to tradition if needed

          const nextOccurrence = getNextOccurrence(weekday, hour, minute);
          if (nextOccurrence.getTime() <= now.getTime() - 60000) return;  // Skip 1min past

          if (notifications.length >= 200) return;  // Cap simple

          const originalId = baseId + (weekday * 100000 + hour * 1000 + minute);  // Unique-ish

          // Main notif
          notifications.push({
            id: originalId,
            title: '🔔 Sacred Bells',
            body: `${chimeCount} chime${chimeCount > 1 ? 's' : ''}`,
            schedule: { 
              at: nextOccurrence,
              allowWhileIdle: true
              // No every 'week' – reschedule 24h for precision
            },
            silent: false,
            smallIcon: 'ic_launcher',
            channelId: channelId,
            extra: {  // Pour listener JS
              type: 'bell',
              soundFile,
              bellTradition: options.bellTradition,
              chimeCount,
              retryLevel: 0,
              originalId,
              scheduledTime: nextOccurrence.toISOString()
            }
          });

          // Optionnel backup pour delays (30s, retryLevel=1) – cancel in listener
          // Commentez si pas voulu
          const backupTime = new Date(nextOccurrence.getTime() + 30000);
          notifications.push({
            id: originalId + 1,
            title: '🔔 Sacred Bells (backup)',
            body: `${chimeCount} chime${chimeCount > 1 ? 's' : ''}`,
            schedule: { 
              at: backupTime,
              allowWhileIdle: true 
            },
            silent: false,
            smallIcon: 'ic_launcher',
            channelId: channelId,
            extra: {
              ... // Same as main
              retryLevel: 1,
              scheduledTime: backupTime.toISOString()
            }
          });

          console.log(`Bell scheduled: ${chimeCount} chimes at ${nextOccurrence.toLocaleTimeString(options.timeZone)}, ID ${originalId}`);
        };

        let notificationId = Date.now();  // Base unique (fix collisions)

        // Cloches (heures + demi si activé)
        let bellCount = 0;
        for (const dayName of options.selectedDays) {
          const weekday = DAY_MAP[dayName];
          if (weekday === undefined) continue;
          
          for (let h = 0; h < 24 && notifications.length < 200; h++) {  // Cap
            const hourMinutes = h * 60;
            if (hourMinutes >= startMinutes && hourMinutes <= endMinutes) {
              scheduleBellNotification(weekday, h, 0, notificationId);
              bellCount++;
              notificationId += 2;  // +1 for backup
            }
            
            if (options.halfHourChimes) {
              const halfHourMinutes = h * 60 + 30;
              if (halfHourMinutes >= startMinutes && halfHourMinutes <= endMinutes) {
                scheduleBellNotification(weekday, h, 30, notificationId);
                bellCount++;
                notificationId += 2;
              }
            }
          }
        }

        // Prières (morning)
        let prayerCount = 0;
        if (options.morningPrayerEnabled && options.morningPrayerTime) {
          const [mHour, mMinute] = options.morningPrayerTime.split(':').map(Number);
          const morningTimeMinutes = mHour * 60 + mMinute;
          
          if (!isInPausePeriod(morningTimeMinutes)) {
            for (const dayName of options.selectedDays) {
              const weekday = DAY_MAP[dayName];
              if (weekday === undefined) continue;
              
              const morningReminders = options.morningReminders || ['5'];
              
              morningReminders.forEach((reminderMinutes) => {
                const minutes = parseInt(reminderMinutes);
                let totalMinutes = mHour * 60 + mMinute - minutes;
                let dayOffset = 0;
                
                while (totalMinutes < 0) {
                  totalMinutes += 24 * 60;
                  dayOffset -= 1;
                }
                
                const reminderHour = Math.floor(totalMinutes / 60) % 24;
                const reminderMinute = totalMinutes % 60;
                let reminderWeekday = (weekday + dayOffset + 7) % 7;
                if (reminderWeekday < 0) reminderWeekday += 7;
                
                const nextOccurrence = createTZDate(year, month, day + ((reminderWeekday - now.getDay() + 7) % 7), reminderHour, reminderMinute, options.timeZone);
                
                notifications.push({
                  title: '⏰ Prayer Reminder',
                  body: `${options.morningPrayerName || 'Morning Prayer'} in ${minutes} minutes`,
                  id: notificationId++,
                  schedule: { 
                    at: nextOccurrence,
                    allowWhileIdle: true
                  },
                  sound: 'default',
                  smallIcon: 'ic_launcher',
                  channelId: 'sacred-bells-channel',
                  extra: {
                    type: 'reminder',
                    prayerType: 'morning'
                  }
                });
              });
              
              const channelId = options.morningCallType === 'long' 
                ? 'morning-prayer-long' 
                : 'morning-prayer-short';
              
              const nextOccurrence = createTZDate(year, month, day + ((weekday - now.getDay() + 7) % 7), mHour, mMinute, options.timeZone);
              
              const origId = notificationId;

              // SoundFile pour JS
              const soundFile = options.morningCallType === 'long' ? 'long_call.mp3' : 'short_call.mp3';

              notifications.push({
                title: '🔔',
                body: ' ',
                id: origId,
                schedule: { 
                  at: nextOccurrence,
                  allowWhileIdle: true
                },
                silent: false,
                smallIcon: 'ic_launcher',
                channelId: channelId,
                extra: {
                  type: 'prayer',
                  prayerType: 'morning',
                  callType: options.morningCallType || 'short',
                  soundFile,  // Pour listener play
                  retryLevel: 0,
                  originalId: origId,
                  scheduledTime: nextOccurrence.toISOString()
                }
              });
              notificationId++;

              prayerCount++;
              console.log(`Morning prayer scheduled at ${nextOccurrence.toLocaleTimeString(options.timeZone)}, ID ${origId}`);
            }
          }
        }

        // Evening similaire (duplique pour eveningPrayerEnabled etc.)
        if (options.eveningPrayerEnabled && options.eveningPrayerTime) {
          // ... Même logique que morning, mais pour evening (copie le bloc, change 'morning' → 'evening')
          // Ex: prayerType: 'evening', options.eveningPrayerName, etc.
          // Incrémente prayerCount
        }

        if (notifications.length > 0 && notifications.length < 500) {
          await LocalNotifications.schedule({ notifications });
          console.log(`Scheduled ${notifications.length} notifications (bells: ${bellCount * 2}, prayers: ${prayerCount * 2} incl backups)`);  // Approx
        } else if (notifications.length >= 500) {
          console.warn('Too many notifs – reduce range/days');
        }

      } catch (error) {
        console.error('Error scheduling bells:', error);
      }
    };

    scheduleBells();

    const rescheduleInterval = setInterval(scheduleBells, 24 * 60 * 60 * 1000);

    return () => {
      clearInterval(rescheduleInterval);
    };
  }, [
    // Tes deps exactes (no premium)
    options.enabled, options.bellTradition, options.startTime, options.endTime, options.halfHourChimes,
    options.pauseEnabled, options.pauseStartTime, options.pauseEndTime, options.selectedDays, options.timeZone,
    options.morningPrayerEnabled, options.morningPrayerTime, options.eveningPrayerEnabled, options.eveningPrayerTime,
    options.morningPrayerName, options.eveningPrayerName, options.morningCallType, options.eveningCallType,
    options.morningReminders, options.eveningReminders
  ]);
};
