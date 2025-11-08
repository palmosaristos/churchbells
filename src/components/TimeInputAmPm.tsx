import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeInputAmPmProps {
  value: string; // Format "HH:MM" (24h)
  onChange: (value: string) => void;
  label?: string;
}

export const TimeInputAmPm = ({ value, onChange, label }: TimeInputAmPmProps) => {
  // Convert 24h to 12h format for display
  const convert24hTo12h = (time24: string): { hour: string; minute: string; period: "AM" | "PM" } => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return {
      hour: hour12.toString(),
      minute: minutes.toString().padStart(2, '0'),
      period
    };
  };

  // Convert 12h to 24h format
  const convert12hTo24h = (hour: number, minute: number, period: "AM" | "PM"): string => {
    let hour24 = hour;
    if (period === "AM" && hour === 12) {
      hour24 = 0;
    } else if (period === "PM" && hour !== 12) {
      hour24 = hour + 12;
    }
    return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const { hour, minute, period } = convert24hTo12h(value || "12:00");
  const [localHour, setLocalHour] = useState(hour);
  const [localMinute, setLocalMinute] = useState(minute);
  const [localPeriod, setLocalPeriod] = useState<"AM" | "PM">(period);

  useEffect(() => {
    const { hour, minute, period } = convert24hTo12h(value || "12:00");
    setLocalHour(hour);
    setLocalMinute(minute);
    setLocalPeriod(period);
  }, [value]);

  const handleUpdate = (newHour?: string, newMinute?: string, newPeriod?: "AM" | "PM") => {
    const h = parseInt(newHour || localHour);
    const m = parseInt(newMinute || localMinute);
    const p = newPeriod || localPeriod;
    
    if (isNaN(h) || isNaN(m) || h < 1 || h > 12 || m < 0 || m > 59) return;
    
    const time24 = convert12hTo24h(h, m, p);
    onChange(time24);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          min="1"
          max="12"
          value={localHour}
          onChange={(e) => {
            const val = e.target.value;
            setLocalHour(val);
            if (val && parseInt(val) >= 1 && parseInt(val) <= 12) {
              handleUpdate(val, undefined, undefined);
            }
          }}
          className="w-16 text-center"
          placeholder="12"
        />
        <span className="text-xl">:</span>
        <Input
          type="number"
          min="0"
          max="59"
          value={localMinute}
          onChange={(e) => {
            const val = e.target.value.padStart(2, '0');
            setLocalMinute(val);
            if (val && parseInt(val) >= 0 && parseInt(val) <= 59) {
              handleUpdate(undefined, val, undefined);
            }
          }}
          className="w-16 text-center"
          placeholder="00"
        />
        <Select
          value={localPeriod}
          onValueChange={(val: "AM" | "PM") => {
            setLocalPeriod(val);
            handleUpdate(undefined, undefined, val);
          }}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
