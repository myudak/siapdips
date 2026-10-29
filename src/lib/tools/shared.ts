export type ToolAction = "status" | "speed" | "reset" | "font" | "color" | "blur" | "ruler" | "pip" | "loop" | "select" | "captureStart" | "captureMove" | "captureEnd";
export interface ToolRect { x: number; y: number; width: number; height: number }
export interface PageToolRequest {
  action: ToolAction;
  value?: number;
  playerId?: string;
  start?: number;
  end?: number;
  x?: number;
  y?: number;
  progress?: string;
  captureId?: string;
}
export interface MediaPlayerInfo {
  id: string;
  kind: string;
  title: string;
  rate: number;
  time: number;
  paused: boolean;
}
export interface CaptureGeometry { width: number; height: number; viewportWidth: number; viewportHeight: number }
export interface PageToolResult {
  players?: MediaPlayerInfo[];
  frameOrigins?: string[];
  message?: string;
  rect?: ToolRect;
  geometry?: CaptureGeometry;
  x?: number;
  y?: number;
}
export interface CaptureProgress { id: string; status: "capturing" | "ready" | "error"; progress: number; total: number; error?: string }
export interface ToolReply { ok: boolean; error?: string; data?: PageToolResult; volume?: number; captureId?: string; capture?: CaptureProgress; remembered?: boolean }
export interface SiteToolSettings { speed: number }
export type SiteToolSettingsMap = Record<string, SiteToolSettings>;
export const TOOLS_SITES_KEY = "toolsSites";

export function normalizeSpeed(value: number): number {
  if (!Number.isFinite(value)) throw new Error("Speed tidak valid.");
  return Math.round(Math.min(4, Math.max(0.25, value)) * 100) / 100;
}
export function normalizeVolume(value: number): number {
  if (!Number.isFinite(value)) throw new Error("Volume tidak valid.");
  return Math.round(Math.min(500, Math.max(0, value)));
}
export function siteOrigin(url: string): string | null {
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.origin : null;
  } catch { return null; }
}
/** Do not remove affiliate or application parameters when cleaning links. */
export function cleanTrackingUrl(url: string): string {
  const parsed = new URL(url);
  if (!siteOrigin(url)) throw new Error("Link harus HTTP atau HTTPS.");
  for (const key of [...parsed.searchParams.keys()]) {
    if (/^utm_/i.test(key) || ["fbclid", "gclid", "dclid", "msclkid", "igshid"].includes(key.toLowerCase())) parsed.searchParams.delete(key);
  }
  return parsed.href;
}
export function captureTileCount(geometry: CaptureGeometry): number {
  const { width, height, viewportWidth, viewportHeight } = geometry;
  if (![width, height, viewportWidth, viewportHeight].every(n => Number.isFinite(n) && n > 0)) throw new Error("Ukuran halaman tidak valid.");
  const count = Math.ceil(width / viewportWidth) * Math.ceil(height / viewportHeight);
  if (!Number.isSafeInteger(count)) throw new Error("Ukuran halaman tidak valid.");
  return count;
}
/** Generate positions lazily so long pages don't allocate an enormous plan. */
export function capturePositions(geometry: CaptureGeometry): Iterable<{ x: number; y: number }> {
  captureTileCount(geometry);
  const { width, height, viewportWidth, viewportHeight } = geometry;
  return (function* () {
    for (let y = 0; y < height; y += viewportHeight) {
      for (let x = 0; x < width; x += viewportWidth) {
        yield { x: Math.min(x, Math.max(0, width - viewportWidth)), y: Math.min(y, Math.max(0, height - viewportHeight)) };
      }
    }
  })();
}

export function captureScale(width: number, height: number, pixelRatio: number): number {
  return Math.min(pixelRatio, 2, 16384 / width, 16384 / height, Math.sqrt(24_000_000 / (width * height)));
}
