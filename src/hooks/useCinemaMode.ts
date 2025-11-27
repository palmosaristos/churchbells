import { useState, useEffect, useRef } from 'react';

interface CinemaModeOptions {
  duration: number; // minutes
  onEnd?: () => void;
}

export const useCinemaMode = () => {
  const [isActive, setIsActive] = useState<boolean>(() => {
    const stored = localStorage.getItem('cinemaModeActive');
    const endTime = localStorage.getItem('cinemaModeEndTime');
    
    if (stored === 'true' && endTime) {
      const end = parseInt(endTime);
      if (Date.now() < end) {
        return true;
      } else {
        // Cinema mode expired
        localStorage.removeItem('cinemaModeActive');
        localStorage.removeItem('cinemaModeEndTime');
        return false;
      }
    }
    return false;
  });

  const [endTime, setEndTime] = useState<number | null>(() => {
    const stored = localStorage.getItem('cinemaModeEndTime');
    return stored ? parseInt(stored) : null;
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Activate cinema mode
  const activate = (duration: number) => {
    const end = Date.now() + duration * 60 * 1000;
    setIsActive(true);
    setEndTime(end);
    localStorage.setItem('cinemaModeActive', 'true');
    localStorage.setItem('cinemaModeEndTime', end.toString());

    // Schedule auto-deactivation
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      deactivate();
    }, duration * 60 * 1000);
  };

  // Deactivate cinema mode
  const deactivate = () => {
    setIsActive(false);
    setEndTime(null);
    localStorage.removeItem('cinemaModeActive');
    localStorage.removeItem('cinemaModeEndTime');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Check if still active on mount
  useEffect(() => {
    if (isActive && endTime) {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        deactivate();
      } else {
        timeoutRef.current = setTimeout(() => {
          deactivate();
        }, remaining);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isActive,
    endTime,
    activate,
    deactivate,
    remainingMinutes: endTime ? Math.max(0, Math.ceil((endTime - Date.now()) / 60000)) : 0
  };
};
