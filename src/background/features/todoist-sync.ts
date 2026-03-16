/**
 * Todoist synchronization functionality for Kulon2 assignments.
 * Scraping runs in the page, while all Todoist API calls stay in the background.
 */

import {
  closeTodoistTask,
  createTodoistTask,
  fetchTodoistTasksForProject,
  updateTodoistTask,
} from "./todoist-api";
import { scrapeKulonAssignmentsFromTab } from "./kulon-assignments";
import type { KulonAssignment } from "@/lib/kulon/shared";
import {
  STORAGE_KEY_TODOIST_API_TOKEN,
  STORAGE_KEY_TODOIST_IGNORE_OVERDUE,
  STORAGE_KEY_TODOIST_PROJECT_ID,
  STORAGE_KEY_TODOIST_TASK_LINKS,
  type TodoistTask,
  type TodoistTaskLink,
  type TodoistTaskLinkMap,
} from "@/lib/todoist/shared";

interface TodoistSyncConfig {
  apiToken: string;
  projectId: string;
  ignoreOverdue: boolean;
}

interface DesiredTodoistTask {
  content: string;
  description: string;
  due_datetime: string;
}

interface TodoistSyncOptions {
  notifyIfUnconfigured?: boolean;
  scrapedAssignments?: KulonAssignment[];
}

export async function initTodoistSync(tabId: number): Promise<void> {
  const config = await loadTodoistSyncConfig();
  if (!config) {
    console.warn(
      "Todoist sync skipped: API token or project ID not configured"
    );
    return;
  }

  await runTodoistSyncForTab(tabId, { notifyIfUnconfigured: false });
}

export async function runTodoistSyncForTab(
  tabId: number,
  options: TodoistSyncOptions = {}
): Promise<void> {
  const config = await loadTodoistSyncConfig();
  if (!config) {
    if (options.notifyIfUnconfigured !== false) {
      await showSyncStatus(
        tabId,
        "error",
        "Siap DIps ~~> Configure Todoist first"
      );
    }
    throw new Error("Todoist sync is not configured.");
  }

  await showSyncStatus(tabId, "loading", "Siap DIps ~~> Syncing Todoist...");

  try {
    const scrapedAssignments =
      options.scrapedAssignments ?? (await scrapeKulonAssignmentsFromTab(tabId));

    if (!scrapedAssignments.length) {
      await showSyncStatus(tabId, "success", "Siap DIps ~~> Nothing to sync");
      return;
    }

    const visibleSourceKeys = new Set(
      scrapedAssignments.map((assignment) => assignment.sourceKey)
    );

    const syncableAssignments = config.ignoreOverdue
      ? scrapedAssignments.filter((assignment) => {
          const dueDate = new Date(assignment.dueIso);
          return dueDate >= new Date();
        })
      : scrapedAssignments;

    const links = await loadTodoistTaskLinks();
    const projectIdsToFetch = new Set<string>([config.projectId]);
    for (const link of Object.values(links)) {
      projectIdsToFetch.add(link.projectId);
    }

    const tasksById = await fetchTasksByProjectIds(
      config.apiToken,
      Array.from(projectIdsToFetch)
    );
    const tasksBySourceKey = buildTaskSourceKeyIndex(tasksById);

    const syncTimestamp = new Date().toISOString();
    let createdCount = 0;
    let updatedCount = 0;
    let completedCount = 0;

    for (const assignment of syncableAssignments) {
      let existingLink = links[assignment.sourceKey];
      let linkedTask = existingLink
        ? tasksById.get(existingLink.todoistTaskId)
        : undefined;

      if (!linkedTask) {
        const recoveredTask = tasksBySourceKey.get(assignment.sourceKey);
        if (recoveredTask) {
          existingLink = {
            sourceKey: assignment.sourceKey,
            todoistTaskId: recoveredTask.id,
            projectId: recoveredTask.project_id,
            lastSyncedAt: syncTimestamp,
          };
          links[assignment.sourceKey] = existingLink;
          linkedTask = recoveredTask;
        }
      }

      if (!existingLink || !linkedTask) {
        const created = await createLinkedTodoistTask(
          config.apiToken,
          assignment,
          config.projectId
        );

        links[assignment.sourceKey] = {
          sourceKey: assignment.sourceKey,
          todoistTaskId: created.id,
          projectId: config.projectId,
          lastSyncedAt: syncTimestamp,
        };
        tasksById.set(created.id, created);
        tasksBySourceKey.set(assignment.sourceKey, created);
        createdCount += 1;
        continue;
      }

      const desiredTask = buildDesiredTodoistTask(assignment);
      const hasChanged = hasTodoistTaskChanged(linkedTask, desiredTask);

      if (hasChanged) {
        const updatedTask = await updateLinkedTodoistTask(
          config.apiToken,
          existingLink.todoistTaskId,
          assignment
        );
        tasksById.set(updatedTask.id, updatedTask);
        tasksBySourceKey.set(assignment.sourceKey, updatedTask);
        updatedCount += 1;
      }

      links[assignment.sourceKey] = {
        ...existingLink,
        lastSyncedAt: syncTimestamp,
      };
    }

    for (const [sourceKey, link] of Object.entries(links)) {
      if (visibleSourceKeys.has(sourceKey)) {
        continue;
      }

      const linkedTask = tasksById.get(link.todoistTaskId);
      if (!linkedTask) {
        delete links[sourceKey];
        continue;
      }

      await completeLinkedTodoistTask(config.apiToken, link);
      tasksById.delete(link.todoistTaskId);
      tasksBySourceKey.delete(sourceKey);
      delete links[sourceKey];
      completedCount += 1;
    }

    await saveTodoistTaskLinks(links);

    const summary = [
      createdCount > 0 ? `created ${createdCount}` : null,
      updatedCount > 0 ? `updated ${updatedCount}` : null,
      completedCount > 0 ? `completed ${completedCount}` : null,
    ]
      .filter(Boolean)
      .join(", ");

    await showSyncStatus(
      tabId,
      "success",
      summary
        ? `Siap DIps ~~> Sync complete (${summary})`
        : "Siap DIps ~~> Already up to date"
    );
  } catch (error) {
    console.error("Todoist sync failed:", error);
    await showSyncStatus(tabId, "error", "Siap DIps ~~> Sync failed");
    throw error;
  }
}

export async function createLinkedTodoistTask(
  apiToken: string,
  assignment: KulonAssignment,
  projectId: string
): Promise<TodoistTask> {
  const desiredTask = buildDesiredTodoistTask(assignment);
  return createTodoistTask(apiToken, {
    ...desiredTask,
    project_id: projectId,
  });
}

export async function updateLinkedTodoistTask(
  apiToken: string,
  taskId: string,
  assignment: KulonAssignment
): Promise<TodoistTask> {
  return updateTodoistTask(apiToken, taskId, buildDesiredTodoistTask(assignment));
}

export async function completeLinkedTodoistTask(
  apiToken: string,
  link: TodoistTaskLink
): Promise<void> {
  await closeTodoistTask(apiToken, link.todoistTaskId);
}

async function loadTodoistSyncConfig(): Promise<TodoistSyncConfig | null> {
  const config = await chrome.storage.local.get([
    STORAGE_KEY_TODOIST_API_TOKEN,
    STORAGE_KEY_TODOIST_PROJECT_ID,
    STORAGE_KEY_TODOIST_IGNORE_OVERDUE,
  ]);

  const apiToken = String(config[STORAGE_KEY_TODOIST_API_TOKEN] || "").trim();
  const projectId = String(config[STORAGE_KEY_TODOIST_PROJECT_ID] || "").trim();
  const ignoreOverdue = Boolean(config[STORAGE_KEY_TODOIST_IGNORE_OVERDUE]);

  if (!apiToken || !projectId) {
    return null;
  }

  return {
    apiToken,
    projectId,
    ignoreOverdue,
  };
}

async function loadTodoistTaskLinks(): Promise<TodoistTaskLinkMap> {
  const result = await chrome.storage.local.get(STORAGE_KEY_TODOIST_TASK_LINKS);
  const links = result[STORAGE_KEY_TODOIST_TASK_LINKS];

  if (!links || typeof links !== "object") {
    return {};
  }

  return links as TodoistTaskLinkMap;
}

async function saveTodoistTaskLinks(links: TodoistTaskLinkMap): Promise<void> {
  await chrome.storage.local.set({
    [STORAGE_KEY_TODOIST_TASK_LINKS]: links,
  });
}

async function fetchTasksByProjectIds(
  apiToken: string,
  projectIds: string[]
): Promise<Map<string, TodoistTask>> {
  const tasksById = new Map<string, TodoistTask>();

  for (const projectId of projectIds) {
    const tasks = await fetchTodoistTasksForProject(apiToken, projectId);
    for (const task of tasks) {
      tasksById.set(task.id, task);
    }
  }

  return tasksById;
}

function buildTaskSourceKeyIndex(
  tasksById: Map<string, TodoistTask>
): Map<string, TodoistTask> {
  const tasksBySourceKey = new Map<string, TodoistTask>();

  for (const task of tasksById.values()) {
    const sourceKey = extractSourceKeyFromTask(task);
    if (!sourceKey) {
      continue;
    }

    tasksBySourceKey.set(sourceKey, task);
  }

  return tasksBySourceKey;
}

function extractSourceKeyFromTask(task: TodoistTask): string | null {
  const description = task.description || "";
  const match = description.match(/^sourceKey=(.+)$/m);
  return match?.[1]?.trim() || null;
}

async function showSyncStatus(
  tabId: number,
  kind: "loading" | "success" | "error",
  message: string
): Promise<void> {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: renderTodoistSyncToast,
      args: [kind, message],
    });
  } catch (error) {
    console.warn("Unable to show Todoist sync status on page:", error);
  }
}

function buildDesiredTodoistTask(
  assignment: KulonAssignment
): DesiredTodoistTask {
  const descriptionLines = [
    `sourceKey=${assignment.sourceKey}`,
    `Source ID: ${assignment.sourceId}`,
    `Due: ${formatFullDate(assignment.dueIso)}`,
  ];

  if (assignment.course) {
    descriptionLines.push(`Course: ${assignment.course}`);
  }

  if (assignment.url) {
    descriptionLines.push(`URL: ${assignment.url}`);
  }

  return {
    content: assignment.title,
    description: descriptionLines.join("\n"),
    due_datetime: assignment.dueIso,
  };
}

function hasTodoistTaskChanged(
  task: TodoistTask,
  desiredTask: DesiredTodoistTask
): boolean {
  const currentDueValue = task.due?.datetime ?? task.due?.date ?? null;
  const normalizedCurrentDue = normalizeDueValue(currentDueValue);
  const normalizedDesiredDue = normalizeDueValue(desiredTask.due_datetime);

  return (
    task.content !== desiredTask.content ||
    (task.description || "") !== desiredTask.description ||
    normalizedCurrentDue !== normalizedDesiredDue
  );
}

function normalizeDueValue(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toISOString();
}

function formatFullDate(isoString: string): string {
  return new Date(isoString).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderTodoistSyncToast(
  kind: "loading" | "success" | "error",
  message: string
): void {
  if (!document.getElementById("siap-dips-sync-toast-style")) {
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

  let container = document.getElementById(
    "siap-dips-toast-container"
  ) as HTMLElement | null;
  if (!container) {
    container = document.createElement("div");
    container.id = "siap-dips-toast-container";
    container.className = "siap-dips-toast-container";
    document.body.appendChild(container);
  }

  const existingToast = document.getElementById(
    "siap-dips-sync-toast"
  ) as HTMLElement | null;
  existingToast?.remove();

  const toast = document.createElement("div");
  toast.id = "siap-dips-sync-toast";
  toast.className = `siap-dips-toast siap-dips-toast--${kind}`;
  toast.innerHTML =
    kind === "loading"
      ? `<span class="toast-spinner" aria-hidden="true"></span><span>${message}</span>`
      : `<span>${message}</span>`;
  container.appendChild(toast);

  if (kind !== "loading") {
    window.setTimeout(() => {
      toast.remove();
    }, 3200);
  }
}
