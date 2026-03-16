import type { KulonAssignment } from "@/lib/kulon/shared";

export const TODOIST_API_BASE = "https://api.todoist.com/api/v1";

export const STORAGE_KEY_TODOIST_API_TOKEN = "todoistApiToken";
export const STORAGE_KEY_TODOIST_PROJECT_ID = "todoistProjectId";
export const STORAGE_KEY_TODOIST_IGNORE_OVERDUE = "todoistIgnoreOverdue";
export const STORAGE_KEY_TODOIST_TASK_LINKS = "todoistTaskLinks";

export interface TodoistListResponse<T> {
  results: T[];
  next_cursor: string | null;
}

export interface TodoistProjectSummary {
  id: string;
  name: string;
  inboxProject: boolean;
}

export interface TodoistDue {
  date?: string | null;
  datetime?: string | null;
  timezone?: string | null;
}

export interface TodoistTask {
  id: string;
  content: string;
  description?: string;
  due?: TodoistDue | null;
  project_id: string;
  completed_at?: string | null;
  checked?: boolean;
}

export interface TodoistTaskLink {
  sourceKey: string;
  todoistTaskId: string;
  projectId: string;
  lastSyncedAt: string;
}

export type TodoistTaskLinkMap = Record<string, TodoistTaskLink>;
export type TodoistSyncSourceItem = KulonAssignment;

export interface TodoistFetchProjectsMessage {
  type: "todoistFetchProjects";
  apiToken: string;
}

export interface TodoistValidateTokenMessage {
  type: "todoistValidateToken";
  apiToken: string;
}

export interface TodoistSyncTabMessage {
  type: "todoistSyncTab";
  tabId: number;
}

export interface TodoistCreateLinkedTaskMessage {
  type: "todoistCreateLinkedTask";
  apiToken: string;
  projectId: string;
  assignment: TodoistSyncSourceItem;
}

export interface TodoistUpdateLinkedTaskMessage {
  type: "todoistUpdateLinkedTask";
  apiToken: string;
  taskId: string;
  assignment: TodoistSyncSourceItem;
}

export interface TodoistCompleteLinkedTaskMessage {
  type: "todoistCompleteLinkedTask";
  apiToken: string;
  link: TodoistTaskLink;
}

export type TodoistRuntimeMessage =
  | TodoistFetchProjectsMessage
  | TodoistValidateTokenMessage
  | TodoistSyncTabMessage
  | TodoistCreateLinkedTaskMessage
  | TodoistUpdateLinkedTaskMessage
  | TodoistCompleteLinkedTaskMessage;

export interface TodoistProjectsResponse {
  ok: boolean;
  projects?: TodoistProjectSummary[];
  error?: string;
  code?: "unauthorized" | "network_error" | "api_error";
}

export interface TodoistValidateTokenResponse {
  ok: boolean;
  error?: string;
  code?: "unauthorized" | "network_error" | "api_error";
}

export interface TodoistSyncTabResponse {
  ok: boolean;
  error?: string;
}

export interface TodoistMutationResponse {
  ok: boolean;
  task?: TodoistTask;
  error?: string;
  code?: "unauthorized" | "network_error" | "api_error";
}
