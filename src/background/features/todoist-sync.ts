/**
 * Todoist synchronization functionality for Kulon2 assignments
 */

export function initTodoistSync(tabId: number): void {
  chrome.scripting.executeScript({
    target: { tabId },
    func: syncJadwalToTodoist,
  });
}

function syncJadwalToTodoist() {
  // Configuration constants (inline to avoid import issues in injected context)
  const TODOIST_API_TOKEN = "65a1af939df760a34a44583eabcec3fea6050384";
  const TODOIST_PROJECT_ID = "2360600488";
  const TODOIST_API_BASE = "https://api.todoist.com/rest/v2";
  const DRY_RUN = false;

  interface ScrapedAssignment {
    sourceId: string;
    title: string;
    date: string;
    time: string;
    dueIso: string;
    course: string;
    url: string;
  }

  interface TodoistDue {
    date?: string | null;
    datetime?: string | null;
    timezone?: string | null;
  }

  interface TodoistTask {
    id: string;
    content: string;
    description?: string;
    due?: TodoistDue | null;
    project_id: string;
    [key: string]: unknown;
  }

  interface IntegrationMarker {
    sourceId: string;
    titleWithoutPrefix: string;
  }

  interface DesiredTodoistTask {
    content: string;
    description?: string;
    project_id: string;
    due_datetime: string;
  }

  interface CreatePlan {
    scraped: ScrapedAssignment;
    payload: DesiredTodoistTask;
  }

  interface UpdatePlan {
    scraped: ScrapedAssignment;
    taskId: string;
    payload: Partial<DesiredTodoistTask>;
  }

  let loadingToastEl: HTMLElement | null = null;
  let resultToastEl: HTMLElement | null = null;
  let resultToastTimer: number | null = null;

  function parseAssignmentsFromPage(): ScrapedAssignment[] {
    const rootf = document.querySelector<HTMLElement>(
      '[data-region="event-list-content"]'
    );
    if (!rootf) {
      console.error("Cannot find [data-region='event-list-content']");
      return [];
    }

    const blocks = rootf.querySelectorAll<HTMLElement>(
      '[data-region="event-list-content-date"], [data-region="event-list-item"]'
    );

    let currentDateTimestamp: number | null = null;
    const parsed: ScrapedAssignment[] = [];

    blocks.forEach((el) => {
      const region = el.getAttribute("data-region");

      if (region === "event-list-content-date") {
        const ts = el.getAttribute("data-timestamp");
        currentDateTimestamp = ts ? Number(ts) : null;
        return;
      }

      if (region === "event-list-item" && currentDateTimestamp) {
        const timeEl = el.querySelector<HTMLElement>("small");
        const timeText = (timeEl?.textContent || "").trim();

        let hours = 0;
        let minutes = 0;
        if (timeText.includes(":")) {
          const [h, m] = timeText.split(":").map((x) => parseInt(x, 10));
          if (!Number.isNaN(h)) hours = h;
          if (!Number.isNaN(m)) minutes = m;
        }

        const titleLink =
          el.querySelector<HTMLAnchorElement>(".event-name a");
        const rawTitle = (titleLink?.textContent || "").trim();
        const url = titleLink?.href || "";

        const courseEl = el.querySelector<HTMLElement>(
          ".event-name-container small"
        );
        const course = (courseEl?.textContent || "").trim();

        let sourceId: string | null = null;
        if (url) {
          const match = url.match(/[?&]id=(\d+)/);
          if (match) sourceId = match[1];
        }

        if (!sourceId) {
          console.warn(
            "Could not extract sourceId from URL, skipping:",
            url
          );
          return;
        }

        const dateObj = new Date(currentDateTimestamp * 1000);
        dateObj.setHours(hours, minutes, 0, 0);

        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
        const dd = String(dateObj.getDate()).padStart(2, "0");
        const dateText = `${yyyy}-${mm}-${dd}`;

        parsed.push({
          sourceId,
          title: rawTitle,
          date: dateText,
          time: timeText,
          dueIso: dateObj.toISOString(),
          course,
          url,
        });
      }
    });

    console.log("Scraped assignments:", parsed);
    return parsed;
  }

  async function fetchTodoistTasksForProject(): Promise<TodoistTask[]> {
    const resp = await fetch(
      `${TODOIST_API_BASE}/tasks?project_id=${encodeURIComponent(
        TODOIST_PROJECT_ID
      )}`,
      {
        headers: {
          Authorization: `Bearer ${TODOIST_API_TOKEN}`,
        },
      }
    );

    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`Failed to fetch tasks: ${resp.status} ${t}`);
    }

    const tasks = (await resp.json()) as TodoistTask[];
    console.log("Todoist tasks in project:", tasks);
    return tasks;
  }

  function parseIntegrationMarker(
    task: TodoistTask
  ): IntegrationMarker | null {
    const desc = task.description || "";
    const match = desc.match(/sourceId=(\d+)/);
    if (!match) return null;

    return {
      sourceId: match[1],
      titleWithoutPrefix: task.content,
    };
  }

  function buildDesiredTodoistTask(
    scraped: ScrapedAssignment
  ): DesiredTodoistTask {
    const descriptionLines = [`sourceId=${scraped.sourceId}`];
    if (scraped.course) descriptionLines.push(scraped.course);
    if (scraped.url) descriptionLines.push(scraped.url);

    return {
      content: scraped.title,
      description: descriptionLines.join("\n"),
      project_id: TODOIST_PROJECT_ID,
      due_datetime: scraped.dueIso,
    };
  }

  function waitForElement(
    selector: string,
    timeout = 10000
  ): Promise<Element> {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(selector);
      if (existing) return resolve(existing);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout waiting for ${selector}`));
      }, timeout);
    });
  }

  function injectSyncToastStyles() {
    if (document.getElementById("siap-dips-sync-toast-style")) return;
    const style = document.createElement("style");
    style.id = "siap-dips-sync-toast-style";
    style.textContent = `
      @keyframes siap-dips-toast-spin { to { transform: rotate(360deg); } }
      @keyframes siap-dips-toast-slide { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      .siap-dips-toast-container {
        position: fixed;
        bottom: 16px;
        left: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 2147483647;
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .siap-dips-toast {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: #fff;
        border-radius: 999px;
        padding: 10px 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        backdrop-filter: blur(6px);
        animation: siap-dips-toast-slide 0.2s ease-out;
      }
      .siap-dips-toast--loading { background: rgba(29, 78, 216, 0.95); }
      .siap-dips-toast--success { background: rgba(21, 128, 61, 0.95); }
      .siap-dips-toast--error { background: rgba(185, 28, 28, 0.95); }
      .toast-spinner {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.6);
        border-top-color: #fff;
        animation: siap-dips-toast-spin 0.8s linear infinite;
      }
    `;
    document.head.appendChild(style);
  }

  function getToastContainer(): HTMLElement {
    let container = document.getElementById(
      "siap-dips-toast-container"
    ) as HTMLElement | null;
    if (!container) {
      container = document.createElement("div");
      container.id = "siap-dips-toast-container";
      container.className = "siap-dips-toast-container";
      document.body.appendChild(container);
    }
    return container;
  }

  function removeToast(el: HTMLElement | null) {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  function showLoadingToast() {
    injectSyncToastStyles();
    removeToast(loadingToastEl);
    loadingToastEl = document.createElement("div");
    loadingToastEl.className = "siap-dips-toast siap-dips-toast--loading";
    loadingToastEl.innerHTML =
      '<span class="toast-spinner" aria-hidden="true"></span><span>Siap DIps ~~> Syncing…</span>';
    loadingToastEl.setAttribute("role", "status");
    loadingToastEl.setAttribute("aria-live", "polite");
    getToastContainer().appendChild(loadingToastEl);
  }

  function showResultToast(message: string, isSuccess: boolean) {
    injectSyncToastStyles();
    removeToast(loadingToastEl);
    loadingToastEl = null;
    if (resultToastTimer !== null) {
      clearTimeout(resultToastTimer);
    }
    removeToast(resultToastEl);

    resultToastEl = document.createElement("div");
    resultToastEl.className = `siap-dips-toast ${
      isSuccess ? "siap-dips-toast--success" : "siap-dips-toast--error"
    }`;
    resultToastEl.textContent = message;
    resultToastEl.setAttribute("role", "status");
    resultToastEl.setAttribute("aria-live", "polite");
    getToastContainer().appendChild(resultToastEl);

    resultToastTimer = window.setTimeout(() => {
      removeToast(resultToastEl);
      resultToastEl = null;
      resultToastTimer = null;
    }, 3200);
  }

  async function syncKulon2ToTodoist(): Promise<void> {
    try {
      showLoadingToast();
      console.log("=== Kulon2 → Todoist sync starting ===");

      await waitForElement('[data-region="event-list-item"]');

      const scraped = parseAssignmentsFromPage();
      if (!scraped.length) {
        console.warn("No assignments scraped, aborting.");
        showResultToast("Siap DIps ~~> Nothing to sync", true);
        return;
      }

      const todoistTasks = await fetchTodoistTasksForProject();

      const existingBySourceId = new Map<
        string,
        { task: TodoistTask; marker: IntegrationMarker }
      >();
      const otherTasks: TodoistTask[] = [];

      for (const task of todoistTasks) {
        const marker = parseIntegrationMarker(task);
        if (marker) {
          existingBySourceId.set(marker.sourceId, { task, marker });
        } else {
          otherTasks.push(task);
        }
      }

      console.log("Existing integration tasks:", existingBySourceId);
      console.log("Other tasks in project (ignored for sync):", otherTasks);

      const toCreate: CreatePlan[] = [];
      const toUpdate: UpdatePlan[] = [];
      const seenSourceIds = new Set<string>();

      for (const scrapedItem of scraped) {
        seenSourceIds.add(scrapedItem.sourceId);
        const desired = buildDesiredTodoistTask(scrapedItem);
        const existing = existingBySourceId.get(scrapedItem.sourceId);

        if (!existing) {
          toCreate.push({ scraped: scrapedItem, payload: desired });
          continue;
        }

        const task = existing.task;
        const currentDue = task.due?.datetime ?? task.due?.date ?? null;
        const desiredDue = desired.due_datetime;

        const changed =
          task.content !== desired.content ||
          (task.description || "") !== (desired.description || "") ||
          (currentDue || null) !== (desiredDue || null);

        if (changed) {
          toUpdate.push({
            scraped: scrapedItem,
            taskId: task.id,
            payload: {
              content: desired.content,
              description: desired.description,
              due_datetime: desired.due_datetime,
            },
          });
        }
      }

      const stale: { sourceId: string; task: TodoistTask }[] = [];
      for (const [sourceId, info] of existingBySourceId.entries()) {
        if (!seenSourceIds.has(sourceId)) {
          stale.push({ sourceId, task: info.task });
        }
      }

      console.log("Will create:", toCreate);
      console.log("Will update:", toUpdate);
      console.log(
        "Stale tasks (present in Todoist but not on page):",
        stale
      );

      if (DRY_RUN) {
        console.log("DRY_RUN = true → No changes sent to Todoist.");
        console.log("Set DRY_RUN = false in the script to actually sync.");
        showResultToast("Siap DIps ~~> DRY RUN", true);
        return;
      }

      for (const plan of toCreate) {
        try {
          const resp = await fetch(`${TODOIST_API_BASE}/tasks`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${TODOIST_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(plan.payload),
          });
          if (!resp.ok) {
            const t = await resp.text();
            console.error("Create failed:", resp.status, t, plan);
          } else {
            const created = (await resp.json()) as TodoistTask;
            console.log("Created task:", created.content, "->", created.id);
          }
        } catch (createErr) {
          console.error("Error creating task:", createErr, plan);
        }
      }

      for (const plan of toUpdate) {
        try {
          const resp = await fetch(
            `${TODOIST_API_BASE}/tasks/${plan.taskId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${TODOIST_API_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(plan.payload),
            }
          );
          if (!resp.ok) {
            const t = await resp.text();
            console.error("Update failed:", resp.status, t, plan);
          } else {
            const updated = (await resp.json()) as TodoistTask;
            console.log("Updated task:", updated.content, "->", updated.id);
          }
        } catch (updateErr) {
          console.error("Error updating task:", updateErr, plan);
        }
      }

      console.log("=== Kulon2 → Todoist sync finished ===");
      showResultToast("Siap DIps ~~> Sync Complete ✅", true);
    } catch (err) {
      console.error("Sync error:", err);
      showResultToast("Siap DIps ~~> Sync Failed ⚠️", false);
    }
  }

  syncKulon2ToTodoist();
}
