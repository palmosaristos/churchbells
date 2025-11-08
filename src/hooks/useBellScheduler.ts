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
  'sunday': 0,
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6
};

export const useBellScheduler = (options: BellSchedulerOptions) => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const scheduleBells = async () => {
      try {
        const permission = await LocalNotifications.requestPermissions();
        if (permission.display !== 'granted') {
          console.log('Notification permission not granted');
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
          importance: 5,
          visibility: 1,
          sound: 'default',
          vibration: true
        });

        for (let i = 1; i <= 12; i++) {
          await LocalNotifications.createChannel({
            id: `cathedral-bells-${i}`,
            name: `Cathedral Bells (${i} chime${i > 1 ? 's' : ''})`,
            description: `Cathedral bells - ${i} chime${i > 1 ? 's' : ''}`,
            importance: 5,
            visibility: 1,
            sound: `cathedral_${i}`,
            vibration: true
          });
        }

        await LocalNotifications.createChannel({
          id: 'morning-prayer-short',
          name: 'Morning Prayer (Short Call)',
          description: 'Short bell call for morning prayer',
          importance: 2,
          visibility: 0,
          sound: 'short_call',
          vibration: false
        });

        await LocalNotifications.createChannel({
          id: 'morning-prayer-long',
          name: 'Morning Prayer (Long Call)',
          description: 'Long bell call for morning prayer',
          importance: 2,
          visibility: 0,
          sound: 'long_call',
          vibration: false
        });

        await LocalNotifications.createChannel({
          id: 'evening-prayer-short',
          name: 'Evening Prayer (Short Call)',
          description: 'Short bell call for evening prayer',
          importance: 2,
          visibility: 0,
          sound: 'short_call',
          vibration: false
        });

        await LocalNotifications.createChannel({
          id: 'evening-prayer-long',
          name: 'Evening Prayer (Long Call)',
          description: 'Long bell call for evening prayer',
          importance: 2,
          visibility: 0,
          sound: 'long_call',
          vibration: false
        });

        const notifications: any[] = [];
        const now = new Date();

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
          return timeMinutes >= pauseStartMinutes && timeMinutes < pauseEndMinutes;
        };

        const getNextOccurrence = (weekday: number, hour: number, minute: number): Date => {
          const target = new Date();
          const currentDay = target.getDay();
          const daysUntil = (weekday - currentDay + 7) % 7;
          
          if (daysUntil === 0) {
            const targetTime = new Date();
            targetTime.setHours(hour, minute, 0, 0);
            if (targetTime <= now) {
              target.setDate(target.getDate() + 7);
            }
          } else {
            target.setDate(target.getDate() + daysUntil);
          }
          
          target.setHours(hour, minute, 0, 0);
          return target;
        };

        const scheduleBellNotification = (weekday: number, hour: number, minute: number, id: number) => {
          const timeMinutes = hour * 60 + minute;
          
          if (timeMinutes < startMinutes || timeMinutes > endMinutes) return;
          if (isInPausePeriod(timeMinutes)) return;

          const chimeCount = minute === 0 ? (hour % 12 || 12) : 1;
          const channelId = options.bellTradition === 'cathedral-bell' 
            ? `cathedral-bells-${chimeCount}`
            : 'sacred-bells-channel';
          
          const nextOccurrence = getNextOccurrence(weekday, hour, minute);
          
          notifications.push({
            id: id,
            schedule: { 
              at: nextOccurrence,
              every: 'week',
              allowWhileIdle: true
            },
            silent: false,
            smallIcon: 'ic_launcher',
            channelId: channelId
          });
        };

        let notificationId = 1;
        
        for (const dayName of options.selectedDays) {
          const weekday = DAY_MAP[dayName];
          if (weekday === undefined) continue;
          
          for (let h = 0; h < 24; h++) {
            const hourMinutes = h * 60;
            if (hourMinutes >= startMinutes && hourMinutes <= endMinutes) {
              scheduleBellNotification(weekday, h, 0, notificationId++);
            }
            
            if (options.halfHourChimes) {
              const halfHourMinutes = h * 60 + 30;
              if (halfHourMinutes >= startMinutes && halfHourMinutes <= endMinutes) {
                scheduleBellNotification(weekday, h, 30, notificationId++);
              }
            }
          }
        }

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
                
                const nextOccurrence = getNextOccurrence(reminderWeekday, reminderHour, reminderMinute);
                
                notifications.push({
                  title: '⏰ Prayer Reminder',
                  body: `${options.morningPrayerName || 'Morning Prayer'} in ${minutes} minutes`,
                  id: notificationId++,
                  schedule: { 
                    at: nextOccurrence,
                    every: 'week',
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
              
              const nextOccurrence = getNextOccurrence(weekday, mHour, mMinute);
              
              notifications.push({
                title: '🔔',
                body: ' ',
                id: notificationId++,
                schedule: { 
                  at: nextOccurrence,
                  every: 'week',
                  allowWhileIdle: true
                },
                silent: false,
                smallIcon: 'ic_launcher',
                channelId: channelId,
                extra: {
                  type: 'prayer',
                  prayerType: 'morning',
                  callType: options.morningCallType || 'short'
                }
              });
            }
          }
        }

        if (options.eveningPrayerEnabled && options.eveningPrayerTime) {
          const [eHour, eMinute] = options.eveningPrayerTime.split(':').map(Number);
          const eveningTimeMinutes = eHour * 60 + eMinute;
          
          if (!isInPausePeriod(eveningTimeMinutes)) {
            for (const dayName of options.selectedDays) {
              const weekday = DAY_MAP[dayName];
              if (weekday === undefined) continue;
              
              const eveningReminders = options.eveningReminders || ['5'];
              
              eveningReminders.forEach((reminderMinutes) => {
                const minutes = parseInt(reminderMinutes);
                let totalMinutes = eHour * 60 + eMinute - minutes;
                let dayOffset = 0;
                
                while (totalMinutes < 0) {
                  totalMinutes += 24 * 60;
                  dayOffset -= 1;
                }
                
                const reminderHour = Math.floor(totalMinutes / 60) % 24;
                const reminderMinute = totalMinutes % 60;
                let reminderWeekday = (weekday + dayOffset + 7) % 7;
                if (reminderWeekday < 0) reminderWeekday += 7;
                
                const nextOccurrence = getNextOccurrence(reminderWeekday, reminderHour, reminderMinute);
                
                notifications.push({
                  title: '⏰ Prayer Reminder',
                  body: `${options.eveningPrayerName || 'Evening Prayer'} in ${minutes} minutes`,
                  id: notificationId++,
                  schedule: { 
                    at: nextOccurrence,
                    every: 'week',
                    allowWhileIdle: true
                  },
                  sound: 'default',
                  smallIcon: 'ic_launcher',
                  channelId: 'sacred-bells-channel',
                  extra: {
                    type: 'reminder',
                    prayerType: 'evening'
                  }
                });
              });
              
              const channelId = options.eveningCallType === 'long' 
                ? 'evening-prayer-long' 
                : 'evening-prayer-short';
              
              const nextOccurrence = getNextOccurrence(weekday, eHour, eMinute);
              
              notifications.push({
                title: '🔔',
                body: ' ',
                id: notificationId++,
                schedule: { 
                  at: nextOccurrence,
                  every: 'week',
                  allowWhileIdle: true
                },
                silent: false,
                smallIcon: 'ic_launcher',
                channelId: channelId,
                extra: {
                  type: 'prayer',
                  prayerType: 'evening',
                  callType: options.eveningCallType || 'short'
                }
              });
            }
          }
        }

        if (notifications.length > 0) {
          await LocalNotifications.schedule({ notifications });
          console.log(`Scheduled ${notifications.length} bell notifications`);
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
    options.enabled,
    options.bellTradition,
    options.startTime,
    options.endTime,
    options.halfHourChimes,
    options.pauseEnabled,
    options.pauseStartTime,
    options.pauseEndTime,
    options.selectedDays,
    options.timeZone,
    options.morningPrayerEnabled,
    options.morningPrayerTime,
    options.eveningPrayerEnabled,
    options.eveningPrayerTime,
    options.morningPrayerName,
    options.eveningPrayerName,
    options.morningCallType,
    options.eveningCallType,
    options.morningReminders,
    options.eveningReminders
  ]);
};
