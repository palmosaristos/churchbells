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
    if (!Capacitor.isNativePlatform() || !options.enabled || !options.timeZone) {
      return;
    }

    const scheduleBells = async () => {
      try {
        const permission = await LocalNotifications.requestPermissions();
        if (permission.display !== 'granted') {
          console.log('Notification permission not granted');
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

        await LocalNotifications.createChannel({
          id: 'morning-prayer-short',
          name: 'Morning Prayer (Short Call)',
          description: 'Short bell call for morning prayer',
          importance: 5,
          visibility: 1,
          sound: 'summoning_bell',
          vibration: true
        });

        await LocalNotifications.createChannel({
          id: 'morning-prayer-long',
          name: 'Morning Prayer (Long Call)',
          description: 'Long bell call for morning prayer',
          importance: 5,
          visibility: 1,
          sound: 'cathedral_bell',
          vibration: true
        });

        await LocalNotifications.createChannel({
          id: 'evening-prayer-short',
          name: 'Evening Prayer (Short Call)',
          description: 'Short bell call for evening prayer',
          importance: 5,
          visibility: 1,
          sound: 'summoning_bell',
          vibration: true
        });

        await LocalNotifications.createChannel({
          id: 'evening-prayer-long',
          name: 'Evening Prayer (Long Call)',
          description: 'Long bell call for evening prayer',
          importance: 5,
          visibility: 1,
          sound: 'cathedral_bell',
          vibration: true
        });

        await LocalNotifications.cancel({ notifications: [] });

        const notifications: any[] = [];
        const now = new Date();
        const today = now.getDay();
        const todayName = Object.keys(DAY_MAP).find(key => DAY_MAP[key] === today) || '';

        if (!options.selectedDays.includes(todayName)) {
          return;
        }

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

        const scheduleBellNotification = (hour: number, minute: number, id: number) => {
          const timeMinutes = hour * 60 + minute;
          
          if (timeMinutes < startMinutes || timeMinutes > endMinutes) return;
          if (isInPausePeriod(timeMinutes)) return;

          const bellTime = new Date();
          bellTime.setHours(hour, minute, 0, 0);

          if (bellTime <= now) return;

          const chimeCount = minute === 0 ? (hour % 12 || 12) : 1;
          
          notifications.push({
            title: '🔔 Sacred Bells',
            body: `${chimeCount} chime${chimeCount > 1 ? 's' : ''}`,
            id: id,
            schedule: { at: bellTime },
            sound: 'default',
            smallIcon: 'ic_launcher',
            channelId: 'sacred-bells-channel'
          });
        };

        let notificationId = 1;
        
        for (let h = 0; h < 24; h++) {
          const hourMinutes = h * 60;
          if (hourMinutes >= startMinutes && hourMinutes <= endMinutes) {
            scheduleBellNotification(h, 0, notificationId++);
          }
          
          if (options.halfHourChimes) {
            const halfHourMinutes = h * 60 + 30;
            if (halfHourMinutes >= startMinutes && halfHourMinutes <= endMinutes) {
              scheduleBellNotification(h, 30, notificationId++);
            }
          }
        }

        if (options.morningPrayerEnabled && options.morningPrayerTime) {
          const [mHour, mMinute] = options.morningPrayerTime.split(':').map(Number);
          const morningTimeMinutes = mHour * 60 + mMinute;
          const morningTime = new Date();
          morningTime.setHours(mHour, mMinute, 0, 0);
          
          if (morningTime > now && !isInPausePeriod(morningTimeMinutes)) {
            const morningReminders = options.morningReminders || ['5'];
            
            morningReminders.forEach((reminderMinutes) => {
              const minutes = parseInt(reminderMinutes);
              const reminderTime = new Date(morningTime.getTime() - minutes * 60000);
              
              if (reminderTime > now) {
                notifications.push({
                  title: '⏰ Prayer Reminder',
                  body: `${options.morningPrayerName || 'Morning Prayer'} in ${minutes} minutes`,
                  id: notificationId++,
                  schedule: { at: reminderTime },
                  sound: 'default',
                  smallIcon: 'ic_launcher',
                  channelId: 'sacred-bells-channel',
                  extra: {
                    type: 'reminder',
                    prayerType: 'morning'
                  }
                });
              }
            });
            
            const channelId = options.morningCallType === 'long' 
              ? 'morning-prayer-long' 
              : 'morning-prayer-short';
            
            notifications.push({
              title: `🙏 ${options.morningPrayerName || 'Morning Prayer'}`,
              body: 'Time for prayer - Bells are ringing',
              id: notificationId++,
              schedule: { at: morningTime },
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

        if (options.eveningPrayerEnabled && options.eveningPrayerTime) {
          const [eHour, eMinute] = options.eveningPrayerTime.split(':').map(Number);
          const eveningTimeMinutes = eHour * 60 + eMinute;
          const eveningTime = new Date();
          eveningTime.setHours(eHour, eMinute, 0, 0);
          
          if (eveningTime > now && !isInPausePeriod(eveningTimeMinutes)) {
            const eveningReminders = options.eveningReminders || ['5'];
            
            eveningReminders.forEach((reminderMinutes) => {
              const minutes = parseInt(reminderMinutes);
              const reminderTime = new Date(eveningTime.getTime() - minutes * 60000);
              
              if (reminderTime > now) {
                notifications.push({
                  title: '⏰ Prayer Reminder',
                  body: `${options.eveningPrayerName || 'Evening Prayer'} in ${minutes} minutes`,
                  id: notificationId++,
                  schedule: { at: reminderTime },
                  sound: 'default',
                  smallIcon: 'ic_launcher',
                  channelId: 'sacred-bells-channel',
                  extra: {
                    type: 'reminder',
                    prayerType: 'evening'
                  }
                });
              }
            });
            
            const channelId = options.eveningCallType === 'long' 
              ? 'evening-prayer-long' 
              : 'evening-prayer-short';
            
            notifications.push({
              title: `🙏 ${options.eveningPrayerName || 'Evening Prayer'}`,
              body: 'Time for prayer - Bells are ringing',
              id: notificationId++,
              schedule: { at: eveningTime },
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
