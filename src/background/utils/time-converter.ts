/**
 * Time conversion utilities
 */

export function suspendTimeToMinutes(value: string): number | null {
  if (value === "never") return null;

  const num = parseInt(value);
  if (value.endsWith("s")) return num / 60;
  if (value.endsWith("m")) return num;
  if (value.endsWith("h")) return num * 60;
  if (value.endsWith("d")) return num * 60 * 24;
  if (value.endsWith("w")) return num * 60 * 24 * 7;

  return null;
}
