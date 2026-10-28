import type { PageToolRequest, PageToolResult, CaptureGeometry, ToolRect } from "./shared";

/** Serialized by scripting.executeScript. Keep all runtime dependencies inside. */
export async function runPageTool(request: PageToolRequest): Promise<PageToolResult> {
  interface PageState {
    players: Map<string, HTMLMediaElement>;
    originals: Map<HTMLMediaElement, { rate: number; defaultRate: number }>;
    nextId: number;
    listening?: boolean;
    speed?: number;
    playerId: string;
    mediaAbort?: AbortController;
    observer?: MutationObserver;
    mediaTimer?: ReturnType<typeof setTimeout>;
    stopInspector?: () => void;
    stopRuler?: () => void;
    unblur: Map<HTMLElement, { value: string; priority: string }>;
    capture?: { finish: () => void; move: (x: number, y: number, progress: string) => Promise<{ x: number; y: number }>; geometry: CaptureGeometry };
  }
  const scope = window as Window & { __siapDipsToolsV1?: PageState };
  const state: PageState = scope.__siapDipsToolsV1 ??= {
    players: new Map(), originals: new Map(), nextId: 0, playerId: "all", unblur: new Map(),
  };
  function resetPage(): void {
    state.mediaAbort?.abort(); state.mediaAbort = undefined;
    state.observer?.disconnect(); state.observer = undefined;
    clearTimeout(state.mediaTimer); state.speed = undefined;
    for (const [media, original] of state.originals) { media.playbackRate = original.rate; media.defaultPlaybackRate = original.defaultRate; }
    state.originals.clear(); mediaList();
    for (const media of state.players.values()) {
      const loopMedia = media as HTMLMediaElement & { __siapLoop?: () => void };
      loopMedia.__siapLoop?.(); delete loopMedia.__siapLoop;
    }
    state.stopInspector?.(); state.stopRuler?.(); unblur(); state.capture?.finish();
    document.getElementById("siapdips-pip-prompt")?.remove();
  }
  if (!state.listening && typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((message, sender, respond) => {
      if (message?.type !== "tools:release" || sender.id !== chrome.runtime.id) return;
      resetPage(); respond({ ok: true });
    });
    state.listening = true;
  }
  function mediaList(): HTMLMediaElement[] {
    for (const [id, media] of state.players) if (!media.isConnected) state.players.delete(id);
    const elements = Array.from(document.querySelectorAll<HTMLMediaElement>("video, audio"));
    for (const media of elements) {
      if (![...state.players.values()].includes(media)) state.players.set(String(++state.nextId), media);
    }
    return elements;
  }
  function selectedMedia(): HTMLMediaElement[] {
    const all = mediaList();
    if (state.playerId === "all") return all;
    const selected = state.players.get(state.playerId);
    if (selected?.isConnected) return [selected];
    // SPA navigation may replace the selected player. Prefer the largest video.
    const replacement = [...all].sort((a, b) => {
      const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
      return br.width * br.height - ar.width * ar.height;
    })[0];
    return replacement ? [replacement] : [];
  }
  function setSpeed(): void {
    if (state.speed === undefined) return;
    for (const media of selectedMedia()) {
      if (media.srcObject instanceof MediaStream) continue;
      if (!state.originals.has(media)) state.originals.set(media, { rate: media.playbackRate, defaultRate: media.defaultPlaybackRate });
      if (Math.abs(media.playbackRate - state.speed) > 0.001) media.playbackRate = state.speed;
      if (Math.abs(media.defaultPlaybackRate - state.speed) > 0.001) media.defaultPlaybackRate = state.speed;
    }
  }
  function startMedia(): void {
    if (state.mediaAbort) return;
    const abort = state.mediaAbort = new AbortController();
    document.addEventListener("ratechange", () => setSpeed(), { capture: true, signal: abort.signal });
    document.addEventListener("loadedmetadata", () => setSpeed(), { capture: true, signal: abort.signal });
    state.observer = new MutationObserver(records => {
      if (!records.some(record => [...record.addedNodes].some(node => node instanceof Element && (node.matches("video,audio") || node.querySelector("video,audio"))))) return;
      clearTimeout(state.mediaTimer);
      state.mediaTimer = setTimeout(setSpeed, 100);
    });
    state.observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  function hostPanel(): { host: HTMLElement; root: ShadowRoot; panel: HTMLDivElement } {
    const host = document.createElement("div");
    host.dataset.siapdipsTool = "true";
    host.style.cssText = "all:initial!important;position:fixed!important;inset:0!important;z-index:2147483647!important;pointer-events:none!important;";
    const root = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `*{box-sizing:border-box} .panel{position:fixed;right:20px;top:20px;max-width:min(340px,calc(100vw - 32px));padding:16px;background:#111827;color:#f9fafb;border:1px solid #475569;border-radius:12px;box-shadow:0 12px 40px #0005;font:13px/1.55 system-ui,sans-serif;pointer-events:auto;word-break:break-word}button{font:inherit;border:1px solid #475569;border-radius:6px;background:#1e293b;color:#fff;padding:6px 10px;cursor:pointer;margin:8px 5px 0 0}button:hover{background:#334155}.muted{color:#94a3b8;font-size:11px;margin-top:7px}.heading{font-weight:700;margin-bottom:8px}.highlight{position:fixed;pointer-events:none;outline:2px solid #60a5fa;background:#3b82f615;border-radius:2px}`;
    const panel = document.createElement("div");
    panel.className = "panel";
    panel.setAttribute("role", "status");
    root.append(style, panel);
    document.documentElement.append(host);
    return { host, root, panel };
  }
  function button(label: string, onClick: () => void): HTMLButtonElement {
    const element = document.createElement("button");
    element.textContent = label;
    element.addEventListener("click", onClick);
    return element;
  }
  function unblur(): void {
    for (const [element, original] of state.unblur) {
      if (original.value) element.style.setProperty("filter", original.value, original.priority);
      else element.style.removeProperty("filter");
    }
    state.unblur.clear();
  }
  async function copy(text: string, target: HTMLButtonElement): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      target.textContent = "Tersalin ✓";
    } catch { target.textContent = "Salin tidak diizinkan"; }
  }
  function inspect(mode: "font" | "color" | "blur"): void {
    state.stopInspector?.();
    const { host, root, panel } = hostPanel();
    const abort = new AbortController();
    const highlight = document.createElement("div");
    highlight.className = "highlight";
    root.append(highlight);
    let pinned = false;
    let details = "";
    const heading = document.createElement("div");
    heading.className = "heading";
    heading.textContent = mode === "font" ? "FontWhat" : mode === "color" ? "Warna elemen" : "Blur elemen";
    const body = document.createElement("div");
    body.textContent = "Arahkan kursor ke elemen halaman.";
    const hint = document.createElement("div");
    hint.className = "muted";
    hint.textContent = mode === "blur" ? "Klik elemen untuk blur. Esc untuk selesai." : "Klik elemen untuk pin. Esc untuk keluar.";
    const copyButton = button("Salin detail", () => { void copy(details, copyButton); });
    const cleanup = () => { abort.abort(); host.remove(); state.stopInspector = undefined; };
    panel.append(heading, body, hint);
    if (mode !== "blur") panel.append(copyButton, button("Pilih lagi", () => { pinned = false; }));
    else panel.append(button("Hapus semua blur", unblur));
    panel.append(button("Selesai", cleanup));
    function target(event: MouseEvent): Element | null {
      let element = document.elementFromPoint(event.clientX, event.clientY);
      // Inspect accessible open shadow roots without reading across origins.
      while (element?.shadowRoot?.elementFromPoint(event.clientX, event.clientY)) {
        const inner = element.shadowRoot.elementFromPoint(event.clientX, event.clientY);
        if (!inner || inner === element) break;
        element = inner;
      }
      return element && element !== host && element !== document.documentElement ? element : null;
    }
    const move = (event: MouseEvent) => {
      if (pinned || event.composedPath().includes(host)) return;
      const element = target(event);
      if (!element) return;
      const rect = element.getBoundingClientRect();
      Object.assign(highlight.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
      const css = getComputedStyle(element);
      details = mode === "font"
        ? `Font-family (CSS): ${css.fontFamily}\nSize: ${css.fontSize}\nWeight: ${css.fontWeight}\nLine-height: ${css.lineHeight}\nLetter-spacing: ${css.letterSpacing}\nColor: ${css.color}`
        : `Text: ${css.color}\nBackground: ${css.backgroundColor}\nBorder: ${css.borderTopColor}`;
      body.style.whiteSpace = "pre-wrap";
      body.textContent = mode === "blur" ? "Klik untuk menyamarkan elemen ini." : details;
      copyButton.textContent = "Salin detail";
    };
    document.addEventListener("mousemove", move, { capture: true, signal: abort.signal });
    document.addEventListener("click", event => {
      if (event.composedPath().includes(host)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      move(event);
      const element = target(event);
      if (mode === "blur" && element instanceof HTMLElement) {
        if (!state.unblur.has(element)) state.unblur.set(element, { value: element.style.getPropertyValue("filter"), priority: element.style.getPropertyPriority("filter") });
        element.style.setProperty("filter", "blur(8px)", "important");
        body.textContent = `${state.unblur.size} elemen diblur. Reset tools untuk memulihkan.`;
      } else pinned = true;
    }, { capture: true, signal: abort.signal });
    document.addEventListener("keydown", event => { if (event.key === "Escape") cleanup(); }, { capture: true, signal: abort.signal });
    state.stopInspector = cleanup;
  }

  if (request.action === "status") {
    mediaList();
    const frameOrigins = [...new Set([...document.querySelectorAll("iframe[src]")].flatMap(frame => {
      try { const url = new URL(frame.getAttribute("src")!, location.href); return /^https?:$/.test(url.protocol) && url.origin !== location.origin ? [url.origin] : []; }
      catch { return []; }
    }))];
    return { frameOrigins, players: [...state.players].map(([id, media]) => ({ id, kind: media.tagName.toLowerCase(), title: media.getAttribute("aria-label") || media.title || `${media.tagName === "VIDEO" ? "Video" : "Audio"} ${id}`, rate: media.playbackRate, time: media.currentTime, paused: media.paused })) };
  }
  if (request.action === "speed") {
    if (!Number.isFinite(request.value) || request.value! < 0.25 || request.value! > 4) throw new Error("Speed harus 0.25–4×.");
    state.playerId = request.playerId ?? "all";
    const targets = selectedMedia();
    if (targets.length && targets.every(media => media.srcObject instanceof MediaStream)) throw new Error("Player live/MediaStream ini tidak mendukung perubahan speed.");
    state.speed = request.value;
    startMedia();
    setSpeed();
    return { message: selectedMedia().length ? "Speed diterapkan. Reset untuk melepas kunci speed." : "Speed siap diterapkan saat player muncul." };
  }
  if (request.action === "reset") {
    resetPage();
    return { message: "Kontrol halaman dipulihkan." };
  }
  if (request.action === "font" || request.action === "color" || request.action === "blur") {
    inspect(request.action);
    return { message: "Mode aktif di halaman. Esc untuk keluar." };
  }
  if (request.action === "ruler") {
    if (state.stopRuler) { state.stopRuler(); return { message: "Reading ruler dimatikan." }; }
    const { host, root, panel } = hostPanel();
    panel.remove();
    const band = document.createElement("div");
    band.style.cssText = "position:fixed;left:0;right:0;height:70px;top:40vh;border-block:1px solid #60a5fa;box-shadow:0 -10000px 0 10000px #0006,0 10000px 0 10000px #0006;pointer-events:none;";
    // Use two shades so the reading window stays fully transparent.
    band.style.boxShadow = "0 -10035px 0 10000px #0006,0 10035px 0 10000px #0006";
    root.append(band);
    const abort = new AbortController();
    const cleanup = () => { abort.abort(); host.remove(); state.stopRuler = undefined; };
    document.addEventListener("mousemove", event => { band.style.top = `${event.clientY - 35}px`; }, { passive: true, signal: abort.signal });
    document.addEventListener("keydown", event => { if (event.key === "Escape") cleanup(); }, { signal: abort.signal });
    state.stopRuler = cleanup;
    return { message: "Reading ruler aktif. Esc untuk keluar." };
  }
  if (request.action === "pip") {
    state.playerId = request.playerId ?? "all";
    const video = selectedMedia().find((media): media is HTMLVideoElement => media instanceof HTMLVideoElement);
    if (!video) throw new Error("Tidak ada video pada frame ini.");
    if (!document.pictureInPictureEnabled || video.disablePictureInPicture) throw new Error("Picture-in-Picture tidak tersedia untuk player ini.");
    if (document.pictureInPictureElement) { await document.exitPictureInPicture(); return { message: "Picture-in-Picture ditutup." }; }
    try { await video.requestPictureInPicture(); }
    catch {
      const { host, panel } = hostPanel(); host.id = "siapdips-pip-prompt";
      panel.textContent = "Klik untuk membuka video mengambang.";
      panel.append(button("Buka Picture-in-Picture", () => { void video.requestPictureInPicture().then(() => host.remove()).catch(() => { panel.firstChild!.textContent = "Player belum siap atau menolak PiP."; }); }), button("Tutup", () => host.remove()));
    }
    return { message: "Jika diminta, klik tombol PiP di halaman." };
  }
  if (request.action === "loop") {
    state.playerId = request.playerId ?? "all";
    const media = selectedMedia()[0];
    if (!media) throw new Error("Player tidak ditemukan.");
    const loopKey = media as HTMLMediaElement & { __siapLoop?: () => void };
    loopKey.__siapLoop?.(); delete loopKey.__siapLoop;
    if (request.start === undefined || request.end === undefined) return { message: "Loop dimatikan." };
    const { start, end } = request;
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start || (Number.isFinite(media.duration) && end > media.duration)) throw new Error("B harus setelah A dan berada dalam durasi media.");
    const tick = () => { if (media.currentTime >= end || media.currentTime < start) media.currentTime = start; };
    media.addEventListener("timeupdate", tick);
    loopKey.__siapLoop = () => media.removeEventListener("timeupdate", tick);
    media.currentTime = start;
    return { message: `Loop ${start.toFixed(1)}–${end.toFixed(1)} detik aktif.` };
  }
  if (request.action === "select") {
    state.stopInspector?.();
    return await new Promise<PageToolResult>((resolve, reject) => {
      const { host, root, panel } = hostPanel();
      host.style.setProperty("pointer-events", "auto", "important");
      host.style.setProperty("cursor", "crosshair", "important");
      const shade = document.createElement("div"); shade.style.cssText = "position:fixed;inset:0;background:#0004";
      const selection = document.createElement("div"); selection.style.cssText = "position:fixed;border:2px solid #60a5fa;background:#3b82f61a;pointer-events:none";
      root.prepend(shade); root.append(selection);
      panel.textContent = "Tarik area screenshot. Esc untuk batal.";
      const abort = new AbortController();
      let origin: { x: number; y: number } | undefined;
      const timeout = setTimeout(() => state.stopInspector?.(), 120000);
      const cleanup = () => { clearTimeout(timeout); abort.abort(); host.remove(); state.stopInspector = undefined; };
      state.stopInspector = () => { cleanup(); reject(new Error("Pemilihan area dibatalkan.")); };
      panel.addEventListener("pointerdown", event => event.stopPropagation());
      host.addEventListener("pointerdown", event => {
        if (event.composedPath().includes(panel)) return;
        event.preventDefault(); origin = { x: event.clientX, y: event.clientY }; host.setPointerCapture(event.pointerId);
      }, { signal: abort.signal });
      host.addEventListener("pointermove", event => {
        if (!origin) return;
        Object.assign(selection.style, { left: `${Math.min(origin.x, event.clientX)}px`, top: `${Math.min(origin.y, event.clientY)}px`, width: `${Math.abs(origin.x - event.clientX)}px`, height: `${Math.abs(origin.y - event.clientY)}px` });
      }, { signal: abort.signal });
      host.addEventListener("pointerup", event => {
        if (!origin) return;
        const x = Math.max(0, Math.min(origin.x, event.clientX)), y = Math.max(0, Math.min(origin.y, event.clientY));
        const rect: ToolRect = { x, y, width: Math.min(innerWidth, Math.max(origin.x, event.clientX)) - x, height: Math.min(innerHeight, Math.max(origin.y, event.clientY)) - y };
        cleanup();
        if (rect.width < 5 || rect.height < 5) reject(new Error("Area terlalu kecil."));
        else resolve({ rect });
      }, { signal: abort.signal });
      document.addEventListener("keydown", event => { if (event.key === "Escape") state.stopInspector?.(); }, { capture: true, signal: abort.signal });
      panel.append(button("Batal", () => state.stopInspector?.()));
    });
  }
  if (request.action === "captureStart") {
    state.capture?.finish(); state.stopInspector?.(); state.stopRuler?.();
    const originalX = scrollX, originalY = scrollY;
    const { host, panel } = hostPanel();
    panel.textContent = "Menyiapkan screenshot…";
    panel.append(button("Batal", () => {
      void chrome.runtime.sendMessage({ type: "tools:cancelCapture", captureId: request.captureId });
      state.capture?.finish();
    }));
    const status = document.createElement("div"); panel.prepend(status);
    const freeze = document.createElement("style");
    freeze.textContent = "html,body,*{scroll-behavior:auto!important;scroll-snap-type:none!important;animation-play-state:paused!important;caret-color:transparent!important;}";
    document.documentElement.append(freeze);
    const fixed = [...document.querySelectorAll<HTMLElement>("body *")].filter(element => !element.closest("[data-siapdips-tool]") && ["fixed", "sticky"].includes(getComputedStyle(element).position));
    const originalVisibility = fixed.map(element => ({ element, value: element.style.getPropertyValue("visibility"), priority: element.style.getPropertyPriority("visibility") }));
    let watchdog: ReturnType<typeof setTimeout>;
    const finish = () => {
      clearTimeout(watchdog); freeze.remove(); host.remove();
      for (const { element, value, priority } of originalVisibility) {
        if (value) element.style.setProperty("visibility", value, priority); else element.style.removeProperty("visibility");
      }
      window.scrollTo({ left: originalX, top: originalY, behavior: "instant" });
      state.capture = undefined;
    };
    const pulse = () => { clearTimeout(watchdog); watchdog = setTimeout(finish, 15000); };
    const geometry = { width: Math.max(innerWidth, document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0), height: Math.max(innerHeight, document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0), viewportWidth: innerWidth, viewportHeight: innerHeight };
    const move = async (x: number, y: number, progress: string) => {
      pulse();
      host.style.setProperty("visibility", "visible", "important"); status.textContent = progress;
      if (x !== 0 || y !== 0) for (const element of fixed) element.style.setProperty("visibility", "hidden", "important");
      window.scrollTo({ left: x < 0 ? scrollX : x, top: y < 0 ? scrollY : y, behavior: "instant" });
      await new Promise(resolve => setTimeout(resolve, 350));
      // Minimized/occluded windows can pause rAF. Never leave capture waiting forever.
      await Promise.race([
        new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))),
        new Promise(resolve => setTimeout(resolve, 180)),
      ]);
      host.style.setProperty("visibility", "hidden", "important");
      return { x: scrollX, y: scrollY };
    };
    state.capture = { finish, move, geometry }; pulse();
    return { geometry };
  }
  if (request.action === "captureMove") {
    if (!state.capture) throw new Error("Sesi screenshot berakhir. Coba ulangi.");
    return await state.capture.move(request.x ?? 0, request.y ?? 0, request.progress ?? "Mengambil screenshot…");
  }
  if (request.action === "captureEnd") { state.stopInspector?.(); state.capture?.finish(); return {}; }
  throw new Error("Tool tidak dikenali.");
}
