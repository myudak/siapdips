import React, { useState, useEffect, useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Info, Flame, TrendingUp, Calendar } from "lucide-react";
import "react-calendar-heatmap/dist/styles.css";
import "./ActivityCalendar.css";

interface ActivityData {
  date: string;
  count: number;
  jobs?: Job[]; // Add jobs array for detailed tooltip information
}

interface Job {
  company: string;
  companySize: string;
  date: string;
  experienceLevel: string;
  industry: string;
  jobType: string;
  location: string;
  notes: string;
  salary: string;
  status: string;
  title: string;
  url: string;
}

const ActivityCalendar: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [jobData, setJobData] = useState<Job[]>([]);

  // Load data from Chrome storage
  useEffect(() => {
    const loadJobsFromStorage = async () => {
      try {
        if (
          typeof chrome !== "undefined" &&
          chrome.storage &&
          chrome.storage.local
        ) {
          const result = await chrome.storage.local.get(["jobs"]);
          const jobs = result.jobs || [];
          setJobData(jobs);
        } else {
          // Fallback for non-extension environment
          const stored = localStorage.getItem("jobs");
          const jobs = stored ? JSON.parse(stored) : [];
          setJobData(jobs);
        }
      } catch (error) {
        console.error("Error loading jobs from storage:", error);
        setJobData([]);
      } finally {
        // Data loading complete
      }
    };

    loadJobsFromStorage();
  }, []);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Generate activity data from real job data
  const generateYearDataFromJobs = (year: number): ActivityData[] => {
    const data: ActivityData[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Create a map to group jobs by date
    const jobsByDate: { [key: string]: Job[] } = {};

    // Filter jobs for the selected year and group by date
    jobData.forEach((job) => {
      const jobDate = new Date(job.date);
      if (jobDate.getFullYear() === year) {
        const dateKey = jobDate.toISOString().split("T")[0];
        if (!jobsByDate[dateKey]) {
          jobsByDate[dateKey] = [];
        }
        jobsByDate[dateKey].push(job);
      }
    });

    // Generate calendar data for the entire year
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = d.toISOString().split("T")[0];
      const dayJobs = jobsByDate[dateKey] || [];

      data.push({
        date: dateKey,
        count: dayJobs.length,
        jobs: dayJobs,
      });
    }

    return data;
  };

  // Get available years from job data
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    jobData.forEach((job) => {
      const year = new Date(job.date).getFullYear().toString();
      years.add(year);
    });
    const yearArray = Array.from(years).sort().reverse();

    // Add current year if not present
    const currentYear = new Date().getFullYear().toString();
    if (!yearArray.includes(currentYear)) {
      yearArray.unshift(currentYear);
    }

    return yearArray;
  }, [jobData]);

  // Set initial year to most recent available year
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  const yearData = generateYearDataFromJobs(parseInt(selectedYear));
  const activeDays = yearData.filter((day) => day.count > 0).length;
  const totalApplications = yearData.reduce((sum, day) => sum + day.count, 0);

  // Calculate streaks
  const calculateStreaks = (data: ActivityData[]) => {
    let maxStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    // Sort data by date
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (let i = 0; i < sortedData.length; i++) {
      if (sortedData[i].count > 0) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate current streak (from the end)
    for (let i = sortedData.length - 1; i >= 0; i--) {
      if (sortedData[i].count > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { maxStreak, currentStreak };
  };

  const { maxStreak, currentStreak } = calculateStreaks(yearData);

  const getClassForValue = (value: any) => {
    if (!value || !value.count || value.count === 0) {
      return "color-empty";
    }
    if (value.count <= 1) {
      return "color-scale-1";
    }
    if (value.count <= 2) {
      return "color-scale-2";
    }
    if (value.count <= 3) {
      return "color-scale-3";
    }
    return "color-scale-4";
  };

  // Get dynamic colors based on theme
  const getActivityColors = () => {
    if (isDarkMode) {
      return {
        empty: "#27272a",
        scale1: "#065f46",
        scale2: "#047857",
        scale3: "#059669",
        scale4: "#10b981",
      };
    }
    return {
      empty: "#ebedf0",
      scale1: "#c6f6d5",
      scale2: "#9ae6b4",
      scale3: "#68d391",
      scale4: "#38a169",
    };
  };

  const startDate = new Date(parseInt(selectedYear), 0, 1);
  const endDate = new Date(parseInt(selectedYear), 11, 31);

  // Apply dynamic styles to CSS custom properties
  useEffect(() => {
    const colors = getActivityColors();
    const root = document.documentElement;

    root.style.setProperty("--calendar-empty", colors.empty);
    root.style.setProperty("--calendar-scale-1", colors.scale1);
    root.style.setProperty("--calendar-scale-2", colors.scale2);
    root.style.setProperty("--calendar-scale-3", colors.scale3);
    root.style.setProperty("--calendar-scale-4", colors.scale4);
    root.style.setProperty(
      "--calendar-text",
      isDarkMode ? "#9ca3af" : "#6b7280"
    );
    root.style.setProperty(
      "--calendar-hover-stroke",
      isDarkMode ? "#ffffff" : "#000000"
    );
  }, [isDarkMode]);

  return (
    <>
      <Card className="w-full max-w-6xl mx-auto transition-all duration-300">
        <CardHeader className="pb-0 border-b border-gray-100 dark:border-card">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold text-2xl">
                    {totalApplications}
                  </span>
                  <span className="text-lg">
                    applications in {selectedYear}
                  </span>
                  <Info
                    className="h-4 w-4 text-gray-400 dark:text-gray-500 cursor-help hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    data-tooltip-id="info-tooltip"
                    data-tooltip-content="Total applications submitted this year"
                  />
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Track your job application progress
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-24 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem
                      key={year}
                      value={year}
                      className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Badge
                variant="secondary"
                className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700 px-3 py-1.5 text-sm font-medium"
              >
                <Flame className="h-3 w-3 mr-1.5" />
                {currentStreak} day streak
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-secondary rounded-lg p-4 border border-gray-200 dark:border-card">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Days
                </span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {activeDays}
              </span>
            </div>

            <div className="bg-secondary rounded-lg p-4 border border-gray-200 dark:border-card">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Max Streak
                </span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {maxStreak}
              </span>
            </div>

            <div className="bg-secondary rounded-lg p-4 border border-gray-200 dark:border-card">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Current Streak
                </span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currentStreak}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 ">
          <div className="space-y-6">
            {/* Calendar Heatmap */}
            <div className=" rounded-xl p-6 border b shadow-sm">
              <div className="github-calendar overflow-x-auto">
                <CalendarHeatmap
                  startDate={startDate}
                  endDate={endDate}
                  values={yearData}
                  classForValue={getClassForValue}
                  showWeekdayLabels={true}
                  showMonthLabels={true}
                  tooltipDataAttrs={(value) => {
                    const content_tooltip =
                      value?.count === 0
                        ? `No applications on ${formatDateWithOrdinal(
                            value?.date
                          )}`
                        : `${
                            value?.count
                          } applications on ${formatDateWithOrdinal(
                            value?.date
                          )}`;

                    return {
                      "data-tooltip-content": content_tooltip,
                      "data-tooltip-id": "info-tooltip",
                    };
                  }}
                  weekdayLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
                  monthLabels={[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ]}
                />
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Activity levels
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div
                      className="w-3 h-3 rounded-sm border"
                      style={{
                        backgroundColor: getActivityColors().empty,
                        borderColor: isDarkMode ? "#374151" : "#d1d5db",
                      }}
                    />
                    <div
                      className="w-3 h-3 rounded-sm border"
                      style={{
                        backgroundColor: getActivityColors().scale1,
                        borderColor: isDarkMode ? "#374151" : "#d1d5db",
                      }}
                    />
                    <div
                      className="w-3 h-3 rounded-sm border"
                      style={{
                        backgroundColor: getActivityColors().scale2,
                        borderColor: isDarkMode ? "#374151" : "#d1d5db",
                      }}
                    />
                    <div
                      className="w-3 h-3 rounded-sm border"
                      style={{
                        backgroundColor: getActivityColors().scale3,
                        borderColor: isDarkMode ? "#374151" : "#d1d5db",
                      }}
                    />
                    <div
                      className="w-3 h-3 rounded-sm border"
                      style={{
                        backgroundColor: getActivityColors().scale4,
                        borderColor: isDarkMode ? "#374151" : "#d1d5db",
                      }}
                    />
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className=" rounded-lg p-4 border  text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((activeDays / 365) * 100)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Year Progress
                </div>
              </div>

              <div className=" rounded-lg p-4 border  text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {activeDays > 0
                    ? Math.round((totalApplications / activeDays) * 10) / 10
                    : 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Daily Average
                </div>
              </div>

              <div className=" rounded-lg p-4 border  text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.max(...yearData.map((d) => d.count))}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Best Day
                </div>
              </div>

              <div className=" rounded-lg p-4 border  text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {365 - activeDays}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Rest Days
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ReactTooltip
        id="info-tooltip"
        place="top"
        style={{
          backgroundColor: isDarkMode ? "#1f2937" : "#374151",
          color: "#ffffff",
          borderRadius: "8px",
          fontSize: "12px",
          padding: "10px 14px",
          boxShadow: isDarkMode
            ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
        }}
      />
    </>
  );
};

export default ActivityCalendar;

function formatDateWithOrdinal(dateStr) {
  const date = new Date(dateStr);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });

  const ordinal =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${ordinal} ${month}`;
}
