// Browser fixture exercises production components and background routing with a
// deterministic extension API adapter. It is never included in extension builds.
import { createRoot } from "react-dom/client";
import ToolsCard from "../../src/components/ToolsCard";
import { initTools } from "../../src/background/features/tools";
import "../../src/pages/main/index.css";

const handlers: Array<(message: unknown, sender: unknown, respond: (value: unknown) => void) => unknown> = [];
const values: Record<string, unknown> = {};
const listeners = () => ({ addListener: () => {} });
let permissionGranted = true;
const tab = { id: 42, windowId: 1, url: "https://example.org/watch?utm_source=test&v=123", title: "Tools fixture", status: "complete" };
const audio = new Map<number, number>();
const adapter = {
  runtime: {
    id: "tools-test", getURL: (path: string) => `chrome-extension://tools-test/${path}`,
    getManifest: () => ({ background: { service_worker: "background.js" } }),
    onMessage: { addListener: (handler: typeof handlers[number]) => handlers.push(handler) },
    sendMessage: async (message: Record<string, unknown>) => {
      if (message.target === "tools-audio") {
        const tabId = message.tabId as number;
        if (message.action === "stop") audio.delete(tabId);
        if (message.action === "volume") {
          if (!audio.has(tabId) && !message.streamId) return { ok: true, needsStream: true };
          audio.set(tabId, message.volume as number);
        }
        return { ok: true, volume: audio.get(tabId) };
      }
      return await new Promise(resolve => {
        for (const handler of handlers) handler(message, { id: "tools-test", url: "chrome-extension://tools-test/popup.html" }, resolve);
      });
    },
  },
  tabs: {
    query: async () => [tab], get: async () => tab,
    sendMessage: async (_tabId: number, message: Record<string, unknown>) => await new Promise(resolve => { for (const handler of handlers) handler(message, { id: "tools-test", url: "chrome-extension://tools-test/background.js" }, resolve); }),
    create: async (options: unknown) => { window.dispatchEvent(new CustomEvent("fixture-tab", { detail: options })); return {}; },
    onRemoved: listeners(), onActivated: listeners(), onUpdated: listeners(),
    captureVisibleTab: async () => {
      const canvas = document.createElement("canvas"); canvas.width = innerWidth; canvas.height = innerHeight;
      const context = canvas.getContext("2d")!; context.fillStyle = scrollY > 0 ? "#60a5fa" : "#ffffff"; context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#111827"; context.font = "30px sans-serif"; context.fillText(`Fixture y=${scrollY}`, 30, 70);
      return canvas.toDataURL("image/png");
    },
  },
  scripting: {
    executeScript: async ({ func, args }: { func: (...args: unknown[]) => unknown; args: unknown[] }) => {
      // A serialized function must run without module imports, like a real injection.
      const injected = (0, eval)(`(${func.toString()})`);
      return [{ frameId: 0, result: await injected(...args) }];
    },
  },
  permissions: { request: async () => permissionGranted, contains: async () => permissionGranted, remove: async () => true, onRemoved: listeners() },
  storage: { local: { get: async (key: string) => ({ [key]: values[key] }), set: async (update: Record<string, unknown>) => { Object.assign(values, update); } } },
  offscreen: { hasDocument: async () => true },
  alarms: { create: () => {}, onAlarm: listeners() },
  tabCapture: { getMediaStreamId: (_: unknown, callback: (id: string) => void) => callback("fixture-stream") },
};
Object.defineProperty(window, "chrome", { value: adapter, configurable: true });
Object.assign(window, { fixture: { denyPermissions: () => { permissionGranted = false; }, allowPermissions: () => { permissionGranted = true; }, values, tab, audio } });
initTools();
createRoot(document.getElementById("tools-root")!).render(<ToolsCard />);
