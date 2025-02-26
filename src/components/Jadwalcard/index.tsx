import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import {
  CalendarCogIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  GripHorizontal,
} from "lucide-react";
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
  msTeams: string;
  status?: string;
};

const days = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
const initialDayIndex = new Date().getDay();

type jadwalMinggu = {
  [key: string]: jadwalHariIni[];
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
  const [jadwalHariIni, setJadwalHariIni] = useState<jadwalHariIni[]>([]);
  const [isJadwal, setIsJadwal] = useState(true);
  const [currentDayIndex, setCurrentDayIndex] = useState(initialDayIndex);
  const [jadwalMingguIni, setJadwalMingguIni] = useState<jadwalMinggu>({});

  useEffect(() => {
    (async () => {
      const result = await chrome.storage.local.get(["scheduleData"]);
      const jadwalData: jadwalMinggu =
        result.scheduleData ?? ({} as jadwalMinggu);
      // EXAMPLE JADWAL MINGGU INI
      // {"jumat":[{"mataKuliah":"Bahasa Inggris II","ruang":"A302","sks":1,"waktuMulai":"10:40:00","waktuSelesai":"11:30:00"},{"mataKuliah":"Organisasi dan Arsitektur Komputer","ruang":"A302","sks":3,"waktuMulai":"13:00:00","waktuSelesai":"15:30:00"}],"kamis":[{"mataKuliah":"Pendidikan Agama Islam","ruang":"A301","sks":2,"waktuMulai":"15:40:00","waktuSelesai":"17:20:00"}],"rabu":[{"mataKuliah":"Metode Numerik","ruang":"A301","sks":3,"waktuMulai":"13:00:00","waktuSelesai":"15:30:00"}],"selasa":[{"mataKuliah":"Kewarganegaraan","ruang":"A302","sks":2,"waktuMulai":"10:40:00","waktuSelesai":"12:20:00"},{"mataKuliah":"Algoritma dan Pemrograman","ruang":"A302","sks":4,"waktuMulai":"13:00:00","waktuSelesai":"16:20:00"}],"senin":[{"mataKuliah":"Statistika","ruang":"A301","sks":2,"waktuMulai":"08:50:00","waktuSelesai":"10:30:00"},{"mataKuliah":"Matematika II","ruang":"A301","sks":2,"waktuMulai":"13:00:00","waktuSelesai":"14:40:00"},{"mataKuliah":"Olahraga","ruang":"Lapangan Stadion UNDIP Tembalang","sks":1,"waktuMulai":"16:40:00","waktuSelesai":"17:30:00"}]}

      if (Object.keys(jadwalData).length === 0) {
        setIsJadwal(false);
        return;
      }

      setJadwalMingguIni(jadwalData);
      updateCurrentDayJadwal(currentDayIndex, jadwalData);
    })();
  }, []);

  useEffect(() => {
    if (Object.keys(jadwalMingguIni).length > 0) {
      updateCurrentDayJadwal(currentDayIndex, jadwalMingguIni);
    }
  }, [currentDayIndex]);

  const updateCurrentDayJadwal = (
    dayIndex: number,
    jadwalData: jadwalMinggu
  ) => {
    const currentDay = days[dayIndex];
    const daySchedule = jadwalData[currentDay] ?? [];
    setJadwalHariIni(daySchedule);
    setCurrentIndex(0); // Reset course index when changing days
  };

  useEffect(() => {
    const checkJadwalStatus = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString(undefined, { hour12: false });
      const jadwal = jadwalHariIni[currentIndex];
      const isToday = currentDayIndex === initialDayIndex;

      if (jadwal) {
        if (
          isToday &&
          currentTime >= jadwal.waktuMulai &&
          currentTime <= jadwal.waktuSelesai
        ) {
          setActiveJadwal({ ...jadwal, status: "active" });
        } else if (isToday && currentTime < jadwal.waktuMulai) {
          setActiveJadwal({ ...jadwal, status: "upcoming" });
        } else if (isToday && currentTime > jadwal.waktuSelesai) {
          setActiveJadwal({ ...jadwal, status: "past" });
        } else if (currentDayIndex > initialDayIndex) {
          // Future day
          setActiveJadwal({ ...jadwal, status: "upcoming" });
        } else {
          // Past day
          setActiveJadwal({ ...jadwal, status: "past" });
        }
      } else {
        setActiveJadwal(null);
      }
    };

    checkJadwalStatus();
    const interval = setInterval(checkJadwalStatus, 60000);
    return () => clearInterval(interval);
  }, [currentIndex, jadwalHariIni, currentDayIndex]);

  const handlePreviousCourse = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextCourse = () => {
    setCurrentIndex((prev) => Math.min(jadwalHariIni.length - 1, prev + 1));
  };

  const handlePreviousDay = () => {
    setCurrentDayIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextDay = () => {
    setCurrentDayIndex((prev) => Math.min(6, prev + 1));
  };

  const getCurrentDayName = () => {
    const dayName = days[currentDayIndex];
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  };

  const isCurrentDay = currentDayIndex === initialDayIndex;

  return (
    <Card
      className={`w-full transition-all duration-300 bg-white dark:bg-gray-800 
        ${
          activeJadwal?.status === "active"
            ? "ring-2 ring-blue-500 dark:ring-blue-400"
            : activeJadwal?.status === "upcoming"
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

      {/* Day Navigation */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousDay}
          disabled={currentDayIndex === 0}
          className="px-2"
        >
          <ChevronLeft className="h-4 w-4 " />
          <span className="text-xs">Kemarin</span>
        </Button>

        <span
          className={`text-sm font-medium ${
            isCurrentDay ? "text-blue-600 dark:text-blue-400" : ""
          }`}
        >
          {getCurrentDayName()} {isCurrentDay ? "(Hari Ini)" : ""}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextDay}
          disabled={currentDayIndex === 6}
          className="px-2"
        >
          <span className="text-xs">Besok</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <CardHeader className="pb-2">
        {isJadwal && (
          <>
            <CardTitle className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {jadwalHariIni.length > 0 ? (
                  <>
                    Jadwal ({currentIndex + 1}/{jadwalHariIni.length})
                  </>
                ) : (
                  <>Gak Ada Jadwal</>
                )}
              </span>
              {activeJadwal && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    activeJadwal?.status === "active"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      : activeJadwal?.status === "upcoming"
                      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {activeJadwal?.status === "active"
                    ? "Sedang Berlangsung"
                    : activeJadwal?.status === "upcoming"
                    ? "Akan Dimulai"
                    : "Selesai"}
                </span>
              )}
            </CardTitle>
          </>
        )}
        {!isJadwal && (
          <CardTitle className="text-lg font-bold text-center">
            <span className="text-lg text-center">JADWAL DIPS</span>
          </CardTitle>
        )}
      </CardHeader>

      {isJadwal && jadwalHariIni.length > 0 && (
        <>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {activeJadwal?.mataKuliah}
                </h3>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {activeJadwal?.waktuMulai} s/d {activeJadwal?.waktuSelesai}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="cursor-default px-2 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                    Ruang {activeJadwal?.ruang}
                  </span>
                  {activeJadwal?.msTeams && (
                    <span className="px-2 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-600 cursor-pointer">
                      <a href={activeJadwal?.msTeams} target="_blank">
                        MS Teams
                      </a>
                    </span>
                  )}
                </div>

                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {activeJadwal?.sks} SKS
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button
              disabled={currentIndex === 0}
              onClick={handlePreviousCourse}
              aria-label="Previous Course"
              variant="outline"
              size="lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => {
                chrome.tabs.create({
                  url: "https://siap.undip.ac.id/jadwal_mahasiswa/mhs/jadwal/",
                });
              }}
              size="sm"
            >
              Jadwal Full
            </Button>
            <Button
              disabled={currentIndex === jadwalHariIni.length - 1}
              onClick={handleNextCourse}
              aria-label="Next Course"
              variant="outline"
              size="lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </>
      )}

      {isJadwal && jadwalHariIni.length === 0 && (
        <CardContent>
          <Card className="w-full bg-gray-100 dark:bg-gray-900 max-w-md mx-auto">
            <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
              <CalendarCogIcon className="h-8 w-8 text-yellow-500" />
            </CardHeader>
            <CardContent className="text-center py-2">
              <p className="text-gray-500 text-sm">
                Gak ada jadwal untuk hari {getCurrentDayName()}
              </p>
            </CardContent>
          </Card>
        </CardContent>
      )}

      {!isJadwal && (
        <CardContent>
          <Card className="w-full bg-gray-100 dark:bg-gray-900 max-w-md mx-auto">
            <CardHeader className="flex flex-col items-center justify-center space-y-2">
              <CalendarCogIcon className="h-12 w-12 text-red-500" />
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-500 text-base">Jadwal not been added</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                className="w-full max-w-xs"
                onClick={() =>
                  chrome.tabs.create({
                    url: "https://siap.undip.ac.id/jadwal_mahasiswa/mhs/jadwal/",
                  })
                }
              >
                Retrieve Jadwal
              </Button>
            </CardFooter>
          </Card>
        </CardContent>
      )}
    </Card>
  );
};

export default JadwalCard;
