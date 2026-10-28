import type { CaptureGeometry, ToolRect } from "./shared";

export interface CaptureRecord {
  id: string;
  title: string;
  created: number;
  status: "capturing" | "ready" | "error";
  progress: number;
  total: number;
  geometry: CaptureGeometry;
  rect?: ToolRect;
  error?: string;
}
export interface CaptureTile { id: string; captureId: string; index: number; x: number; y: number; image: Blob }

async function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("siapdips-tools-captures", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("captures", { keyPath: "id" });
      const tiles = request.result.createObjectStore("tiles", { keyPath: "id" });
      tiles.createIndex("captureId", "captureId");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function transaction<T>(store: string, mode: IDBTransactionMode, perform: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(store, mode);
      const request = perform(tx.objectStore(store));
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = () => reject(tx.error ?? request.error);
      tx.onabort = () => reject(tx.error ?? new Error("Penyimpanan screenshot dibatalkan."));
    });
  } finally { db.close(); }
}
export const saveCapture = (record: CaptureRecord) => transaction("captures", "readwrite", store => store.put(record));
export async function loadCapture(id: string): Promise<CaptureRecord | undefined> {
  const record: CaptureRecord | undefined = await transaction("captures", "readonly", store => store.get(id));
  if (record && Date.now() - record.created > 24 * 60 * 60 * 1000) { await deleteCapture(id); return undefined; }
  return record;
}
export const saveCaptureTile = (tile: CaptureTile) => transaction("tiles", "readwrite", store => store.put(tile));
export const loadCaptureTiles = (id: string): Promise<CaptureTile[]> => transaction("tiles", "readonly", store => store.index("captureId").getAll(id));
export async function deleteCapture(id: string): Promise<void> {
  const tiles = await loadCaptureTiles(id);
  for (const tile of tiles) await transaction("tiles", "readwrite", store => store.delete(tile.id));
  await transaction("captures", "readwrite", store => store.delete(id));
}
export async function pruneCaptures(): Promise<void> {
  const records: CaptureRecord[] = await transaction("captures", "readonly", store => store.getAll());
  const ordered = records.sort((a, b) => b.created - a.created);
  for (const [index, record] of ordered.entries()) {
    if (Date.now() - record.created > 24 * 60 * 60 * 1000 || index >= 4) await deleteCapture(record.id);
  }
}
