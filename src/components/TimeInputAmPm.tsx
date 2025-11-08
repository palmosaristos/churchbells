import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeInputAmPmProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TimeInputAmPm = ({ value, onChange, className }: TimeInputAmPmProps) => {
  const parse24Hour = (time24: string): { hour: number; minute: number; period: 'AM' | 'PM' } => {
    const [hourStr, minuteStr] = time24.split(':');
    const hour24 = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    
    return { hour: hour12, minute, period };
  };

  const format24Hour = (hour12: number, minute: number, period: 'AM' | 'PM'): string => {
    let hour24 = hour12;
    if (period === 'AM' && hour12 === 12) {
      hour24 = 0;
    } else if (period === 'PM' && hour12 !== 12) {
      hour24 = hour12 + 12;
    }
    return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const { hour, minute, period } = parse24Hour(value);

  const handleHourChange = (newHour: string) => {
    const hour12 = parseInt(newHour);
    onChange(format24Hour(hour12, minute, period));
  };

  const handleMinuteChange = (newMinute: string) => {
    const min = parseInt(newMinute);
    onChange(format24Hour(hour, min, period));
  };

  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    onChange(format24Hour(hour, minute, newPeriod));
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className={`flex gap-2 items-center ${className || ''}`}>
      <Select value={hour.toString()} onValueChange={handleHourChange}>
        <SelectTrigger className="w-20 text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {hours.map(h => (
            <SelectItem key={h} value={h.toString()}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-2xl font-cormorant text-foreground">:</span>

      <Select value={minute.toString().padStart(2, '0')} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-20 text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {minutes.map(m => (
            <SelectItem key={m} value={m.toString().padStart(2, '0')}>
              {m.toString().padStart(2, '0')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-24 text-xl font-cormorant text-foreground border-2 focus:border-primary transition-colors">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
