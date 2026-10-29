import type { ToolReply } from "../../lib/tools/shared";

interface AudioReply { ok: boolean; volume?: number; needsStream?: boolean; error?: string }
let offscreenCreation: Promise<void> | undefined;
const audioQueues = new Map<number, Promise<unknown>>();

async function ensureOffscreen(): Promise<void> {
  if (!chrome.offscreen) throw new Error("Booster tab tersedia di Chrome/Edge 116+. Firefox mendukung speed control tanpa booster.");
  if (offscreenCreation) return offscreenCreation;
  offscreenCreation = (async () => {
    if (await chrome.offscreen.hasDocument()) return;
    await chrome.offscreen.createDocument({
      url: "src/pages/tools/audio.html",
      reasons: [chrome.offscreen.Reason.USER_MEDIA],
      justification: "Play user-selected tab audio through a local volume control while the extension popup is closed.",
    });
  })();
  try { await offscreenCreation; } finally { offscreenCreation = undefined; }
}
async function audioMessage(message: Record<string, unknown>): Promise<AudioReply> {
  const reply: AudioReply | undefined = await chrome.runtime.sendMessage({ ...message, target: "tools-audio" });
  if (!reply || typeof reply.ok !== "boolean") throw new Error("Kontrol audio tidak merespons. Klik 100%, lalu coba booster lagi.");
  if (!reply.ok) throw new Error(reply.error ?? "Audio gagal diproses.");
  return reply;
}
const captureBusyMessage = "Sesi capture audio tab ini masih aktif. Klik 100% dan coba lagi. Jika tetap gagal, tutup lalu buka kembali tab ini dan klik ikon Siap Dips. Hentikan juga capture dari extension audio/perekam lain jika sedang dipakai.";
async function captureBusy(tabId: number): Promise<boolean> {
  if (!chrome.tabCapture?.getCapturedTabs) return false;
  const captures = await new Promise<chrome.tabCapture.CaptureInfo[]>((resolve, reject) => {
    chrome.tabCapture.getCapturedTabs(tabs => {
      if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
      else resolve(tabs);
    });
  });
  return captures.some(capture => capture.tabId === tabId && ["pending", "active"].includes(capture.status));
}
async function waitForRelease(tabId: number): Promise<boolean> {
  // track.stop() resolves before Chrome necessarily releases its capture slot.
  const deadline = Date.now() + 1500;
  while (await captureBusy(tabId)) {
    if (Date.now() >= deadline) return false;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  return true;
}
export async function audioStatus(tabId: number): Promise<number> {
  if (!chrome.offscreen || !await chrome.permissions.contains({ permissions: ["offscreen"] })) return 100;
  try {
    if (!await chrome.offscreen.hasDocument()) return 100;
    return (await audioMessage({ action: "status", tabId })).volume ?? 100;
  } catch { return 100; }
}
async function stopAudio(tabId: number): Promise<void> {
  // Messaging remains usable when the optional offscreen permission is revoked.
  await audioMessage({ action: "stop", tabId }).catch(() => undefined);
  // Revoked permission can make tabCapture unavailable, but the offscreen stop
  // above must still run to restore the tab's normal playback.
  if (typeof chrome.tabCapture?.getCapturedTabs === "function" && await chrome.permissions.contains({ permissions: ["tabCapture"] }) && !await waitForRelease(tabId)) throw new Error(captureBusyMessage);
}
export async function boost(tabId: number, volume: number): Promise<ToolReply> {
  const queued = audioQueues.get(tabId) ?? Promise.resolve();
  const job = queued.catch(() => undefined).then(async () => {
    if (volume === 100) { await stopAudio(tabId); return { ok: true, volume }; }
    if (!await chrome.permissions.contains({ permissions: ["tabCapture", "offscreen"] })) throw new Error("Izin audio belum diberikan. Aktifkan booster dari Tools.");
    await ensureOffscreen();
    // Ask the persistent owner to update/reuse its session atomically. A status
    // read followed by a separate command can race a worker restart.
    const existing = await audioMessage({ action: "volume", tabId, volume });
    if (!existing.needsStream) return { ok: true, volume: existing.volume ?? volume };
    if (!await waitForRelease(tabId)) throw new Error(captureBusyMessage);
    let streamId: string;
    try {
      streamId = await new Promise<string>((resolve, reject) => {
        chrome.tabCapture.getMediaStreamId({ targetTabId: tabId }, id => {
          if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
          else if (!id) reject(new Error("Sumber audio tab tidak tersedia. Klik ikon Siap Dips di tab ini lalu coba lagi."));
          else resolve(id);
        });
      });
    } catch (error) {
      if (error instanceof Error && /Cannot capture a tab with an active stream/i.test(error.message)) {
        // A capture initialized by an earlier worker may now be ready to reuse.
        const retry = await audioMessage({ action: "volume", tabId, volume });
        if (!retry.needsStream) return { ok: true, volume: retry.volume ?? volume };
        throw new Error(captureBusyMessage);
      }
      throw error;
    }
    try {
      const result = await audioMessage({ action: "volume", tabId, volume, streamId });
      if (result.needsStream) throw new Error("Booster gagal diaktifkan. Klik 100% lalu coba lagi.");
      return { ok: true, volume: result.volume ?? volume };
    } catch (error) {
      await stopAudio(tabId).catch(() => undefined);
      throw error;
    }
  });
  audioQueues.set(tabId, job);
  try { return await job; } finally { if (audioQueues.get(tabId) === job) audioQueues.delete(tabId); }
}
