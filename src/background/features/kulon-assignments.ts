import {
  STORAGE_KEY_KULON_ASSIGNMENTS_CACHE,
  STORAGE_KEY_KULON_ASSIGNMENTS_LAST_SYNCED_AT,
  STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED,
  type KulonAssignment,
  type KulonDashboardDataResponse,
  type KulonDashboardRefreshResponse,
} from "@/lib/kulon/shared";
import {
  STORAGE_KEY_TODOIST_API_TOKEN,
  STORAGE_KEY_TODOIST_PROJECT_ID,
  STORAGE_KEY_TODOIST_TASK_LINKS,
  type TodoistTaskLinkMap,
} from "@/lib/todoist/shared";

export async function isNewTabDashboardEnabled(): Promise<boolean> {
  const result = await chrome.storage.local.get(STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED);
  return Boolean(result[STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED]);
}

export async function isTodoistSyncConfigured(): Promise<boolean> {
  const result = await chrome.storage.local.get([
    STORAGE_KEY_TODOIST_API_TOKEN,
    STORAGE_KEY_TODOIST_PROJECT_ID,
  ]);

  return Boolean(
    String(result[STORAGE_KEY_TODOIST_API_TOKEN] || "").trim() &&
      String(result[STORAGE_KEY_TODOIST_PROJECT_ID] || "").trim()
  );
}

export async function shouldProcessKulonVisit(): Promise<boolean> {
  const [dashboardEnabled, todoistConfigured] = await Promise.all([
    isNewTabDashboardEnabled(),
    isTodoistSyncConfigured(),
  ]);

  return dashboardEnabled || todoistConfigured;
}

export async function refreshKulonAssignmentsCacheFromTab(
  tabId: number
): Promise<KulonAssignment[]> {
  const assignments = await scrapeKulonAssignmentsFromTab(tabId);

  if (assignments.length > 0) {
    await chrome.storage.local.set({
      [STORAGE_KEY_KULON_ASSIGNMENTS_CACHE]: assignments,
      [STORAGE_KEY_KULON_ASSIGNMENTS_LAST_SYNCED_AT]: new Date().toISOString(),
    });
  }

  return assignments;
}

export async function scrapeKulonAssignmentsFromTab(
  tabId: number
): Promise<KulonAssignment[]> {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: scrapeAssignmentsFromPage,
  });

  const scrapedAssignments = results[0]?.result;
  if (!Array.isArray(scrapedAssignments)) {
    return [];
  }

  return sortKulonAssignments(scrapedAssignments as KulonAssignment[]);
}

export async function getKulonDashboardData(): Promise<KulonDashboardDataResponse> {
  const result = await chrome.storage.local.get([
    STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED,
    STORAGE_KEY_KULON_ASSIGNMENTS_CACHE,
    STORAGE_KEY_KULON_ASSIGNMENTS_LAST_SYNCED_AT,
    STORAGE_KEY_TODOIST_TASK_LINKS,
  ]);

  const assignments = Array.isArray(result[STORAGE_KEY_KULON_ASSIGNMENTS_CACHE])
    ? sortKulonAssignments(result[STORAGE_KEY_KULON_ASSIGNMENTS_CACHE] as KulonAssignment[])
    : [];

  const links = isTodoistLinkMap(result[STORAGE_KEY_TODOIST_TASK_LINKS])
    ? result[STORAGE_KEY_TODOIST_TASK_LINKS]
    : {};

  return {
    ok: true,
    enabled: Boolean(result[STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED]),
    assignments,
    lastSyncedAt:
      typeof result[STORAGE_KEY_KULON_ASSIGNMENTS_LAST_SYNCED_AT] === "string"
        ? result[STORAGE_KEY_KULON_ASSIGNMENTS_LAST_SYNCED_AT]
        : null,
    linkedSourceKeys: Object.keys(links),
  };
}

export async function refreshKulonDashboardFromActiveTab(): Promise<KulonDashboardRefreshResponse> {
  const tabs = await chrome.tabs.query({});
  const kulonTab = tabs
    .filter((tab) => tab.id && tab.url?.includes("https://kulon2.undip.ac.id/my/"))
    .sort((left, right) => (right.lastAccessed || 0) - (left.lastAccessed || 0))[0];

  if (!kulonTab?.id) {
    const current = await getKulonDashboardData();
    return {
      ok: false,
      enabled: current.enabled,
      assignments: current.assignments,
      lastSyncedAt: current.lastSyncedAt,
      linkedSourceKeys: current.linkedSourceKeys,
      error: "Open the Kulon assignments page in any tab first.",
    };
  }

  const assignments = await refreshKulonAssignmentsCacheFromTab(kulonTab.id);
  const current = await getKulonDashboardData();

  return {
    ok: true,
    refreshed: assignments.length > 0,
    enabled: current.enabled,
    assignments: current.assignments,
    lastSyncedAt: current.lastSyncedAt,
    linkedSourceKeys: current.linkedSourceKeys,
  };
}

function sortKulonAssignments(assignments: KulonAssignment[]): KulonAssignment[] {
  return [...assignments].sort((left, right) => {
    return new Date(left.dueIso).getTime() - new Date(right.dueIso).getTime();
  });
}

function isTodoistLinkMap(value: unknown): value is TodoistTaskLinkMap {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function scrapeAssignmentsFromPage(): Promise<KulonAssignment[]> {
  return new Promise((resolve) => {
    const parseAssignments = (): KulonAssignment[] => {
      const root = document.querySelector<HTMLElement>(
        '[data-region="event-list-content"]'
      );
      if (!root) {
        return [];
      }

      const blocks = root.querySelectorAll<HTMLElement>(
        '[data-region="event-list-content-date"], [data-region="event-list-item"]'
      );

      let currentDateTimestamp: number | null = null;
      const parsedAssignments: KulonAssignment[] = [];

      blocks.forEach((element) => {
        const region = element.getAttribute("data-region");

        if (region === "event-list-content-date") {
          const timestamp = element.getAttribute("data-timestamp");
          currentDateTimestamp = timestamp ? Number(timestamp) : null;
          return;
        }

        if (region !== "event-list-item" || !currentDateTimestamp) {
          return;
        }

        const timeElement = element.querySelector<HTMLElement>("small");
        const timeText = (timeElement?.textContent || "").trim();

        let hours = 0;
        let minutes = 0;
        if (timeText.includes(":")) {
          const [hourValue, minuteValue] = timeText
            .split(":")
            .map((value) => parseInt(value, 10));
          if (!Number.isNaN(hourValue)) {
            hours = hourValue;
          }
          if (!Number.isNaN(minuteValue)) {
            minutes = minuteValue;
          }
        }

        const titleLink = element.querySelector<HTMLAnchorElement>(
          ".event-name a"
        );
        const rawTitle = (titleLink?.textContent || "").trim();
        const url = titleLink?.href || "";

        const courseElement = element.querySelector<HTMLElement>(
          ".event-name-container small"
        );
        const course = (courseElement?.textContent || "").trim();

        const sourceIdMatch = url.match(/[?&]id=(\d+)/);
        const sourceId = sourceIdMatch?.[1] || url || rawTitle;
        if (!sourceId || !rawTitle) {
          return;
        }

        const dateObject = new Date(currentDateTimestamp * 1000);
        dateObject.setHours(hours, minutes, 0, 0);

        const sourceKey = url ? `moodle:${url}` : `moodle:${sourceId}`;

        parsedAssignments.push({
          sourceId,
          sourceKey,
          title: rawTitle,
          dueIso: dateObject.toISOString(),
          course,
          url,
        });
      });

      return parsedAssignments;
    };

    const immediateAssignments = parseAssignments();
    if (immediateAssignments.length > 0) {
      resolve(immediateAssignments);
      return;
    }

    const observer = new MutationObserver(() => {
      const parsedAssignments = parseAssignments();
      if (!parsedAssignments.length) {
        return;
      }

      observer.disconnect();
      resolve(parsedAssignments);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    window.setTimeout(() => {
      observer.disconnect();
      resolve(parseAssignments());
    }, 10000);
  });
}
