import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import { ChevronLeft, ChevronRight, Clock, GripHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState, useEffect } from "react";

type jadwalHariIni = {
  mataKuliah: string;
  ruang: string;
  waktuMulai: string;
  waktuSelesai: string;
  sks: number;
  status?: string;
};

const JadwalCard = ({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeJadwal, setActiveJadwal] = useState<jadwalHariIni | null>(null);

  const jadwalHariIni = [
    {
      mataKuliah: "Basis Data",
      ruang: "A301",
      waktuMulai: "09:00:00",
      waktuSelesai: "11:30:00",
      sks: 3.0,
    },
    {
      mataKuliah: "Algoritma dan Pemrograman",
      ruang: "A302",
      waktuMulai: "13:00:00",
      waktuSelesai: "16:20:00",
      sks: 4.0,
    },
    {
      mataKuliah: "Matematika Diskrit",
      ruang: "B201",
      waktuMulai: "16:30:00",
      waktuSelesai: "18:20:00",
      sks: 2.0,
    },
  ];

  useEffect(() => {
    const checkJadwalStatus = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString(undefined, { hour12: false });
      console.log(currentTime);
      const jadwal = jadwalHariIni[currentIndex];

      if (jadwal) {
        if (
          currentTime >= jadwal.waktuMulai &&
          currentTime <= jadwal.waktuSelesai
        ) {
          setActiveJadwal({ ...jadwal, status: "active" });
        } else if (currentTime < jadwal.waktuSelesai) {
          setActiveJadwal({ ...jadwal, status: "upcoming" });
        } else {
          setActiveJadwal({ ...jadwal, status: "past" });
        }
      }
    };

    checkJadwalStatus();
    const interval = setInterval(checkJadwalStatus, 60000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(jadwalHariIni.length - 1, prev + 1));
  };

  if (!activeJadwal) {
    return null;
  }

  return (
    <Card
      className={`w-full transition-all duration-300 bg-white dark:bg-gray-800 
        ${
          activeJadwal.status === "active"
            ? "ring-2 ring-blue-500 dark:ring-blue-400"
            : activeJadwal.status === "upcoming"
            ? "ring-2 ring-yellow-500 dark:ring-yellow-400"
            : "ring-2 ring-gray-500 dark:ring-gray-400"
        }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="w-full h-8 rounded-b-none border border-b-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        {...attributes}
        {...listeners}
      >
        <GripHorizontal className="h-4 w-4" />
      </Button>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Jadwal Hari Ini ({currentIndex + 1}/{jadwalHariIni.length})
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              activeJadwal.status === "active"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                : activeJadwal.status === "upcoming"
                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            }`}
          >
            {activeJadwal.status === "active"
              ? "Sedang Berlangsung"
              : activeJadwal.status === "upcoming"
              ? "Akan Dimulai"
              : "Selesai"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {activeJadwal.mataKuliah}
            </h3>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {activeJadwal.waktuMulai} s/d {activeJadwal.waktuSelesai}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                Ruang {activeJadwal.ruang}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {activeJadwal.sks} SKS
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button
          disabled={currentIndex === 0}
          onClick={handlePrevious}
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </Button>
        <Button className="w-1/3">Jadwal Full</Button>
        <Button
          disabled={currentIndex === jadwalHariIni.length - 1}
          onClick={handleNext}
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JadwalCard;
