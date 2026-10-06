export interface ChangelogEntry {
  version: string;
  date: string;
  type: "feature" | "bugfix" | "initial" | "patch";
  changes: string[];
}

// Shared by the options page changelog and the public landing page.
export const changelogEntries: ChangelogEntry[] = [
  {
    version: "v1.4.1058",
    date: "June 9, 2026",
    type: "feature",
    changes: [
      "Helper quiz Moodle bisa pakai ChatGPT",
      "Perbaikan helper di Firefox",
      "Rilis otomatis ke Chrome, Firefox, dan Edge",
    ],
  },
  {
    version: "v1.4.9",
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
