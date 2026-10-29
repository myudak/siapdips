import { audioStatus, boost } from "./tools-audio";
import { runPageTool } from "../../lib/tools/page-tools";
import { capturePositions, normalizeSpeed, normalizeVolume, siteOrigin, TOOLS_SITES_KEY } from "../../lib/tools/shared";
import type { PageToolRequest, PageToolResult, SiteToolSettingsMap, ToolReply, CaptureGeometry } from "../../lib/tools/shared";
import { pruneCaptures, saveCapture, saveCaptureTile } from "../../lib/tools/capture-db";
import type { CaptureRecord } from "../../lib/tools/capture-db";

interface ToolsMessage {
  type: string;
  tabId?: number;
  request?: PageToolRequest;
  volume?: number;
  speed?: number;
  enabled?: boolean;
  mode?: "full" | "visible" | "area";
  captureId?: string;
}
let captureJob: { id: string; tabId: number; windowId: number; cancelled: boolean } | undefined;
let lastCapture = 0;

async function currentWebTab(tabId: number | undefined): Promise<chrome.tabs.Tab & { id: number; url: string }> {
  if (!Number.isInteger(tabId)) throw new Error("Tab tidak valid.");
  const tab = await chrome.tabs.get(tabId!);
  if (tab.id === undefined || !tab.url || !siteOrigin(tab.url)) throw new Error("Tools tersedia di halaman HTTP/HTTPS. Halaman browser dan extension store dapat dibatasi.");
  return tab as chrome.tabs.Tab & { id: number; url: string };
}
async function page(tabId: number, request: PageToolRequest, documentId?: string): Promise<chrome.scripting.InjectionResult<PageToolResult>> {
  let frameId = 0;
  const parsed = request.playerId?.match(/^(\d+)\/(.+)$/);
  if (parsed) { frameId = Number(parsed[1]); request = { ...request, playerId: parsed[2] }; }
  const results = await chrome.scripting.executeScript({
    target: documentId ? { tabId, documentIds: [documentId] } : { tabId, frameIds: [frameId] },
    func: runPageTool,
    args: [request],
  });
  if (!results[0]?.result) throw new Error("Halaman tidak merespons. Muat ulang halaman lalu buka Tools lagi.");
  return results[0];
}
async function getPageStatus(tabId: number): Promise<PageToolResult> {
  let results: chrome.scripting.InjectionResult<PageToolResult>[];
  try { results = await chrome.scripting.executeScript({ target: { tabId, allFrames: true }, func: runPageTool, args: [{ action: "status" }] }); }
  catch { results = [await page(tabId, { action: "status" })]; }
  return { frameOrigins: [...new Set(results.flatMap(result => result.result?.frameOrigins ?? []))], players: results.flatMap(result => (result.result?.players ?? []).map(player => ({ ...player, id: `${result.frameId}/${player.id}`, title: `${player.title}${result.frameId ? " · embedded" : ""}` }))) };
}
async function sites(): Promise<SiteToolSettingsMap> {
  return (await chrome.storage.local.get(TOOLS_SITES_KEY))[TOOLS_SITES_KEY] ?? {};
}
async function remember(tab: chrome.tabs.Tab & { id: number; url: string }, enabled: boolean, speed: number): Promise<ToolReply> {
  const origin = siteOrigin(tab.url)!;
  const settings = await sites();
  if (enabled) {
    if (!await chrome.permissions.contains({ origins: [`${origin}/*`] })) throw new Error("Izin untuk situs ini belum diberikan.");
    settings[origin] = { speed: normalizeSpeed(speed) };
  } else delete settings[origin];
  await chrome.storage.local.set({ [TOOLS_SITES_KEY]: settings });
  // Immediately release the speed lock when the setting is turned off.
  if (!enabled) {
    await page(tab.id, { action: "reset" });
    // Required host grants (including legacy scripts) cannot be removed here.
    await chrome.permissions.remove({ origins: [`${origin}/*`] }).catch(() => false);
  }
  return { ok: true, remembered: enabled };
}
async function applyRemembered(tabId: number, url: string): Promise<void> {
  const origin = siteOrigin(url);
  if (!origin) return;
  const setting = (await sites())[origin];
  if (!setting || !await chrome.permissions.contains({ origins: [`${origin}/*`] })) return;
  await page(tabId, { action: "speed", value: normalizeSpeed(setting.speed), playerId: "all" });
}

async function capture(tab: chrome.tabs.Tab & { id: number; url: string }, mode: "full" | "visible" | "area", id: string): Promise<void> {
  const job = captureJob = { id, tabId: tab.id, windowId: tab.windowId, cancelled: false };
  let record: CaptureRecord | undefined;
  let documentId: string | undefined;
  try {
    await pruneCaptures();
    let rect;
    if (mode === "area") rect = (await page(tab.id, { action: "select" })).result?.rect;
    if (job.cancelled) throw new Error("Screenshot dibatalkan.");
    const initial = await page(tab.id, { action: "captureStart", captureId: id });
    documentId = initial.documentId;
    const full = initial.result!.geometry!;
    const geometry: CaptureGeometry = mode === "full" ? full : { ...full, width: full.viewportWidth, height: full.viewportHeight };
    const positions = mode === "full" ? capturePositions(geometry) : [{ x: -1, y: -1 }];
    record = { id, title: tab.title || "Screenshot", created: Date.now(), status: "capturing", progress: 0, total: positions.length, geometry, rect };
    await saveCapture(record);
    for (const [index, position] of positions.entries()) {
      const [active] = await chrome.tabs.query({ active: true, windowId: tab.windowId });
      const current = await chrome.tabs.get(tab.id);
      if (job.cancelled || active?.id !== tab.id || current.url !== tab.url || current.status === "loading") throw new Error("Screenshot dibatalkan karena tab atau halaman berubah.");
      const moved = await page(tab.id, { action: "captureMove", x: position.x, y: position.y, progress: `Screenshot ${index + 1}/${positions.length}` }, documentId);
      const wait = Math.max(0, 600 - (Date.now() - lastCapture));
      if (wait) await new Promise(resolve => setTimeout(resolve, wait));
      if (job.cancelled) throw new Error("Screenshot dibatalkan.");
      // Verify the active tab again after scrolling/waiting. Never capture another tab.
      const [visible] = await chrome.tabs.query({ active: true, windowId: tab.windowId });
      if (visible?.id !== tab.id) throw new Error("Screenshot dibatalkan karena tab berubah.");
      lastCapture = Date.now();
      const image = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" });
      if (job.cancelled) throw new Error("Screenshot dibatalkan.");
      const blob = await (await fetch(image)).blob();
      await saveCaptureTile({ id: `${id}/${index}`, captureId: id, index, x: mode === "full" ? moved.result!.x! : 0, y: mode === "full" ? moved.result!.y! : 0, image: blob });
      record.progress = index + 1;
      await saveCapture(record);
    }
    record.status = "ready";
    await saveCapture(record);
  } catch (error) {
    record ??= { id, title: tab.title || "Screenshot", created: Date.now(), progress: 0, total: 0, geometry: { width: 1, height: 1, viewportWidth: 1, viewportHeight: 1 }, status: "error" };
    record.status = "error"; record.error = error instanceof Error ? error.message : "Screenshot gagal.";
    await saveCapture(record).catch(() => undefined);
  } finally {
    await page(tab.id, { action: "captureEnd" }, documentId).catch(() => undefined);
    if (captureJob === job) captureJob = undefined;
  }
  // Open only after capture ends: focusing the editor must not interrupt capture.
  if (job.cancelled) return;
  await chrome.tabs.create({ url: chrome.runtime.getURL(`src/pages/tools/capture.html?id=${encodeURIComponent(id)}`) });
}

async function handle(message: ToolsMessage): Promise<ToolReply> {
  const tab = await currentWebTab(message.tabId);
  if (message.type === "tools:status") {
    const [data, volume, settings] = await Promise.all([getPageStatus(tab.id), audioStatus(tab.id), sites()]);
    return { ok: true, data, volume, remembered: Boolean(settings[siteOrigin(tab.url)!]), captureId: captureJob?.tabId === tab.id ? captureJob.id : undefined };
  }
  if (message.type === "tools:page") {
    if (!message.request || !["status", "speed", "reset", "font", "color", "blur", "ruler", "pip", "loop"].includes(message.request.action)) throw new Error("Perintah tools tidak valid.");
    if (message.request.action === "speed") message.request.value = normalizeSpeed(message.request.value!);
    if (message.request.action === "reset") {
      if (captureJob?.tabId === tab.id) captureJob.cancelled = true;
      await boost(tab.id, 100);
      await chrome.tabs.sendMessage(tab.id, { type: "tools:release" }).catch(() => undefined);
      try { await chrome.scripting.executeScript({ target: { tabId: tab.id, allFrames: true }, func: runPageTool, args: [{ action: "reset" }] }); }
      catch { await page(tab.id, { action: "reset" }); }
      return { ok: true, volume: 100, data: { message: "Kontrol halaman dipulihkan." } };
    }
    const result = await page(tab.id, message.request);
    return { ok: true, data: result.result };
  }
  if (message.type === "tools:boost") return boost(tab.id, normalizeVolume(message.volume!));
  if (message.type === "tools:remember") return remember(tab, Boolean(message.enabled), message.speed ?? 1);
  if (message.type === "tools:capture") {
    if (captureJob) throw new Error("Screenshot lain sedang berjalan. Selesaikan atau batalkan dulu.");
    if (!["full", "visible", "area"].includes(message.mode ?? "")) throw new Error("Mode screenshot tidak valid.");
    const id = crypto.randomUUID();
    // Reserve synchronously before the first asynchronous operation.
    captureJob = { id, tabId: tab.id, windowId: tab.windowId, cancelled: false };
    void capture(tab, message.mode!, id).catch(console.error);
    return { ok: true, captureId: id };
  }
  throw new Error("Perintah tools tidak dikenali.");
}

export function initTools(): void {
  chrome.alarms.create("tools-prune-captures", { periodInMinutes: 60 });
  chrome.alarms.onAlarm.addListener(alarm => { if (alarm.name === "tools-prune-captures") void pruneCaptures().catch(console.error); });
  chrome.runtime.onMessage.addListener((message: ToolsMessage, sender, sendResponse) => {
    if (!message || typeof message.type !== "string" || !message.type.startsWith("tools:")) return;
    if (sender.id !== chrome.runtime.id) return;
    if (message.type === "tools:cancelCapture") {
      const job = captureJob;
      if (job && job.id === message.captureId && (sender.url?.startsWith(chrome.runtime.getURL("")) || sender.tab?.id === job.tabId)) {
        job.cancelled = true;
        void page(job.tabId, { action: "captureEnd" }).catch(() => undefined);
      }
      sendResponse({ ok: true }); return;
    }
    if (!sender.url?.startsWith(chrome.runtime.getURL(""))) { sendResponse({ ok: false, error: "Perintah harus berasal dari halaman ekstensi." }); return; }
    void handle(message).then(sendResponse).catch(error => sendResponse({ ok: false, error: error instanceof Error ? error.message : "Tool gagal dijalankan." }));
    return true;
  });
  chrome.tabs.onRemoved.addListener(tabId => {
    if (captureJob?.tabId === tabId) captureJob.cancelled = true;
    void boost(tabId, 100).catch(() => undefined);
  });
  chrome.tabs.onActivated.addListener(info => {
    const job = captureJob;
    if (job?.windowId === info.windowId && job.tabId !== info.tabId) {
      job.cancelled = true;
      void page(job.tabId, { action: "captureEnd" }).catch(() => undefined);
    }
  });
  chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (change.status === "loading") {
      if (captureJob?.tabId === tabId) captureJob.cancelled = true;
      void boost(tabId, 100).catch(() => undefined);
    }
    if (change.status === "complete" && tab.url) void applyRemembered(tabId, tab.url).catch(() => undefined);
  });
  chrome.permissions.onRemoved.addListener(() => {
    void (async () => {
      const settings = await sites();
      const tabs = await chrome.tabs.query({});
      for (const origin of Object.keys(settings)) {
        if (!await chrome.permissions.contains({ origins: [`${origin}/*`] })) {
          delete settings[origin];
          for (const tab of tabs) if (tab.id !== undefined && tab.url && siteOrigin(tab.url) === origin) await chrome.tabs.sendMessage(tab.id, { type: "tools:release" }).catch(() => undefined);
        }
      }
      await chrome.storage.local.set({ [TOOLS_SITES_KEY]: settings });
      const background = chrome.runtime.getManifest().background;
      if (background && "service_worker" in background && !await chrome.permissions.contains({ permissions: ["tabCapture", "offscreen"] })) {
        for (const tab of tabs) if (tab.id !== undefined) await boost(tab.id, 100).catch(() => undefined);
      }
    })().catch(console.error);
  });
}
