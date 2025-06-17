import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCommitHorizontal } from "lucide-react";

interface ChangelogEntry {
  version: string;
  date: string;
  type: "feature" | "bugfix" | "initial" | "patch";
  changes: string[];
}

const changelogEntries: ChangelogEntry[] = [
  {
    version: "v1.4.0",
    date: "June 15, 2025",
    type: "feature",
    changes: [
      "Upload Absen Image",
      "Moodle Kulon helper",
      "DIPS AI Helper ( •̀ ω •́ )✧",
      "better mobile layout",
    ],
  },
  {
    version: "v1.3.0",
    date: "March 14, 2025",
    type: "feature",
    changes: [
      "TODO Board",
      "Fix Thememode {change from radix to own}",
      "React compilerr ヾ(≧ ▽ ≦)ゝ ",
    ],
  },
  {
    version: "v1.2.0",
    date: "March 7, 2025",
    type: "feature",
    changes: [
      "Food Truk Helper {beta}",
      "Navcard setting",
      "Patch Learn Social Helper",
    ],
  },
  {
    version: "v1.1.1",
    date: "February 27, 2025",
    type: "patch",
    changes: ["Better Jadwal Dips", "Bugfixes"],
  },
  {
    version: "v1.1.0",
    date: "February, 2025",
    type: "feature",
    changes: [
      "Auto Learn Social",
      "Jadwal Dips",
      "Quality of Life improvements",
    ],
  },
  {
    version: "v1.0.0",
    date: "2025",
    type: "initial",
    changes: ["Core features", "Ipk, Dark mode, Auto PBM etc"],
  },
];

const getBadgeVariant = (
  type: ChangelogEntry["type"]
): "default" | "outline" | "secondary" | "destructive" => {
  switch (type) {
    case "feature":
      return "default";
    case "bugfix":
      return "destructive";
    case "initial":
      return "secondary";
    case "patch":
      return "secondary";
    default:
      return "outline";
  }
};

const ChangelogSection = () => {
  return (
    <section className=" mt-6 py-12">
      <div id="changelog" className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-8 space-x-3">
          <GitCommitHorizontal className="w-8 h-8 text-primary dark:text-primary-light" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Changelog {"{Whats new}"}
          </h1>
        </div>

        <div className="space-y-6">
          {changelogEntries.map((entry, index) => (
            <Card
              key={index}
              className="w-full bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {entry.version}
                  </h2>
                  <Badge
                    className="cursor-default"
                    variant={getBadgeVariant(entry.type)}
                  >
                    {entry.type}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {entry.date}
                </span>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 pl-4 border-l-2 border-primary/20 dark:border-primary/40">
                  {entry.changes.map((change, changeIndex) => (
                    <li
                      key={changeIndex}
                      className="pl-4 relative text-gray-800 dark:text-gray-300 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-primary before:rounded-full"
                    >
                      {change}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChangelogSection;
