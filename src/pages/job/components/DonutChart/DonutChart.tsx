import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";

const defaultData = [
  { name: "No update", value: 1, color: "#6366F1" },
  { name: "Assessment", value: 1, color: "#8B5CF6" },
];

// Step 1: Normalize statuses
const getLabel = (status: string) => {
  if (["applied"].includes(status)) return "No Update";
  return status.charAt(0).toUpperCase() + status.slice(1); // Title case fallback
};

// Step 3: Generate colors (simple auto palette)
const baseColors = [
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#10B981", // Green
  "#3B82F6", // Blue
];

export function DonutChart() {
  const [data, setData] = useState(defaultData);
  const [savedJobs, setSavedJobs] = useState(0);

  useEffect(() => {
    chrome.storage.local.get(["jobs"], (result) => {
      if (result.jobs && Array.isArray(result.jobs)) {
        const counts = {};
        result.jobs.forEach((item) => {
          if (item.status === "saved") {
            setSavedJobs((prev) => prev + 1);
            return;
          }
          const label = getLabel(item.status);
          counts[label] = (counts[label] || 0) + 1;
        });
        const donutData = Object.entries(counts).map(
          ([name, value], index) => ({
            name,
            value,
            color: baseColors[index % baseColors.length],
          })
        );

        setData(donutData);
      }
    });
  }, []);

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Application Summary
          </CardTitle>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Bookmark className="w-4 h-4" />
            <span className="text-sm font-medium">{savedJobs} Saved Jobs</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Donut Chart */}
          <div className="relative">
            <ResponsiveContainer width={240} height={240}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={85}
                  innerRadius={55}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {total}
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                JOBS APPLIED
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-4">
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 tracking-wide">
              APPLICATION STATUS
            </div>

            <div className="space-y-3">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-8 min-w-[180px]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                  </div>

                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Applications
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {total}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Response Rate
                </span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {total > 0
                    ? `${(
                        (data
                          .filter((item) => item.name !== "No Update")
                          .reduce((sum, entry) => sum + entry.value, 0) /
                          total) *
                        100
                      ).toFixed(2)}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
