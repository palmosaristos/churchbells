import { useState, useEffect, useRef, useCallback } from "react";

export interface UseCurrentTimeOptions {
  timeZone: string;  // IANA TZ (e.g., "Europe/Paris")
}

export interface CurrentTimeResult {
  time: string;         // HH:MM (24h)
  formatted: string;    // Alias pour time
  raw: Date;            // TZ-aware Date pour diffs/scheduler (e.g., next vs current)
  isValidTZ: boolean;   // Vrai si TZ valide (pour scheduler skip si invalid)
}

export const useCurrentTime = (options: string | UseCurrentTimeOptions): CurrentTimeResult => {
  const timeZone = typeof options === 'string' ? options : options.timeZone;
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isValidTZ, setIsValidTZ] = useState<boolean>(true);
  const [rawDate, setRawDate] = useState<Date>(new Date());
  const prevTimeRef = useRef<Date>(new Date());  // Pour skip jitter <1s

  // Validation TZ (once, pour scheduler fiable)
  useEffect(() => {
    try {
      // @ts-ignore - supportedValuesOf might not be available in all environments
      const validTZs = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : [];
      const isValid = validTZs.includes(timeZone) || timeZone === 'UTC';
      setIsValidTZ(isValid);
      if (!isValid && import.meta.env.DEV) {
        console.warn(`Invalid TZ "${timeZone}" – fallback to UTC for scheduling precision`);
      }
    } catch {
      setIsValidTZ(false);  // Rare, Intl fail
    }
  }, [timeZone]);

  const updateTime = useCallback(() => {
    const now = new Date();
    const effectiveTZ = isValidTZ ? timeZone : 'UTC';  // Fallback pour no drifts

    // Time string précis (HH:MM 24h)
    const timeStr = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      timeZone: effectiveTZ,
    });

    // Raw Date TZ-adjusted (pour scheduler diffs : e.g., bellTime > raw.getTime())
    const rawStr = now.toLocaleString("sv-SE", {  // ISO-like
      timeZone: effectiveTZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tzRaw = new Date(rawStr.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/, '$1/$2/$3 $4:$5:$6'));

    // Skip si <1s drift (perf, aide scheduler ticks au moment exact)
    if (Math.abs(tzRaw.getTime() - prevTimeRef.current.getTime()) < 1000) return;
    prevTimeRef.current = tzRaw;

    setCurrentTime(timeStr);
    setRawDate(tzRaw);
  }, [timeZone, isValidTZ]);

  useEffect(() => {
    updateTime();  // Initial

    const interval = setInterval(updateTime, 1000);  // 1s pour précision paramétrage

    return () => clearInterval(interval);
  }, [updateTime]);  // Stable callback

  // Formatted alias
  const formatted = currentTime;

  return {
    time: currentTime,
    formatted,
    raw: rawDate,
    isValidTZ
  };
};
