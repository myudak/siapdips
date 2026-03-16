import "./App.css";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  AlarmClock,
  ArrowUpRight,
  BookOpenCheck,
  CalendarClock,
  LayoutDashboard,
  ListTodo,
  RefreshCw,
  Settings2,
} from "lucide-react";
import ModeToggle from "@/pages/option/components/Navbar/ModeToggle";
import {
  DEFAULT_NEW_TAB_DASHBOARD_PREFS,
  NEW_TAB_MODULE_LABELS,
  STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED,
  STORAGE_KEY_NEW_TAB_DASHBOARD_PREFS,
  getNewTabAccentVariables,
  normalizeNewTabDashboardPrefs,
  type KulonAssignment,
  type KulonDashboardDataMessage,
  type KulonDashboardDataResponse,
  type KulonDashboardRefreshMessage,
  type KulonDashboardRefreshResponse,
  type NewTabDashboardPrefs,
  type NewTabModuleId,
} from "@/lib/kulon/shared";

interface LocalTodo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <NewTabDashboard />
      <Toaster />
    </ThemeProvider>
  );
}

function NewTabDashboard() {
  const [enabled, setEnabled] = useState(false);
  const [assignments, setAssignments] = useState<KulonAssignment[]>([]);
  const [linkedSourceKeys, setLinkedSourceKeys] = useState<string[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [localTodos, setLocalTodos] = useState<LocalTodo[]>([]);
  const [prefs, setPrefs] = useState<NewTabDashboardPrefs>(
    DEFAULT_NEW_TAB_DASHBOARD_PREFS
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    void hydrate();

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName !== "local") {
        return;
      }

      if (
        changes.todo ||
        changes[STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED] ||
        changes[STORAGE_KEY_NEW_TAB_DASHBOARD_PREFS] ||
        changes.kulonAssignmentsCache ||
        changes.kulonAssignmentsLastSyncedAt ||
        changes.todoistTaskLinks
      ) {
        void hydrate();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const hydrate = async () => {
    try {
      const [dashboardResponse, storageResult] = await Promise.all([
        chrome.runtime.sendMessage({
          type: "kulonDashboardGetData",
        } satisfies KulonDashboardDataMessage) as Promise<KulonDashboardDataResponse>,
        chrome.storage.local.get(["todo", STORAGE_KEY_NEW_TAB_DASHBOARD_PREFS]),
      ]);

      if (dashboardResponse.ok) {
        setEnabled(Boolean(dashboardResponse.enabled));
        setAssignments(dashboardResponse.assignments || []);
        setLinkedSourceKeys(dashboardResponse.linkedSourceKeys || []);
        setLastSyncedAt(dashboardResponse.lastSyncedAt || null);
      }

      setPrefs(
        normalizeNewTabDashboardPrefs(
          storageResult[STORAGE_KEY_NEW_TAB_DASHBOARD_PREFS]
        )
      );
      setLocalTodos(
        Array.isArray(storageResult.todo)
          ? (storageResult.todo as LocalTodo[])
          : []
      );
    } catch (error) {
      console.error("Failed to hydrate new tab dashboard:", error);
      toast.error("Failed to load dashboard data.");
    }
  };

  const assignmentGroups = useMemo(
    () => groupAssignments(assignments),
    [assignments]
  );
  const pendingLocalTodoCount = useMemo(
    () => localTodos.filter((todo) => !todo.completed).length,
    [localTodos]
  );
  const visibleModules = useMemo(
    () =>
      prefs.moduleOrder.filter(
        (moduleId) => !prefs.hiddenModules.includes(moduleId)
      ),
    [prefs.hiddenModules, prefs.moduleOrder]
  );

  const handleEnableDashboard = async () => {
    await chrome.storage.local.set({
      [STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED]: true,
    });
    setEnabled(true);
    toast.success("New tab dashboard enabled");
    void hydrate();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = (await chrome.runtime.sendMessage({
        type: "kulonDashboardRefreshFromActiveTab",
      } satisfies KulonDashboardRefreshMessage)) as KulonDashboardRefreshResponse;

      if (!response.ok) {
        toast.error(response.error || "Failed to refresh Kulon assignments.");
      } else if (!response.refreshed) {
        toast.info("No new Kulon assignments were captured.");
      } else {
        toast.success("Kulon assignments refreshed from an open Kulon tab.");
      }

      setEnabled(Boolean(response.enabled));
      setAssignments(response.assignments || []);
      setLinkedSourceKeys(response.linkedSourceKeys || []);
      setLastSyncedAt(response.lastSyncedAt || null);
    } catch (error) {
      console.error("Failed to refresh dashboard:", error);
      toast.error("Failed to refresh Kulon assignments.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const accentVariables = getNewTabAccentVariables(prefs.accentTone);

  if (!enabled) {
    return (
      <div className="newtab-shell flex min-h-screen items-center justify-center px-6 py-10">
        <Card className="w-full max-w-2xl border-border/60 bg-background/90 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-background/80 shadow-sm">
              <LayoutDashboard className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-semibold tracking-tight">
                New Tab Dashboard is off
              </CardTitle>
              <CardDescription className="mx-auto max-w-xl text-base">
                The extension still owns the new tab page, but the dashboard is currently disabled.
                Turn it on to use your saved custom layout and visual style here.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => void handleEnableDashboard()}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Enable Dashboard
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  chrome.tabs.create({
                    url: chrome.runtime.getURL("option.html#newTabDashboard"),
                  })
                }
              >
                <Settings2 className="mr-2 h-4 w-4" />
                Open Settings
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  chrome.tabs.create({ url: "https://kulon2.undip.ac.id/my/" })
                }
              >
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Open Kulon
              </Button>
            </div>
            {lastSyncedAt && (
              <p className="text-center text-sm text-muted-foreground">
                Last cached Kulon refresh: {formatLastSyncedAt(lastSyncedAt)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="newtab-shell min-h-screen px-4 py-5 sm:px-6 lg:px-8"
      data-background-style={prefs.backgroundStyle}
      data-density={prefs.density}
      data-typography={prefs.typography}
      style={accentVariables}
    >
      <div className="mx-auto flex max-w-7xl flex-col" style={{ gap: "var(--newtab-gap)" }}>
        {visibleModules.length === 0 ? (
          <div className="newtab-empty-card mx-auto w-full max-w-2xl p-8 text-center shadow-xl backdrop-blur-sm">
            <div className="space-y-3">
              <h1 className="newtab-heading text-3xl font-semibold tracking-tight">
                Everything is hidden right now
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Your dashboard layout is still saved. Open Settings and turn at least one module back on.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  onClick={() =>
                    chrome.tabs.create({
                      url: chrome.runtime.getURL("option.html#newTabDashboard"),
                    })
                  }
                >
                  <Settings2 className="mr-2 h-4 w-4" />
                  Open Settings
                </Button>
                <Button variant="secondary" onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") })}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Reload New Tab
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="newtab-module-grid">
            {visibleModules.map((moduleId) => (
              <div
                key={moduleId}
                className={`newtab-module ${
                  moduleId === "hero" || moduleId === "summary"
                    ? "newtab-module--wide"
                    : ""
                }`}
              >
                {renderModule({
                  moduleId,
                  assignmentGroups,
                  assignments,
                  linkedSourceKeys,
                  pendingLocalTodoCount,
                  localTodos,
                  lastSyncedAt,
                  isRefreshing,
                  onRefresh: handleRefresh,
                })}
              </div>
            ))}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

function renderModule({
  moduleId,
  assignmentGroups,
  assignments,
  linkedSourceKeys,
  pendingLocalTodoCount,
  localTodos,
  lastSyncedAt,
  isRefreshing,
  onRefresh,
}: {
  moduleId: NewTabModuleId;
  assignmentGroups: ReturnType<typeof groupAssignments>;
  assignments: KulonAssignment[];
  linkedSourceKeys: string[];
  pendingLocalTodoCount: number;
  localTodos: LocalTodo[];
  lastSyncedAt: string | null;
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
}) {
  switch (moduleId) {
    case "hero":
      return (
        <section className="newtab-panel newtab-panel--hero">
          <div className="newtab-panel-content flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="newtab-accent-kicker text-sm font-medium uppercase">
                Siap Dips / New Tab
              </div>
              <div className="space-y-2">
                <h1 className="newtab-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                  Kulon assignments, arranged your way.
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Your cached Kulon tasks and local todos, with layout and visual controls managed from Settings.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ModeToggle />
              <Button variant="outline" onClick={() => void onRefresh()} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh From Open Kulon Tab
              </Button>
              <Button
                variant="secondary"
                onClick={() => chrome.tabs.create({ url: "https://kulon2.undip.ac.id/my/" })}
              >
                <BookOpenCheck className="mr-2 h-4 w-4" />
                Open Kulon
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  chrome.tabs.create({
                    url: chrome.runtime.getURL("option.html#newTabDashboard"),
                  })
                }
              >
                <Settings2 className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </section>
      );
    case "summary":
      return (
        <section className="newtab-panel">
          <div className="newtab-panel-content space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="newtab-module-title text-xl font-semibold">Dashboard Summary</h2>
                <p className="text-sm text-muted-foreground">
                  {lastSyncedAt
                    ? `Last updated ${formatLastSyncedAt(lastSyncedAt)}`
                    : "Visit Kulon /my/ to create the first cache."}
                </p>
              </div>
              <Badge className="newtab-accent-chip rounded-full px-3 py-1">
                {assignments.length} cached Kulon item{assignments.length === 1 ? "" : "s"}
              </Badge>
            </div>
            <div className="newtab-summary-grid">
              <SummaryCard label="Today" value={assignmentGroups.today.length} icon={AlarmClock} />
              <SummaryCard label="Upcoming" value={assignmentGroups.upcoming.length} icon={CalendarClock} />
              <SummaryCard label="Overdue" value={assignmentGroups.overdue.length} icon={BookOpenCheck} />
              <SummaryCard label="Local Todo" value={pendingLocalTodoCount} icon={ListTodo} />
            </div>
          </div>
        </section>
      );
    case "kulon":
      return (
        <section className="newtab-panel">
          <div className="newtab-panel-content space-y-6">
            <div>
              <h2 className="newtab-module-title text-2xl font-semibold">{NEW_TAB_MODULE_LABELS.kulon}</h2>
              <p className="text-sm text-muted-foreground">
                Grouped by urgency from the latest successful scrape.
              </p>
            </div>
            <AssignmentSection
              title="Today"
              assignments={assignmentGroups.today}
              linkedSourceKeys={linkedSourceKeys}
              emptyLabel="No assignments due today."
            />
            <AssignmentSection
              title="Upcoming"
              assignments={assignmentGroups.upcoming}
              linkedSourceKeys={linkedSourceKeys}
              emptyLabel="No upcoming assignments in cache."
            />
            <AssignmentSection
              title="Overdue"
              assignments={assignmentGroups.overdue}
              linkedSourceKeys={linkedSourceKeys}
              emptyLabel="Nothing overdue right now."
            />

            {assignments.length === 0 && (
              <div className="newtab-empty-card p-6 text-center">
                <p className="text-base font-medium">No cached Kulon assignments yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Open Kulon `/my/` once, then come back here.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => chrome.tabs.create({ url: "https://kulon2.undip.ac.id/my/" })}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Open Kulon Assignments
                </Button>
              </div>
            )}
          </div>
        </section>
      );
    case "localTodo":
      return (
        <section className="newtab-panel">
          <div className="newtab-panel-content space-y-4">
            <div>
              <h2 className="newtab-module-title text-2xl font-semibold">{NEW_TAB_MODULE_LABELS.localTodo}</h2>
              <p className="text-sm text-muted-foreground">
                Read-only preview of the todo items stored by the popup card.
              </p>
            </div>
            {localTodos.length === 0 ? (
              <div className="newtab-empty-card p-6 text-center text-sm text-muted-foreground">
                No local todos saved yet. Add one from the popup Todo card.
              </div>
            ) : (
              <ScrollArea className="h-[420px] pr-4">
                <div className="space-y-3">
                  {localTodos.map((todo, index) => (
                    <div key={todo.id}>
                      <div className="newtab-task-card flex items-start gap-3 p-4">
                        <div
                          className={`mt-1 h-3 w-3 rounded-full ${
                            todo.completed ? "bg-emerald-500" : "bg-sky-500"
                          }`}
                        />
                        <div className="space-y-1">
                          <p
                            className={`text-sm font-medium ${
                              todo.completed ? "text-muted-foreground line-through" : ""
                            }`}
                          >
                            {todo.text}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {todo.completed ? "Completed in popup" : "Pending in popup"}
                          </p>
                        </div>
                      </div>
                      {index < localTodos.length - 1 && <Separator className="newtab-muted-line my-3" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </section>
      );
    default:
      return null;
  }
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="newtab-summary-card flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="newtab-number mt-1 text-3xl font-semibold tracking-tight">{value}</p>
      </div>
      <div className="newtab-summary-icon rounded-2xl p-3">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

function AssignmentSection({
  title,
  assignments,
  linkedSourceKeys,
  emptyLabel,
}: {
  title: string;
  assignments: KulonAssignment[];
  linkedSourceKeys: string[];
  emptyLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="newtab-module-title text-lg font-semibold">{title}</h3>
        <Badge variant="outline" className="rounded-full px-3 py-1">
          {assignments.length}
        </Badge>
      </div>
      {assignments.length === 0 ? (
        <div className="newtab-empty-card p-4 text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => {
            const linked = linkedSourceKeys.includes(assignment.sourceKey);
            return (
              <div key={assignment.sourceKey} className="newtab-task-card p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold leading-tight">{assignment.title}</p>
                      {linked && (
                        <Badge className="newtab-linked-badge rounded-full">
                          Todoist linked
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {assignment.course || "Kulon task"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due {formatDue(assignment.dueIso)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => chrome.tabs.create({ url: assignment.url })}
                      disabled={!assignment.url}
                    >
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Open
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function groupAssignments(assignments: KulonAssignment[]) {
  const now = new Date();
  const startOfTomorrow = new Date(now);
  startOfTomorrow.setHours(24, 0, 0, 0);

  return assignments.reduce(
    (groups, assignment) => {
      const dueDate = new Date(assignment.dueIso);
      const isOverdue = dueDate.getTime() < now.getTime();
      const isToday = !isOverdue && dueDate.getTime() < startOfTomorrow.getTime();

      if (isOverdue) {
        groups.overdue.push(assignment);
      } else if (isToday) {
        groups.today.push(assignment);
      } else {
        groups.upcoming.push(assignment);
      }

      return groups;
    },
    {
      today: [] as KulonAssignment[],
      upcoming: [] as KulonAssignment[],
      overdue: [] as KulonAssignment[],
    }
  );
}

function formatDue(dueIso: string): string {
  return new Date(dueIso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatLastSyncedAt(value: string): string {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default App;
