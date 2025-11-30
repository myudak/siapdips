/**
 * Schedule parsing functionality
 */

interface Course {
  mataKuliah: string;
  ruang: string;
  waktuMulai: string;
  waktuSelesai: string;
  sks: number;
  msTeams: string;
}

interface DayObject {
  [dayName: string]: Course[];
}

export function parseSchedule(tabId: number): void {
  chrome.scripting.executeScript({
    target: { tabId },
    func: parseTableToJsonAndSave,
  });
}

function parseTableToJsonAndSave(): DayObject | null {
  const table = document.querySelector(".table") as HTMLTableElement | null;
  if (!table) {
    console.error("Elemen tabel tidak ditemukan.");
    return null;
  }

  const tbody = table.querySelector("tbody") as HTMLTableSectionElement | null;
  if (!tbody) {
    console.error("Body tabel (tbody) tidak ditemukan.");
    return null;
  }

  const rows: HTMLTableRowElement[] = Array.from(
    tbody.querySelectorAll("tr")
  ) as HTMLTableRowElement[];
  if (!rows || rows.length === 0) {
    console.warn("Tidak ada baris tabel yang ditemukan di tbody.");
    return {};
  }

  const daysSchedule: DayObject = {};
  let currentDay: string | null = null;
  let dayCourses: Course[] = [];

  rows.forEach((row) => {
    const cells: HTMLElement[] = Array.from(
      row.querySelectorAll("td")
    ) as HTMLElement[];

    if (cells.length >= 8) {
      const day = cells[1].textContent?.trim() || "";
      const mataKuliah = cells[2].textContent?.trim() || "";
      const ruang = cells[3].textContent?.trim() || "";
      const waktuText = cells[4].textContent?.trim() || "";
      const sksText = cells[5].textContent?.trim() || "";
      const msTeams =
        (cells[7]?.children?.[1] as HTMLAnchorElement)?.href || "";

      if (day) {
        if (day !== currentDay) {
          if (currentDay) {
            daysSchedule[currentDay] = dayCourses;
          }
          currentDay = day;
          dayCourses = [];
        }

        const waktuParts = waktuText.split(" s/d ");
        const waktuMulai = waktuParts[0];
        const waktuSelesai = waktuParts[1];

        const sks = parseFloat(sksText);

        dayCourses.push({
          mataKuliah: mataKuliah,
          ruang: ruang,
          waktuMulai: waktuMulai,
          waktuSelesai: waktuSelesai,
          sks: sks,
          msTeams: msTeams,
        });
      }
    }
  });

  if (currentDay) {
    daysSchedule[currentDay] = dayCourses;
  }

  chrome.storage.local.set({ scheduleData: daysSchedule }, function () {
    if (chrome.runtime.lastError) {
      console.error(
        "Error menyimpan ke Chrome local storage:",
        chrome.runtime.lastError
      );
    } else {
      chrome.storage.local.get(["scheduleData"], function (result) {
        console.log("data Chrome local storage:", result.scheduleData);
      });
    }
  });

  return daysSchedule;
}
