import "./App.css";
import { useEffect, useMemo, useState, useRef } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  AlertTriangle,
  BookOpenCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  LayoutDashboard,
  ListTodo,
  MapPin,
  RefreshCw,
  Search,
  Settings2,
  TerminalSquare,
  UserCircle,
  X,
} from "lucide-react";
import NewTabDashboardSettingsEditor from "@/components/NewTabDashboardSettingsEditor";
import {
  STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED,
  type KulonAssignment,
  type KulonDashboardDataMessage,
  type KulonDashboardDataResponse,
  type KulonDashboardRefreshMessage,
  type KulonDashboardRefreshResponse,
} from "@/lib/kulon/shared";

interface LocalTodo {
  id: number;
  text: string;
  completed: boolean;
}

interface ScheduleItem {
  mataKuliah: string;
  msTeams: string;
  ruang: string;
  sks: number;
  waktuMulai: string;
  waktuSelesai: string;
}

function App() {
  return (
    <>
      <NewTabDashboard />
      <Toaster />
    </>
  );
}

function NewTabDashboard() {
  const [enabled, setEnabled] = useState(false);
  const [assignments, setAssignments] = useState<KulonAssignment[]>([]);
  const [linkedSourceKeys, setLinkedSourceKeys] = useState<string[]>([]);
  const [localTodos, setLocalTodos] = useState<LocalTodo[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [profileName, setProfileName] = useState<string>("Student");
  const [ipkLocal, setIpkLocal] = useState<string>("0.00");
  const [profileNim, setProfileNim] = useState<string>("NIM");
  const [profileProdi, setProfileProdi] = useState<string>("PRODI");
  const [scheduleData, setScheduleData] = useState<Record<string, ScheduleItem[]> | null>(null);

  const [isIpkVisible, setIsIpkVisible] = useState(() => localStorage.getItem('brutal_ipk_visible') !== 'false');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (enabled && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [enabled]);

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
        changes.kulonAssignmentsCache ||
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
        chrome.storage.local.get(["todo", "profileName", "ipkLocal", "profileNim", "profileProdi", "scheduleData"]),
      ]);

      if (dashboardResponse.ok) {
        setEnabled(Boolean(dashboardResponse.enabled));
        setAssignments(dashboardResponse.assignments || []);
        setLinkedSourceKeys(dashboardResponse.linkedSourceKeys || []);
      }

      setLocalTodos(
        Array.isArray(storageResult.todo)
          ? (storageResult.todo as LocalTodo[])
          : []
      );

      if (storageResult.profileName) setProfileName(storageResult.profileName);
      if (storageResult.ipkLocal) setIpkLocal(storageResult.ipkLocal);
      if (storageResult.profileNim) setProfileNim(storageResult.profileNim);
      if (storageResult.profileProdi) setProfileProdi(storageResult.profileProdi);
      if (storageResult.scheduleData) setScheduleData(storageResult.scheduleData);
    } catch (error) {
      console.error("Failed to hydrate new tab dashboard:", error);
      toast.error("Failed to load dashboard data.");
    }
  };

  const assignmentGroups = useMemo(
    () => groupAssignments(assignments),
    [assignments]
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
    } catch (error) {
      console.error("Failed to refresh dashboard:", error);
      toast.error("Failed to refresh Kulon assignments.");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!enabled) {
    return (
      <div className="brutal-shell flex min-h-screen items-center justify-center p-6">
        <div className="brutal-card p-8 max-w-xl text-center space-y-6 bg-[var(--brutal-surface)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border-[3px] border-[var(--brutal-ink)] bg-[var(--brutal-bg)] shadow-[4px_4px_0_var(--brutal-ink)]">
            <LayoutDashboard className="h-8 w-8 text-[var(--brutal-ink)]" />
          </div>
          <div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tight">
              Dashboard Offline
            </h1>
            <p className="font-mono text-sm mt-3 opacity-80 uppercase leading-relaxed">
              The student OS extension owns this new tab page, but the dashboard is currently disabled.
              Initialize the neo-brutalist view to continue.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mt-6">
            <button className="brutal-btn brutal-btn-primary text-[var(--brutal-bg)]" onClick={() => void handleEnableDashboard()}>
              Enable OS
            </button>
            <button
              className="brutal-btn"
              onClick={() => setIsSettingsOpen(true)}
            >
              OS Config
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "PAGII";
    if (hour < 15) return "SIANG";
    if (hour < 18) return "SORE";
    return "MALEM";
  };

  return (
    <div className="brutal-shell p-6 md:p-8 flex flex-col gap-6 min-h-screen">

      {/* Header */}
      <header className="brutal-container w-full !px-0 flex flex-col sm:flex-row justify-between items-start sm:items-center brutal-divider pb-4 gap-4">
        <div className="flex items-center gap-6">
          <span className="font-display font-black text-xl md:text-2xl border-[3px] border-[var(--brutal-ink)] p-1.5 px-3 bg-[var(--brutal-primary)] text-[var(--brutal-bg)] shadow-[4px_4px_0_var(--brutal-ink)]">
            SIAP DIPS
          </span>
          <nav className="hidden md:flex gap-6 font-mono text-sm font-bold uppercase tracking-wider">
            <span className="text-[var(--brutal-primary)] underline decoration-[3px] underline-offset-8 decoration-[var(--brutal-ink)]">Dashboard</span>
            <span className="hover:text-[var(--brutal-secondary)] cursor-pointer transition-colors">Schedule</span>
            <span className="hover:text-[var(--brutal-secondary)] cursor-pointer transition-colors" onClick={() => chrome.tabs.create({ url: "https://kulon2.undip.ac.id/my/" })}>Moodle</span>
            <span className="hover:text-[var(--brutal-secondary)] cursor-pointer transition-colors">Grades</span>
          </nav>
        </div>
        <div className="flex gap-4 items-center">
          <button
            className="brutal-icon-btn flex items-center gap-2 font-mono text-xs font-bold uppercase"
            onClick={() => void handleRefresh()}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
          <button
            className="brutal-icon-btn"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings2 className="w-5 h-5" />
          </button>
          <button className="brutal-icon-btn"><UserCircle className="w-5 h-5" /></button>
        </div>
      </header>

      {/* Hero */}
      <section className="brutal-container w-full !px-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div className="space-y-6">
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[0.85] text-[var(--brutal-ink)] uppercase max-w-4xl tracking-tighter break-words">
            {getGreeting()},<br />{profileName}
          </h1>
          <div className="brutal-badge brutal-badge-primary shadow-[2px_2px_0_var(--brutal-ink)] text-[var(--brutal-bg)]">NODE: {profileNim} // {profileProdi}</div>
        </div>

        <div className="brutal-card bg-[var(--brutal-surface-dim)] text-[var(--brutal-primary)] p-5 flex flex-col items-center justify-center min-w-[220px]">
          <span className="font-display font-black text-5xl md:text-6xl tracking-tighter leading-none">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/ AM| PM/, '')}
            <span className="text-2xl ml-1">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).match(/AM|PM/)?.[0] || 'AM'}</span>
          </span>
          <span className="font-mono text-[10px] mt-3 uppercase text-[var(--brutal-ink)] opacity-60 tracking-widest font-bold">
            {new Date().toLocaleDateString('en-US', { weekday: 'short' })} // {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} // {new Date().getFullYear()}
          </span>
        </div>
      </section>

      {/* Search */}
      <section className="brutal-container w-full !px-0 mt-6 lg:mt-10">
        <div className="relative">
          <div className="absolute -top-3 left-4 bg-[var(--brutal-ink)] text-[var(--brutal-bg)] font-mono text-[10px] font-bold px-2 py-0.5 z-10 uppercase tracking-widest">
            cmd_input // global_search
          </div>
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="SEARCH... // EXECUTE"
              className="brutal-input pl-6 pr-14 py-5 placeholder:opacity-40"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  window.location.href = `https://www.google.com/search?q=${encodeURIComponent(e.currentTarget.value.trim())}`;
                }
              }}
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-7 h-7 text-[var(--brutal-ink)] opacity-70" />
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="brutal-container w-full !px-0 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Moodle Tasks */}
          <div className="brutal-card p-0 flex flex-col items-stretch">
            <div className="border-b-[3px] border-[var(--brutal-ink)] p-4 flex justify-between items-center px-5 bg-[var(--brutal-surface)]">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <span className="font-display font-bold text-xl uppercase tracking-tight">Moodle_Tasks</span>
              </div>
              <GripVertical className="w-5 h-5 opacity-40" />
            </div>
            <div className="p-6 flex flex-col gap-5 bg-[var(--brutal-bg)]">
              {assignments.length === 0 && localTodos.filter(t => !t.completed).length === 0 ? (
                <div className="border-[3px] border-dashed border-[var(--brutal-ink)] p-10 text-center flex flex-col items-center w-full bg-[var(--brutal-surface-dim)]">
                  <BookOpenCheck className="w-8 h-8 opacity-40 mb-4" />
                  <span className="font-display font-bold text-xl uppercase">No Assignments Active</span>
                  <span className="font-mono text-xs mt-2 opacity-60 uppercase font-bold">System Cache Empty.</span>
                </div>
              ) : (
                <>
                  {/* Real Kulon Assignments */}
                  {(['overdue', 'today', 'upcoming'] as const).map(groupKey => {
                    const group = assignmentGroups[groupKey];
                    if (group.length === 0) return null;
                    return group.map(assignment => {
                      const linked = linkedSourceKeys.includes(assignment.sourceKey);
                      return (
                        <div key={assignment.sourceKey} className="border-[3px] border-[var(--brutal-ink)] flex flex-col sm:flex-row justify-between p-4 gap-4 items-start sm:items-center relative transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--brutal-ink)] bg-[var(--brutal-surface)] cursor-pointer" onClick={() => chrome.tabs.create({ url: assignment.url })}>
                          <div className="flex gap-4 items-center">
                            <div className={`w-12 h-12 border-[3px] border-[var(--brutal-ink)] flex items-center justify-center shrink-0 ${groupKey === 'overdue' ? 'bg-[var(--brutal-secondary)] text-[var(--brutal-bg)]' : groupKey === 'today' ? 'bg-[var(--brutal-primary)] text-[var(--brutal-bg)]' : 'bg-[var(--brutal-surface-dim)] text-[var(--brutal-ink)]'}`}>
                              <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="font-mono text-[10px] opacity-60 font-bold uppercase tracking-wider">{assignment.course || "Kulon Task"}</span>
                              <span className="font-body font-bold uppercase text-base leading-tight">{assignment.title}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0 flex-wrap sm:flex-col md:flex-row items-end sm:items-center">
                            {linked && <span className="brutal-badge" style={{ backgroundColor: 'var(--brutal-ink)', color: 'var(--brutal-bg)' }}>Synced</span>}

                            {groupKey === 'overdue' && <span className="brutal-badge bg-[var(--brutal-secondary)] text-[var(--brutal-bg)]">Overdue</span>}
                            {groupKey === 'today' && <span className="brutal-badge bg-[var(--brutal-primary)] text-[var(--brutal-bg)]">Due Today</span>}
                            {groupKey === 'upcoming' && <span className="brutal-badge bg-[var(--brutal-surface-dim)] text-[var(--brutal-ink)]">{formatPartialDue(assignment.dueIso)}</span>}
                          </div>
                        </div>
                      );
                    });
                  })}

                  {/* Real Local Todos injected here as well */}
                  {localTodos.filter(t => !t.completed).map(todo => (
                    <div key={todo.id} className="border-[3px] border-[var(--brutal-ink)] flex flex-col sm:flex-row justify-between p-4 gap-4 items-start sm:items-center relative transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--brutal-ink)] bg-[var(--brutal-surface)]">
                      <div className="flex gap-4 items-center">
                        <div className="bg-[var(--brutal-surface-dim)] text-[var(--brutal-ink)] w-12 h-12 border-[3px] border-[var(--brutal-ink)] flex items-center justify-center shrink-0">
                          <ListTodo className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[10px] opacity-60 font-bold uppercase tracking-wider">Local Todo</span>
                          <span className="font-body font-bold uppercase text-base leading-tight">{todo.text}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <span className="brutal-badge bg-[var(--brutal-ink)] text-[var(--brutal-bg)]">Pending</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Daily Schedule */}
          <BrutalistScheduleWidget scheduleData={scheduleData} />

        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-8">

          {/* IPK Widget (Mocked) */}
          <div className="brutal-card brutal-card-secondary p-6 text-[var(--brutal-bg)]">
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs uppercase font-bold tracking-widest flex items-center gap-3">
                Current_IPK
                <button
                  onClick={() => setIsIpkVisible(prev => { localStorage.setItem('brutal_ipk_visible', String(!prev)); return !prev; })}
                  className="hover:text-[var(--brutal-ink)] transition-colors opacity-70 hover:opacity-100"
                >
                  {isIpkVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </span>
              <GripVertical className="w-5 h-5 opacity-40" />
            </div>
            <div className="mt-4 font-display font-black text-6xl md:text-7xl tracking-tighter flex items-baseline leading-none">
              {isIpkVisible ? ipkLocal : "•.••"}<span className="text-3xl font-bold ml-1 opacity-80">/ 4.0</span>
            </div>
            <div className="w-full h-5 border-[3px] border-[var(--brutal-ink)] bg-[var(--brutal-bg)] mt-8 relative shadow-[4px_4px_0_var(--brutal-ink)]">
              <div className="h-full bg-[var(--brutal-primary)] border-r-[3px] border-[var(--brutal-ink)] transition-all duration-500" style={{ width: `${isIpkVisible ? (parseFloat(ipkLocal) / 4) * 100 : 0}%` }}></div>
            </div>
            <div className="flex justify-between items-center mt-6 font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--brutal-ink)]">
              <span>System Metrics</span>
              <span className="bg-[var(--brutal-ink)] text-[var(--brutal-bg)] px-2 py-1 shadow-[2px_2px_0_var(--brutal-primary)]">Sync</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="brutal-card p-6 bg-[var(--brutal-surface)]">
            <span className="font-display font-bold text-xl uppercase tracking-tight block mb-5">Quick_Links</span>
            <div className="grid grid-cols-2 gap-4">
              <button className="brutal-btn bg-[var(--brutal-bg)] hover:bg-[var(--brutal-surface-dim)] text-xs shadow-[4px_4px_0_var(--brutal-ink)] w-full text-[var(--brutal-ink)]">SIAP</button>
              <button
                className="brutal-btn brutal-btn-primary text-xs shadow-[4px_4px_0_var(--brutal-ink)] w-full text-[var(--brutal-bg)]"
                onClick={() => chrome.tabs.create({ url: "https://kulon2.undip.ac.id/my/" })}
              >
                Moodle
              </button>
              <button className="brutal-btn brutal-btn-secondary text-xs shadow-[4px_4px_0_var(--brutal-ink)] w-full text-[var(--brutal-bg)]">SSO</button>
              <button className="brutal-btn bg-[var(--brutal-surface-dim)] hover:bg-[var(--brutal-bg)] text-[var(--brutal-ink)] text-xs shadow-[4px_4px_0_var(--brutal-ink)] w-full">Grades</button>
            </div>
          </div>

          {/* Campus Logs (Mocked) */}
          <div className="brutal-card bg-[var(--brutal-surface-dim)] text-[var(--brutal-primary)] p-6 shadow-[6px_6px_0_var(--brutal-ink)] flex flex-col items-stretch lg:flex-1">
            <div className="flex items-center gap-3 mb-6 text-[var(--brutal-primary)]">
              <TerminalSquare className="w-6 h-6" />
              <span className="font-display font-bold text-xl uppercase tracking-tight">Campus_Logs</span>
            </div>

            <div className="space-y-5 font-mono text-[10px] uppercase tracking-wider flex-1">
              <div className="flex flex-col gap-1.5 border-l-[3px] border-[var(--brutal-primary)] pl-3">
                <span className="text-[var(--brutal-ink)] opacity-60 font-bold">T: 10:15 // SSO_0</span>
                <span className="font-bold text-[11px] leading-relaxed">Network maintenance scheduled for midnight.</span>
              </div>
              <div className="flex flex-col gap-1.5 border-l-[3px] border-[var(--brutal-secondary)] pl-3">
                <span className="text-[var(--brutal-ink)] opacity-60 font-bold">T: 08:30 // ADM_1</span>
                <span className="font-bold text-[11px] leading-relaxed text-[var(--brutal-secondary)]">Library fine amnesty program extended.</span>
              </div>
              <div className="flex flex-col gap-1.5 border-l-[3px] border-[var(--brutal-primary)] pl-3">
                <span className="text-[var(--brutal-ink)] opacity-60 font-bold">T: 07:00 // SYS_0</span>
                <span className="font-bold text-[11px] leading-relaxed text-[var(--brutal-ink)]">New semester registration is now active.</span>
              </div>
            </div>
            <button className="brutal-btn w-full mt-8 text-xs bg-[var(--brutal-primary)] text-[var(--brutal-bg)] hover:bg-[var(--brutal-secondary)] hover:text-[var(--brutal-bg)] transition-colors border-2 border-transparent">
              Access Full Terminal
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="brutal-container w-full !px-0 mt-8 border-t-[3px] border-[var(--brutal-ink)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] font-bold uppercase tracking-widest">
        <span>©2067 Siap Dips, Make with ❤️</span>
        <div className="flex flex-wrap justify-center gap-6">
          <span className="hover:bg-[var(--brutal-primary)] hover:text-[var(--brutal-bg)] cursor-pointer transition-colors bg-[var(--brutal-ink)] text-[var(--brutal-bg)] px-2 py-1 border-[2px] border-transparent hover:border-[var(--brutal-ink)] hover:shadow-[2px_2px_0_var(--brutal-ink)]">Privacy</span>
          <span className="bg-[var(--brutal-primary)] text-[var(--brutal-bg)] px-2 py-1 border-[2px] border-[var(--brutal-ink)] shadow-[2px_2px_0_var(--brutal-ink)]">System Status</span>
          <span className="hover:text-[var(--brutal-bg)] cursor-pointer bg-[var(--brutal-secondary)] text-[var(--brutal-bg)] px-2 py-1 border-[2px] border-[var(--brutal-ink)] shadow-[2px_2px_0_var(--brutal-ink)] transition-colors">Report Bug</span>
        </div>
      </footer>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--brutal-bg)]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="brutal-card bg-[var(--brutal-bg)] w-full max-w-4xl border-[4px] border-[var(--brutal-ink)] p-0 shadow-[8px_8px_0_var(--brutal-ink)] relative flex flex-col max-h-[90vh]">
            <div className="border-b-[4px] border-[var(--brutal-ink)] p-4 flex justify-between items-center bg-[var(--brutal-primary)] text-[var(--brutal-bg)] shrink-0">
              <div className="flex items-center gap-3">
                <Settings2 className="w-6 h-6" />
                <span className="font-display font-black text-xl md:text-2xl uppercase tracking-tighter">Siap Dips CONFIG</span>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="hover:bg-[var(--brutal-ink)] hover:text-[var(--brutal-primary)] transition-colors p-1 border-[2px] border-transparent"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-0 overflow-y-auto w-full brutal-scroll flex-1">
              <NewTabDashboardSettingsEditor context="newtab" onClose={() => setIsSettingsOpen(false)} />
            </div>
          </div>
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

function formatPartialDue(dueIso: string): string {
  const date = new Date(dueIso);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function BrutalistScheduleWidget({ scheduleData }: { scheduleData: Record<string, ScheduleItem[]> | null }) {
  const [scheduleDayIndex, setScheduleDayIndex] = useState(new Date().getDay());
  const [scheduleCourseIndex, setScheduleCourseIndex] = useState(0);

  const daysIndo = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];

  const getDefaultCourseIndex = (dayIdx: number, classes: ScheduleItem[]) => {
    if (dayIdx !== new Date().getDay()) return 0;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (let i = 0; i < classes.length; i++) {
      const [eH, eM] = classes[i].waktuSelesai.split(':').map(Number);
      if (currentMinutes <= eH * 60 + eM) return i;
    }
    return Math.max(0, classes.length - 1);
  };

  useEffect(() => {
    if (scheduleData) {
      const cls = scheduleData?.[daysIndo[new Date().getDay()]] ? [...scheduleData[daysIndo[new Date().getDay()]]].sort((a, b) => (a.waktuMulai > b.waktuMulai) ? 1 : -1) : [];
      setScheduleCourseIndex(getDefaultCourseIndex(new Date().getDay(), cls));
    }
  }, [scheduleData]);

  const handleDayChange = (delta: number) => {
    const newDay = (scheduleDayIndex + delta + 7) % 7;
    setScheduleDayIndex(newDay);
    const newDayClasses = scheduleData?.[daysIndo[newDay]] ? [...scheduleData[daysIndo[newDay]]].sort((a, b) => (a.waktuMulai > b.waktuMulai) ? 1 : -1) : [];
    setScheduleCourseIndex(getDefaultCourseIndex(newDay, newDayClasses));
  };

  const dayName = daysIndo[scheduleDayIndex];
  const dayClasses = scheduleData?.[dayName] ? [...scheduleData[dayName]].sort((a, b) => (a.waktuMulai > b.waktuMulai) ? 1 : -1) : [];

  return (
    <div className="brutal-card brutal-card-primary p-0">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center px-5 border-b-[3px] border-[var(--brutal-ink)] bg-[var(--brutal-primary)] text-[var(--brutal-bg)] gap-3">
        <div className="flex items-center gap-3 w-full justify-between sm:w-auto">
          <div className="flex items-center gap-3 text-[var(--brutal-ink)]">
            <Clock className="w-5 h-5" />
            <span className="font-display font-bold text-xl uppercase tracking-tight">Daily_Schedule</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleDayChange(-1)} className="hover:bg-[var(--brutal-ink)] hover:text-[var(--brutal-primary)] text-[var(--brutal-ink)] transition-colors p-1 border-[2px] border-[var(--brutal-ink)]"><ChevronLeft className="w-4 h-4" /></button>
          <span className="font-mono text-xs uppercase font-bold w-12 text-center text-[var(--brutal-ink)]">{dayName}</span>
          <button onClick={() => handleDayChange(1)} className="hover:bg-[var(--brutal-ink)] hover:text-[var(--brutal-primary)] text-[var(--brutal-ink)] transition-colors p-1 border-[2px] border-[var(--brutal-ink)]"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="p-6 bg-[var(--brutal-bg)]">
        {(() => {
          if (!scheduleData) {
            return (
              <div className="border-[3px] border-dashed border-[var(--brutal-ink)] p-8 text-center text-[var(--brutal-ink)] bg-[var(--brutal-bg)] opacity-70">
                <span className="font-mono font-bold uppercase tracking-widest text-xs">Loading Schedule...</span>
              </div>
            );
          }

          if (dayClasses.length === 0) {
            return (
              <div className="border-[3px] border-[var(--brutal-ink)] p-8 text-center text-[var(--brutal-ink)] bg-[var(--brutal-surface-dim)] opacity-70">
                <span className="font-mono font-bold uppercase tracking-widest text-xs">No Scheduled Classes</span>
              </div>
            );
          }

          const activeClass = dayClasses[scheduleCourseIndex] || dayClasses[0];

          const now = new Date();
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          const [startH, startM] = activeClass.waktuMulai.split(':').map(Number);
          const [endH, endM] = activeClass.waktuSelesai.split(':').map(Number);
          const startMins = startH * 60 + startM;
          const endMins = endH * 60 + endM;

          let isToday = scheduleDayIndex === now.getDay();
          let status = "Scheduled";

          if (isToday) {
            if (currentMinutes < startMins) {
              const diff = startMins - currentMinutes;
              const h = Math.floor(diff / 60);
              const m = diff % 60;
              status = `Starting in ${h > 0 ? h + 'h ' : ''}${m}m`;
            } else if (currentMinutes <= endMins) {
              status = "Ongoing Now // " + activeClass.waktuSelesai.substring(0, 5);
            } else {
              status = "Passed";
            }
          }

          return (
            <div className="bg-[var(--brutal-primary)] border-[3px] border-[var(--brutal-ink)] p-6 md:p-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 shadow-[6px_6px_0_var(--brutal-ink)] relative">
              <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 bg-[var(--brutal-ink)] text-[var(--brutal-primary)] px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-widest shadow-[2px_2px_0_var(--brutal-bg)] border-x-[3px] border-b-[3px] border-[var(--brutal-ink)]">
                Class {scheduleCourseIndex + 1} / {dayClasses.length}
              </div>

              <div className="flex flex-col gap-2 text-[var(--brutal-bg)] w-full">
                <span className="font-mono text-xs uppercase font-bold tracking-widest opacity-80 mt-2 xl:mt-0">Status // {status}</span>
                <span className="font-display font-black text-2xl md:text-4xl uppercase tracking-tighter leading-[0.9]">{activeClass.mataKuliah}</span>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4 w-full">
                  <div className="flex flex-wrap gap-4 font-mono text-sm font-bold">
                    <span className="flex items-center gap-2 bg-[var(--brutal-ink)] text-[var(--brutal-bg)] px-2 py-1 border-[2px] border-[var(--brutal-bg)]"><MapPin className="w-4 h-4" /> {activeClass.ruang || "TBA"}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button onClick={() => setScheduleCourseIndex(i => Math.max(0, i - 1))} disabled={scheduleCourseIndex === 0} className="brutal-btn py-1 px-3 text-xs border-[2px] border-[var(--brutal-bg)] hover:bg-[var(--brutal-ink)] hover:border-[var(--brutal-ink)] hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--brutal-ink)] disabled:hover:border-[var(--brutal-bg)]">Prev</button>
                    <button onClick={() => setScheduleCourseIndex(i => Math.min(dayClasses.length - 1, i + 1))} disabled={scheduleCourseIndex === dayClasses.length - 1} className="brutal-btn py-1 px-3 text-xs border-[2px] border-[var(--brutal-bg)] hover:bg-[var(--brutal-ink)] hover:border-[var(--brutal-ink)] hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--brutal-ink)] disabled:hover:border-[var(--brutal-bg)]">Next</button>
                  </div>
                </div>
              </div>

              <div className="border-[3px] border-[var(--brutal-ink)] bg-[var(--brutal-bg)] text-[var(--brutal-primary)] p-4 md:p-6 text-center min-w-[120px] shrink-0 self-stretch flex flex-col justify-center shadow-[4px_4px_0_var(--brutal-secondary)] mt-4 xl:mt-0">
                <span className="font-display font-black text-4xl block leading-none">{activeClass.waktuMulai.substring(0, 5)}</span>
                <span className="font-mono text-[10px] mt-2 block uppercase font-bold tracking-widest text-[var(--brutal-ink)] opacity-60">Start / WIB</span>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  );
}

export default App;
