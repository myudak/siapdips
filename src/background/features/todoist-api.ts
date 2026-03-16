import {
  TODOIST_API_BASE,
  type TodoistListResponse,
  type TodoistProjectSummary,
  type TodoistTask,
} from "@/lib/todoist/shared";

interface TodoistProjectApiModel {
  id: string;
  name: string;
  inbox_project?: boolean;
}

interface TodoistRequestOptions {
  method?: "GET" | "POST";
  token: string;
  searchParams?: Record<string, string | undefined>;
  body?: unknown;
  parseJson?: boolean;
}

export class TodoistApiError extends Error {
  status: number;
  code: "unauthorized" | "network_error" | "api_error";

  constructor(
    message: string,
    status: number,
    code: "unauthorized" | "network_error" | "api_error"
  ) {
    super(message);
    this.name = "TodoistApiError";
    this.status = status;
    this.code = code;
  }
}

async function todoistRequest<T>(
  path: string,
  { method = "GET", token, searchParams, body, parseJson = true }: TodoistRequestOptions
): Promise<T> {
  const url = new URL(`${TODOIST_API_BASE}${path}`);

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    throw new TodoistApiError(
      error instanceof Error ? error.message : "Network request failed",
      0,
      "network_error"
    );
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new TodoistApiError(
      errorText || `Todoist request failed with status ${response.status}`,
      response.status,
      response.status === 401 ? "unauthorized" : "api_error"
    );
  }

  if (!parseJson) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function fetchTodoistPaginated<T>(
  path: string,
  token: string,
  baseParams: Record<string, string | undefined> = {}
): Promise<TodoistListResponse<T>> {
  const results: T[] = [];
  let cursor: string | null = null;

  do {
    const page = await todoistRequest<TodoistListResponse<T>>(path, {
      token,
      searchParams: {
        ...baseParams,
        limit: baseParams.limit ?? "200",
        ...(cursor ? { cursor } : {}),
      },
    });

    results.push(...page.results);
    cursor = page.next_cursor;
  } while (cursor);

  return {
    results,
    next_cursor: null,
  };
}

export function isTodoistApiError(error: unknown): error is TodoistApiError {
  return error instanceof TodoistApiError;
}

export async function validateTodoistToken(apiToken: string): Promise<void> {
  await todoistRequest<TodoistListResponse<TodoistProjectApiModel>>("/projects", {
    token: apiToken,
    searchParams: { limit: "1" },
  });
}

export async function fetchTodoistProjects(
  apiToken: string
): Promise<TodoistListResponse<TodoistProjectSummary>> {
  const response = await fetchTodoistPaginated<TodoistProjectApiModel>(
    "/projects",
    apiToken
  );

  return {
    results: response.results.map((project) => ({
      id: project.id,
      name: project.name,
      inboxProject: Boolean(project.inbox_project),
    })),
    next_cursor: response.next_cursor,
  };
}

export async function fetchTodoistTasksForProject(
  apiToken: string,
  projectId: string
): Promise<TodoistTask[]> {
  const response = await fetchTodoistPaginated<TodoistTask>("/tasks", apiToken, {
    project_id: projectId,
  });

  return response.results;
}

export async function createTodoistTask(
  apiToken: string,
  payload: {
    content: string;
    description?: string;
    project_id: string;
    due_datetime?: string;
  }
): Promise<TodoistTask> {
  return todoistRequest<TodoistTask>("/tasks", {
    method: "POST",
    token: apiToken,
    body: payload,
  });
}

export async function updateTodoistTask(
  apiToken: string,
  taskId: string,
  payload: {
    content?: string;
    description?: string;
    due_datetime?: string;
  }
): Promise<TodoistTask> {
  return todoistRequest<TodoistTask>(`/tasks/${taskId}`, {
    method: "POST",
    token: apiToken,
    body: payload,
  });
}

export async function closeTodoistTask(
  apiToken: string,
  taskId: string
): Promise<void> {
  await todoistRequest<void>(`/tasks/${taskId}/close`, {
    method: "POST",
    token: apiToken,
    parseJson: false,
  });
}
