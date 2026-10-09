import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GripHorizontal,
  NotebookPen,
  Plus,
  Trash2,
  Pin,
  PinOff,
  Search,
  X,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import HideButton from "../hideButton";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Note {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  color: string;
  createdAt: number;
  updatedAt: number;
}

const NOTE_COLORS = [
  { label: "Default", value: "default", bg: "bg-card", border: "border-border" },
  { label: "Yellow",  value: "yellow",  bg: "bg-yellow-50  dark:bg-yellow-950", border: "border-yellow-300  dark:border-yellow-700" },
  { label: "Blue",    value: "blue",    bg: "bg-blue-50    dark:bg-blue-950",   border: "border-blue-300    dark:border-blue-700" },
  { label: "Green",   value: "green",   bg: "bg-green-50   dark:bg-green-950",  border: "border-green-300   dark:border-green-700" },
  { label: "Pink",    value: "pink",    bg: "bg-pink-50    dark:bg-pink-950",   border: "border-pink-300    dark:border-pink-700" },
  { label: "Purple",  value: "purple",  bg: "bg-purple-50  dark:bg-purple-950", border: "border-purple-300  dark:border-purple-700" },
];

const STORAGE_KEY = "notecard_notes";

function getColorMeta(value: string) {
  return NOTE_COLORS.find((c) => c.value === value) ?? NOTE_COLORS[0];
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
const NoteCard = ({
  listeners,
  attributes,
  id,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
  id?: string;
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load from storage ──────────────────────────────────────────────────────
  useEffect(() => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const stored: Note[] = result[STORAGE_KEY] ?? [];
      setNotes(stored);
      if (stored.length > 0) {
        setActiveId(stored.find((n) => n.pinned)?.id ?? stored[0].id);
      }
    });
  }, []);

  // ── Persist to storage (debounced) ─────────────────────────────────────────
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      chrome.storage.local.set({ [STORAGE_KEY]: notes });
    }, 500);
  }, [notes]);

  // ── Sync editor content when active note changes ───────────────────────────
  const activeNote = notes.find((n) => n.id === activeId) ?? null;

  useEffect(() => {
    if (!editorRef.current || !activeNote) return;
    if (editorRef.current.innerHTML !== activeNote.content) {
      editorRef.current.innerHTML = activeNote.content;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const createNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "Catatan Baru",
      content: "",
      pinned: false,
      color: "default",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
  };

  const updateNote = (id: number, patch: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n
      )
    );
  };

  const deleteNote = (id: number) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      if (activeId === id) {
        setActiveId(next[0]?.id ?? null);
      }
      if (next.length === 0) {
        chrome.storage.local.set({ [STORAGE_KEY]: [] });
      }
      return next;
    });
    setDeleteConfirm(null);
  };

  const togglePin = (id: number) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // ── Editor commands ────────────────────────────────────────────────────────
  const execCmd = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const handleEditorInput = () => {
    if (!activeId || !editorRef.current) return;
    updateNote(activeId, { content: editorRef.current.innerHTML });
  };

  // ── Sorted / filtered notes ────────────────────────────────────────────────
  const filteredNotes = notes
    .filter(
      (n) =>
        !search ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });

  const colorMeta = activeNote ? getColorMeta(activeNote.color) : NOTE_COLORS[0];

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <Card className="relative group w-full dark:bg-gray-800 dark:border-gray-700">
      {/* Hide button */}
      <HideButton
        id={id || "NoteCard"}
        classNames="group-hover:flex hidden transition-all duration-300"
      />

      {/* Drag handle */}
      <Button
        variant="ghost"
        size="icon"
        className="w-full h-8 rounded-b-none border border-b-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        {...attributes}
        {...listeners}
      >
        <GripHorizontal className="h-4 w-4" />
      </Button>

      {/* Header */}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <NotebookPen className="w-5 h-5" />
            Notes
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                setShowSearch((v) => !v);
                setSearch("");
              }}
              title="Cari catatan"
            >
              {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={createNote}
              title="Tambah catatan baru"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="relative mt-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari catatan..."
              className="w-full rounded-md border border-border bg-background pl-7 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0 space-y-2">
        {/* Empty state */}
        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <NotebookPen className="h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">Belum ada catatan.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={createNote}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Buat catatan
            </Button>
          </div>
        )}

        {/* Note tabs */}
        {filteredNotes.length > 0 && (
          <div className="flex gap-1 overflow-x-auto pb-1">
            {filteredNotes.map((n) => (
              <button
                key={n.id}
                onClick={() => setActiveId(n.id)}
                title={n.title}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-all max-w-[120px]",
                  activeId === n.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border hover:bg-accent"
                )}
              >
                {n.pinned && <Pin className="h-3 w-3 flex-shrink-0" />}
                <span className="truncate">{n.title || "Tanpa Judul"}</span>
              </button>
            ))}
          </div>
        )}

        {/* Active note editor */}
        {activeNote && (
          <div
            className={cn(
              "rounded-lg border p-2 space-y-2 transition-colors",
              colorMeta.bg,
              colorMeta.border
            )}
          >
            {/* Title + actions row */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                placeholder="Judul catatan..."
                className="flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground min-w-0"
              />

              {/* Color swatches */}
              <div className="flex gap-0.5">
                {NOTE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    title={c.label}
                    onClick={() => updateNote(activeNote.id, { color: c.value })}
                    className={cn(
                      "h-4 w-4 rounded-full border-2 transition-all",
                      c.value === "default"  ? "bg-gray-200 dark:bg-gray-600" :
                      c.value === "yellow"   ? "bg-yellow-300" :
                      c.value === "blue"     ? "bg-blue-300" :
                      c.value === "green"    ? "bg-green-300" :
                      c.value === "pink"     ? "bg-pink-300" :
                                               "bg-purple-300",
                      activeNote.color === c.value
                        ? "border-foreground scale-110"
                        : "border-transparent"
                    )}
                  />
                ))}
              </div>

              {/* Pin button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => togglePin(activeNote.id)}
                title={activeNote.pinned ? "Lepas pin" : "Sematkan"}
              >
                {activeNote.pinned ? (
                  <PinOff className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Pin className="h-3.5 w-3.5" />
                )}
              </Button>

              {/* Delete button */}
              {deleteConfirm === activeNote.id ? (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs text-destructive">Hapus?</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-5 px-2 text-xs"
                    onClick={() => deleteNote(activeNote.id)}
                  >
                    Ya
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 px-2 text-xs"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Batal
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0 text-destructive hover:text-destructive"
                  onClick={() => setDeleteConfirm(activeNote.id)}
                  title="Hapus catatan"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {/* Formatting toolbar */}
            <div className="flex flex-wrap gap-0.5 border-b border-border pb-1.5">
              {(
                [
                  { cmd: "bold",          Icon: Bold,          title: "Tebal (Ctrl+B)" },
                  { cmd: "italic",        Icon: Italic,        title: "Miring (Ctrl+I)" },
                  { cmd: "underline",     Icon: Underline,     title: "Garis bawah (Ctrl+U)" },
                  { cmd: "strikeThrough", Icon: Strikethrough, title: "Coret" },
                ] as const
              ).map(({ cmd, Icon, title }) => (
                <button
                  key={cmd}
                  onMouseDown={(e) => { e.preventDefault(); execCmd(cmd); }}
                  title={title}
                  className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}

              <div className="w-px bg-border mx-0.5" />

              {(
                [
                  { cmd: "justifyLeft",   Icon: AlignLeft,   title: "Rata kiri" },
                  { cmd: "justifyCenter", Icon: AlignCenter, title: "Rata tengah" },
                  { cmd: "justifyRight",  Icon: AlignRight,  title: "Rata kanan" },
                ] as const
              ).map(({ cmd, Icon, title }) => (
                <button
                  key={cmd}
                  onMouseDown={(e) => { e.preventDefault(); execCmd(cmd); }}
                  title={title}
                  className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}

              <div className="w-px bg-border mx-0.5" />

              <select
                title="Ukuran font"
                onChange={(e) => execCmd("fontSize", e.target.value)}
                defaultValue="3"
                className="h-6 rounded border border-border bg-background text-xs px-1 outline-none cursor-pointer"
              >
                <option value="1">Kecil</option>
                <option value="3">Normal</option>
                <option value="5">Besar</option>
                <option value="7">Sangat Besar</option>
              </select>
            </div>

            {/* Rich text editor area */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleEditorInput}
              data-placeholder="Tulis catatanmu di sini..."
              className={cn(
                "min-h-[140px] max-h-[300px] overflow-y-auto outline-none text-sm leading-relaxed",
                "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
              )}
              style={{ wordBreak: "break-word" }}
            />

            {/* Footer: timestamps */}
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <span className="text-[10px] text-muted-foreground">
                Dibuat: {formatDate(activeNote.createdAt)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                Diubah: {formatDate(activeNote.updatedAt)}
              </span>
            </div>
          </div>
        )}

        {/* No search result */}
        {search && filteredNotes.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            Tidak ada catatan yang cocok.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteCard;
