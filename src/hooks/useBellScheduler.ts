import { useEffect } from 'react';
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
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Gestion de la timezone exacte sans dérive
    const createTZDate = (year: number, month: number, day: number, hour: number, minute: number, tz: string): Date => {
      try {
        const fmt = new Intl.DateTimeFormat('en-US', { 
          timeZone: tz, 
          year: 'numeric', month: 'numeric', day: 'numeric', 
          hour: 'numeric', minute: 'numeric', hour12: false 
        });
        const parts = fmt.formatToParts(new Date(year, month - 1, day, hour, minute));
        const str = parts.map(p => p.value).join('');
        const match = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2})/);
        if (match) {
          const [, m, d, y, h, min] = match;
          return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${h.padStart(2, '0')}:${min}:00`);
        }
        return new Date(year, month - 1, day, hour, minute);
      } catch {
        console.warn('TZ calc fail, fallback local');
        return new Date(year
