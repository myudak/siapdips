import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter as DialogFooterUI,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TimePicker } from "@/components/ui/time-picker";
import { Plus, Pencil, Trash2, RefreshCcw, Save } from "lucide-react";

type JadwalItem = {
  mataKuliah: string;
  ruang: string;
  waktuMulai: string; // HH:MM
  waktuSelesai: string; // HH:MM
  sks: number;
  msTeams: string;
};

type JadwalMinggu = {
  [key: string]: JadwalItem[];
};

const DAY_KEYS = [
  "minggu",
  "senin",
  "selasa",
  "rabu",
  "kamis",
  "jumat",
  "sabtu",
] as const;

const TITLE_PER_DAY: Record<(typeof DAY_KEYS)[number], string> = {
  minggu: "Minggu",
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
};

function normalizeTime(value: string): string {
  // Accept HH:MM or HH:MM:SS -> return HH:MM
  if (!value) return "";
  const parts = value.split(":");
  const h = parts[0]?.padStart(2, "0") ?? "00";
  const m = (parts[1] ?? "00").padStart(2, "0");
  return `${h}:${m}`;
}

function compareTimeAsc(a: string, b: string): number {
  return normalizeTime(a).localeCompare(normalizeTime(b));
}

export default function SettingJadwal() {
  const [data, setData] = useState<JadwalMinggu>({});
  const [activeDay, setActiveDay] = useState<(typeof DAY_KEYS)[number]>("senin");
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // form refs
  const mataKuliahRef = useRef<HTMLInputElement>(null);
  const ruangRef = useRef<HTMLInputElement>(null);
  const sksRef = useRef<HTMLInputElement>(null);
  const msTeamsRef = useRef<HTMLInputElement>(null);
  const [waktuMulai, setWaktuMulai] = useState<string>("");
  const [waktuSelesai, setWaktuSelesai] = useState<string>("");

  // load from chrome.storage.local
  useEffect(() => {
    chrome.storage.local.get(["scheduleData"], (result) => {
      const stored: JadwalMinggu = result.scheduleData ?? {};
      // ensure all day keys exist
      const complete: JadwalMinggu = DAY_KEYS.reduce((acc, key) => {
        const items = (stored[key] ?? []).map((it) => ({
          ...it,
          waktuMulai: normalizeTime(it.waktuMulai),
          waktuSelesai: normalizeTime(it.waktuSelesai),
        }));
        acc[key] = items.sort((a, b) => compareTimeAsc(a.waktuMulai, b.waktuMulai));
        return acc;
      }, {} as JadwalMinggu);
      setData(complete);
    });
  }, []);

  const itemsToday = useMemo(() => data[activeDay] ?? [], [data, activeDay]);

  function resetForm() {
    setEditingIndex(null);
    setWaktuMulai("");
    setWaktuSelesai("");
    if (mataKuliahRef.current) mataKuliahRef.current.value = "";
    if (ruangRef.current) ruangRef.current.value = "";
    if (sksRef.current) sksRef.current.value = "";
    if (msTeamsRef.current) msTeamsRef.current.value = "";
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  function openEdit(index: number) {
    const item = itemsToday[index];
    if (!item) return;
    setEditingIndex(index);
    if (mataKuliahRef.current) mataKuliahRef.current.value = item.mataKuliah;
    if (ruangRef.current) ruangRef.current.value = item.ruang;
    if (sksRef.current) sksRef.current.value = String(item.sks);
    if (msTeamsRef.current) msTeamsRef.current.value = item.msTeams ?? "";
    setWaktuMulai(normalizeTime(item.waktuMulai));
    setWaktuSelesai(normalizeTime(item.waktuSelesai));
    setOpen(true);
  }

  function validateForm(): string | null {
    const mataKuliah = mataKuliahRef.current?.value.trim() ?? "";
    const ruang = ruangRef.current?.value.trim() ?? "";
    const sks = Number(sksRef.current?.value ?? 0);
    if (!mataKuliah) return "Mata kuliah wajib diisi";
    if (!ruang) return "Ruang wajib diisi";
    if (!waktuMulai) return "Waktu mulai wajib diisi";
    if (!waktuSelesai) return "Waktu selesai wajib diisi";
    if (normalizeTime(waktuMulai) >= normalizeTime(waktuSelesai)) return "Waktu selesai harus setelah mulai";
    if (!Number.isFinite(sks) || sks <= 0) return "SKS harus angka > 0";
    return null;
  }

  function upsertItem() {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    const newItem: JadwalItem = {
      mataKuliah: mataKuliahRef.current?.value.trim() ?? "",
      ruang: ruangRef.current?.value.trim() ?? "",
      waktuMulai: normalizeTime(waktuMulai),
      waktuSelesai: normalizeTime(waktuSelesai),
      sks: Number(sksRef.current?.value ?? 0),
      msTeams: msTeamsRef.current?.value.trim() ?? "",
    };
    setData((prev) => {
      const next = { ...prev } as JadwalMinggu;
      const list = [...(next[activeDay] ?? [])];
      if (editingIndex === null) {
        list.push(newItem);
      } else {
        list[editingIndex] = newItem;
      }
      next[activeDay] = list.sort((a, b) => compareTimeAsc(a.waktuMulai, b.waktuMulai));
      return next;
    });
    setOpen(false);
    setEditingIndex(null);
    toast.success("Jadwal disimpan (lokal)");
  }

  function removeItem(index: number) {
    setData((prev) => {
      const next = { ...prev } as JadwalMinggu;
      const list = [...(next[activeDay] ?? [])];
      list.splice(index, 1);
      next[activeDay] = list;
      return next;
    });
  }

  function saveAll() {
    // transform back to HH:MM:SS for consumer component compatibility
    const toStore: JadwalMinggu = DAY_KEYS.reduce((acc, key) => {
      const items = (data[key] ?? []).map((it) => ({
        ...it,
        waktuMulai: `${normalizeTime(it.waktuMulai)}:00`,
        waktuSelesai: `${normalizeTime(it.waktuSelesai)}:00`,
      }));
      acc[key] = items;
      return acc;
    }, {} as JadwalMinggu);

    chrome.storage.local.set({ scheduleData: toStore }, () => {
      toast.success("Schedule saved ✨");
    });
  }

  function resetAll() {
    if (!confirm("Reset semua jadwal?")) return;
    const cleared = DAY_KEYS.reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {} as JadwalMinggu);
    setData(cleared);
    chrome.storage.local.set({ scheduleData: cleared }, () => {
      toast.success("Jadwal direset");
    });
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-4">
        <CardTitle className="text-slate-900 dark:text-white flex items-center justify-between">
          <span>Jadwal Editor</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetAll}>
              <RefreshCcw className="w-4 h-4 mr-1" /> Reset
            </Button>
            <Button size="sm" onClick={saveAll}>
              <Save className="w-4 h-4 mr-1" /> Save All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeDay} onValueChange={(v) => setActiveDay(v as any)}>
          <TabsList className="flex flex-wrap gap-2 p-1">
            {DAY_KEYS.map((d) => (
              <TabsTrigger key={d} value={d} className="capitalize">
                {TITLE_PER_DAY[d]}
              </TabsTrigger>
            ))}
          </TabsList>
          {DAY_KEYS.map((d) => (
            <TabsContent key={d} value={d}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-muted-foreground">
                  {data[d]?.length ?? 0} item
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={openCreate}>
                      <Plus className="w-4 h-4 mr-1" /> Tambah
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingIndex === null ? "Tambah Jadwal" : "Edit Jadwal"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-1 block">Mata Kuliah</Label>
                        <Input ref={mataKuliahRef} placeholder="Algoritma dan Pemrograman" />
                      </div>
                      <div>
                        <Label className="mb-1 block">Ruang</Label>
                        <Input ref={ruangRef} placeholder="A301" />
                      </div>
                      <div>
                        <Label className="mb-1 block">Waktu Mulai</Label>
                        <TimePicker time={waktuMulai} onTimeChange={setWaktuMulai} placeholder="08:00" />
                      </div>
                      <div>
                        <Label className="mb-1 block">Waktu Selesai</Label>
                        <TimePicker time={waktuSelesai} onTimeChange={setWaktuSelesai} placeholder="10:30" />
                      </div>
                      <div>
                        <Label className="mb-1 block">SKS</Label>
                        <Input ref={sksRef} type="number" min={1} placeholder="3" />
                      </div>
                      <div>
                        <Label className="mb-1 block">MS Teams (opsional)</Label>
                        <Input ref={msTeamsRef} placeholder="https://teams.microsoft.com/..." />
                      </div>
                    </div>
                    <DialogFooterUI className="mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                      </DialogClose>
                      <Button onClick={upsertItem}>Simpan</Button>
                    </DialogFooterUI>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="divide-y rounded-md border overflow-hidden">
                {(data[d] ?? []).length === 0 && (
                  <div className="p-4 text-sm text-muted-foreground">Belum ada jadwal untuk hari ini.</div>
                )}
                {(data[d] ?? []).map((item, idx) => (
                  <div key={`${d}-${idx}`} className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate text-slate-900 dark:text-white">{item.mataKuliah}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {item.waktuMulai} - {item.waktuSelesai} • Ruang {item.ruang} • {item.sks} SKS
                      </div>
                      {item.msTeams && (
                        <a
                          className="text-xs text-blue-600 hover:underline break-all"
                          href={item.msTeams}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.msTeams}
                        </a>
                      )}
                    </div>
                    <div className="shrink-0 flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(idx)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          removeItem(idx);
                          toast.success("Item dihapus");
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="justify-end">
        <div className="text-xs text-muted-foreground">Perubahan disimpan setelah klik Save All</div>
      </CardFooter>
    </Card>
  );
}


