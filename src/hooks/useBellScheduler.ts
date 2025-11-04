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

        const isInPausePeriod = (hour: number, minute: number) => {
          if (!options.pauseEnabled) return false;
          const timeMinutes = hour * 60 + minute;
          const pauseStartMinutes = pauseStartHour * 60 + pauseStartMinute;
          const pauseEndMinutes = pauseEndHour * 60 + pauseEndMinute;
          return timeMinutes >= pauseStartMinutes && timeMinutes < pauseEndMinutes;
        };

        const scheduleBellNotification = (hour: number, minute: number, id: number) => {
          if (isInPausePeriod(hour, minute)) return;

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
        for (let h = startHour; h <= endHour; h++) {
          const startMin = (h === startHour) ? startMinute : 0;
          const endMin = (h === endHour) ? endMinute : 59;

          if (startMin === 0 || (h > startHour)) {
            scheduleBellNotification(h, 0, notificationId++);
          }

          if (options.halfHourChimes && endMin >= 30) {
            scheduleBellNotification(h, 30, notificationId++);
          }
        }

        if (options.morningPrayerEnabled && options.morningPrayerTime) {
          const [mHour, mMinute] = options.morningPrayerTime.split(':').map(Number);
          const morningTime = new Date();
          morningTime.setHours(mHour, mMinute, 0, 0);
          if (morningTime > now && !isInPausePeriod(mHour, mMinute)) {
            notifications.push({
              title: '🙏 Morning Prayer',
              body: 'Time for morning prayer',
              id: notificationId++,
              schedule: { at: morningTime },
              sound: 'default',
              smallIcon: 'ic_launcher',
              channelId: 'sacred-bells-channel'
            });
          }
        }

        if (options.eveningPrayerEnabled && options.eveningPrayerTime) {
          const [eHour, eMinute] = options.eveningPrayerTime.split(':').map(Number);
          const eveningTime = new Date();
          eveningTime.setHours(eHour, eMinute, 0, 0);
          if (eveningTime > now && !isInPausePeriod(eHour, eMinute)) {
            notifications.push({
              title: '🙏 Evening Prayer',
              body: 'Time for evening prayer',
              id: notificationId++,
              schedule: { at: eveningTime },
              sound: 'default',
              smallIcon: 'ic_launcher',
              channelId: 'sacred-bells-channel'
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
    options.eveningPrayerTime
  ]);
};
