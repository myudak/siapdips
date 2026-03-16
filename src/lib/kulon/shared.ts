import type { CSSProperties } from "react";

export const STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED = "newTabDashboardEnabled";
export const STORAGE_KEY_KULON_ASSIGNMENTS_CACHE = "kulonAssignmentsCache";
export const STORAGE_KEY_KULON_ASSIGNMENTS_LAST_SYNCED_AT =
  "kulonAssignmentsLastSyncedAt";
export const STORAGE_KEY_NEW_TAB_DASHBOARD_PREFS = "newTabDashboardPrefs";

export interface KulonAssignment {
  sourceId: string;
  sourceKey: string;
  title: string;
  dueIso: string;
  course: string;
  url: string;
}

export const NEW_TAB_MODULE_IDS = [
  "hero",
  "summary",
  "kulon",
  "localTodo",
] as const;

export type NewTabModuleId = (typeof NEW_TAB_MODULE_IDS)[number];
export type NewTabPresetId = "campusDawn" | "paperDesk" | "nightLab";
export type NewTabDensity = "compact" | "comfortable" | "airy";
export type NewTabBackgroundStyle = "aurora" | "paper" | "grid";
export type NewTabAccentTone = "sky" | "emerald" | "amber" | "slate";
export type NewTabTypography = "clean" | "editorial" | "mono";

export interface NewTabDashboardPrefs {
  moduleOrder: NewTabModuleId[];
  hiddenModules: NewTabModuleId[];
  preset: NewTabPresetId;
  backgroundStyle: NewTabBackgroundStyle;
  accentTone: NewTabAccentTone;
  density: NewTabDensity;
  typography: NewTabTypography;
}

export const NEW_TAB_MODULE_LABELS: Record<NewTabModuleId, string> = {
  hero: "Hero Header",
  summary: "Summary Row",
  kulon: "Kulon Assignments",
  localTodo: "Local Todo",
};

export const NEW_TAB_MODULE_DESCRIPTIONS: Record<NewTabModuleId, string> = {
  hero: "Title, dashboard intro, and quick actions.",
  summary: "Today, upcoming, overdue, and todo counters.",
  kulon: "Cached Kulon tasks grouped by urgency.",
  localTodo: "Read-only preview of your popup todo list.",
};

export const NEW_TAB_PRESET_LABELS: Record<NewTabPresetId, string> = {
  campusDawn: "Campus Dawn",
  paperDesk: "Paper Desk",
  nightLab: "Night Lab",
};

export const NEW_TAB_PRESET_DESCRIPTIONS: Record<NewTabPresetId, string> = {
  campusDawn: "Airy aurora gradients with a calm campus-blue accent.",
  paperDesk: "Warm editorial paper feel with roomy spacing.",
  nightLab: "Sharper grid energy with compact spacing and mono tone.",
};

export const NEW_TAB_PRESET_CONFIGS: Record<
  NewTabPresetId,
  Omit<NewTabDashboardPrefs, "moduleOrder" | "hiddenModules"> 
> = {
  campusDawn: {
    preset: "campusDawn",
    backgroundStyle: "aurora",
    accentTone: "sky",
    density: "comfortable",
    typography: "clean",
  },
  paperDesk: {
    preset: "paperDesk",
    backgroundStyle: "paper",
    accentTone: "amber",
    density: "airy",
    typography: "editorial",
  },
  nightLab: {
    preset: "nightLab",
    backgroundStyle: "grid",
    accentTone: "emerald",
    density: "compact",
    typography: "mono",
  },
};

export const DEFAULT_NEW_TAB_DASHBOARD_PREFS: NewTabDashboardPrefs = {
  moduleOrder: [...NEW_TAB_MODULE_IDS],
  hiddenModules: [],
  ...NEW_TAB_PRESET_CONFIGS.campusDawn,
};

export function normalizeNewTabDashboardPrefs(
  value: unknown
): NewTabDashboardPrefs {
  const input =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Partial<NewTabDashboardPrefs>)
      : {};

  const preset = isPresetId(input.preset)
    ? input.preset
    : DEFAULT_NEW_TAB_DASHBOARD_PREFS.preset;
  const presetDefaults = NEW_TAB_PRESET_CONFIGS[preset];

  const seen = new Set<NewTabModuleId>();
  const moduleOrder = Array.isArray(input.moduleOrder)
    ? input.moduleOrder.filter((moduleId): moduleId is NewTabModuleId => {
        if (!isModuleId(moduleId) || seen.has(moduleId)) {
          return false;
        }
        seen.add(moduleId);
        return true;
      })
    : [];

  for (const moduleId of NEW_TAB_MODULE_IDS) {
    if (!seen.has(moduleId)) {
      moduleOrder.push(moduleId);
    }
  }

  const hiddenSeen = new Set<NewTabModuleId>();
  const hiddenModules = Array.isArray(input.hiddenModules)
    ? input.hiddenModules.filter((moduleId): moduleId is NewTabModuleId => {
        if (!isModuleId(moduleId) || hiddenSeen.has(moduleId)) {
          return false;
        }
        hiddenSeen.add(moduleId);
        return true;
      })
    : [];

  return {
    moduleOrder,
    hiddenModules,
    preset,
    backgroundStyle: isBackgroundStyle(input.backgroundStyle)
      ? input.backgroundStyle
      : presetDefaults.backgroundStyle,
    accentTone: isAccentTone(input.accentTone)
      ? input.accentTone
      : presetDefaults.accentTone,
    density: isDensity(input.density) ? input.density : presetDefaults.density,
    typography: isTypography(input.typography)
      ? input.typography
      : presetDefaults.typography,
  };
}

export function applyNewTabPreset(
  preset: NewTabPresetId,
  current?: Partial<NewTabDashboardPrefs>
): NewTabDashboardPrefs {
  const normalizedCurrent = normalizeNewTabDashboardPrefs(current);
  return {
    ...normalizedCurrent,
    ...NEW_TAB_PRESET_CONFIGS[preset],
    preset,
  };
}

export function getNewTabAccentVariables(
  accentTone: NewTabAccentTone
): CSSProperties {
  const accentMap: Record<
    NewTabAccentTone,
    {
      strong: string;
      soft: string;
      surface: string;
      ring: string;
      chip: string;
    }
  > = {
    sky: {
      strong: "#0f8bd7",
      soft: "rgba(14, 165, 233, 0.18)",
      surface: "rgba(14, 165, 233, 0.10)",
      ring: "rgba(14, 165, 233, 0.28)",
      chip: "#0369a1",
    },
    emerald: {
      strong: "#0f9f6e",
      soft: "rgba(16, 185, 129, 0.18)",
      surface: "rgba(16, 185, 129, 0.10)",
      ring: "rgba(16, 185, 129, 0.28)",
      chip: "#047857",
    },
    amber: {
      strong: "#c77a12",
      soft: "rgba(245, 158, 11, 0.18)",
      surface: "rgba(245, 158, 11, 0.10)",
      ring: "rgba(245, 158, 11, 0.28)",
      chip: "#b45309",
    },
    slate: {
      strong: "#475569",
      soft: "rgba(100, 116, 139, 0.18)",
      surface: "rgba(100, 116, 139, 0.10)",
      ring: "rgba(100, 116, 139, 0.28)",
      chip: "#334155",
    },
  };

  const accent = accentMap[accentTone];
  return {
    "--newtab-accent-strong": accent.strong,
    "--newtab-accent-soft": accent.soft,
    "--newtab-accent-surface": accent.surface,
    "--newtab-accent-ring": accent.ring,
    "--newtab-accent-chip": accent.chip,
  } as CSSProperties;
}

function isModuleId(value: unknown): value is NewTabModuleId {
  return typeof value === "string" && NEW_TAB_MODULE_IDS.includes(value as NewTabModuleId);
}

function isPresetId(value: unknown): value is NewTabPresetId {
  return value === "campusDawn" || value === "paperDesk" || value === "nightLab";
}

function isDensity(value: unknown): value is NewTabDensity {
  return value === "compact" || value === "comfortable" || value === "airy";
}

function isBackgroundStyle(value: unknown): value is NewTabBackgroundStyle {
  return value === "aurora" || value === "paper" || value === "grid";
}

function isAccentTone(value: unknown): value is NewTabAccentTone {
  return value === "sky" || value === "emerald" || value === "amber" || value === "slate";
}

function isTypography(value: unknown): value is NewTabTypography {
  return value === "clean" || value === "editorial" || value === "mono";
}

export interface KulonDashboardDataMessage {
  type: "kulonDashboardGetData";
}

export interface KulonDashboardStatusMessage {
  type: "kulonDashboardGetStatus";
}

export interface KulonDashboardRefreshMessage {
  type: "kulonDashboardRefreshFromActiveTab";
}

export type KulonRuntimeMessage =
  | KulonDashboardDataMessage
  | KulonDashboardStatusMessage
  | KulonDashboardRefreshMessage;

export interface KulonDashboardDataResponse {
  ok: boolean;
  enabled?: boolean;
  assignments?: KulonAssignment[];
  lastSyncedAt?: string | null;
  linkedSourceKeys?: string[];
  error?: string;
}

export interface KulonDashboardStatusResponse {
  ok: boolean;
  enabled?: boolean;
  error?: string;
}

export interface KulonDashboardRefreshResponse {
  ok: boolean;
  refreshed?: boolean;
  enabled?: boolean;
  assignments?: KulonAssignment[];
  lastSyncedAt?: string | null;
  linkedSourceKeys?: string[];
  error?: string;
}
