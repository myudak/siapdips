/**
 * Runtime message event listener
 */

import {
  closeAllSuspendedTabs,
  SuspendAllThoseTabsNow,
  CloseThoseTabsNow,
} from "../utils/tab-suspender";
import {
  fetchTodoistProjects,
  isTodoistApiError,
  validateTodoistToken,
} from "../features/todoist-api";
import {
  getKulonDashboardData,
  isNewTabDashboardEnabled,
  refreshKulonDashboardFromActiveTab,
} from "../features/kulon-assignments";
import {
  completeLinkedTodoistTask,
  createLinkedTodoistTask,
  runTodoistSyncForTab,
  updateLinkedTodoistTask,
} from "../features/todoist-sync";
import type {
  KulonDashboardDataResponse,
  KulonDashboardRefreshResponse,
  KulonDashboardStatusResponse,
  KulonRuntimeMessage,
} from "@/lib/kulon/shared";
import type {
  TodoistMutationResponse,
  TodoistProjectsResponse,
  TodoistRuntimeMessage,
  TodoistSyncTabResponse,
  TodoistValidateTokenResponse,
} from "@/lib/todoist/shared";

export function initMessageListener(): void {
  chrome.runtime.onMessage.addListener(handleMessage);
}

type RuntimeMessage =
  | { type: "closeAllSuspendedTabsNow" }
  | { type: "suspendAllTabsNow" }
  | { type: "closeAllTabsNow" }
  | { type: "hackerrankSetEditorCode"; tabId?: number; code?: string }
  | TodoistRuntimeMessage
  | KulonRuntimeMessage;

interface EditorInsertResult {
  ok: boolean;
  via: "monaco" | "codemirror" | "textarea" | "none";
}

function handleMessage(
  message: RuntimeMessage,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
): boolean | void {
  if (message.type === "closeAllSuspendedTabsNow") {
    closeAllSuspendedTabs();
    return;
  }

  if (message.type === "suspendAllTabsNow") {
    SuspendAllThoseTabsNow();
    return;
  }

  if (message.type === "closeAllTabsNow") {
    CloseThoseTabsNow();
    return;
  }

  if (message.type === "kulonDashboardGetData") {
    handleKulonDashboardGetData(sendResponse);
    return true;
  }

  if (message.type === "kulonDashboardGetStatus") {
    handleKulonDashboardGetStatus(sendResponse);
    return true;
  }

  if (message.type === "kulonDashboardRefreshFromActiveTab") {
    handleKulonDashboardRefresh(sendResponse);
    return true;
  }

  if (message.type === "todoistFetchProjects") {
    handleTodoistFetchProjects(message.apiToken, sendResponse);
    return true;
  }

  if (message.type === "todoistValidateToken") {
    handleTodoistValidateToken(message.apiToken, sendResponse);
    return true;
  }

  if (message.type === "todoistSyncTab") {
    handleTodoistSyncTab(message.tabId, sendResponse);
    return true;
  }

  if (message.type === "todoistCreateLinkedTask") {
    handleTodoistCreateLinkedTask(
      message.apiToken,
      message.projectId,
      message.assignment,
      sendResponse
    );
    return true;
  }

  if (message.type === "todoistUpdateLinkedTask") {
    handleTodoistUpdateLinkedTask(
      message.apiToken,
      message.taskId,
      message.assignment,
      sendResponse
    );
    return true;
  }

  if (message.type === "todoistCompleteLinkedTask") {
    handleTodoistCompleteLinkedTask(message.apiToken, message.link, sendResponse);
    return true;
  }

  if (message.type === "hackerrankSetEditorCode") {
    if (typeof message.tabId !== "number" || typeof message.code !== "string") {
      sendResponse({ ok: false, via: "none" } satisfies EditorInsertResult);
      return;
    }

    insertCodeInMainWorld(message.tabId, message.code)
      .then((result) => sendResponse(result))
      .catch((error) => {
        console.warn("[SiapDips][AI] MAIN world insert request failed:", error);
        sendResponse({ ok: false, via: "none" } satisfies EditorInsertResult);
      });

    return true;
  }
}

async function handleKulonDashboardGetData(
  sendResponse: (response?: unknown) => void
): Promise<void> {
  try {
    sendResponse((await getKulonDashboardData()) satisfies KulonDashboardDataResponse);
  } catch (error) {
    sendResponse({
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load Kulon dashboard data.",
    } satisfies KulonDashboardDataResponse);
  }
}

async function handleKulonDashboardGetStatus(
  sendResponse: (response?: unknown) => void
): Promise<void> {
  try {
    sendResponse({
      ok: true,
      enabled: await isNewTabDashboardEnabled(),
    } satisfies KulonDashboardStatusResponse);
  } catch (error) {
    sendResponse({
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load new tab dashboard status.",
    } satisfies KulonDashboardStatusResponse);
  }
}

async function handleKulonDashboardRefresh(
  sendResponse: (response?: unknown) => void
): Promise<void> {
  try {
    sendResponse(
      (await refreshKulonDashboardFromActiveTab()) satisfies KulonDashboardRefreshResponse
    );
  } catch (error) {
    sendResponse({
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to refresh Kulon dashboard.",
    } satisfies KulonDashboardRefreshResponse);
  }
}

async function handleTodoistFetchProjects(
  apiToken: string,
  sendResponse: (response?: unknown) => void
): Promise<void> {
  try {
    const projectResponse = await fetchTodoistProjects(apiToken.trim());
    sendResponse({
      ok: true,
      projects: projectResponse.results,
    } satisfies TodoistProjectsResponse);
  } catch (error) {
    sendResponse(mapTodoistError(error));
  }
}

async function handleTodoistValidateToken(
  apiToken: string,
  sendResponse: (response?: unknown) => void
): Promise<void> {
  try {
    await validateTodoistToken(apiToken.trim());
    sendResponse({ ok: true } satisfies TodoistValidateTokenResponse);
  } catch (error) {
    sendResponse(mapTodoistError(error));
  }
}

async function handleTodoistSyncTab(
  tabId: number,
  sendResponse: (response?: unknown) => void
): Promise<void> {
  if (typeof tabId !== "number") {
    sendResponse({
      ok: false,
      error: "Missing tab id for Todoist sync.",
    } satisfies TodoistSyncTabResponse);
    return;
  }

  try {
    await runTodoistSyncForTab(tabId, { notifyIfUnconfigured: true });
    sendResponse({ ok: true } satisfies TodoistSyncTabResponse);
  } catch (error) {
    sendResponse({
      ok: false,
      error: error instanceof Error ? error.message : "Todoist sync failed.",
    } satisfies TodoistSyncTabResponse);
  }
}

async function handleTodoistCreateLinkedTask(
  apiToken: string,
  projectId: string,
  assignment: Parameters<typeof createLinkedTodoistTask>[1],
  sendResponse: (response?: unknown) => void
): Promise<void> {
  try {
    const task = await createLinkedTodoistTask(apiToken.trim(), assignment, projectId);
    sendResponse({ ok: true, task } satisfies TodoistMutationResponse);
  } catch (error) {
    sendResponse(mapTodoistError(error));
  }
}

async function handleTodoistUpdateLinkedTask(
  apiToken: string,
  taskId: string,
  assignment: Parameters<typeof updateLinkedTodoistTask>[2],
  sendResponse: (response?: unknown) => void
): Promise<void> {
  try {
    const task = await updateLinkedTodoistTask(apiToken.trim(), taskId, assignment);
    sendResponse({ ok: true, task } satisfies TodoistMutationResponse);
  } catch (error) {
    sendResponse(mapTodoistError(error));
  }
}

async function handleTodoistCompleteLinkedTask(
  apiToken: string,
  link: Parameters<typeof completeLinkedTodoistTask>[1],
  sendResponse: (response?: unknown) => void
): Promise<void> {
  try {
    await completeLinkedTodoistTask(apiToken.trim(), link);
    sendResponse({ ok: true } satisfies TodoistMutationResponse);
  } catch (error) {
    sendResponse(mapTodoistError(error));
  }
}

function mapTodoistError(
  error: unknown
): TodoistProjectsResponse | TodoistValidateTokenResponse | TodoistMutationResponse {
  if (isTodoistApiError(error)) {
    return {
      ok: false,
      error:
        error.code === "unauthorized"
          ? "Invalid Todoist API token."
          : error.message,
      code: error.code,
    };
  }

  return {
    ok: false,
    error: error instanceof Error ? error.message : "Unknown Todoist error.",
    code: "api_error",
  };
}

async function insertCodeInMainWorld(
  tabId: number,
  code: string
): Promise<EditorInsertResult> {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      func: setHackerRankEditorCodeInMainWorld,
      args: [code],
    });

    const result = results[0]?.result as EditorInsertResult | undefined;
    if (
      result &&
      typeof result.ok === "boolean" &&
      typeof result.via === "string"
    ) {
      return result;
    }
  } catch (error) {
    console.warn("[SiapDips][AI] executeScript MAIN failed:", error);
  }

  return { ok: false, via: "none" };
}

function setHackerRankEditorCodeInMainWorld(code: string): EditorInsertResult {
  const setMonacoCode = (): EditorInsertResult => {
    try {
      const w = window as unknown as {
        monaco?: {
          editor?: {
            getEditors?: () => Array<{
              getModel?: () => { setValue: (v: string) => void } | null;
              focus?: () => void;
            }>;
            getModels?: () => Array<{ setValue: (v: string) => void }>;
          };
        };
      };

      const monacoApi = w.monaco?.editor;
      const editors = monacoApi?.getEditors?.() || [];
      const firstEditor = editors[0];
      const model = firstEditor?.getModel?.();

      if (model) {
        model.setValue(code);
        firstEditor?.focus?.();
        return { ok: true, via: "monaco" };
      }

      const models = monacoApi?.getModels?.() || [];
      if (models.length > 0) {
        models[0].setValue(code);
        firstEditor?.focus?.();
        return { ok: true, via: "monaco" };
      }
    } catch (error) {
      console.warn("[SiapDips][AI] Monaco insert failed:", error);
    }

    return { ok: false, via: "none" };
  };

  const setCodeMirrorCode = (): EditorInsertResult => {
    try {
      const editors = Array.from(
        document.querySelectorAll(".CodeMirror")
      ) as Array<
        Element & {
          CodeMirror?: {
            setValue: (v: string) => void;
            refresh?: () => void;
            focus?: () => void;
          };
        }
      >;

      for (const editorElement of editors) {
        if (!editorElement?.CodeMirror) continue;
        editorElement.CodeMirror.focus?.();
        editorElement.CodeMirror.setValue(code);
        editorElement.CodeMirror.refresh?.();
        return { ok: true, via: "codemirror" };
      }
    } catch (error) {
      console.warn("[SiapDips][AI] CodeMirror insert failed:", error);
    }

    return { ok: false, via: "none" };
  };

  const setTextareaCode = (): EditorInsertResult => {
    try {
      const textarea = document.querySelector<HTMLTextAreaElement>("#codeview");
      if (!textarea) return { ok: false, via: "none" };

      textarea.value = code;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.dispatchEvent(new Event("change", { bubbles: true }));
      return { ok: true, via: "textarea" };
    } catch (error) {
      console.warn("[SiapDips][AI] Textarea insert failed:", error);
      return { ok: false, via: "none" };
    }
  };

  const monacoResult = setMonacoCode();
  if (monacoResult.ok) return monacoResult;

  const codeMirrorResult = setCodeMirrorCode();
  if (codeMirrorResult.ok) return codeMirrorResult;

  const textareaResult = setTextareaCode();
  if (textareaResult.ok) return textareaResult;

  return { ok: false, via: "none" };
}
