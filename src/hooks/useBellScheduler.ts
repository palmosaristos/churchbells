import { useEffect, useRef } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

interface BellSchedulerOptions {
  enabled: boolean;
  bellsEnabled: boolean;
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

export const useBellScheduler = (options: BellSchedulerOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

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

        for (let i = 1; i <= 12; i++) {
          await LocalNotifications.createChannel({
            id: `village-bells-${i}`,
            name: `Village Bells (${i} chime${i > 1 ? 's' : ''})`,
            description: `Village bells - ${i} chime${i > 1 ? 's' : ''}`,
            ...lowPrio,
            sound: `village_${i}.mp3`,
            lightColor: '#d4a574',
            vibration: false
          });
        }

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

        await LocalNotifications.createChannel({
          id: 'prayer-reminder',
          name: 'Prayer Reminders',
          description: 'Visual reminders before prayer times (silent)',
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
        if (permission.display !== 'granted') return;

        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel({ notifications: pending.notifications });
        }

        if (!options.enabled || !options.timeZone) return;

        await setupChannels();

        const notifications: any[] = [];
        const now = new Date();
        const windowEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);

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

        let currentId = 1;
        const getNextId = () => currentId++;

        let bellCount = 0; // Déclaré ici pour être accessible partout

        // CLOCHES PRINCIPALES (24h window) - contrôlées par bellsEnabled
        if (options.bellsEnabled) {
          for (let offsetHours = 0; offsetHours < 24; offsetHours++) {
            const checkTime = new Date(now.getTime() + offsetHours * 60 * 60 * 1000);
            const h = checkTime.getHours();
            const dayName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][checkTime.getDay()];
            
            if (!options.selectedDays.includes(dayName)) continue;
            
            const hourMinutes = h * 60;
            if (hourMinutes < startMinutes || hourMinutes > endMinutes) continue;
            if (isInPausePeriod(hourMinutes)) continue;
            
            const chimeCount = h % 12 || 12;
            let soundFile: string, channelId: string;
            
            if (options.bellTradition === 'cathedral-bell') {
              soundFile = `cathedral_${chimeCount}.mp3`;
              channelId = `cathedral-bells-${chimeCount}`;
            } else if (options.bellTradition === 'village-bell') {
              soundFile = `village_${chimeCount}.mp3`;
              channelId = `village-bells-${chimeCount}`;
            } else {
              soundFile = 'freemium_carillon.mp3';
              channelId = 'sacred-bells-channel';
            }

            const notifTime = new Date(checkTime);
            notifTime.setMinutes(0, 0, 0);
            
            if (notifTime <= now || notifTime > windowEnd) continue;

            const originalId = getNextId();
            const backupId = getNextId();
            notifications.push({
              id: originalId,
              title: `🔔 ${chimeCount} Chime${chimeCount > 1 ? 's' : ''}`,
              body: ' ',
              schedule: { at: notifTime, allowWhileIdle: true },
              silent: false,
              smallIcon: 'ic_launcher',
              channelId,
              extra: { type: 'bell', soundFile, bellTradition: options.bellTradition, chimeCount, retryLevel: 0, originalId, backupId, scheduledTime: notifTime.toISOString() }
            });

            const backupTime = new Date(notifTime.getTime() + 45000);
            notifications.push({
              id: backupId,
              title: `🔔 ${chimeCount} Chime${chimeCount > 1 ? 's' : ''}`,
              body: ' ',
              schedule: { at: backupTime, allowWhileIdle: true },
              silent: false,
              smallIcon: 'ic_launcher',
              channelId,
              extra: { type: 'bell', soundFile, bellTradition: options.bellTradition, chimeCount, retryLevel: 1, originalId, backupId, scheduledTime: backupTime.toISOString() }
            });

            bellCount += 2;
          }

          // DEMI-HEURES (24h window)
          if (options.halfHourChimes) {
            for (let offsetHours = 0; offsetHours < 24; offsetHours++) {
              const checkTime = new Date(now.getTime() + offsetHours * 60 * 60 * 1000);
              const h = checkTime.getHours();
              const dayName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][checkTime.getDay()];
              
              if (!options.selectedDays.includes(dayName)) continue;
              
              const halfHourMinutes = h * 60 + 30;
              if (halfHourMinutes < startMinutes || halfHourMinutes > endMinutes) continue;
              if (isInPausePeriod(halfHourMinutes)) continue;

              let soundFile: string, channelId: string;
              if (options.bellTradition === 'cathedral-bell') {
                soundFile = 'cathedral_1.mp3';
                channelId = 'cathedral-bells-1';
              } else if (options.bellTradition === 'village-bell') {
                soundFile = 'village_1.mp3';
                channelId = 'village-bells-1';
              } else {
                soundFile = 'freemium_carillon.mp3';
                channelId = 'sacred-bells-channel';
              }

              const notifTime = new Date(checkTime);
              notifTime.setMinutes(30, 0, 0);
              
              if (notifTime <= now || notifTime > windowEnd) continue;

              const originalId = getNextId();
              const backupId = getNextId();

              notifications.push({
                id: originalId,
                title: '🔔 Half Hour',
                body: ' ',
                schedule: { at: notifTime, allowWhileIdle: true },
                silent: false,
                smallIcon: 'ic_launcher',
                channelId,
                extra: { type: 'bell', soundFile, bellTradition: options.bellTradition, chimeCount: 1, retryLevel: 0, originalId, backupId, scheduledTime: notifTime.toISOString(), isHalfHour: true }
              });

              const backupTime = new Date(notifTime.getTime() + 45000);
              notifications.push({
                id: backupId,
                title: '🔔 Half Hour',
                body: ' ',
                schedule: { at: backupTime, allowWhileIdle: true },
                silent: false,
                smallIcon: 'ic_launcher',
                channelId,
                extra: { type: 'bell', soundFile, bellTradition: options.bellTradition, chimeCount: 1, retryLevel: 1, originalId, backupId, scheduledTime: backupTime.toISOString(), isHalfHour: true }
              });

              bellCount += 2;
            }
          }

          console.log(`📅 Scheduled ${bellCount} bell notifications in next 24h`);
        }

        // PRIÈRES (24h window) - toujours actives si prayerEnabled
        let prayerCount = 0;
        if (options.prayerEnabled && options.prayerTime) {
          const [pHour, pMinute] = options.prayerTime.split(':').map(Number);
          const prayerTimeMinutes = pHour * 60 + pMinute;

          if (!isInPausePeriod(prayerTimeMinutes)) {
            for (let dayOffset = 0; dayOffset < 2; dayOffset++) {
              const checkDate = new Date(now);
              checkDate.setDate(checkDate.getDate() + dayOffset);
              checkDate.setHours(pHour, pMinute, 0, 0);
              
              const dayName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][checkDate.getDay()];
              
              if (!options.selectedDays.includes(dayName)) continue;
              if (checkDate <= now || checkDate > windowEnd) continue;

              const prayerReminders = options.prayerReminders || [];
              for (const reminderMinutes of prayerReminders) {
                const reminderTime = new Date(checkDate);
                reminderTime.setMinutes(reminderTime.getMinutes() - parseInt(reminderMinutes));
                
                if (reminderTime <= now || reminderTime > windowEnd) continue;

                const withBell = options.prayerReminderWithBell || false;
                notifications.push({
                  id: getNextId(),
                  title: `🔔 ${options.prayerName || 'Prayer'}`,
                  body: `in ${reminderMinutes} min${reminderMinutes === '1' ? '' : 's'}`,
                  schedule: { at: reminderTime, allowWhileIdle: true },
                  silent: false,
                  smallIcon: 'ic_launcher',
                  channelId: withBell ? 'prayer-reminder-bell' : 'prayer-reminder',
                  extra: { type: 'prayer-reminder', prayerName: options.prayerName || 'Prayer', minutesUntil: reminderMinutes, scheduledTime: reminderTime.toISOString(), withBell }
                });
              }

              const channelId = options.callType === 'long' ? 'prayer-long' : 'prayer-short';
              const soundFile = options.callType === 'long' ? 'long_call.mp3' : 'short_call.mp3';
              const originalId = getNextId();
              const backupId = getNextId();

              notifications.push({
                title: `🔔 ${options.prayerName || 'Prayer'}`,
                body: ' ',
                id: originalId,
                schedule: { at: checkDate, allowWhileIdle: true },
                silent: false,
                smallIcon: 'ic_launcher',
                channelId,
                extra: { type: 'prayer', callType: options.callType || 'short', soundFile, scheduledTime: checkDate.toISOString(), retryLevel: 0, originalId, backupId }
              });

              const backupTime = new Date(checkDate.getTime() + 30000);
              notifications.push({
                id: backupId,
                title: `🔔 ${options.prayerName || 'Prayer'}`,
                body: ' ',
                schedule: { at: backupTime, allowWhileIdle: true },
                silent: false,
                smallIcon: 'ic_launcher',
                channelId,
                extra: { type: 'prayer', callType: options.callType || 'short', soundFile, scheduledTime: backupTime.toISOString(), retryLevel: 1, originalId, backupId }
              });

              prayerCount += 2;
            }
          }
        }

        console.log(`📊 SCHEDULER: 24h Rolling Window - ${notifications.length} notifications (bells: ${bellCount}, prayers: ${prayerCount})`);
        console.log(`   Window: ${now.toLocaleString()} → ${windowEnd.toLocaleString()}`);
        
        if (notifications.length > 0 && notifications.length < 500) {
          await LocalNotifications.schedule({ notifications });
          const pending = await LocalNotifications.getPending();
          console.log(`✅ Scheduled ${notifications.length}, ${pending.notifications.length} pending`);
        }

      } catch (error) {
        console.error('❌ Schedule error:', error);
      }
    };

    scheduleBells();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    options.enabled, options.bellTradition, options.startTime, options.endTime, options.halfHourChimes,
    options.pauseEnabled, options.pauseStartTime, options.pauseEndTime, options.selectedDays, options.timeZone,
    options.prayerEnabled, options.prayerTime, options.prayerName, options.callType, options.prayerReminders,
    options.prayerReminderWithBell
  ]);
};
