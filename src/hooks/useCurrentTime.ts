import { useState, useEffect } from "react";

export interface UseCurrentTimeOptions {
  timeZone: string;
}

export interface CurrentTimeResult {
  time: string;
  formatted: string;
}

export const useCurrentTime = (options: string | UseCurrentTimeOptions): string => {
  const timeZone = typeof options === 'string' ? options : options.timeZone;
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          timeZone,
        })
      );
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  return currentTime;
};
