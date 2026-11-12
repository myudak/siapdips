import type { ConsoleEntry, ExecutionReport } from "./shared";
import { validateConsoleCode } from "./shared.ts";

/** Serialized into the user-script world. Keep every runtime dependency inside. */
async function runUserCode(execute: (logger: Record<string, (...args: unknown[]) => void>) => Promise<unknown>): Promise<ExecutionReport> {
  const started = performance.now();
  const logs: ConsoleEntry[] = [];
  let remaining = 64_000, truncated = false;
  function format(value: unknown): string {
    const seen = new WeakSet<object>();
    let nodes = 0;
    function visit(item: unknown, depth: number): string {
      if (++nodes > 100) return "[…]";
      if (typeof item === "string") return item.length > 2000 ? item.slice(0, 2000) + "…" : item;
      if (typeof item === "bigint") return `${item}n`;
      if (typeof item === "function") return "[Function]";
      if (item === null || typeof item !== "object") return String(item);
      if (seen.has(item)) return "[Circular]";
      if (depth > 3) return "[…]";
      seen.add(item);
      try {
        if (item instanceof Error) return `${item.name}: ${item.message}`.slice(0, 4000);
        if (typeof Element !== "undefined" && item instanceof Element) return `<${item.tagName.toLowerCase()}${item.id ? `#${item.id}` : ""}>`;
        const values: string[] = [];
        for (const key in item) {
          if (!Object.prototype.hasOwnProperty.call(item, key)) continue;
          if (values.length >= 20) { values.push("…"); break; }
          const descriptor = Object.getOwnPropertyDescriptor(item, key);
          if (!descriptor) continue;
          const text = "value" in descriptor ? visit(descriptor.value, depth + 1) : "[Getter]";
          values.push(Array.isArray(item) ? text : `${key}: ${text}`);
        }
        return Array.isArray(item) ? `[${values.join(", ")}]` : `{${values.join(", ")}}`;
      } catch { return "[Unreadable object]"; }
    }
    try { return visit(value, 0).slice(0, 4000); } catch { return "[Unreadable value]"; }
  }
  function write(level: ConsoleEntry["level"], args: unknown[]): void {
    if (logs.length >= 200 || remaining <= 0) { truncated = true; return; }
    const text = args.slice(0, 20).map(format).join(" ");
    const limit = Math.min(4000, remaining);
    if (text.length > limit || args.length > 20) truncated = true;
    logs.push({ level, text: text.slice(0, limit) });
    remaining -= Math.min(text.length, limit);
  }
  const logger: Record<string, (...args: unknown[]) => void> = {
    log: (...args) => write("log", args), info: (...args) => write("info", args),
    warn: (...args) => write("warn", args), error: (...args) => write("error", args),
    debug: (...args) => write("debug", args), dir: (...args) => write("log", args),
    table: (...args) => write("log", args),
    assert: (condition, ...args) => { if (!condition) write("error", ["Assertion failed:", ...args]); },
    clear: () => { logs.length = 0; remaining = 64_000; truncated = false; },
  };
  try {
    const result = await execute(logger);
    return { ok: true, logs, result: format(result), truncated, duration: performance.now() - started };
  } catch (error) {
    return { ok: false, logs, result: "undefined", error: format(error), truncated, duration: performance.now() - started };
  }
}

export function buildConsoleSource(code: string): string {
  validateConsoleCode(code);
  // userScripts executes this source directly. No eval/Function in extension
  // pages, no remotely downloaded source, and no persistent script registration.
  return `(${runUserCode.toString()})(async function(console) {\n${code}\n});`;
}
