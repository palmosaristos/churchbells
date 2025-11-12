import { useEffect, useRef } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';

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
  prayerReminderWithBell?: boolean;
}

const DAY_MAP: { [key: string]: number } = {
  'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
  'thursday': 4, 'friday': 5, 'saturday': 6
};

export const useBellScheduler = (options: BellSchedulerOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Simplification de la gestion de la timezone : fallback direct au local (compatible avec l'hypothèse que le device est en timezone utilisateur pour MVP)
    const createTZDate = (year: number, month: number, day: number, hour: number, minute: number, tz: string): Date => {
      console.warn('TZ calc simplified to local for MVP compatibility');
      return new Date(year, month - 1, day, hour, minute);
    };

    // Création des canaux (sans audioAttributes non supporté par Capacitor)
    const setupChannels = async () => {
      try {
        const lowPrio = { importance: 3, visibility: 1, vibration: false } as const;
        
        await LocalNotifications.createChannel({
          id: 'sacred-bells-channel',
          name: 'Sacred Bells',
          description: 'Notifications for scheduled bell chimes',
          ...lowPrio,
          sound: 'freemium_carillon.mp3',
          lightColor: '#d4a574',
          vibration: false
        });

        // Canaux Cathedral (1-12 carillons)
        for (let i = 1; i <= 12; i++) {
          await LocalNotifications.createChannel({
            id: `cathedral-bells-${i}`,
            name: `Cathedral Bells (${i} chime${i > 1 ? 's' : ''})`,
            description: `Cathedral bells - ${i} chime${i > 1 ? 's' : ''}`,
            ...lowPrio,
            sound: `cathedral_${i}.mp3`,
            lightColor: '#d4a574',
            vibration: false
          });
        }

        // Canaux de prière
        await LocalNotifications.createChannel({
          id: 'prayer-short',
          name: 'Prayer (Short Call)',
          description: 'Short bell call for prayer',
          ...lowPrio,
          sound: 'short_call.mp3',
          lightColor: '#8b4513',
          vibration: false
        });

        await LocalNotifications.createChannel({
          id: 'prayer-long',
          name: 'Prayer (Long Call)',
          description: 'Long bell call for prayer',
          ...lowPrio,
          sound: 'long_call.mp3',
          lightColor: '#8b4513',
          vibration: false
        });

        // Canaux de rappel
        await LocalNotifications.createChannel({
          id: 'prayer-reminder',
          name: 'Prayer Reminders',
          description: 'Silent reminders before prayer times',
          importance: 2 as const,
          visibility: 1,
          vibration: false
        });

        await LocalNotifications.createChannel({
          id: 'prayer-reminder-bell',
          name: 'Prayer Reminders (with bell)',
          description: 'Reminders with cathedral bell',
          importance: 3 as const,
          visibility: 1,
          sound: 'cathedral_1.mp3',
          lightColor: '#d4a574',
          vibration: false
        });
      } catch (chanErr) {
        console.warn('Channel create fail (OK if already exist):', chanErr);
      }
    };

    const scheduleBells = async () => {
      try {
        const permission = await LocalNotifications.requestPermissions();
        if (permission.display !== 'granted') {
          console.log('Permission not granted');
          return;
        }

        // Nettoyage complet des anciennes notifications
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel({ notifications: pending.notifications });
        }

        if (!options.enabled || !options.timeZone) {
          console.log('Bells disabled or no timezone, notifications cleared');
          return;
        }

        await setupChannels();

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

        // CLOCHES PRINCIPALES
        let bellCount = 0;
        for (const dayName of options.selectedDays) {
          const weekday = DAY_MAP[dayName];
          if (weekday === undefined) continue;

          for (let h = 0; h < 24; h++) {
            const hourMinutes = h * 60;
            if (hourMinutes >= startMinutes && hourMinutes <= endMinutes) {
              const chimeCount = h % 12 || 12;
              
              if (isInPausePeriod(hourMinutes)) continue;

              let soundFile: string;
              let channelId: string;
              
              if (options.bellTradition === 'cathedral-bell') {
                soundFile = `cathedral_${chimeCount}.mp3`;
                channelId = `cathedral-bells-${chimeCount}`;
              } else {
                soundFile = 'freemium_carillon.mp3';
                channelId = 'sacred-bells-channel';
              }

              const nextOccurrence = getNextOccurrence(weekday, h, 0);

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
                title: '🔔 Sacred Bells',
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
            }

            // DEMI-HEURES
            if (options.halfHourChimes) {
              const halfHourMinutes = h * 60 + 30;
              if (halfHourMinutes >= startMinutes && halfHourMinutes <= endMinutes && !isInPausePeriod(halfHourMinutes)) {
                
                let soundFile: string;
                let channelId: string;
                
                if (options.bellTradition === 'cathedral-bell') {
                  soundFile = 'cathedral_1.mp3';
                  channelId = 'cathedral-bells-1';
                } else {
                  soundFile = 'freemium_carillon.mp3';
                  channelId = 'sacred-bells-channel';
                }

                const nextOccurrence = getNextOccurrence(weekday, h, 30);

                const originalId = notificationId++;
                notifications.push({
                  id: originalId,
                  title: '🔔 Sacred Bells',
                  body: 'Half hour',
                  schedule: { at: nextOccurrence, allowWhileIdle: true },
                  silent: false,
                  smallIcon: 'ic_launcher',
                  channelId,
                  extra: {
                    type: 'bell' as const,
                    soundFile,
                    bellTradition: options.bellTradition,
                    chimeCount: 1,
                    retryLevel: 0 as const,
                    originalId,
                    scheduledTime: nextOccurrence.toISOString(),
                    isHalfHour: true
                  }
                });

                bellCount++;
              }
            }
          }
        }

        // PRIÈRES
        let prayerCount = 0;
        if (options.prayerEnabled && options.prayerTime) {
          const [pHour, pMinute] = options.prayerTime.split(':').map(Number);
          const prayerTimeMinutes = pHour * 60 + pMinute;

          if (!isInPausePeriod(prayerTimeMinutes)) {
            for (const dayName of options.selectedDays) {
              const weekday = DAY_MAP[dayName];
              if (weekday === undefined) continue;

              // Rappels
              const prayerReminders = options.prayerReminders || [];
              for (const reminderMinutes of prayerReminders) {
                const reminderTime = new Date();
                reminderTime.setHours(pHour, pMinute - parseInt(reminderMinutes), 0, 0);
                
                const reminderOccurrence = getNextOccurrence(weekday, reminderTime.getHours(), reminderTime.getMinutes());

                const withBell = options.prayerReminderWithBell || false;
                notifications.push({
                  id: notificationId++,
                  title: `🔔 ${options.prayerName || 'Prayer'}`,
                  body: `in ${reminderMinutes} min${reminderMinutes === '1' ? '' : 's'}`,
                  schedule: { at: reminderOccurrence, allowWhileIdle: true },
                  silent: false,
                  smallIcon: 'ic_launcher',
                  channelId: withBell ? 'prayer-reminder-bell' : 'prayer-reminder',
                  extra: {
                    type: 'prayer-reminder' as const,
                    prayerName: options.prayerName || 'Prayer',
                    minutesUntil: reminderMinutes,
                    scheduledTime: reminderOccurrence.toISOString(),
                    withBell: withBell
                  }
                });
              }

              // Notification principale de prière
              const channelId = options.callType === 'long' ? 'prayer-long' : 'prayer-short';
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
                title: `🔔 ${options.prayerName || 'Prayer'}`,
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
                title: `🔔 ${options.prayerName || 'Prayer'}`,
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
            }
          }
        }

        // Planification finale
        if (notifications.length > 0 && notifications.length < 500) {
          await LocalNotifications.schedule({ notifications });
          console.log(`✅ Scheduled ${notifications.length} notifications (bells: ${bellCount}, prayers: ${prayerCount})`);
        } else if (notifications.length >= 500) {
          console.warn('⚠️ Too many notifications – reduce time range');
        }

      } catch (error) {
        console.error('❌ Schedule error:', error);
      }
    };

    // Planification immédiate (sur montage et changements d'options)
    scheduleBells();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    options.enabled, options.bellTradition, options.startTime, options.endTime, options.halfHourChimes,
    options.pauseEnabled, options.pauseStartTime, options.pauseEndTime, options.selectedDays, options.timeZone,
    options.prayerEnabled, options.prayerTime, options.prayerName, options.callType, options.prayerReminders,
    options.prayerReminderWithBell
  ]);
};
