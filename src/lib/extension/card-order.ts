/** Keep the user's order while appending new cards and dropping removed cards. */
export function reconcileCardOrder(saved: unknown, available: readonly string[]): string[] {
  const known = new Set(available);
  const ordered = Array.isArray(saved)
    ? saved.filter((id): id is string => typeof id === "string" && known.has(id))
    : [];
  return [...new Set([...ordered, ...available])];
}

export function readCardOrder(raw: string | null, available: readonly string[]): string[] {
  try {
    return reconcileCardOrder(raw ? JSON.parse(raw) : null, available);
  } catch {
    return [...available];
  }
}
