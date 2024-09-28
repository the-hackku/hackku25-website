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
  const [time, setTime] = useState(value);
  const [hours, setHours] = useState(() =>
    value ? value.split(":")[0] : "12"
  );
  const [minutes, setMinutes] = useState(() =>
    value ? value.split(":")[1] : "00"
  );

  const handleTimeChange = () => {
    const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(
      2,
      "0"
    )}`;
    setTime(formattedTime);
    onChange?.(formattedTime);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          <Clock className="mr-2 h-4 w-4" />
          {time || "Select time"}
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
              if (parseInt(newHours) > 23) newHours = "23";
              if (parseInt(newHours) < 0) newHours = "00";
              setHours(newHours);
            }}
            onBlur={handleTimeChange}
            className="w-16 text-center"
            min={0}
            max={23}
            placeholder="HH"
          />
          <span className="self-center">:</span>
          {/* Minutes Input */}
          <Input
            type="number"
            value={minutes}
            onChange={(e) => {
              let newMinutes = e.target.value;
              if (parseInt(newMinutes) > 59) newMinutes = "59";
              if (parseInt(newMinutes) < 0) newMinutes = "00";
              setMinutes(newMinutes);
            }}
            onBlur={handleTimeChange}
            className="w-16 text-center"
            min={0}
            max={59}
            placeholder="MM"
          />
        </div>
        <Button variant="outline" className="mt-2" onClick={handleTimeChange}>
          Set Time
        </Button>
      </PopoverContent>
    </Popover>
  );
}
