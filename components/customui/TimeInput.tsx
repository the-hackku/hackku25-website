import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface TimeInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function TimeInput({ value = "", onChange }: TimeInputProps) {
  // If a value is provided (in 24-hour format), convert it to 12-hour format
  const initialHour = value ? parseInt(value.split(":")[0], 10) : 12;
  const initialMinute = value ? value.split(":")[1] : "00";
  const initialAmPm = initialHour >= 12 ? "PM" : "AM";
  const [hours, setHours] = useState(() => {
    if (!value) return "12";
    const h = parseInt(value.split(":")[0], 10);
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return hour12.toString();
  });
  const [minutes, setMinutes] = useState(() => initialMinute || "00");
  const [amPm, setAmPm] = useState(() => initialAmPm);
  const [displayTime, setDisplayTime] = useState(() =>
    value ? convert24to12(value) : "12:00 AM"
  );

  // Utility: convert a 24-hour formatted string to a 12-hour formatted string
  function convert24to12(time24: string) {
    const [h, m] = time24.split(":");
    const hour24 = parseInt(h, 10);
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${hour12.toString().padStart(2, "0")}:${m.padStart(
      2,
      "0"
    )} ${period}`;
  }

  // When the user changes the time, convert the 12-hour input to a 24-hour format string.
  const handleTimeChange = () => {
    let h = parseInt(hours, 10);
    // Convert 12-hour to 24-hour
    if (amPm === "AM" && h === 12) {
      h = 0;
    } else if (amPm === "PM" && h !== 12) {
      h += 12;
    }
    const formattedHour = h.toString().padStart(2, "0");
    const formattedMinute = minutes.padStart(2, "0");
    const formatted24HourTime = `${formattedHour}:${formattedMinute}`;
    setDisplayTime(convert24to12(formatted24HourTime));
    onChange?.(formatted24HourTime);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          <Clock className="mr-2 h-4 w-4" />
          {displayTime || "Select time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-4">
        <div className="flex space-x-2">
          {/* Hours Input */}
          <Input
            type="number"
            value={hours}
            onChange={(e) => {
              let newHours = e.target.value;
              // Limit hours between 1 and 12
              const num = parseInt(newHours, 10);
              if (num > 12) newHours = "12";
              if (num < 1 || isNaN(num)) newHours = "1";
              setHours(newHours);
            }}
            onBlur={handleTimeChange}
            className="w-16 text-center"
            min={1}
            max={12}
            placeholder="HH"
          />
          <span className="self-center">:</span>
          {/* Minutes Input */}
          <Input
            type="number"
            value={minutes}
            onChange={(e) => {
              let newMinutes = e.target.value;
              const num = parseInt(newMinutes, 10);
              if (num > 59) newMinutes = "59";
              if (num < 0 || isNaN(num)) newMinutes = "00";
              setMinutes(newMinutes);
            }}
            onBlur={handleTimeChange}
            className="w-16 text-center"
            min={0}
            max={59}
            placeholder="MM"
          />
          {/* AM/PM Selector */}
          <select
            value={amPm}
            onChange={(e) => {
              setAmPm(e.target.value);
              handleTimeChange();
            }}
            className="text-center border rounded p-2"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <Button variant="outline" className="mt-2" onClick={handleTimeChange}>
          Set Time
        </Button>
      </PopoverContent>
    </Popover>
  );
}
