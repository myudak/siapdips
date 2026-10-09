import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BotMessageSquare,
  GripHorizontal,
  HelpCircle,
  Link2Icon,
  Mic2,
  NotebookPen,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import HideButton from "../hideButton";
import { resolveContentScriptPath } from "@/lib/extension/content-script-path";
import { useEffect, useRef, useState } from "react";

// ── Storage key untuk note Siedu ────────────────────────────────────────────
const SIEDU_NOTE_KEY = "siedu_note";

// ── Note Panel Component ─────────────────────────────────────────────────────
function SieduNotePanel({ onClose }: { onClose: () => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [saved, setSaved] = useState(true);

  // Load saved note
  useEffect(() => {
    chrome.storage.local.get(SIEDU_NOTE_KEY, (result) => {
      const content: string = result[SIEDU_NOTE_KEY] ?? "";
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        setCharCount(editorRef.current.innerText.length);
      }
    });
  }, []);

  const handleInput = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    setCharCount(text.length);
    setSaved(false);

    // Debounce save 600ms
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      chrome.storage.local.set({ [SIEDU_NOTE_KEY]: editorRef.current?.innerHTML ?? "" });
      setSaved(true);
    }, 600);
  };

  const handleClear = () => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = "";
    setCharCount(0);
    chrome.storage.local.set({ [SIEDU_NOTE_KEY]: "" });
    setSaved(true);
  };

  return (
    <div className="flex flex-col w-56 rounded-lg border bg-card dark:bg-gray-800 dark:border-gray-700 shadow-lg animate-in slide-in-from-left-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-700">
        <div className="flex items-center gap-1.5">
          <NotebookPen className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-semibold">Catatan Siedu</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleClear}
            title="Hapus semua catatan"
            className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </button>
          <button
            onClick={onClose}
            title="Tutup catatan"
            className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder="Tulis catatan di sini..."
        className="flex-1 min-h-[180px] max-h-[260px] overflow-y-auto px-3 py-2 text-sm outline-none leading-relaxed
          empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
        style={{ wordBreak: "break-word" }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t dark:border-gray-700">
        <span className="text-[10px] text-muted-foreground">{charCount} karakter</span>
        <span className={`text-[10px] transition-colors ${saved ? "text-green-500" : "text-yellow-500"}`}>
          {saved ? "✓ Tersimpan" : "Menyimpan..."}
        </span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const AutoEduLangua = ({
  listeners,
  attributes,
  id,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
  id?: string;
}) => {
  const [showNote, setShowNote] = useState(false);

  return (
    <div className="flex gap-2 items-start w-full">
      {/* Note panel — tampil di sebelah kiri card */}
      {showNote && (
        <SieduNotePanel onClose={() => setShowNote(false)} />
      )}

      {/* Card utama Siedu */}
      <Card className="w-full dark:bg-gray-800 dark:border-gray-700 relative group">
        <HideButton
          id={id || "AutoEduLangua"}
          classNames="group-hover:flex hidden transition-all duration-300"
        />
        <Button
          variant="ghost"
          size="icon"
          className="w-full h-8 rounded-b-none border border-b-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          {...attributes}
          {...listeners}
        >
          <GripHorizontal className="h-4 w-4" />
        </Button>
        <CardHeader className="py-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            Siedu{" "}
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">
              by Siap Dips
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent title="Info Siedu by Siap Dips">
                  <p className="max-w-xs text-sm">
                    Otomasi pengerjaan soal di undip.edulangua.com. Aktifkan
                    helper di halaman soal, lalu pilih mode auto.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 flex flex-col">
          {/* Inject helper button */}
          <Button
            className="w-full"
            onClick={async () => {
              const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
              });
              if (!tab?.id) return;

              if (!tab.url?.includes("https://undip.edulangua.com")) {
                await chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  files: ["libs/toastify.js"],
                });
                await chrome.scripting.insertCSS({
                  target: { tabId: tab.id },
                  files: ["libs/toastify.css"],
                });
                await chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  func: () => {
                    // @ts-ignore
                    Toastify({
                      text: "Siedu ~> Bukan EduLangua `(*>﹏<*)′",
                      duration: 3000,
                      close: true,
                      position: "left",
                    }).showToast();
                  },
                });
                return;
              }

              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: [
                  resolveContentScriptPath("content-edulangua") ??
                    "content-edulangua.js",
                ],
              });
            }}
          >
            <BotMessageSquare className="w-4 h-4 mr-2" />
            ~Add Helper~
          </Button>

          {/* Auto Voice button */}
          <Button
            className="w-full"
            variant={"outline"}
            onClick={async () => {
              const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
              });
              if (!tab?.id) return;

              if (!tab.url?.includes("https://undip.edulangua.com")) {
                await chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  files: ["libs/toastify.js"],
                });
                await chrome.scripting.insertCSS({
                  target: { tabId: tab.id },
                  files: ["libs/toastify.css"],
                });
                await chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  func: () => {
                    // @ts-ignore
                    Toastify({
                      text: "Siedu ~> Bukan EduLangua `(*>﹏<*)′",
                      duration: 3000,
                      close: true,
                      position: "left",
                    }).showToast();
                  },
                });
                return;
              }

              // ── KRITIS: Inject toastify + auto voice ke MAIN WORLD ──────────
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["libs/toastify.js"],
                // @ts-ignore — world: MAIN tersedia di Chrome MV3
                world: "MAIN",
              });
              await chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                files: ["libs/toastify.css"],
              });
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                // @ts-ignore
                world: "MAIN",
                func: async () => {
                  function sleep(ms: number) {
                    return new Promise((r) => setTimeout(r, ms));
                  }
                  function showToast(text: string, duration = 3000) {
                    // @ts-ignore
                    Toastify({ text, duration, close: true, position: "left" }).showToast();
                  }

                  showToast("🎙️ Auto Voice dimulai...", 2000);

                  const racDivs = Array.from(
                    document.querySelectorAll<HTMLElement>(".record-and-compare")
                  ).filter((el) => !el.classList.contains("page-answer-actions"));

                  if (racDivs.length === 0) {
                    showToast("⚠️ Tidak ada soal voice (record-and-compare) ditemukan");
                    return;
                  }

                  const originalGetUserMedia =
                    navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                  let handled = 0;

                  for (const racDiv of racDivs) {
                    const audioEl = racDiv.querySelector<HTMLAudioElement>("audio");
                    const audioUrl = audioEl?.src || audioEl?.currentSrc || "";

                    if (!audioUrl || audioUrl === window.location.href) {
                      showToast("⚠️ Audio soal tidak ditemukan, dilewati", 1500);
                      continue;
                    }

                    try {
                      const response = await fetch(audioUrl);
                      if (!response.ok) throw new Error(`Fetch gagal: ${response.status}`);
                      const arrayBuffer = await response.arrayBuffer();

                      const audioCtx = new AudioContext();
                      await audioCtx.resume();
                      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                      const duration = audioBuffer.duration;

                      const destination = audioCtx.createMediaStreamDestination();
                      const fakeStream = destination.stream;

                      navigator.mediaDevices.getUserMedia = async (_constraints?: MediaStreamConstraints) => {
                        const source = audioCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(destination);
                        source.start(audioCtx.currentTime + 0.2);
                        await new Promise<void>(r => setTimeout(r, 200));
                        return fakeStream;
                      };

                      const recordBtn = racDiv.querySelector<HTMLButtonElement>(".rac-btn--danger");
                      if (!recordBtn) {
                        await audioCtx.close();
                        navigator.mediaDevices.getUserMedia = originalGetUserMedia;
                        continue;
                      }

                      recordBtn.click();
                      await sleep(Math.ceil(duration * 1000) + 500);

                      racDiv.querySelector<HTMLButtonElement>(".rac-btn--danger")?.click();
                      await sleep(800);
                      await audioCtx.close();
                      handled++;
                    } catch (err) {
                      showToast(`❌ Error: ${(err as Error).message}`, 2000);
                    } finally {
                      navigator.mediaDevices.getUserMedia = originalGetUserMedia;
                    }
                    await sleep(300);
                  }

                  if (handled > 0) {
                    await sleep(600);
                    const submitBtn = document.querySelector<HTMLButtonElement>(
                      ".page-answer-actions .answer-actions__btn--primary"
                    );
                    if (submitBtn && !submitBtn.disabled) {
                      submitBtn.click();
                      showToast(`✅ Auto Voice selesai! ${handled} soal dikerjakan`);
                    } else {
                      showToast(`✅ ${handled} soal direkam — klik Submit manual jika belum`, 4000);
                    }
                  } else {
                    showToast("⚠️ Tidak ada soal voice yang berhasil diproses");
                  }
                },
              });
            }}
          >
            <Mic2 className="w-4 h-4 mr-2" />
            Auto Voice
          </Button>

          {/* Note toggle button */}
          <Button
            className="w-full"
            variant={showNote ? "default" : "ghost"}
            onClick={() => setShowNote((v) => !v)}
            title="Buka/tutup catatan Siedu"
          >
            <NotebookPen className="w-4 h-4 mr-2" />
            {showNote ? "Tutup Catatan" : "Catatan"}
          </Button>

          {/* Go to EduLangua */}
          <Button
            className="w-full"
            variant={"secondary"}
            onClick={() =>
              chrome.tabs.create({
                url: "https://undip.edulangua.com",
              })
            }
          >
            <Link2Icon className="w-4 h-4 mr-2" />
            Goto Siedu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoEduLangua;
