import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { createRoot } from "react-dom/client";
import { Camera, Crop, Download, Eraser, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { captureScale } from "../../lib/tools/shared";
import type { ToolRect } from "../../lib/tools/shared";
import { deleteCapture, loadCapture, loadCaptureTiles } from "../../lib/tools/capture-db";
import type { CaptureRecord } from "../../lib/tools/capture-db";
import "./capture.css";

export function CaptureEditor() {
  const id = new URLSearchParams(location.search).get("id");
  const canvas = useRef<HTMLCanvasElement>(null);
  const original = useRef<HTMLCanvasElement>();
  const start = useRef<{ x: number; y: number }>();
  const [record, setRecord] = useState<CaptureRecord>();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [ready, setReady] = useState(false);
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const [mode, setMode] = useState<"crop" | "blur">("crop");
  const [selection, setSelection] = useState<ToolRect>();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        if (!id) throw new Error("Screenshot tidak ditemukan.");
        let stored: CaptureRecord | undefined;
        while (!cancelled) {
          stored = await loadCapture(id);
          if (!stored) throw new Error("Screenshot sudah dihapus atau kedaluwarsa (24 jam). Screenshot juga dibersihkan setelah empat tangkapan berikutnya.");
          if (cancelled) return;
          setRecord(stored);
          if (stored.status === "error") throw new Error(stored.error || "Screenshot gagal. Coba ambil ulang dari tab asal.");
          if (stored.status === "ready") break;
          // A capture in progress is loading, not an editor error. Let the
          // background detect an interrupted worker instead of spinning forever.
          if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) await chrome.runtime.sendMessage({ type: "tools:captureStatus", captureId: id });
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        if (cancelled || !stored) return;
        const tiles = (await loadCaptureTiles(id)).sort((a, b) => a.index - b.index);
        if (tiles.length !== stored.total || !tiles.length) throw new Error("Data screenshot tidak lengkap. Coba ambil ulang.");
        const first = await createImageBitmap(tiles[0].image);
        const pixelRatio = first.width / stored.geometry.viewportWidth;
        first.close();
        const region = stored.rect ?? { x: 0, y: 0, width: stored.geometry.width, height: stored.geometry.height };
        const scale = captureScale(region.width, region.height, pixelRatio);
        const output = document.createElement("canvas");
        output.width = Math.max(1, Math.round(region.width * scale));
        output.height = Math.max(1, Math.round(region.height * scale));
        const context = output.getContext("2d");
        if (!context) throw new Error("Canvas tidak tersedia.");
        let assembled = 0;
        for (const tile of tiles) {
          if (cancelled) return;
          const bitmap = await createImageBitmap(tile.image);
          context.drawImage(bitmap, (tile.x - region.x) * scale, (tile.y - region.y) * scale, stored.geometry.viewportWidth * scale, stored.geometry.viewportHeight * scale);
          bitmap.close();
          setAssemblyProgress(++assembled / tiles.length);
          if (assembled % 4 === 0) await new Promise(resolve => setTimeout(resolve, 0));
        }
        if (cancelled || !canvas.current) return;
        original.current = output;
        canvas.current.width = output.width; canvas.current.height = output.height;
        canvas.current.getContext("2d")!.drawImage(output, 0, 0);
        setImageSize({ width: output.width, height: output.height });
        setReady(true);
        if (scale < pixelRatio) setNotice("Gambar diperkecil agar halaman panjang tetap bisa disimpan dengan stabil (maks. 24 megapiksel)." );
      } catch (cause) { if (!cancelled) setError(cause instanceof Error ? cause.message : "Gagal membuka screenshot."); }
    })();
    return () => { cancelled = true; };
  }, [id]);
  function point(event: PointerEvent<HTMLCanvasElement>) {
    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();
    return { x: Math.max(0, Math.min(element.width, (event.clientX - bounds.left) * element.width / bounds.width)), y: Math.max(0, Math.min(element.height, (event.clientY - bounds.top) * element.height / bounds.height)) };
  }
  function move(event: PointerEvent<HTMLCanvasElement>) {
    if (!start.current) return;
    const end = point(event);
    setSelection({ x: Math.min(start.current.x, end.x), y: Math.min(start.current.y, end.y), width: Math.abs(end.x - start.current.x), height: Math.abs(end.y - start.current.y) });
  }
  function apply(event: PointerEvent<HTMLCanvasElement>) {
    if (!start.current) return;
    const end = point(event), origin = start.current;
    start.current = undefined;
    const rect = { x: Math.round(Math.min(origin.x, end.x)), y: Math.round(Math.min(origin.y, end.y)), width: Math.round(Math.abs(end.x - origin.x)), height: Math.round(Math.abs(end.y - origin.y)) };
    setSelection(undefined);
    if (rect.width < 3 || rect.height < 3 || !canvas.current) return;
    const working = canvas.current;
    const temporary = document.createElement("canvas");
    if (mode === "crop") {
      temporary.width = rect.width; temporary.height = rect.height;
      temporary.getContext("2d")!.drawImage(working, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
      working.width = rect.width; working.height = rect.height;
      working.getContext("2d")!.drawImage(temporary, 0, 0);
      setImageSize({ width: working.width, height: working.height });
    } else {
      // Pixelate rather than applying a reversible CSS filter to the preview.
      temporary.width = Math.max(1, Math.ceil(rect.width / 18));
      temporary.height = Math.max(1, Math.ceil(rect.height / 18));
      temporary.getContext("2d")!.drawImage(working, rect.x, rect.y, rect.width, rect.height, 0, 0, temporary.width, temporary.height);
      const context = working.getContext("2d")!;
      context.imageSmoothingEnabled = false;
      context.drawImage(temporary, 0, 0, temporary.width, temporary.height, rect.x, rect.y, rect.width, rect.height);
      context.imageSmoothingEnabled = true;
    }
  }
  function reset() {
    if (!canvas.current || !original.current) return;
    canvas.current.width = original.current.width; canvas.current.height = original.current.height;
    canvas.current.getContext("2d")!.drawImage(original.current, 0, 0);
    setImageSize({ width: canvas.current.width, height: canvas.current.height });
    setSelection(undefined);
  }
  function download() {
    canvas.current?.toBlob(blob => {
      if (!blob) { setError("Gagal membuat PNG. Coba crop gambar menjadi lebih kecil."); return; }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a"); link.href = url;
      link.download = `siapdips-${(record?.title ?? "screenshot").replace(/[^\p{L}\p{N} -]/gu, "").trim().slice(0, 60) || "screenshot"}.png`;
      link.click(); setTimeout(() => URL.revokeObjectURL(url), 60000);
    }, "image/png");
  }
  return <main>
    <header><span className="brand"><Camera size={20} />Siap Dips <span>/ screenshot</span></span><span className="local">Diproses di perangkat ini</span></header>
    <section className="intro"><div><p className="eyebrow">CAPTURE STUDIO</p><h1>{record?.title || "Screenshot"}</h1><p>{ready ? `${imageSize.width.toLocaleString()} × ${imageSize.height.toLocaleString()} px · Tarik pada gambar untuk ${mode === "crop" ? "crop" : "blur area"}.` : "Menyiapkan hasil tangkapan…"}</p></div></section>
    <div className="toolbar" role="toolbar" aria-label="Edit screenshot"><button aria-pressed={mode === "crop"} disabled={!ready} onClick={() => setMode("crop")}><Crop size={16} />Crop</button><button aria-pressed={mode === "blur"} disabled={!ready} onClick={() => setMode("blur")}><Eraser size={16} />Blur area</button><button disabled={!ready} onClick={reset}><RotateCcw size={16} />Reset edits</button><button className="save" disabled={!ready} onClick={download}><Download size={16} />Simpan PNG</button><button className="delete" disabled={!id || (!ready && !error)} onClick={() => { if (id) void deleteCapture(id).then(() => { setReady(false); setError("Screenshot telah dihapus dari perangkat ini."); if (canvas.current) { canvas.current.width = 1; canvas.current.height = 1; } original.current = undefined; }); }}><Trash2 size={16} />Hapus</button></div>
    {error && <p className="error" role="alert">{error}</p>}{notice && <p className="notice">{notice}</p>}
    {!ready && !error && <section className="capture-loading" role="status" aria-live="polite"><Loader2 size={28} className="loading-spinner" aria-hidden="true" /><h2>{record?.status === "capturing" ? "Mengambil halaman…" : "Menyusun screenshot…"}</h2><p>{record?.status === "capturing" ? `${record.progress} dari ${record.total || "…"} potongan. Tetap di tab asal sampai selesai.` : "Menggabungkan potongan halaman. Gambar panjang disesuaikan otomatis."}</p><progress aria-label="Progres penyusunan screenshot" max={record?.status === "capturing" ? record.total || 1 : 1} value={record?.status === "capturing" ? (record.total ? record.progress : undefined) : assemblyProgress || undefined} /></section>}
    <div className="workspace"><div className="image-wrap" style={{ display: ready ? "block" : "none" }}><canvas ref={canvas} aria-label="Screenshot yang dapat diedit" onPointerDown={event => { event.preventDefault(); start.current = point(event); event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={move} onPointerUp={apply} onPointerCancel={() => { start.current = undefined; setSelection(undefined); }} />{selection && <div className="selection" style={{ left: `${selection.x / imageSize.width * 100}%`, top: `${selection.y / imageSize.height * 100}%`, width: `${selection.width / imageSize.width * 100}%`, height: `${selection.height / imageSize.height * 100}%` }} />}</div></div>
    <footer>Screenshot asli disimpan lokal hingga 24 jam atau sampai empat tangkapan berikutnya. Gunakan Hapus untuk menghapus sekarang.</footer>
  </main>;
}

createRoot(document.getElementById("root")!).render(<CaptureEditor />);
