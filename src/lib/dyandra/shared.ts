export const STORAGE_KEY_DYANDRA_HELPER_ENABLED = "dyandraHelperEnabled";
export const STORAGE_KEY_DYANDRA_TARGET_TEXT = "dyandraTargetText";
export const STORAGE_KEY_DYANDRA_REFRESH_INTERVAL_MS =
  "dyandraRefreshIntervalMs";
export const STORAGE_KEY_DYANDRA_AUTO_REFRESH_ENABLED =
  "dyandraAutoRefreshEnabled";

export const DEFAULT_DYANDRA_REFRESH_INTERVAL_MS = 3000;
export const MIN_DYANDRA_REFRESH_INTERVAL_MS = 500;
export const MAX_DYANDRA_REFRESH_INTERVAL_MS = 60000;

export interface DyandraHelperConfig {
  targetText: string;
  refreshIntervalMs: number;
  autoRefreshEnabled: boolean;
}

export interface DyandraHelperState {
  status: "idle" | "running" | "found" | "error";
  lastCheckedAt?: string;
  lastMatchHref?: string;
  lastMatchText?: string;
  lastError?: string;
}

export interface DyandraLoketMatch {
  href: string;
  text: string;
}

export const DEFAULT_DYANDRA_HELPER_CONFIG: DyandraHelperConfig = {
  targetText: "",
  refreshIntervalMs: DEFAULT_DYANDRA_REFRESH_INTERVAL_MS,
  autoRefreshEnabled: false,
};

export function normalizeDyandraText(value: string | null | undefined): string {
  return (value || "").replace(/\s+/g, " ").trim();
}

export function normalizeDyandraRefreshInterval(value: unknown): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : Number.NaN;

  if (Number.isNaN(parsed)) {
    return DEFAULT_DYANDRA_REFRESH_INTERVAL_MS;
  }

  return Math.min(
    Math.max(parsed, MIN_DYANDRA_REFRESH_INTERVAL_MS),
    MAX_DYANDRA_REFRESH_INTERVAL_MS
  );
}

export function normalizeDyandraHelperConfig(
  value: unknown
): DyandraHelperConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...DEFAULT_DYANDRA_HELPER_CONFIG };
  }

  const candidate = value as Partial<DyandraHelperConfig>;
  return {
    targetText:
      typeof candidate.targetText === "string"
        ? normalizeDyandraText(candidate.targetText)
        : DEFAULT_DYANDRA_HELPER_CONFIG.targetText,
    refreshIntervalMs: normalizeDyandraRefreshInterval(
      candidate.refreshIntervalMs
    ),
    autoRefreshEnabled: Boolean(candidate.autoRefreshEnabled),
  };
}

export function isDyandraLoketHref(value: string | null | undefined): boolean {
  return /^https:\/\/widget\.loket\.com\/.+/i.test((value || "").trim());
}

export function findMatchingDyandraLoketLink(
  links: Array<{ href?: string | null; text?: string | null }>,
  targetText: string
): DyandraLoketMatch | null {
  const normalizedTargetText = normalizeDyandraText(targetText);
  if (!normalizedTargetText) {
    return null;
  }

  for (const link of links) {
    const href = (link.href || "").trim();
    const text = normalizeDyandraText(link.text);

    if (!isDyandraLoketHref(href)) {
      continue;
    }

    if (!text.includes(normalizedTargetText)) {
      continue;
    }

    return {
      href,
      text,
    };
  }

  return null;
}
