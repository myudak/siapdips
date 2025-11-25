import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";

const STORAGE_KEY_API_TOKEN = "todoistApiToken";
const STORAGE_KEY_PROJECT_ID = "todoistProjectId";
const TODOIST_API_BASE = "https://api.todoist.com/rest/v2";

interface TodoistProject {
  id: string;
  name: string;
  color: string;
  is_inbox_project: boolean;
  is_shared: boolean;
}

const TodoistSettings = () => {
  const [apiToken, setApiToken] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [projects, setProjects] = useState<TodoistProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingProjects, setIsFetchingProjects] = useState<boolean>(false);

  // Load saved settings on mount
  useEffect(() => {
    chrome.storage.local.get(
      [STORAGE_KEY_API_TOKEN, STORAGE_KEY_PROJECT_ID],
      (result: { [key: string]: string }) => {
        if (result[STORAGE_KEY_API_TOKEN]) {
          setApiToken(result[STORAGE_KEY_API_TOKEN]);
        }
        if (result[STORAGE_KEY_PROJECT_ID]) {
          setProjectId(result[STORAGE_KEY_PROJECT_ID]);
        }
      }
    );
  }, []);

  // Auto-fetch projects when API token changes (and is not empty)
  useEffect(() => {
    if (apiToken && apiToken.trim().length > 0) {
      // Check if we have a saved token and it matches
      chrome.storage.local.get([STORAGE_KEY_API_TOKEN], (result) => {
        if (result[STORAGE_KEY_API_TOKEN] === apiToken) {
          fetchProjects();
        }
      });
    } else {
      setProjects([]);
      setProjectId("");
    }
  }, [apiToken]);

  const fetchProjects = async () => {
    if (!apiToken || apiToken.trim() === "") {
      toast.error("Please enter an API token first");
      return;
    }

    setIsFetchingProjects(true);
    try {
      const response = await fetch(`${TODOIST_API_BASE}/projects`, {
        headers: {
          Authorization: `Bearer ${apiToken.trim()}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Invalid API token");
        } else {
          toast.error(`Failed to fetch projects: ${response.status}`);
        }
        setProjects([]);
        return;
      }

      const data: TodoistProject[] = await response.json();
      setProjects(data);
      toast.success(`Loaded ${data.length} projects`);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects. Check your network connection.");
      setProjects([]);
    } finally {
      setIsFetchingProjects(false);
    }
  };

  const handleSaveApiToken = () => {
    if (!apiToken || apiToken.trim() === "") {
      toast.error("API token cannot be empty");
      return;
    }

    setIsLoading(true);
    chrome.storage.local.set({ [STORAGE_KEY_API_TOKEN]: apiToken.trim() }, () => {
      setIsLoading(false);
      toast.success("API token saved");
      fetchProjects();
    });
  };

  const handleProjectChange = (value: string) => {
    setProjectId(value);
    chrome.storage.local.set({ [STORAGE_KEY_PROJECT_ID]: value }, () => {
      toast.success("Project saved");
    });
  };

  const handleClearSettings = () => {
    chrome.storage.local.remove(
      [STORAGE_KEY_API_TOKEN, STORAGE_KEY_PROJECT_ID],
      () => {
        setApiToken("");
        setProjectId("");
        setProjects([]);
        toast.success("Settings cleared");
      }
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Todoist Integration</CardTitle>
        <CardDescription>
          Configure Todoist API token and select a project for syncing Kulon2 assignments.
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
        {/* API Token Input */}
        <div className="space-y-2">
          <Label htmlFor="todoist-api-token">API Token</Label>
          <div className="flex gap-2">
            <Input
              id="todoist-api-token"
              type="password"
              placeholder="Enter your Todoist API token"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleSaveApiToken}
              disabled={isLoading || !apiToken.trim()}
            >
              {isLoading ? (
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

        {/* Fetch Projects Button */}
        <div className="space-y-2">
          <Button
            onClick={fetchProjects}
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
        </div>

        {/* Project Selector */}
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
                    {project.is_inbox_project && "📥 "}
                    {project.is_shared && "👥 "}
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Clear Settings */}
        <div className="pt-4 border-t">
          <Button
            onClick={handleClearSettings}
            variant="destructive"
            className="w-full"
          >
            Clear All Settings
          </Button>
        </div>

        {/* Status Info */}
        <div className="pt-2 text-sm text-muted-foreground">
          <p>
            Status:{" "}
            {apiToken && projectId
              ? "✅ Configured"
              : apiToken
              ? "⚠️ Please select a project"
              : "❌ Not configured"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoistSettings;
