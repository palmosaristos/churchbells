import { useMemo } from "react";

interface NextChimeCalculatorOptions {
  bellsEnabled: boolean;
  startTime: string;
  endTime: string;
  halfHourChimes: boolean;
  selectedDays: string[];
  currentDate: Date;
  timeZone?: string;
  isValidTZ?: boolean;
}

const DAY_MAP: Record<string, number> = {
  'sunday': 0, 
  'monday': 1, 
  'tuesday': 2, 
  'wednesday': 3, 
  'thursday': 4,
  'friday': 5, 
  'saturday': 6
};

const DAY_NAMES: Record<number, string> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday'
};

/**
 * Finds the next active day starting from the given day number
 * Returns a readable string like "tomorrow", "monday", etc.
 */
const findNextActiveDay = (currentDayNum: number, activeDays: string[]): string => {
  // Convert activeDays to day numbers
  const activeDayNums = activeDays.map(day => DAY_MAP[day]).sort((a, b) => a - b);
  
  // Look for the next active day (tomorrow or after)
  for (let i = 1; i <= 7; i++) {
    const nextDayNum = (currentDayNum + i) % 7;
    if (activeDayNums.includes(nextDayNum)) {
      const dayName = DAY_NAMES[nextDayNum];
      
      // Format the day name nicely
      if (i === 1) return 'tomorrow';
      return dayName;
    }
  }
  
  // Fallback if no active days found (shouldn't happen)
  return activeDays[0] || 'active day';
};

/**
 * Custom hook to calculate the next chime time display text
 */
export const useNextChimeCalculator = (options: NextChimeCalculatorOptions): string => {
  const {
    bellsEnabled,
    startTime,
    endTime,
    halfHourChimes,
    selectedDays,
    currentDate,
    timeZone = 'UTC',
    isValidTZ = false
  } = options;

  return useMemo(() => {
    if (!bellsEnabled) return '';
    
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const nowMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
    const todayDayNum = currentDate.getDay();  // 0=Sun, 1=Mon, etc.
    const todayDayName = DAY_NAMES[todayDayNum];
    const isTodayActive = selectedDays.includes(todayDayName);
    
    let nextText = '';
    
    // Case 1: Today is active AND we are WITHIN the time range
    if (isTodayActive && nowMinutes >= sh * 60 + sm && nowMinutes < eh * 60 + em) {
      const interval = halfHourChimes ? 30 : 60;
      const nextChimeMinutes = Math.ceil((nowMinutes + 1) / interval) * interval;
      
      // Check if the next chime exceeds endTime
      if (nextChimeMinutes >= eh * 60 + em) {
        // Move to the next active day
        const nextDay = findNextActiveDay(todayDayNum, selectedDays);
        nextText = ` (next on ${nextDay} at ${startTime})`;
      } else {
        const nextHour = Math.floor(nextChimeMinutes / 60);
        const nextMinute = nextChimeMinutes % 60;
        nextText = ` (next at ${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')})`;
      }
    }
    // Case 2: Today is active but we are BEFORE startTime
    else if (isTodayActive && nowMinutes < sh * 60 + sm) {
      nextText = ` (next today at ${startTime})`;
    }
    // Case 3: Today is active but we are AFTER endTime, OR today is not active
    else {
      const nextDay = findNextActiveDay(todayDayNum, selectedDays);
      nextText = ` (next on ${nextDay} at ${startTime})`;
    }
    
    // Add timezone info if valid and not UTC
    if (isValidTZ && timeZone !== 'UTC') {
      nextText += ` (${timeZone.replace('/', ' ')})`;
    }

    return nextText;
  }, [bellsEnabled, startTime, endTime, halfHourChimes, selectedDays, currentDate, timeZone, isValidTZ]);
};
