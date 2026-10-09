/* eslint-disable @typescript-eslint/ban-ts-comment */

// ─── Types ────────────────────────────────────────────────────────────────────

interface ButtonConfig {
  text: string;
  icon: string;
  primary?: boolean;
  action?: () => Promise<void> | void;
}

// ─── State ────────────────────────────────────────────────────────────────────

let shouldStop = false;
let noteToggleCallback: (() => void) | null = null;

/** Register callback yang dipanggil saat tombol Note diklik */
export function onNoteToggle(cb: () => void) {
  noteToggleCallback = cb;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showToast(text: string, duration = 3000) {
  // @ts-ignore
  Toastify({
    text,
    duration,
    close: true,
    position: "left",
  }).showToast();
}

/**
 * Aktifkan toggle "Show Answers" (hanya jika belum ON).
 * Digunakan untuk inisialisasi awal sebelum loop soal.
 */
function enableShowAnswers(): void {
  const toggle = document.getElementById(
    "dev-show-answers-toggle"
  ) as HTMLInputElement | null;
  if (!toggle) return;

  if (!toggle.checked) {
    toggle.click();
  }
}

/**
 * Cycle toggle show-answers: OFF → ON.
 *
 * Ini adalah fix utama untuk soal yang sudah pernah dikerjakan:
 * - Setelah Reset, marker .mcq-correct di DOM menjadi stale
 * - Platform EduLangua hanya me-refresh marker ketika toggle benar-benar
 *   di-toggle (bukan hanya saat ON)
 * - Dengan mematikan lalu menyalakan kembali, platform dipaksa
 *   re-apply semua marker jawaban benar ke DOM
 */
async function cycleShowAnswers(): Promise<void> {
  const toggle = document.getElementById(
    "dev-show-answers-toggle"
  ) as HTMLInputElement | null;
  if (!toggle) return;

  // Matikan dulu jika sedang ON
  if (toggle.checked) {
    toggle.click();
    await sleep(250); // tunggu platform remove marker
  }

  // Nyalakan kembali → platform re-apply marker jawaban benar
  toggle.click();
  await sleep(400); // tunggu DOM update selesai
}

/**
 * Tunggu sampai kondisi terpenuhi, dengan timeout.
 * Berguna untuk menunggu DOM update setelah klik.
 */
function waitFor(
  condition: () => boolean,
  timeoutMs = 2000,
  intervalMs = 50
): Promise<boolean> {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      if (condition()) return resolve(true);
      if (Date.now() - start > timeoutMs) return resolve(false);
      setTimeout(check, intervalMs);
    };
    check();
  });
}

// ─── Core Solver ──────────────────────────────────────────────────────────────

// ─── Auto Voice ───────────────────────────────────────────────────────────────

/**
 * Selesaikan semua soal voice recorder (record-and-compare) di halaman.
 *
 * Alur:
 *   Content script (isolated) → sendMessage → Background script →
 *   executeScript world:MAIN → bypass CSP EduLangua → override getUserMedia ✅
 *
 * Pola ini sama dengan hackerrankSetEditorCode yang sudah ada di project.
 */
async function autoVoiceCurrentPage(): Promise<number> {
  // Cek cepat apakah ada soal voice sebelum kirim pesan ke background
  const racCount = document.querySelectorAll(
    ".record-and-compare:not(.page-answer-actions)"
  ).length;

  if (racCount === 0) {
    showToast("⚠️ Tidak ada soal voice (record-and-compare) ditemukan");
    return 0;
  }

  showToast(`🎙️ Auto Voice dimulai... (${racCount} soal)`, 2000);

  // Kirim pesan ke background; background panggil executeScript world:MAIN
  // sehingga override getUserMedia terlihat oleh kode platform EduLangua
  return new Promise<number>((resolve) => {
    chrome.runtime.sendMessage(
      { type: "autoVoiceEduLangua" },
      (response: { ok: boolean; handled: number } | undefined) => {
        if (chrome.runtime.lastError) {
          console.error("[AutoVoice] Runtime error:", chrome.runtime.lastError);
          showToast("❌ Gagal: " + chrome.runtime.lastError.message, 3000);
          resolve(0);
          return;
        }
        resolve(response?.handled ?? 0);
      }
    );
  });
}

// ─── Core Solver ──────────────────────────────────────────────────────────────

/**
 * Mendeteksi tipe soal dari container-nya dan mengisi jawaban yang benar,
 * lalu mengklik Submit.
 *
 * Tipe yang didukung:
 *  - MCQ            → .mcq-option.mcq-correct
 *  - Grouping/D&D   → .grouping-item.grouping-correct (sudah terpasang oleh dev-toggle)
 *  - Voice/Audio    → dilewati (skip)
 *
 * NOTE: Reset sudah dilakukan di solveCurrentPage sebelum fungsi ini dipanggil.
 */
async function solveQuestion(actionEl: Element): Promise<void> {
  // Cari container soal (parent terdekat yang merupakan card)
  const card =
    actionEl.closest(
      ".question-card, .activity-section, [class*='question-card']"
    ) || actionEl.parentElement;

  if (!card) return;

  // --- Voice / Audio: skip (ditangani oleh Auto Voice) ---
  if (
    card.querySelector(
      '[class*="voice"], [class*="speak"], [class*="audio-record"], [class*="recording"]'
    )
  ) {
    console.log("[EduLangua] Skipping voice/audio question");
    showToast("⏭️ Soal audio dilewati", 1500);
    return;
  }

  // --- MCQ: klik opsi yang benar ---
  if (card.querySelector(".mcq-option")) {
    // Tunggu sampai mcq-correct muncul di DOM (maksimal 2 detik)
    const appeared = await waitFor(
      () => !!card.querySelector(".mcq-option.mcq-correct"),
      2000
    );
    if (!appeared) {
      console.warn("[EduLangua] MCQ: mcq-correct tidak muncul setelah 2 detik, skip");
      return;
    }
    const correctOption = card.querySelector(
      ".mcq-option.mcq-correct"
    ) as HTMLElement;
    correctOption.click();
    await sleep(200);
  }

  // --- Grouping / Drag & Drop ---
  // Jika dev-toggle sudah aktif, grouping-correct sudah di-set oleh platform.
  // Kita perlu memastikan slot-slot sudah terisi sebelum submit.
  const draggableSlots = card.querySelectorAll(
    "[class*='slot'], [class*='drop-zone'], [class*='target']"
  );
  if (draggableSlots.length > 0) {
    // Tunggu sampai slot terisi (dev-toggle mengisi otomatis) atau timeout
    await waitFor(
      () => {
        const emptySlots = card.querySelectorAll(
          "[class*='slot']:empty, [class*='drop-zone']:empty"
        );
        return emptySlots.length === 0;
      },
      1500
    );
    await sleep(200);
  }

  // --- Submit soal ini ---
  // Coba beberapa selector: primary button, submit, atau tombol apapun di actions
  const submitBtn = (
    actionEl.querySelector(".answer-actions__btn--primary") ??
    actionEl.querySelector("button[type='submit']") ??
    actionEl.querySelector(".answer-actions button:not(.answer-actions__reset)")
  ) as HTMLElement | null;

  if (submitBtn && !(submitBtn as HTMLButtonElement).disabled) {
    submitBtn.click();
    await sleep(400);
  } else {
    console.warn("[EduLangua] Submit button tidak ditemukan atau disabled");
  }
}

/**
 * Selesaikan semua soal di halaman saat ini.
 * Mengembalikan jumlah soal yang berhasil dikerjakan.
 *
 * FLOW per soal:
 *   1. Klik Reset (clear jawaban lama)
 *   2. Aktifkan ulang show-answers (reset bisa mematikan toggle)
 *   3. Klik jawaban benar + Submit
 *
 * Ini menangani soal yang sudah pernah dijawab maupun yang belum.
 */
async function solveCurrentPage(): Promise<number> {
  // Aktifkan show-answers untuk pertama kali
  enableShowAnswers();
  await sleep(600);

  // Ambil semua answer-actions di level soal
  // (kecualikan yang berada di dalam .page-answer-actions)
  const pageActions = document.querySelector(".page-answer-actions");
  const allActions = Array.from(
    document.querySelectorAll<Element>(".answer-actions")
  );
  const questionActions = allActions.filter(
    (el) => !pageActions?.contains(el)
  );

  if (questionActions.length === 0) {
    console.log("[EduLangua] Tidak ada soal di halaman ini");
    return 0;
  }

  console.log(`[EduLangua] Mengerjakan ${questionActions.length} soal...`);

  let solved = 0;
  for (const actionEl of questionActions) {
    if (shouldStop) break;

    // STEP 1: Reset soal ini terlebih dahulu agar state bersih
    // (diperlukan untuk soal yang sudah pernah dijawab/di-submit sebelumnya)
    const resetBtn = actionEl.querySelector(
      ".answer-actions__reset"
    ) as HTMLButtonElement | null;

    const isResetDisabled =
      !resetBtn ||
      resetBtn.disabled ||
      resetBtn.getAttribute("aria-disabled") === "true" ||
      resetBtn.classList.contains("disabled");

    if (!isResetDisabled) {
      resetBtn!.click();
      await sleep(400); // tunggu DOM update setelah reset
    } else if (resetBtn) {
      // Reset button ada tapi disabled — coba force enable lalu klik
      resetBtn.removeAttribute("disabled");
      resetBtn.click();
      await sleep(400);
    }

    // STEP 2: Cycle toggle show-answers (OFF → ON) setelah reset.
    // Ini kunci fix-nya: platform hanya me-refresh marker .mcq-correct
    // ketika toggle benar-benar di-cycle, bukan hanya saat memastikan ON.
    // (Sama persis dengan workaround manual: toggle 2x)
    await cycleShowAnswers();

    // STEP 3: Solve soal (klik jawaban benar + submit)
    await solveQuestion(actionEl);
    solved++;
  }

  return solved;
}

// ─── Button Actions ───────────────────────────────────────────────────────────

/** Kerjakan hanya halaman saat ini */
function AutoThisPage(): () => Promise<void> {
  return async () => {
    shouldStop = false;
    showToast("🔥 Mengerjakan halaman ini...");
    const count = await solveCurrentPage();
    if (count > 0) {
      showToast(`✅ Selesai! ${count} soal dikerjakan`);
    } else {
      showToast("⚠️ Tidak ada soal yang ditemukan di halaman ini");
    }
  };
}

/**
 * Kerjakan semua halaman ke depan secara otomatis (tanpa batas unit).
 * Berhenti jika tombol Next tidak tersedia atau shouldStop = true.
 */
function AutoAll(): () => Promise<void> {
  return async () => {
    shouldStop = false;
    showToast("🚀 Auto All dimulai...", 2000);
    let totalSolved = 0;
    let pagesVisited = 0;

    while (!shouldStop) {
      const count = await solveCurrentPage();
      totalSolved += count;
      pagesVisited++;

      if (count === 0) {
        console.log("[EduLangua] Halaman ini tidak ada soal, tetap lanjut...");
      }

      await sleep(800);

      // Cek tombol Next
      const nextBtn = document.getElementById("nav-next") as HTMLElement | null;
      const isDisabled =
        !nextBtn ||
        (nextBtn as HTMLButtonElement).disabled ||
        nextBtn.getAttribute("aria-disabled") === "true" ||
        nextBtn.classList.contains("disabled");

      if (isDisabled) {
        showToast(
          `✅ Selesai! Total ${totalSolved} soal di ${pagesVisited} halaman`
        );
        break;
      }

      nextBtn!.click();
      await sleep(1800); // tunggu halaman berikutnya load
    }

    if (shouldStop) {
      showToast("🛑 Dihentikan!");
    }
  };
}

/** Toggle visibilitas jawaban benar di halaman */
function ToggleShowAnswers(): () => void {
  return () => {
    const toggle = document.getElementById(
      "dev-show-answers-toggle"
    ) as HTMLInputElement | null;
    if (!toggle) {
      showToast("⚠️ Dev toggle tidak ditemukan");
      return;
    }
    toggle.click();
    showToast(toggle.checked ? "👁️ Jawaban ditampilkan" : "👁️ Jawaban disembunyikan", 1500);
  };
}

/** Pindah ke halaman berikutnya */
function GoNext(): () => void {
  return () => {
    const nextBtn = document.getElementById("nav-next") as HTMLElement | null;
    if (nextBtn) {
      nextBtn.click();
    } else {
      showToast("⚠️ Tombol Next tidak ditemukan");
    }
  };
}

/** Hentikan proses auto */
function StopAuto(): () => void {
  return () => {
    shouldStop = true;
    showToast("🛑 Menghentikan...");
  };
}

/** Toggle panel catatan di dalam widget */
function ToggleNote(): () => void {
  return () => {
    if (noteToggleCallback) noteToggleCallback();
  };
}

/**
 * Jalankan Auto Voice: ambil audio soal → inject sebagai rekaman → submit.
 * Hanya memproses soal bertipe voice recorder di halaman saat ini.
 */
function AutoVoice(): () => Promise<void> {
  return async () => {
    shouldStop = false;
    showToast("🎙️ Auto Voice dimulai...", 2000);
    const count = await autoVoiceCurrentPage();
    if (count > 0) {
      showToast(`✅ Auto Voice selesai! ${count} soal voice dikerjakan`);
    } else {
      showToast("⚠️ Tidak ada soal voice yang berhasil diproses");
    }
  };
}

// ─── Button Registry ──────────────────────────────────────────────────────────

const BUTTONS: ButtonConfig[] = [
  {
    text: "AUTO THIS PAGE",
    icon: "🔥",
    primary: true,
    action: AutoThisPage(),
  },
  {
    text: "AUTO ALL",
    icon: "🚀",
    action: AutoAll(),
  },
  {
    text: "Auto Voice",
    icon: "🎙️",
    action: AutoVoice(),
  },
  {
    text: "Toggle Answers",
    icon: "👁️",
    action: ToggleShowAnswers(),
  },
  {
    text: "Next Page",
    icon: "➡️",
    action: GoNext(),
  },
  {
    text: "Note",
    icon: "📝",
    action: ToggleNote(),
  },
  {
    text: "STOP",
    icon: "🛑",
    action: StopAuto(),
  },
];

export { BUTTONS };
