import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import {
  STORAGE_KEY_TODOIST_API_TOKEN,
  STORAGE_KEY_TODOIST_IGNORE_OVERDUE,
  STORAGE_KEY_TODOIST_PROJECT_ID,
  type TodoistFetchProjectsMessage,
  type TodoistProjectSummary,
  type TodoistProjectsResponse,
  type TodoistValidateTokenMessage,
  type TodoistValidateTokenResponse,
} from "@/lib/todoist/shared";

type ProjectStatusKind =
  | "idle"
  | "loading"
  | "success"
  | "empty"
  | "invalid_token"
  | "error";

interface ProjectStatus {
  kind: ProjectStatusKind;
  message: string;
}

const DEFAULT_PROJECT_STATUS: ProjectStatus = {
  kind: "idle",
  message: "Save a valid Todoist token to load your projects.",
};

const TodoistSettings = () => {
  const [apiToken, setApiToken] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [projects, setProjects] = useState<TodoistProjectSummary[]>([]);
  const [isSavingToken, setIsSavingToken] = useState<boolean>(false);
  const [isFetchingProjects, setIsFetchingProjects] = useState<boolean>(false);
  const [ignoreOverdue, setIgnoreOverdue] = useState<boolean>(false);
  const [projectStatus, setProjectStatus] =
    useState<ProjectStatus>(DEFAULT_PROJECT_STATUS);

  const sendMessage = async <TResponse,>(message: unknown): Promise<TResponse> => {
    return (await chrome.runtime.sendMessage(message)) as TResponse;
  };

  const applyProjectResponse = (
    response: TodoistProjectsResponse,
    options: { showSuccessToast?: boolean } = {}
  ) => {
    if (!response.ok) {
      setProjects([]);
      setProjectStatus({
        kind: response.code === "unauthorized" ? "invalid_token" : "error",
        message: response.error || "Failed to load Todoist projects.",
      });
      toast.error(response.error || "Failed to load Todoist projects.");
      return;
    }

    const nextProjects = response.projects || [];
    setProjects(nextProjects);

    if (!nextProjects.length) {
      setProjectStatus({
        kind: "empty",
        message: "No Todoist projects were returned for this account.",
      });
      if (options.showSuccessToast !== false) {
        toast.success("Loaded 0 projects");
      }
      return;
    }

    setProjectStatus({
      kind: "success",
      message: `Loaded ${nextProjects.length} Todoist project${
        nextProjects.length === 1 ? "" : "s"
      }.`,
    });

    if (options.showSuccessToast !== false) {
      toast.success(`Loaded ${nextProjects.length} projects`);
    }
  };

  useEffect(() => {
    chrome.storage.local.get(
      [
        STORAGE_KEY_TODOIST_API_TOKEN,
        STORAGE_KEY_TODOIST_PROJECT_ID,
        STORAGE_KEY_TODOIST_IGNORE_OVERDUE,
      ],
      async (result: { [key: string]: string | boolean }) => {
        const savedToken = String(result[STORAGE_KEY_TODOIST_API_TOKEN] || "");
        const savedProjectId = String(
          result[STORAGE_KEY_TODOIST_PROJECT_ID] || ""
        );
        const savedIgnoreOverdue = Boolean(
          result[STORAGE_KEY_TODOIST_IGNORE_OVERDUE]
        );

        setApiToken(savedToken);
        setProjectId(savedProjectId);
        setIgnoreOverdue(savedIgnoreOverdue);

        if (!savedToken.trim()) {
          return;
        }

        setIsFetchingProjects(true);
        setProjectStatus({
          kind: "loading",
          message: "Loading Todoist projects...",
        });

        try {
          const response = await sendMessage<TodoistProjectsResponse>({
            type: "todoistFetchProjects",
            apiToken: savedToken.trim(),
          } satisfies TodoistFetchProjectsMessage);
          applyProjectResponse(response, { showSuccessToast: false });
        } catch (error) {
          console.error("Error fetching Todoist projects:", error);
          setProjects([]);
          setProjectStatus({
            kind: "error",
            message: "Failed to load Todoist projects. Check your connection.",
          });
        } finally {
          setIsFetchingProjects(false);
        }
      }
    );
  }, []);

  const fetchProjects = async (
    tokenOverride = apiToken.trim(),
    options: { showSuccessToast?: boolean } = {}
  ) => {
    if (!tokenOverride) {
      setProjects([]);
      setProjectStatus(DEFAULT_PROJECT_STATUS);
      return;
    }

    setIsFetchingProjects(true);
    setProjectStatus({
      kind: "loading",
      message: "Loading Todoist projects...",
    });

    try {
      const response = await sendMessage<TodoistProjectsResponse>({
        type: "todoistFetchProjects",
        apiToken: tokenOverride,
      } satisfies TodoistFetchProjectsMessage);

      applyProjectResponse(response, options);
    } catch (error) {
      console.error("Error fetching Todoist projects:", error);
      setProjects([]);
      setProjectStatus({
        kind: "error",
        message: "Failed to load Todoist projects. Check your connection.",
      });
      toast.error("Failed to load Todoist projects. Check your connection.");
    } finally {
      setIsFetchingProjects(false);
    }
  };

  const handleSaveApiToken = async () => {
    const trimmedToken = apiToken.trim();
    if (!trimmedToken) {
      toast.error("API token cannot be empty");
      return;
    }

    setIsSavingToken(true);
    setProjectStatus({
      kind: "loading",
      message: "Validating Todoist token...",
    });

    try {
      const validation = await sendMessage<TodoistValidateTokenResponse>({
        type: "todoistValidateToken",
        apiToken: trimmedToken,
      } satisfies TodoistValidateTokenMessage);

      if (!validation.ok) {
        setProjectStatus({
          kind: validation.code === "unauthorized" ? "invalid_token" : "error",
          message: validation.error || "Todoist token validation failed.",
        });
        toast.error(validation.error || "Todoist token validation failed.");
        return;
      }

      await chrome.storage.local.set({
        [STORAGE_KEY_TODOIST_API_TOKEN]: trimmedToken,
      });

      toast.success("Todoist API token saved");
      await fetchProjects(trimmedToken, { showSuccessToast: true });
    } catch (error) {
      console.error("Error validating Todoist token:", error);
      setProjectStatus({
        kind: "error",
        message: "Failed to validate Todoist token.",
      });
      toast.error("Failed to validate Todoist token.");
    } finally {
      setIsSavingToken(false);
    }
  };

  const handleProjectChange = (value: string) => {
    setProjectId(value);
    chrome.storage.local.set({ [STORAGE_KEY_TODOIST_PROJECT_ID]: value }, () => {
      toast.success("Todoist project saved");
    });
  };

  const handleIgnoreOverdueChange = (checked: boolean) => {
    setIgnoreOverdue(checked);
    chrome.storage.local.set(
      { [STORAGE_KEY_TODOIST_IGNORE_OVERDUE]: checked },
      () => {
        toast.success(
          checked
            ? "Overdue Moodle items will be ignored"
            : "Overdue Moodle items will be synced"
        );
      }
    );
  };

  const handleClearSettings = () => {
    chrome.storage.local.remove(
      [
        STORAGE_KEY_TODOIST_API_TOKEN,
        STORAGE_KEY_TODOIST_PROJECT_ID,
        STORAGE_KEY_TODOIST_IGNORE_OVERDUE,
      ],
      () => {
        setApiToken("");
        setProjectId("");
        setProjects([]);
        setIgnoreOverdue(false);
        setProjectStatus(DEFAULT_PROJECT_STATUS);
        toast.success("Todoist settings cleared");
      }
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Todoist Integration</CardTitle>
        <CardDescription>
          Configure your Todoist API token and global project for Moodle sync.
          Get your API token from{" "}
          <a
            href="https://todoist.com/app/settings/integrations/developer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Todoist Settings
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="todoist-api-token">API Token</Label>
          <div className="flex gap-2">
            <Input
              id="todoist-api-token"
              type="password"
              placeholder="Enter your Todoist API token"
              value={apiToken}
              onChange={(event) => setApiToken(event.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleSaveApiToken}
              disabled={isSavingToken || !apiToken.trim()}
            >
              {isSavingToken ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => void fetchProjects()}
            disabled={isFetchingProjects || !apiToken.trim()}
            variant="outline"
            className="w-full"
          >
            {isFetchingProjects ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching Projects...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Fetch Projects
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">{projectStatus.message}</p>
        </div>

        {projects.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="todoist-project">Select Project</Label>
            <Select value={projectId} onValueChange={handleProjectChange}>
              <SelectTrigger id="todoist-project" className="w-full">
                <SelectValue placeholder="- Select a project -" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.inboxProject ? "Inbox - " : ""}
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center justify-between space-x-2 pt-2">
          <div className="space-y-0.5">
            <Label htmlFor="ignore-overdue" className="text-base">
              Ignore Overdue Tasks
            </Label>
            <p className="text-sm text-muted-foreground">
              Skip syncing Moodle items that are already overdue
            </p>
          </div>
          <Switch
            id="ignore-overdue"
            checked={ignoreOverdue}
            onCheckedChange={handleIgnoreOverdueChange}
          />
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={handleClearSettings}
            variant="destructive"
            className="w-full"
          >
            Clear All Settings
          </Button>
        </div>

        <div className="pt-2 text-sm text-muted-foreground">
          <p>
            Status:{" "}
            {apiToken && projectId
              ? "Configured"
              : apiToken
              ? "Please select a Todoist project"
              : "Not configured"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoistSettings;
