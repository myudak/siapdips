import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const STORAGE_KEY = "selectedLokasiFT";

const LokasiFoodTruk = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    chrome.storage.local.get(
      [STORAGE_KEY],
      (result: { [key: string]: string }) => {
        if (result[STORAGE_KEY]) {
          setSelectedDate(result[STORAGE_KEY]);
        }
      }
    );
  }, []);

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    chrome.storage.local.set({ [STORAGE_KEY]: value });
    toast.success("Saved");
  };

  const dateOptions: { value: string; label: string }[] = [
    { value: "Auditorium Imam Bardjo", label: "Auditorium Imam Bardjo" },
    { value: "Student Center", label: "Student Center" },
    { value: "Auditorium FPIK", label: "Auditorium FPIK" },
    {
      value: "Halaman Parkir Gedung SA-MWA",
      label: "Halaman Parkir Gedung SA-MWA",
    },
    {
      value: "ART Center",
      label: "Gedung ART Center",
    },
    {
      value: "NONE",
      label: "- Pilih Lokasi -",
    },
  ];

  return (
    <Select value={selectedDate} onValueChange={handleDateChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="- Pilih Lokasi -" />
      </SelectTrigger>
      <SelectContent>
        {dateOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LokasiFoodTruk;
