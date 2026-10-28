import { useCallback, useEffect, useId, useState } from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Camera, Check, ChevronRight, Copy, Focus, GripHorizontal, Loader2, MousePointer2, PictureInPicture2, RefreshCw, ScanLine, SlidersHorizontal, Type, Volume2, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import HideButton from "../hideButton";
import { cleanTrackingUrl, siteOrigin } from "@/lib/tools/shared";
import type { MediaPlayerInfo, PageToolRequest, ToolReply } from "@/lib/tools/shared";

type Section = "media" | "capture" | "inspect";
const sections: Array<{ id: Section; label: string }> = [{ id: "media", label: "Media" }, { id: "capture", label: "Capture" }, { id: "inspect", label: "Inspect" }];

export default function ToolsCard({ listeners, attributes, id = "ToolsCard" }: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
  id?: string;
}) {
  const uid = useId();
  const [section, setSection] = useState<Section>("media");
  const [tab, setTab] = useState<chrome.tabs.Tab>();
  const [players, setPlayers] = useState<MediaPlayerInfo[]>([]);
  const [frameOrigins, setFrameOrigins] = useState<string[]>([]);
  const [playerId, setPlayerId] = useState("all");
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(100);
  const [remembered, setRemembered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loopA, setLoopA] = useState(0);
  const [loopB, setLoopB] = useState(10);
  const [captureId, setCaptureId] = useState<string>();
  const background = chrome.runtime.getManifest().background;
  const boosterSupported = Boolean(background && "service_worker" in background);
  const origin = tab?.url ? siteOrigin(tab.url) : null;

  const refresh = useCallback(async () => {
    setError("");
    try {
      const [current] = await chrome.tabs.query({ active: true, currentWindow: true });
      setTab(current);
      if (!current?.id || !current.url || !siteOrigin(current.url)) throw new Error("Buka halaman web biasa, lalu klik ikon Siap Dips untuk memakai Tools.");
      const result: ToolReply = await chrome.runtime.sendMessage({ type: "tools:status", tabId: current.id });
      if (!result?.ok) throw new Error(result?.error || "Tidak dapat mengakses halaman ini.");
      setPlayers(result.data?.players ?? []);
      setFrameOrigins(result.data?.frameOrigins ?? []);
      setSpeed(result.data?.players?.[0]?.rate ?? 1);
      setVolume(result.volume ?? 100);
      setRemembered(result.remembered ?? false);
      setCaptureId(result.captureId);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Tools belum tersedia."); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  async function send(payload: Record<string, unknown>): Promise<ToolReply> {
    if (tab?.id === undefined) throw new Error("Tab tidak ditemukan.");
    const result: ToolReply = await chrome.runtime.sendMessage({ ...payload, tabId: tab.id });
    if (!result?.ok) throw new Error(result?.error || "Tool gagal dijalankan.");
    return result;
  }
  async function perform(task: () => Promise<void>) {
    setBusy(true); setError(""); setMessage("");
    try { await task(); return true; }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Tool gagal dijalankan."); return false; }
    finally { setBusy(false); }
  }
  async function pageAction(request: PageToolRequest, close = false) {
    await perform(async () => {
      const result = await send({ type: "tools:page", request: { playerId, ...request } });
      setMessage(result.data?.message ?? "Selesai.");
      if (request.action === "reset") { setVolume(100); await refresh(); }
      if (close && /^(chrome|moz)-extension:$/.test(location.protocol)) window.close();
    });
  }
  async function changeSpeed(value: number) {
    setSpeed(value);
    await perform(async () => {
      const result = await send({ type: "tools:page", request: { action: "speed", value, playerId } });
      if (remembered) await send({ type: "tools:remember", enabled: true, speed: value });
      setMessage(result.data?.message ?? "Speed diubah.");
    });
  }
  function changeVolume(value: number) {
    setVolume(value);
    // Request permission directly in the click/keyboard gesture, before awaiting.
    const permission = value === 100 ? Promise.resolve(true) : chrome.permissions.request({ permissions: ["tabCapture", "offscreen"] });
    void perform(async () => {
      if (!await permission) throw new Error("Izin audio tidak diberikan. Volume halaman tetap normal.");
      const result = await send({ type: "tools:boost", volume: value });
      setVolume(result.volume ?? value);
      setMessage(value === 100 ? "Booster dihentikan. Audio kembali normal." : `Volume tab ${value}%. Stop dengan tombol 100%.`);
    }).then(success => { if (!success) void send({ type: "tools:status" }).then(result => setVolume(result.volume ?? 100)).catch(() => setVolume(100)); });
  }
  function toggleRemember() {
    if (!origin) return;
    const enabled = !remembered;
    const permission = enabled ? chrome.permissions.request({ origins: [`${origin}/*`] }) : Promise.resolve(true);
    void perform(async () => {
      if (!await permission) throw new Error("Izin situs tidak diberikan. Tools masih bisa dipakai manual.");
      const result = await send({ type: "tools:remember", enabled, speed });
      setRemembered(result.remembered ?? false);
      setMessage(enabled ? "Speed disimpan untuk situs ini; booster tetap diaktifkan manual." : "Pengaturan otomatis situs dimatikan.");
    });
  }
  async function screenshot(mode: "full" | "visible" | "area") {
    await perform(async () => {
      const result = await send({ type: "tools:capture", mode });
      setCaptureId(result.captureId);
      setMessage("Screenshot berjalan di tab. Editor akan terbuka setelah selesai.");
      if (/^(chrome|moz)-extension:$/.test(location.protocol)) window.close();
    });
  }
  const unavailable = busy || !origin;
  const toolButton = (label: string, detail: string, Icon: typeof Type, action: () => void) => (
    <button type="button" disabled={unavailable} onClick={action} className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/60 disabled:opacity-50 disabled:cursor-not-allowed">
      <Icon className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
      <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{label}</span><span className="block text-xs leading-relaxed text-muted-foreground">{detail}</span></span>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
    </button>
  );
  return (
    <Card className="group relative w-full overflow-hidden dark:bg-gray-800 dark:border-gray-700" data-tools-card>
      <HideButton id={id} classNames="group-hover:flex hidden transition-all duration-300" />
      <Button variant="ghost" size="icon" aria-label="Geser kartu Tools" className="h-8 w-full rounded-b-none border-b dark:border-gray-700" {...attributes} {...listeners}><GripHorizontal aria-hidden="true" /></Button>
      <CardHeader className="space-y-3 px-4 pb-3 pt-4">
        <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500"><Wrench className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="text-xl tracking-tight">Tools etc</CardTitle><Button className="ml-auto h-7 w-7" size="icon" variant="ghost" onClick={() => void refresh()} disabled={busy} aria-label="Refresh tools"><RefreshCw className="h-3.5 w-3.5" /></Button></div>
        <p className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${origin ? "bg-blue-500" : "bg-gray-400"}`} /><span className="truncate">{origin ? new URL(origin).hostname : "Pilih halaman web"}</span><span className="ml-auto shrink-0 rounded border px-1.5 py-0.5 text-[10px]">Tab ini</span></p>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
        <div role="tablist" aria-label="Kategori tools" className="grid grid-cols-3 gap-1 rounded-lg bg-muted/70 p-1">
          {sections.map(item => <button key={item.id} id={`${uid}-${item.id}-tab`} role="tab" aria-selected={section === item.id} aria-controls={`${uid}-${item.id}`} tabIndex={section === item.id ? 0 : -1} onKeyDown={event => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const index = sections.findIndex(s => s.id === section);
            const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : (index + (event.key === "ArrowRight" ? 1 : 2)) % 3;
            setSection(sections[next].id); document.getElementById(`${uid}-${sections[next].id}-tab`)?.focus();
          }} onClick={() => setSection(item.id)} className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${section === item.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{item.label}</button>)}
        </div>
        <div role="tabpanel" id={`${uid}-${section}`} aria-labelledby={`${uid}-${section}-tab`} className="space-y-4">
          {section === "media" && <>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between"><label htmlFor={`${uid}-volume`} className="flex items-center gap-2 text-sm font-medium"><Volume2 className="h-4 w-4 text-blue-500" />Volume booster</label><output htmlFor={`${uid}-volume`} className="font-mono text-xl font-semibold tracking-tight text-blue-500">{volume}%</output></div>
              <input id={`${uid}-volume`} type="range" min="0" max="500" step="10" value={volume} disabled={unavailable || !boosterSupported} onChange={event => setVolume(Number(event.target.value))} onPointerUp={event => changeVolume(Number(event.currentTarget.value))} onKeyUp={event => { if (["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(event.key)) changeVolume(Number(event.currentTarget.value)); }} className="w-full accent-blue-500 disabled:opacity-40" />
              <div className="flex justify-between font-mono text-[10px] text-muted-foreground"><span>0%</span><span>100% normal</span><span>500%</span></div>
              <div className="grid grid-cols-4 gap-1.5">{[0, 100, 200, 500].map(value => <Button key={value} size="sm" variant={volume === value ? "secondary" : "outline"} className="h-7 px-1 text-xs" disabled={unavailable || !boosterSupported} onClick={() => changeVolume(value)}>{value === 0 ? "Mute" : `${value}%`}</Button>)}</div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">{boosterSupported ? "Klik preset atau lepas slider untuk menerapkan. Boost tinggi bisa mendistorsi audio; 100% menghentikan booster." : "Booster 500% tersedia di Chrome/Edge. Speed control tetap bisa dipakai di Firefox."}</p>
            </div>
            <div className="space-y-3 border-t pt-4 dark:border-gray-700">
              <div className="flex items-center justify-between"><label htmlFor={`${uid}-speed`} className="flex items-center gap-2 text-sm font-medium"><SlidersHorizontal className="h-4 w-4 text-blue-500" />Playback speed</label><output htmlFor={`${uid}-speed`} className="font-mono text-xl font-semibold tracking-tight text-blue-500">{speed}×</output></div>
              <label className="block space-y-1 text-xs text-muted-foreground"><span>Player</span><select aria-label="Pilih player" value={playerId} disabled={unavailable} onChange={event => { const selected = event.target.value; setPlayerId(selected); const media = players.find(p => p.id === selected); if (media) setSpeed(media.rate); }} className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground"><option value="all">Semua player di halaman utama</option>{players.map(player => <option key={player.id} value={player.id}>{player.title}{player.paused ? " · paused" : " · playing"}</option>)}</select></label>
              <input id={`${uid}-speed`} type="range" min="0.25" max="4" step="0.05" value={speed} disabled={unavailable} onChange={event => setSpeed(Number(event.target.value))} onPointerUp={event => void changeSpeed(Number(event.currentTarget.value))} onKeyUp={event => { if (["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(event.key)) void changeSpeed(Number(event.currentTarget.value)); }} className="w-full accent-blue-500" />
              <div className="grid grid-cols-5 gap-1.5">{[1, 1.5, 2, 3, 4].map(value => <Button key={value} size="sm" variant={speed === value ? "secondary" : "outline"} className="h-7 px-1 text-xs" disabled={unavailable} onClick={() => void changeSpeed(value)}>{value}×</Button>)}</div>
              <label className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed"><input type="checkbox" className="mt-0.5 accent-blue-500" checked={remembered} disabled={unavailable} onChange={toggleRemember} /><span>Ingat speed untuk situs ini<span className="block text-[10px] text-muted-foreground">Minta akses situs untuk menerapkan otomatis.</span></span></label>
              {!players.length && <p className="text-[11px] text-muted-foreground">Player belum terdeteksi. Buka videonya, lalu refresh. Embed dari situs lain mungkin memerlukan izin situs player.</p>}
              {frameOrigins.length > 0 && <details className="rounded-lg border p-3 text-xs dark:border-gray-700"><summary className="cursor-pointer font-medium">Akses player embedded</summary><p className="my-2 text-muted-foreground">Izinkan hanya domain player yang ingin dikontrol. Beberapa embed perlu dimuat ulang setelah izin diberikan.</p>{frameOrigins.map(frameOrigin => <Button key={frameOrigin} size="sm" variant="outline" className="my-1 w-full overflow-hidden text-xs" disabled={unavailable} onClick={() => {
                const permission = chrome.permissions.request({ origins: [`${frameOrigin}/*`] });
                void perform(async () => { if (!await permission) throw new Error("Izin embed tidak diberikan."); await refresh(); setMessage("Izin embed diberikan. Jika player belum muncul, muat ulang halaman."); });
              }}>Izinkan {new URL(frameOrigin).hostname}</Button>)}</details>}
              {toolButton("Picture-in-Picture", "Buka video dalam jendela mengambang", PictureInPicture2, () => void pageAction({ action: "pip" }, true))}
              <details className="rounded-lg border p-3 text-xs dark:border-gray-700"><summary className="cursor-pointer font-medium">A–B loop</summary><div className="mt-3 flex items-end gap-2"><label className="min-w-0 flex-1">A · detik<input aria-label="Loop A detik" type="number" min="0" step="0.1" value={loopA} onChange={event => setLoopA(Number(event.target.value))} className="mt-1 w-full rounded border bg-background p-1.5" /></label><label className="min-w-0 flex-1">B · detik<input aria-label="Loop B detik" type="number" min="0" step="0.1" value={loopB} onChange={event => setLoopB(Number(event.target.value))} className="mt-1 w-full rounded border bg-background p-1.5" /></label></div><div className="mt-2 flex gap-2"><Button size="sm" variant="secondary" disabled={unavailable} onClick={() => void pageAction({ action: "loop", start: loopA, end: loopB })}>Mulai loop</Button><Button size="sm" variant="ghost" disabled={unavailable} onClick={() => void pageAction({ action: "loop" })}>Stop loop</Button></div></details>
            </div>
          </>}
          {section === "capture" && <div className="space-y-2">
            {toolButton("Full page screenshot", "Scroll otomatis dan gabungkan halaman", Camera, () => void screenshot("full"))}
            {toolButton("Visible area", "Ambil area yang sedang terlihat", ScanLine, () => void screenshot("visible"))}
            {toolButton("Select area", "Tarik area yang ingin disimpan", MousePointer2, () => void screenshot("area"))}
            <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">Hasil diproses lokal. Editor menyediakan crop, blur, dan simpan PNG. Tunggu di tab yang sama sampai selesai; konten lazy-load atau halaman sangat panjang bisa terbatas.</p>
            {captureId && <Button variant="outline" size="sm" className="w-full" onClick={() => void chrome.runtime.sendMessage({ type: "tools:cancelCapture", captureId }).then(() => { setCaptureId(undefined); setMessage("Pembatalan screenshot diminta."); })}>Batalkan screenshot</Button>}
          </div>}
          {section === "inspect" && <div className="space-y-2">
            {toolButton("FontWhat", "Hover teks → pin → salin detail font CSS", Type, () => void pageAction({ action: "font" }, true))}
            {toolButton("Warna elemen", "Inspeksi warna teks, background, dan border", Focus, () => void pageAction({ action: "color" }, true))}
            {toolButton("Blur elemen", "Samarkan informasi sebelum screenshot", MousePointer2, () => void pageAction({ action: "blur" }, true))}
            {toolButton("Reading ruler", "Panduan baris saat membaca · Esc untuk keluar", ScanLine, () => void pageAction({ action: "ruler" }, true))}
            {toolButton("Salin link bersih", "Hapus parameter tracking umum seperti utm_*", Copy, () => void perform(async () => { if (!tab?.url) throw new Error("Link tidak tersedia."); await navigator.clipboard.writeText(cleanTrackingUrl(tab.url)); setMessage("Link bersih disalin."); }))}
            <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">FontWhat membaca font-family CSS, bukan identifikasi font dari gambar. Klik elemen untuk pin; Esc untuk menutup mode inspeksi.</p>
          </div>}
        </div>
        <Button variant="secondary" size="sm" className="w-full" disabled={unavailable} onClick={() => void pageAction({ action: "reset" })}><RefreshCw className="h-3.5 w-3.5" />Reset tools di tab ini</Button>
        <div aria-live="polite" className="space-y-1 text-xs leading-relaxed">
          {busy && <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />Memproses…</p>}
          {message && <p className="flex items-start gap-1.5 text-blue-600 dark:text-blue-400"><Check className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />{message}</p>}
          {error && <p role="alert" className="text-destructive">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
