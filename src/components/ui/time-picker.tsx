"use client";

import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface TimePickerProps {
  time?: string;
  onTimeChange?: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({
  time,
  onTimeChange,
  placeholder = "Select time",
  disabled = false,
  className,
}: TimePickerProps) {
  const [hours, setHours] = React.useState("12");
  const [minutes, setMinutes] = React.useState("00");

  React.useEffect(() => {
    if (time) {
      const [timePart] = time.split(" ");
      const [h, m] = timePart.split(":");
      setHours(h);
      setMinutes(m);
    }
  }, [time]);

  const formatTime = (h: string, m: string) => {
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const formattedTime = formatTime(newHours, newMinutes);
    setHours(newHours);
    setMinutes(newMinutes);
    onTimeChange?.(formattedTime);
  };

  const displayTime = time || placeholder;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !time && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          <span>{displayTime}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value === "" ||
                    (parseInt(value) >= 0 && parseInt(value) <= 23)
                  ) {
                    handleTimeChange(value, minutes);
                  }
                }}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minutes">Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value === "" ||
                    (parseInt(value) >= 0 && parseInt(value) <= 59)
                  ) {
                    handleTimeChange(hours, value);
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
              <Button
                key={hour}
                variant={parseInt(hours) === hour ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0 text-xs"
                onClick={() => handleTimeChange(hour.toString(), minutes)}
              >
                {hour.toString().padStart(2, "0")}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
