import { Draggable } from "./draggable";
import {
  DEFAULT_DYANDRA_HELPER_CONFIG,
  findMatchingDyandraLoketLink,
  normalizeDyandraHelperConfig,
  normalizeDyandraRefreshInterval,
  normalizeDyandraText,
  STORAGE_KEY_DYANDRA_AUTO_REFRESH_ENABLED,
  STORAGE_KEY_DYANDRA_REFRESH_INTERVAL_MS,
  STORAGE_KEY_DYANDRA_TARGET_TEXT,
  type DyandraHelperConfig,
  type DyandraHelperState,
  type DyandraLoketMatch,
} from "@/lib/dyandra/shared";

const HELPER_ID = "siapdips-dyandra-helper";
const SESSION_RUNNING_KEY = "siapdipsDyandraWatcherRunning";
const SESSION_REFRESH_ONCE_KEY = "siapdipsDyandraRefreshOnce";
const TOAST_DURATION_MS = 2800;

let helperInstance: HTMLElement | null = null;
let watcherReloadTimer: number | null = null;
let currentConfig: DyandraHelperConfig = { ...DEFAULT_DYANDRA_HELPER_CONFIG };
let currentState: DyandraHelperState = { status: "idle" };

let targetInput: HTMLInputElement | null = null;
let intervalInput: HTMLInputElement | null = null;
let autoRefreshCheckbox: HTMLInputElement | null = null;
let statusBadge: HTMLElement | null = null;
let statusMeta: HTMLElement | null = null;
let statusDetails: HTMLElement | null = null;
let refreshHint: HTMLElement | null = null;

function getStorage<T>(key: string): Promise<T | undefined> {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        console.warn("[Dyandra] Storage read error:", chrome.runtime.lastError);
        resolve(undefined);
        return;
      }
      resolve(result[key] as T | undefined);
    });
  });
}

function setStorage(payload: Record<string, unknown>): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(payload, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      resolve();
    });
  });
}

function setWatcherRunning(value: boolean): void {
  if (value) {
    sessionStorage.setItem(SESSION_RUNNING_KEY, "1");
    return;
  }
  sessionStorage.removeItem(SESSION_RUNNING_KEY);
}

function isWatcherRunning(): boolean {
  return sessionStorage.getItem(SESSION_RUNNING_KEY) === "1";
}

function setRefreshOncePending(value: boolean): void {
  if (value) {
    sessionStorage.setItem(SESSION_REFRESH_ONCE_KEY, "1");
    return;
  }
  sessionStorage.removeItem(SESSION_REFRESH_ONCE_KEY);
}

function isRefreshOncePending(): boolean {
  return sessionStorage.getItem(SESSION_REFRESH_ONCE_KEY) === "1";
}

function clearReloadTimer(): void {
  if (watcherReloadTimer !== null) {
    window.clearTimeout(watcherReloadTimer);
    watcherReloadTimer = null;
  }
}

function formatTimestamp(value?: string): string {
  if (!value) return "Belum ada";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleTimeString("id-ID");
}

function getStatusPalette(status: DyandraHelperState["status"]): {
  label: string;
  background: string;
  color: string;
} {
  switch (status) {
    case "running":
      return {
        label: "Mantau",
        background: "rgba(59, 130, 246, 0.14)",
        color: "#1d4ed8",
      };
    case "found":
      return {
        label: "Ketemu",
        background: "rgba(22, 163, 74, 0.14)",
        color: "#15803d",
      };
    case "error":
      return {
        label: "Error",
        background: "rgba(220, 38, 38, 0.14)",
        color: "#b91c1c",
      };
    default:
      return {
        label: "Idle",
        background: "rgba(100, 116, 139, 0.12)",
        color: "#475569",
      };
  }
}

function showToast(
  message: string,
  type: "success" | "error" | "info" = "info"
): void {
  const background =
    type === "success"
      ? "#16a34a"
      : type === "error"
        ? "#dc2626"
        : "#1f2937";

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Toastify({
    text: message,
    duration: TOAST_DURATION_MS,
    close: true,
    gravity: "top",
    position: "left",
    style: { background },
  }).showToast();
}

function collectPageLinks(): Array<{ href: string; text: string }> {
  return Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]")).map(
    (link) => ({
      href: link.href || link.getAttribute("href") || "",
      text: normalizeDyandraText(link.textContent),
    })
  );
}

function applyConfigToForm(): void {
  if (targetInput) {
    targetInput.value = currentConfig.targetText;
  }
  if (intervalInput) {
    intervalInput.value = String(currentConfig.refreshIntervalMs);
  }
  if (autoRefreshCheckbox) {
    autoRefreshCheckbox.checked = currentConfig.autoRefreshEnabled;
  }
}

function applyStateToUi(): void {
  const palette = getStatusPalette(currentState.status);
  if (statusBadge) {
    statusBadge.textContent = palette.label;
    statusBadge.style.background = palette.background;
    statusBadge.style.color = palette.color;
  }

  if (statusMeta) {
    statusMeta.textContent = `Target: ${currentConfig.targetText || "belum diisi"}`;
  }

  const details: string[] = [
    `Check terakhir: ${formatTimestamp(currentState.lastCheckedAt)}`,
  ];

  if (currentState.lastMatchText) {
    details.push(`Teks match: ${currentState.lastMatchText}`);
  }
  if (currentState.lastMatchHref) {
    details.push(`Link: ${currentState.lastMatchHref}`);
  }
  if (currentState.lastError) {
    details.push(`Catatan: ${currentState.lastError}`);
  }

  if (statusDetails) {
    statusDetails.innerHTML = details
      .map((line) => `<div>${escapeHtml(line)}</div>`)
      .join("");
  }

  if (refreshHint) {
    refreshHint.textContent = currentConfig.autoRefreshEnabled
      ? `Auto refresh nyala tiap ${currentConfig.refreshIntervalMs} ms kalau belum ketemu.`
      : "Auto refresh mati. Mulai pantau cuma cek sekali per load.";
  }
}

function setHelperState(nextState: DyandraHelperState): void {
  currentState = nextState;
  applyStateToUi();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function persistConfig(): Promise<void> {
  await setStorage({
    [STORAGE_KEY_DYANDRA_TARGET_TEXT]: currentConfig.targetText,
    [STORAGE_KEY_DYANDRA_REFRESH_INTERVAL_MS]: currentConfig.refreshIntervalMs,
    [STORAGE_KEY_DYANDRA_AUTO_REFRESH_ENABLED]: currentConfig.autoRefreshEnabled,
  });
}

function readConfigFromForm(): DyandraHelperConfig {
  return normalizeDyandraHelperConfig({
    targetText: targetInput?.value || "",
    refreshIntervalMs: intervalInput?.value,
    autoRefreshEnabled: autoRefreshCheckbox?.checked ?? false,
  });
}

async function updateConfigFromForm(): Promise<void> {
  currentConfig = readConfigFromForm();
  applyConfigToForm();
  await persistConfig();
  applyStateToUi();

  if (!currentConfig.autoRefreshEnabled && isWatcherRunning()) {
    stopWatcher("Auto refresh dimatiin, jadi watcher ikut berhenti ya.");
  }
}

function findMatchOnPage(targetText = currentConfig.targetText): DyandraLoketMatch | null {
  return findMatchingDyandraLoketLink(collectPageLinks(), targetText);
}

async function runScan(options?: {
  silent?: boolean;
  source?: "check" | "watcher" | "refresh";
}): Promise<DyandraLoketMatch | null> {
  currentConfig = readConfigFromForm();
  await persistConfig();

  const normalizedTargetText = normalizeDyandraText(currentConfig.targetText);
  if (!normalizedTargetText) {
    setHelperState({
      status: "error",
      lastCheckedAt: new Date().toISOString(),
      lastError: "Isi target teks dulu biar helper tahu mau nyari apa.",
    });
    if (!options?.silent) {
      showToast("Isi target teks dulu ya.", "error");
    }
    return null;
  }

  const match = findMatchOnPage(normalizedTargetText);
  if (!match) {
    setHelperState({
      status:
        options?.source === "watcher" && currentConfig.autoRefreshEnabled
          ? "running"
          : "idle",
      lastCheckedAt: new Date().toISOString(),
      lastError: `Belum nemu link Loket yang ada teks "${normalizedTargetText}".`,
    });
    if (!options?.silent) {
      showToast("Belum ketemu link Loket yang cocok.", "info");
    }
    return null;
  }

  setHelperState({
    status: "found",
    lastCheckedAt: new Date().toISOString(),
    lastMatchHref: match.href,
    lastMatchText: match.text,
  });

  if (!options?.silent) {
    showToast("Ketemu link Loket-nya, gas buka.", "success");
  }

  clearReloadTimer();
  setWatcherRunning(false);
  setRefreshOncePending(false);
  window.location.href = match.href;
  return match;
}

async function scheduleWatcherReload(): Promise<void> {
  clearReloadTimer();

  if (!isWatcherRunning()) {
    return;
  }

  if (!currentConfig.autoRefreshEnabled) {
    setHelperState({
      status: "idle",
      lastCheckedAt: new Date().toISOString(),
      lastError: "Watcher berhenti karena auto refresh lagi mati.",
    });
    setWatcherRunning(false);
    return;
  }

  watcherReloadTimer = window.setTimeout(() => {
    window.location.reload();
  }, currentConfig.refreshIntervalMs);
}

async function runWatcherCycle(): Promise<void> {
  const match = await runScan({ silent: true, source: "watcher" });
  if (match) {
    return;
  }

  if (!isWatcherRunning()) {
    return;
  }

  if (!currentConfig.autoRefreshEnabled) {
    setWatcherRunning(false);
    return;
  }

  await scheduleWatcherReload();
}

export function stopWatcher(message?: string): void {
  clearReloadTimer();
  setWatcherRunning(false);
  if (isRefreshOncePending()) {
    setRefreshOncePending(false);
  }
  setHelperState({
    status: "idle",
    lastCheckedAt: currentState.lastCheckedAt,
    lastMatchHref: currentState.lastMatchHref,
    lastMatchText: currentState.lastMatchText,
    lastError: message,
  });
  if (message) {
    showToast(message, "info");
  }
}

export async function startWatcher(): Promise<void> {
  await updateConfigFromForm();

  if (!currentConfig.targetText) {
    setHelperState({
      status: "error",
      lastCheckedAt: new Date().toISOString(),
      lastError: "Isi target teks dulu sebelum mulai mantau.",
    });
    showToast("Isi target teks dulu sebelum mulai mantau.", "error");
    return;
  }

  setWatcherRunning(true);
  setHelperState({
    status: "running",
    lastCheckedAt: currentState.lastCheckedAt,
    lastError: currentConfig.autoRefreshEnabled
      ? "Watcher aktif. Kalau belum ketemu, page bakal refresh lagi."
      : "Watcher aktif tapi auto refresh mati, jadi cuma cek sekali per load.",
  });
  showToast(
    currentConfig.autoRefreshEnabled
      ? "Watcher Dyandra nyala. Kita pantau terus ya."
      : "Watcher nyala, tapi auto refresh masih mati.",
    "info"
  );

  await runWatcherCycle();
}

export async function refreshNow(): Promise<void> {
  await updateConfigFromForm();
  setRefreshOncePending(true);
  window.location.reload();
}

export async function checkNow(): Promise<void> {
  await runScan({ source: "check" });
}

async function handlePendingSessionActions(): Promise<void> {
  if (isRefreshOncePending()) {
    setRefreshOncePending(false);
    await runScan({ silent: true, source: "refresh" });
    return;
  }

  if (isWatcherRunning()) {
    setHelperState({
      status: "running",
      lastError: currentConfig.autoRefreshEnabled
        ? "Watcher lanjut lagi habis reload."
        : "Watcher masih nyala tapi auto refresh mati.",
    });
    await runWatcherCycle();
  }
}

async function loadStoredConfig(): Promise<void> {
  const [targetText, refreshIntervalMs, autoRefreshEnabled] = await Promise.all([
    getStorage<string>(STORAGE_KEY_DYANDRA_TARGET_TEXT),
    getStorage<number>(STORAGE_KEY_DYANDRA_REFRESH_INTERVAL_MS),
    getStorage<boolean>(STORAGE_KEY_DYANDRA_AUTO_REFRESH_ENABLED),
  ]);

  currentConfig = normalizeDyandraHelperConfig({
    targetText,
    refreshIntervalMs,
    autoRefreshEnabled,
  });
}

function createActionButton(label: string, variant: "primary" | "secondary") {
  const button = document.createElement("button");
  button.type = "button";
  Object.assign(button.style, {
    border: variant === "primary" ? "none" : "1px solid rgba(15, 23, 42, 0.10)",
    background:
      variant === "primary"
        ? "linear-gradient(135deg, #0f766e 0%, #0891b2 100%)"
        : "#ffffff",
    color: variant === "primary" ? "#ffffff" : "#0f172a",
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      variant === "primary" ? "0 10px 20px rgba(8, 145, 178, 0.18)" : "none",
  });
  button.textContent = label;
  return button;
}

function createFieldLabel(text: string): HTMLLabelElement {
  const label = document.createElement("label");
  label.textContent = text;
  Object.assign(label.style, {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#334155",
    marginBottom: "6px",
  });
  return label;
}

function createRow(): HTMLDivElement {
  const row = document.createElement("div");
  Object.assign(row.style, {
    display: "grid",
    gap: "8px",
  });
  return row;
}

function createInputBase(): HTMLInputElement {
  const input = document.createElement("input");
  Object.assign(input.style, {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "10px",
    border: "1px solid rgba(15, 23, 42, 0.12)",
    padding: "10px 12px",
    fontSize: "13px",
    color: "#0f172a",
    background: "rgba(255,255,255,0.96)",
  });
  return input;
}

export function createHelper(): HTMLElement {
  const existing = document.getElementById(HELPER_ID);
  if (existing) {
    helperInstance = existing;
    return existing;
  }

  const helper = document.createElement("div");
  helper.id = HELPER_ID;
  Object.assign(helper.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    width: "340px",
    background:
      "linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(255, 255, 255, 0.98) 100%)",
    borderRadius: "16px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    padding: "16px",
    zIndex: "2147483647",
    resize: "both",
    overflow: "auto",
    color: "#0f172a",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });

  const header = document.createElement("div");
  Object.assign(header.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    cursor: "move",
    marginBottom: "14px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
  });

  const titleWrap = document.createElement("div");
  const title = document.createElement("div");
  title.textContent = "Helper Dyandra Loket";
  Object.assign(title.style, {
    fontSize: "16px",
    fontWeight: "800",
    marginBottom: "4px",
  });
  const subtitle = document.createElement("div");
  subtitle.textContent = "Refresh, scan, terus auto gas kalau link Loket-nya muncul.";
  Object.assign(subtitle.style, {
    fontSize: "12px",
    lineHeight: "1.45",
    color: "#475569",
  });
  titleWrap.appendChild(title);
  titleWrap.appendChild(subtitle);

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "✕";
  Object.assign(closeButton.style, {
    border: "none",
    background: "rgba(15, 23, 42, 0.05)",
    color: "#475569",
    borderRadius: "999px",
    width: "32px",
    height: "32px",
    cursor: "pointer",
    flexShrink: "0",
  });
  closeButton.addEventListener("click", () => {
    helper.remove();
    helperInstance = null;
  });

  header.appendChild(titleWrap);
  header.appendChild(closeButton);
  helper.appendChild(header);

  const body = document.createElement("div");
  Object.assign(body.style, {
    display: "grid",
    gap: "12px",
  });
  helper.appendChild(body);

  const targetRow = createRow();
  const targetLabel = createFieldLabel("Target teks");
  targetInput = createInputBase();
  targetInput.placeholder = "Contoh: 15 April 2026";
  targetInput.addEventListener("change", () => {
    void updateConfigFromForm();
  });
  targetRow.appendChild(targetLabel);
  targetRow.appendChild(targetInput);
  body.appendChild(targetRow);

  const intervalRow = createRow();
  const intervalLabel = createFieldLabel("Interval refresh (ms)");
  intervalInput = createInputBase();
  intervalInput.type = "number";
  intervalInput.min = "500";
  intervalInput.step = "500";
  intervalInput.placeholder = "3000";
  intervalInput.addEventListener("change", () => {
    if (!intervalInput) return;
    intervalInput.value = String(
      normalizeDyandraRefreshInterval(intervalInput.value)
    );
    void updateConfigFromForm();
  });
  intervalRow.appendChild(intervalLabel);
  intervalRow.appendChild(intervalInput);
  body.appendChild(intervalRow);

  const toggleRow = document.createElement("label");
  Object.assign(toggleRow.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(14, 165, 233, 0.08)",
    border: "1px solid rgba(14, 165, 233, 0.12)",
  });
  const toggleTextWrap = document.createElement("div");
  const toggleTitle = document.createElement("div");
  toggleTitle.textContent = "Auto refresh";
  Object.assign(toggleTitle.style, {
    fontSize: "13px",
    fontWeight: "800",
    marginBottom: "2px",
  });
  refreshHint = document.createElement("div");
  Object.assign(refreshHint.style, {
    fontSize: "11px",
    color: "#475569",
    lineHeight: "1.4",
  });
  toggleTextWrap.appendChild(toggleTitle);
  toggleTextWrap.appendChild(refreshHint);
  autoRefreshCheckbox = document.createElement("input");
  autoRefreshCheckbox.type = "checkbox";
  Object.assign(autoRefreshCheckbox.style, {
    width: "18px",
    height: "18px",
    flexShrink: "0",
  });
  autoRefreshCheckbox.addEventListener("change", () => {
    void updateConfigFromForm();
  });
  toggleRow.appendChild(toggleTextWrap);
  toggleRow.appendChild(autoRefreshCheckbox);
  body.appendChild(toggleRow);

  const statusCard = document.createElement("div");
  Object.assign(statusCard.style, {
    borderRadius: "14px",
    padding: "12px",
    background: "rgba(15, 23, 42, 0.04)",
    border: "1px solid rgba(15, 23, 42, 0.06)",
    display: "grid",
    gap: "8px",
  });
  statusBadge = document.createElement("div");
  Object.assign(statusBadge.style, {
    width: "fit-content",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
  });
  statusMeta = document.createElement("div");
  Object.assign(statusMeta.style, {
    fontSize: "12px",
    fontWeight: "700",
  });
  statusDetails = document.createElement("div");
  Object.assign(statusDetails.style, {
    fontSize: "11px",
    lineHeight: "1.5",
    color: "#475569",
    wordBreak: "break-word",
  });
  statusCard.appendChild(statusBadge);
  statusCard.appendChild(statusMeta);
  statusCard.appendChild(statusDetails);
  body.appendChild(statusCard);

  const primaryActions = document.createElement("div");
  Object.assign(primaryActions.style, {
    display: "grid",
    gap: "8px",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  });
  const checkButton = createActionButton("Cek Sekarang", "secondary");
  checkButton.addEventListener("click", () => {
    void checkNow();
  });
  const refreshButton = createActionButton("Refresh Sekarang", "secondary");
  refreshButton.addEventListener("click", () => {
    void refreshNow();
  });
  primaryActions.appendChild(checkButton);
  primaryActions.appendChild(refreshButton);
  body.appendChild(primaryActions);

  const watcherActions = document.createElement("div");
  Object.assign(watcherActions.style, {
    display: "grid",
    gap: "8px",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  });
  const startButton = createActionButton("Mulai Pantau", "primary");
  startButton.addEventListener("click", () => {
    void startWatcher();
  });
  const stopButton = createActionButton("Stop", "secondary");
  stopButton.addEventListener("click", () => {
    stopWatcher("Watcher Dyandra dihentiin manual.");
  });
  watcherActions.appendChild(startButton);
  watcherActions.appendChild(stopButton);
  body.appendChild(watcherActions);

  document.body.appendChild(helper);
  new Draggable({ element: helper, handle: header });

  helperInstance = helper;
  applyConfigToForm();
  applyStateToUi();
  return helper;
}

export function removeHelper(): void {
  clearReloadTimer();
  helperInstance?.remove();
  helperInstance = null;
}

export function injectGlobalStyles(): void {
  if (document.getElementById("siapdips-dyandra-style")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "siapdips-dyandra-style";
  style.textContent = `
    @keyframes siapdips-dyandra-glow {
      0%, 100% { box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18); }
      50% { box-shadow: 0 20px 44px rgba(8, 145, 178, 0.20); }
    }
    #${HELPER_ID} {
      animation: siapdips-dyandra-glow 5s ease-in-out infinite;
    }
    #${HELPER_ID}.dragging {
      animation: none;
      user-select: none;
      cursor: move;
    }
    #${HELPER_ID} button:hover {
      filter: brightness(0.98);
    }
    #${HELPER_ID} input:focus {
      outline: 2px solid rgba(14, 165, 233, 0.25);
      outline-offset: 1px;
    }
  `;
  document.head.appendChild(style);
}

export async function initializeDyandraHelper(autoShow: boolean): Promise<void> {
  await loadStoredConfig();
  injectGlobalStyles();

  if (autoShow || isWatcherRunning() || isRefreshOncePending()) {
    createHelper();
  }

  applyConfigToForm();
  applyStateToUi();
  await handlePendingSessionActions();
}
