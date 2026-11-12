export type ConsoleWorld = "USER_SCRIPT" | "MAIN";
export interface ConsoleEntry { level: "log" | "info" | "warn" | "error" | "debug"; text: string }
export interface ExecutionReport { ok: boolean; logs: ConsoleEntry[]; result: string; error?: string; truncated: boolean; duration: number }
export interface ConsoleRun {
  id: string; tabId: number; url: string; world: ConsoleWorld; created: number;
  status: "running" | "done" | "error"; report?: ExecutionReport; error?: string;
}
export interface ConsoleStatus {
  state: "ready" | "permission" | "toggle" | "unsupported";
  message: string; optionalPermission: boolean;
}
export interface ConsoleReply { ok: boolean; error?: string; availability?: ConsoleStatus; run?: ConsoleRun }
export interface ConsoleSnippet { id: string; name: string; code: string; world: ConsoleWorld }
export const CONSOLE_DRAFT_KEY = "devConsoleDraft";
export const CONSOLE_SNIPPETS_KEY = "devConsoleSnippets";
export const MAX_SCRIPT_LENGTH = 50_000;
export const DEFAULT_SCRIPT = 'console.log("Page:", document.title);\nconsole.log("Links:", document.querySelectorAll("a").length);\nreturn location.href;';

export function consoleOrigin(url: string): string | null {
  try { const parsed = new URL(url); return ["http:", "https:"].includes(parsed.protocol) ? parsed.origin : null; }
  catch { return null; }
}
/** Match patterns do not support port numbers. Chrome grants host access by
 * scheme + hostname; the execution target is additionally pinned to a document. */
export function consoleSitePattern(url: string): string | null {
  if (!consoleOrigin(url)) return null;
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.hostname}/*`;
}
export function validateConsoleCode(code: unknown): asserts code is string {
  if (typeof code !== "string" || !code.trim()) throw new Error("Isi JavaScript dulu sebelum menjalankan.");
  if (code.length > MAX_SCRIPT_LENGTH) throw new Error("Script maksimal 50.000 karakter.");
}
export function readConsoleSnippets(value: unknown): ConsoleSnippet[] {
  if (!Array.isArray(value)) return [];
  return value.filter((s): s is ConsoleSnippet => Boolean(s && typeof s.id === "string" && typeof s.name === "string" && typeof s.code === "string" && s.code.length <= MAX_SCRIPT_LENGTH && ["USER_SCRIPT", "MAIN"].includes(s.world))).slice(0, 20);
}
/** The script world is untrusted. Only pass bounded text into extension UI. */
export function normalizeConsoleReport(value: unknown): ExecutionReport {
  if (!value || typeof value !== "object" || typeof (value as ExecutionReport).ok !== "boolean") throw new Error("Hasil script tidak valid.");
  const report = value as ExecutionReport;
  let remaining = 64_000;
  const logs: ConsoleEntry[] = [];
  for (const entry of Array.isArray(report.logs) ? report.logs.slice(0, 200) : []) {
    if (!entry || !["log", "info", "warn", "error", "debug"].includes(entry.level) || typeof entry.text !== "string") continue;
    const text = entry.text.slice(0, Math.min(4000, remaining));
    logs.push({ level: entry.level, text }); remaining -= text.length;
    if (remaining <= 0) break;
  }
  return { ok: report.ok, logs, result: typeof report.result === "string" ? report.result.slice(0, 4000) : "undefined", error: typeof report.error === "string" ? report.error.slice(0, 4000) : undefined, truncated: Boolean(report.truncated) || remaining <= 0, duration: Number.isFinite(report.duration) ? Math.max(0, report.duration) : 0 };
}
