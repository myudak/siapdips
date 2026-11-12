import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Copy, GripHorizontal, Loader2, Maximize2, Minimize2, Play, RefreshCw, Save, Settings2, TerminalSquare, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import HideButton from "../hideButton";
import { CONSOLE_DRAFT_KEY, CONSOLE_SNIPPETS_KEY, DEFAULT_SCRIPT, MAX_SCRIPT_LENGTH, consoleOrigin, consoleSitePattern, readConsoleSnippets, validateConsoleCode } from "../../lib/dev-console/shared";
import type { ConsoleReply, ConsoleRun, ConsoleSnippet, ConsoleStatus, ConsoleWorld } from "../../lib/dev-console/shared";

export default function DevConsoleCard({ listeners, attributes, id = "DevConsoleCard" }: {
  listeners?: DraggableAttributes; attributes?: SyntheticListenerMap; id?: string;
}) {
  const uid = useId();
  const [tab, setTab] = useState<chrome.tabs.Tab>();
  const [availability, setAvailability] = useState<ConsoleStatus>();
  const [code, setCode] = useState(DEFAULT_SCRIPT);
  const [world, setWorld] = useState<ConsoleWorld>("USER_SCRIPT");
  const [expanded, setExpanded] = useState(false);
  const [snippets, setSnippets] = useState<ConsoleSnippet[]>([]);
  const [selected, setSelected] = useState("");
  const [name, setName] = useState("");
  const [run, setRun] = useState<ConsoleRun>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const launching = useRef(false);
  const editor = useRef<HTMLTextAreaElement>(null);
  const origin = tab?.url ? consoleOrigin(tab.url) : null;
  const running = run?.status === "running";

  const refresh = useCallback(async () => {
    setError("");
    try {
      const [current] = await chrome.tabs.query({ active: true, currentWindow: true });
      setTab(current);
      if (current?.id === undefined || !current.url || !consoleOrigin(current.url)) {
        setAvailability(undefined); setRun(undefined);
        throw new Error("Buka halaman web, lalu klik ikon Siap Dips untuk memilih tab tujuan.");
      }
      const response: ConsoleReply = await chrome.runtime.sendMessage({ type: "console:status", tabId: current.id });
      if (!response?.ok) throw new Error(response?.error || "Status console tidak tersedia.");
      setAvailability(response.availability);
      setRun(response.run?.url === current.url ? response.run : undefined);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Console tidak tersedia."); }
  }, []);
  useEffect(() => {
    void refresh();
    let cancelled = false;
    void chrome.storage.local.get([CONSOLE_DRAFT_KEY, CONSOLE_SNIPPETS_KEY]).then(stored => {
      if (cancelled) return;
      const draft = stored[CONSOLE_DRAFT_KEY];
      if (draft && typeof draft.code === "string" && draft.code.length <= MAX_SCRIPT_LENGTH) {
        setCode(draft.code); setWorld(draft.world === "MAIN" ? "MAIN" : "USER_SCRIPT");
      }
      setSnippets(readConsoleSnippets(stored[CONSOLE_SNIPPETS_KEY]));
    }).catch(cause => { if (!cancelled) setError(`Draft tidak dapat dibaca: ${String(cause)}`); });
    return () => { cancelled = true; };
  }, [refresh]);
  useEffect(() => {
    if (!running || tab?.id === undefined) return;
    const tabId = tab.id;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const response: ConsoleReply = await chrome.runtime.sendMessage({ type: "console:status", tabId });
        if (cancelled) return;
        if (!response?.ok) throw new Error(response?.error || "Status eksekusi tidak tersedia.");
        setRun(response.run);
        if (response.run?.status === "running") timer = setTimeout(() => void poll(), 700);
      } catch (cause) { if (!cancelled) setError(cause instanceof Error ? cause.message : "Gagal membaca hasil."); }
    };
    timer = setTimeout(() => void poll(), 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [running, tab?.id]);

  function updateDraft(nextCode: string, nextWorld = world) {
    setCode(nextCode); setWorld(nextWorld);
    void chrome.storage.local.set({ [CONSOLE_DRAFT_KEY]: { code: nextCode, world: nextWorld } }).catch(() => setError("Draft tidak berhasil disimpan."));
  }
  async function execute() {
    if (launching.current || running || tab?.id === undefined || !tab.url) return;
    setError(""); setNotice("");
    try { validateConsoleCode(code); } catch (cause) { setError((cause as Error).message); return; }
    const pattern = consoleSitePattern(tab.url);
    if (!pattern) return;
    // Start the permission request in the button/keyboard user gesture.
    const permission = chrome.permissions.request({ origins: [pattern] });
    launching.current = true; setBusy(true);
    try {
      if (!await permission) throw new Error("Akses situs tidak diberikan. Script belum dijalankan.");
      const response: ConsoleReply = await chrome.runtime.sendMessage({ type: "console:run", tabId: tab.id, url: tab.url, code, world });
      if (!response?.ok) throw new Error(response?.error || "Script gagal dijalankan.");
      setRun(response.run);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Eksekusi gagal."); }
    finally { launching.current = false; setBusy(false); }
  }
  async function enable() {
    setError("");
    try {
      if (availability?.state === "permission") {
        if (!await chrome.permissions.request({ permissions: ["userScripts"] })) throw new Error("Izin User Scripts tidak diberikan.");
        await refresh();
      } else {
        const scheme = navigator.userAgent.includes("Edg/") ? "edge" : "chrome";
        await chrome.tabs.create({ url: `${scheme}://extensions/?id=${chrome.runtime.id}` });
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Pengaturan tidak dapat dibuka."); }
  }
  async function storeSnippets(next: ConsoleSnippet[]) {
    await chrome.storage.local.set({ [CONSOLE_SNIPPETS_KEY]: next });
    setSnippets(next);
  }
  async function saveSnippet() {
    setError(""); setNotice("");
    try {
      validateConsoleCode(code);
      if (!name.trim()) throw new Error("Beri nama snippet dulu.");
      if (!selected && snippets.length >= 20) throw new Error("Maksimal 20 snippet. Hapus atau perbarui salah satunya.");
      const snippet = { id: selected || crypto.randomUUID(), name: name.trim().slice(0, 60), code, world };
      await storeSnippets([...snippets.filter(item => item.id !== snippet.id), snippet]);
      setSelected(snippet.id); setNotice("Snippet tersimpan di perangkat ini.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Snippet gagal disimpan."); }
  }
  const output = [
    ...(run?.report?.logs.map(entry => `[${entry.level}] ${entry.text}`) ?? []),
    ...(run?.report ? [`${run.report.ok ? "←" : "error"} ${run.report.error || run.report.result}`] : []),
    ...(run?.error ? [`error: ${run.error}`] : []),
  ].join("\n");
  const canRun = Boolean(origin && availability?.state === "ready" && !busy && !running);
  return <Card className="group relative w-full overflow-hidden dark:bg-gray-800 dark:border-gray-700" data-dev-console-card>
    <HideButton id={id} classNames="group-hover:flex hidden" />
    <Button variant="ghost" size="icon" className="h-8 w-full rounded-b-none border-b dark:border-gray-700" aria-label="Geser kartu Dev Console" {...attributes} {...listeners}><GripHorizontal aria-hidden="true" /></Button>
    <CardHeader className="space-y-3 px-4 pb-3 pt-4">
      <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><TerminalSquare className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="text-xl tracking-tight">Dev Console</CardTitle><Button size="icon" variant="ghost" className="ml-auto h-7 w-7" onClick={() => void refresh()} disabled={busy || running} aria-label="Refresh target console"><RefreshCw className="h-3.5 w-3.5" /></Button></div>
      <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground"><span className={`h-1.5 w-1.5 rounded-full ${origin ? "bg-emerald-500" : "bg-gray-400"}`} /><span className="truncate" title={tab?.url}>{origin || "Pilih halaman web"}</span><span className="ml-auto shrink-0 rounded border px-1.5 py-0.5 text-[10px]">Tab tujuan</span></div>
    </CardHeader>
    <CardContent className="space-y-3 px-4 pb-4">
      {availability && availability.state !== "ready" && <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs leading-relaxed"><p>{availability.message}</p>{availability.state !== "unsupported" && <Button size="sm" variant="outline" onClick={() => void enable()}><Settings2 className="h-3.5 w-3.5" />{availability.state === "permission" ? "Aktifkan User Scripts" : "Buka pengaturan extension"}</Button>}</div>}
      <label className="flex items-center gap-2 text-xs text-muted-foreground" htmlFor={`${uid}-world`}>Jalankan di<select id={`${uid}-world`} className="ml-auto rounded-md border bg-background px-2 py-1.5 text-foreground" value={world} disabled={busy || running} onChange={event => updateDraft(code, event.target.value as ConsoleWorld)}><option value="USER_SCRIPT">DOM · isolated</option><option value="MAIN">Page · globals situs</option></select></label>
      <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-800 px-3 py-1.5"><label htmlFor={`${uid}-code`} className="font-mono text-[10px] tracking-widest text-emerald-400">JAVASCRIPT</label><button type="button" className="rounded p-1 text-slate-400 hover:text-white focus-visible:outline focus-visible:outline-2" aria-label={expanded ? "Ringkas editor" : "Perbesar editor"} aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}</button></div>
        <textarea ref={editor} id={`${uid}-code`} aria-label="JavaScript editor" className={`block w-full resize-y bg-transparent p-3 font-mono text-xs leading-6 text-slate-100 outline-none focus:ring-1 focus:ring-inset focus:ring-emerald-500 ${expanded ? "min-h-[320px]" : "min-h-[156px]"}`} spellCheck={false} autoCapitalize="off" autoCorrect="off" value={code} maxLength={MAX_SCRIPT_LENGTH} onChange={event => updateDraft(event.target.value)} onKeyDown={event => {
          if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); if (canRun) void execute(); }
          if (event.key === "Tab") {
            event.preventDefault(); const { selectionStart: start, selectionEnd: end } = event.currentTarget;
            updateDraft(code.slice(0, start) + "  " + code.slice(end));
            requestAnimationFrame(() => editor.current?.setSelectionRange(start + 2, start + 2));
          }
        }} />
        <div className="flex items-center justify-between border-t border-slate-800 px-3 py-2"><span className="font-mono text-[10px] text-slate-400">Ctrl / ⌘ + Enter</span><Button size="sm" className="h-7 bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-500" disabled={!canRun} onClick={() => void execute()}>{busy || running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}{running ? "Running…" : "Run"}</Button></div>
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">Jalankan manual di tab tujuan. Gunakan <code>console.log()</code> untuk log, <code>return</code> untuk hasil, dan <code>await</code> untuk proses async.</p>
      <div className="overflow-hidden rounded-lg border dark:border-gray-700"><div className="flex items-center gap-2 border-b px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground dark:border-gray-700"><span>Output</span>{run?.report && <span className="font-mono normal-case tracking-normal">{Math.round(run.report.duration)} ms</span>}<button type="button" aria-label="Copy console output" className="ml-auto rounded p-1 hover:text-foreground disabled:opacity-30" disabled={!output} onClick={() => void navigator.clipboard.writeText(output).then(() => setNotice("Output disalin.")).catch(() => setError("Output tidak dapat disalin."))}><Copy size={13} /></button><button type="button" aria-label="Clear console output" className="rounded p-1 hover:text-foreground disabled:opacity-30" disabled={running} onClick={() => { setRun(undefined); setError(""); setNotice(""); if (tab?.id !== undefined) void chrome.storage.session.remove(`devConsoleRun:${tab.id}`); }}><Trash2 size={13} /></button></div><div className="max-h-64 min-h-20 overflow-auto p-3 font-mono text-[11px] leading-relaxed" role="log" aria-label="Console output"><p className="mb-1 text-[10px] text-muted-foreground">{run ? `${new URL(run.url).host} · ${run.world === "MAIN" ? "Page" : "DOM"}` : "Hasil script akan muncul di sini."}</p>{run?.status === "running" && <p className="text-emerald-500">Menunggu hasil… Script tetap berjalan bila popup ditutup.</p>}{run?.report?.logs.map((entry, index) => <pre key={index} className={`whitespace-pre-wrap break-words ${entry.level === "error" ? "text-red-500" : entry.level === "warn" ? "text-amber-500" : "text-foreground"}`}><span className="mr-2 opacity-50">{entry.level}</span>{entry.text}</pre>)}{run?.report && <pre className={`mt-2 whitespace-pre-wrap break-words border-t pt-2 ${run.report.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>{run.report.ok ? "← " + run.report.result : run.report.error}</pre>}{run?.error && <pre className="whitespace-pre-wrap break-words text-red-500">{run.error}</pre>}{run?.report?.truncated && <p className="mt-2 text-amber-500">Output dipotong agar tetap responsif.</p>}</div></div>
      <details className="rounded-lg border p-3 text-xs dark:border-gray-700"><summary className="cursor-pointer font-medium">Snippet tersimpan <span className="text-muted-foreground">({snippets.length}/20)</span></summary><div className="mt-3 space-y-2"><select aria-label="Pilih snippet" className="w-full rounded-md border bg-background p-2" value={selected} onChange={event => {
        const value = event.target.value; setSelected(value);
        const snippet = snippets.find(item => item.id === value);
        if (snippet) { setName(snippet.name); updateDraft(snippet.code, snippet.world); } else setName("");
      }}><option value="">Snippet baru</option>{snippets.map(snippet => <option key={snippet.id} value={snippet.id}>{snippet.name}</option>)}</select><label className="block"><span className="sr-only">Nama snippet</span><input className="w-full rounded-md border bg-background p-2" placeholder="Nama snippet" value={name} maxLength={60} onChange={event => setName(event.target.value)} /></label><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => void saveSnippet()}><Save className="h-3.5 w-3.5" />{selected ? "Perbarui" : "Simpan"}</Button><Button size="sm" variant="ghost" disabled={!selected} onClick={() => void storeSnippets(snippets.filter(item => item.id !== selected)).then(() => { setSelected(""); setName(""); setNotice("Snippet dihapus."); }).catch(() => setError("Snippet tidak dapat dihapus."))}><Trash2 className="h-3.5 w-3.5" />Hapus</Button></div></div></details>
      <div className="text-xs leading-relaxed" aria-live="polite">{notice && <p className="text-emerald-600 dark:text-emerald-400">{notice}</p>}{error && <p className="text-destructive" role="alert">{error}</p>}</div>
    </CardContent>
  </Card>;
}
