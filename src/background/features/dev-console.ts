import { buildConsoleSource } from "../../lib/dev-console/runner.ts";
import { consoleSitePattern, normalizeConsoleReport, validateConsoleCode } from "../../lib/dev-console/shared.ts";
import type { ConsoleReply, ConsoleRun, ConsoleStatus, ConsoleWorld, ExecutionReport } from "../../lib/dev-console/shared";

interface UserScriptsApi {
  getScripts(): Promise<unknown>;
  execute(injection: { target: { tabId: number; documentIds: string[] }; js: Array<{ code: string }>; world: ConsoleWorld }): Promise<Array<{ frameId: number; result?: ExecutionReport; error?: string }>>;
}
interface ConsoleMessage { type?: string; tabId?: number; url?: string; code?: unknown; world?: ConsoleWorld }
const pending = new Map<number, string>();
const runKey = (tabId: number) => `devConsoleRun:${tabId}`;
function userScripts(): UserScriptsApi | undefined {
  try { return (chrome as unknown as { userScripts?: UserScriptsApi }).userScripts; } catch { return undefined; }
}
export async function consoleAvailability(): Promise<ConsoleStatus> {
  const optionalPermission = !chrome.runtime.getManifest().permissions?.includes("userScripts");
  const chromiumVersion = Number(globalThis.navigator?.userAgent.match(/(?:Chrome|Chromium)\/(\d+)/)?.[1]);
  if (chromiumVersion && chromiumVersion < 135) return { state: "unsupported", optionalPermission, message: "Dev Console memerlukan Chrome/Edge 135+ untuk menjalankan script sekali pakai." };
  if (optionalPermission && !await chrome.permissions.contains({ permissions: ["userScripts"] })) return { state: "permission", optionalPermission, message: "Aktifkan izin User Scripts untuk memakai Dev Console." };
  const api = userScripts();
  if (api && typeof api.execute !== "function") return { state: "unsupported", optionalPermission, message: "Browser ini belum mendukung eksekusi user script. Gunakan Chrome/Edge 135+ atau Firefox terbaru." };
  try {
    if (!api) throw new Error("disabled");
    await api.getScripts();
    return { state: "ready", optionalPermission, message: "Siap menjalankan JavaScript di tab ini." };
  } catch {
    return { state: "toggle", optionalPermission, message: "Buka detail Siap Dips di halaman Extensions, aktifkan Allow User Scripts, lalu refresh kartu ini. Jika toggle belum tersedia, gunakan Developer mode." };
  }
}
async function readRun(tabId: number): Promise<ConsoleRun | undefined> {
  const key = runKey(tabId);
  const run = (await chrome.storage.session.get(key))[key] as ConsoleRun | undefined;
  if (run?.status === "running" && pending.get(tabId) !== run.id) {
    run.status = "error"; run.error = "Eksekusi terputus atau background dimuat ulang. Refresh tab tujuan bila diperlukan, lalu jalankan lagi.";
    await chrome.storage.session.set({ [key]: run });
  }
  return run;
}
async function executeRun(run: ConsoleRun, source: string, documentId: string, api: UserScriptsApi): Promise<void> {
  try {
    const results = await api.execute({ target: { tabId: run.tabId, documentIds: [documentId] }, js: [{ code: source }], world: run.world });
    const result = results[0];
    if (result?.error) throw new Error(result.error);
    if (!result?.result || typeof result.result.ok !== "boolean") throw new Error("Halaman tidak mengembalikan hasil. Halaman mungkin berpindah atau ditutup.");
    run.report = normalizeConsoleReport(result.result);
    run.status = run.report.ok ? "done" : "error";
  } catch (error) { run.status = "error"; run.error = error instanceof Error ? error.message.slice(0, 2000) : "Eksekusi gagal."; }
  finally {
    try {
      // Closing a tab invalidates its pending token. A late completion must not
      // recreate output that the tab-close listener has already removed.
      if (pending.get(run.tabId) === run.id) await chrome.storage.session.set({ [runKey(run.tabId)]: run });
    }
    finally { if (pending.get(run.tabId) === run.id) pending.delete(run.tabId); }
  }
}
export async function handleConsole(message: ConsoleMessage): Promise<ConsoleReply> {
  if (!Number.isInteger(message.tabId)) throw new Error("Tab tujuan tidak valid.");
  const tabId = message.tabId!;
  if (message.type === "console:status") return { ok: true, availability: await consoleAvailability(), run: await readRun(tabId) };
  if (message.type !== "console:run") throw new Error("Perintah console tidak dikenali.");
  validateConsoleCode(message.code);
  if (!["USER_SCRIPT", "MAIN"].includes(message.world ?? "")) throw new Error("Mode eksekusi tidak valid.");
  if (pending.has(tabId)) throw new Error("Script sebelumnya masih berjalan di tab ini.");
  // Reserve before async permission/document checks to prevent double runs.
  const id = crypto.randomUUID(); pending.set(tabId, id);
  let dispatched = false;
  try {
    const availability = await consoleAvailability();
    if (availability.state !== "ready") throw new Error(availability.message);
    const tab = await chrome.tabs.get(tabId);
    const pattern = tab.url && consoleSitePattern(tab.url);
    if (!pattern) throw new Error("Pilih halaman HTTP/HTTPS biasa untuk menjalankan script.");
    if (tab.url !== message.url) throw new Error("Tab tujuan berubah. Refresh kartu sebelum menjalankan script.");
    if (!await chrome.permissions.contains({ origins: [pattern] })) throw new Error("Izinkan akses untuk situs ini sebelum menjalankan script.");
    const [target] = await chrome.scripting.executeScript({ target: { tabId, frameIds: [0] }, func: () => location.href });
    if (!target?.documentId || target.result !== message.url) throw new Error("Halaman berubah. Refresh kartu sebelum menjalankan script.");
    if (pending.get(tabId) !== id) throw new Error("Tab tujuan sudah ditutup.");
    const run: ConsoleRun = { id, tabId, url: tab.url!, world: message.world!, created: Date.now(), status: "running" };
    const source = buildConsoleSource(message.code);
    await chrome.storage.session.set({ [runKey(tabId)]: run });
    dispatched = true;
    void executeRun(run, source, target.documentId, userScripts()!).catch(console.error);
    return { ok: true, run };
  } finally { if (!dispatched && pending.get(tabId) === id) pending.delete(tabId); }
}
export function initDevConsole(): void {
  chrome.runtime.onMessage.addListener((message: ConsoleMessage, sender, respond) => {
    if (!message?.type?.startsWith("console:")) return;
    if (sender.id !== chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL(""))) return;
    void handleConsole(message).then(respond).catch(error => respond({ ok: false, error: error instanceof Error ? error.message : "Console gagal diproses." }));
    return true;
  });
  chrome.tabs.onRemoved.addListener(tabId => { pending.delete(tabId); void chrome.storage.session.remove(runKey(tabId)); });
}
