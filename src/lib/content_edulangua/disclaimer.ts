// src/lib/content_edulangua/disclaimer.ts

const DISCLAIMER_KEY = "siedu_disclaimer_accepted_at";
const DISCLAIMER_TTL_MS = 36 * 60 * 60 * 1000; // 36 jam (129.600.000 ms)

/** Cek fallback localStorage jika chrome storage tidak tersedia */
function checkLocalStorageFallback(): boolean {
  try {
    const val = localStorage.getItem(DISCLAIMER_KEY);
    if (!val) return true;
    const acceptedAt = parseInt(val, 10);
    if (isNaN(acceptedAt)) return true;
    return Date.now() - acceptedAt >= DISCLAIMER_TTL_MS;
  } catch {
    return true;
  }
}

/** Cek apakah disclaimer perlu ditampilkan (pertama kali atau sudah lebih dari 36 jam) */
export async function needsDisclaimer(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(DISCLAIMER_KEY, (result) => {
          if (chrome.runtime?.lastError) {
            return resolve(checkLocalStorageFallback());
          }
          const acceptedAt = result?.[DISCLAIMER_KEY];
          if (!acceptedAt || typeof acceptedAt !== "number") {
            return resolve(checkLocalStorageFallback());
          }
          const elapsed = Date.now() - acceptedAt;
          resolve(elapsed >= DISCLAIMER_TTL_MS);
        });
        return;
      }
      resolve(checkLocalStorageFallback());
    } catch {
      resolve(checkLocalStorageFallback());
    }
  });
}

/** Simpan waktu persetujuan disclaimer */
export function saveDisclaimerAccepted(): Promise<void> {
  return new Promise((resolve) => {
    const now = Date.now();
    try {
      localStorage.setItem(DISCLAIMER_KEY, String(now));
    } catch (_) {}

    try {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [DISCLAIMER_KEY]: now }, () => {
          resolve();
        });
        return;
      }
    } catch (_) {}
    resolve();
  });
}

/** Inject keyframes untuk animasi modal */
export function injectDisclaimerStyles() {
  if (document.getElementById("siedu-disclaimer-styles")) return;
  const style = document.createElement("style");
  style.id = "siedu-disclaimer-styles";
  style.textContent = `
    @keyframes siedu-fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes siedu-fadeout {
      from { opacity: 1; }
      to   { opacity: 0; }
    }
    @keyframes siedu-slidein {
      from { opacity: 0; transform: scale(0.92) translateY(18px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

/** Tampilkan modal disclaimer pemblokir, me-resolve Promise hanya saat user klik Setuju */
export function showDisclaimer(): Promise<void> {
  return new Promise((resolve) => {
    // Hindari duplikasi modal jika sudah aktif di DOM
    if (document.getElementById("siedu-disclaimer-overlay")) {
      return;
    }

    injectDisclaimerStyles();

    // Kunci scroll halaman agar edulangua tidak bisa digeser sebelum setuju
    const origBodyOverflow = document.body ? document.body.style.overflow : "";
    const origDocOverflow = document.documentElement ? document.documentElement.style.overflow : "";
    if (document.body) document.body.style.overflow = "hidden";
    if (document.documentElement) document.documentElement.style.overflow = "hidden";

    // ── Overlay Backdrop (Blokir seluruh interaksi layar) ─────────────────
    const overlay = document.createElement("div");
    overlay.id = "siedu-disclaimer-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483647", // Maximum z-index
      backgroundColor: "rgba(15, 23, 42, 0.78)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxSizing: "border-box",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      animation: "siedu-fadein 0.25s ease forwards",
    });

    // Cegah event tembus ke halaman di belakangnya
    overlay.addEventListener("click", (e) => e.stopPropagation());
    overlay.addEventListener("keydown", (e) => e.stopPropagation());

    // ── Modal Box ─────────────────────────────────────────────────────────
    const modal = document.createElement("div");
    modal.id = "siedu-disclaimer-modal";
    Object.assign(modal.style, {
      background: "#ffffff",
      borderRadius: "16px",
      padding: "30px 28px 24px",
      maxWidth: "520px",
      width: "100%",
      maxHeight: "92vh",
      overflowY: "auto",
      boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.05)",
      animation: "siedu-slidein 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      position: "relative",
      boxSizing: "border-box",
      color: "#334155",
    });

    // ── Header (⚠️ PERINGATAN) ──────────────────────────────────────────
    const header = document.createElement("div");
    Object.assign(header.style, {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "20px",
      paddingBottom: "14px",
      borderBottom: "2px solid #fef3c7",
    });

    const iconBadge = document.createElement("div");
    iconBadge.textContent = "⚠️";
    Object.assign(iconBadge.style, {
      fontSize: "24px",
      lineHeight: "1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "44px",
      height: "44px",
      backgroundColor: "#fef3c7",
      borderRadius: "12px",
      border: "1px solid #fde68a",
      flexShrink: "0",
    });

    const title = document.createElement("h2");
    title.textContent = "PERINGATAN";
    Object.assign(title.style, {
      margin: "0",
      fontSize: "20px",
      fontWeight: "800",
      color: "#92400e",
      letterSpacing: "0.5px",
    });

    header.appendChild(iconBadge);
    header.appendChild(title);

    // ── Body ──────────────────────────────────────────────────────────────
    const body = document.createElement("div");
    Object.assign(body.style, {
      fontSize: "13.5px",
      lineHeight: "1.7",
      color: "#374151",
      marginBottom: "22px",
    });

    function p(html: string): HTMLParagraphElement {
      const el = document.createElement("p");
      el.innerHTML = html;
      Object.assign(el.style, {
        margin: "0 0 14px 0",
      });
      return el;
    }

    body.appendChild(
      p(
        "Siedu dibuat sebagai alat bantu dalam proses pembelajaran. " +
        "<strong>Jangan gunakan Siedu sebagai alasan untuk melewatkan proses belajar, " +
        "menghindari usaha, atau sepenuhnya bergantung pada bantuan otomatis.</strong>"
      )
    );

    body.appendChild(
      p(
        "Segala bentuk penggunaan Siedu merupakan tanggung jawab pengguna. " +
        "<strong>Kami tidak bertanggung jawab atas kerugian, kesalahan, maupun dampak " +
        "yang timbul akibat penggunaan Siedu secara tidak bijak atau di luar tujuan yang semestinya.</strong>"
      )
    );

    body.appendChild(
      p(
        "Oleh karena itu, <strong>gunakan Siedu secara bijak, bertanggung jawab, dan seperlunya. " +
        "Jangan biarkan kemudahan menghilangkan proses belajarmu.</strong>"
      )
    );

    // Callout persetujuan
    const agreeCallout = document.createElement("div");
    agreeCallout.innerHTML =
      "<strong>Dengan melanjutkan, Anda menyatakan telah memahami dan menyetujui peringatan ini.</strong>";
    Object.assign(agreeCallout.style, {
      margin: "16px 0 0 0",
      padding: "12px 16px",
      backgroundColor: "#fffbeb",
      borderRadius: "10px",
      border: "1px solid #fde68a",
      fontSize: "13px",
      lineHeight: "1.55",
      color: "#92400e",
    });
    body.appendChild(agreeCallout);

    // ── Button: [ Saya Mengerti dan Setuju ] ────────────────────────────────
    const btn = document.createElement("button");
    btn.textContent = "Saya Mengerti dan Setuju";
    Object.assign(btn.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      padding: "13px 20px",
      backgroundColor: "#2563eb",
      color: "#ffffff",
      border: "none",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: "700",
      cursor: "pointer",
      letterSpacing: "0.3px",
      transition: "background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease",
      boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
      fontFamily: "inherit",
    });

    btn.addEventListener("mouseenter", () => {
      btn.style.backgroundColor = "#1d4ed8";
      btn.style.transform = "translateY(-1px)";
      btn.style.boxShadow = "0 6px 18px rgba(29, 78, 216, 0.4)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.backgroundColor = "#2563eb";
      btn.style.transform = "translateY(0)";
      btn.style.boxShadow = "0 4px 14px rgba(37, 99, 235, 0.35)";
    });
    btn.addEventListener("mousedown", () => {
      btn.style.transform = "translateY(1px)";
    });

    btn.addEventListener("click", async () => {
      // Simpan waktu persetujuan
      await saveDisclaimerAccepted();

      // Kembalikan overflow scroll halaman
      if (document.body) document.body.style.overflow = origBodyOverflow;
      if (document.documentElement) document.documentElement.style.overflow = origDocOverflow;

      // Animasi keluar
      overlay.style.animation = "siedu-fadeout 0.2s ease forwards";
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 200);
    });

    // ── Assemble ──────────────────────────────────────────────────────────
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(btn);
    overlay.appendChild(modal);

    const mount = () => {
      if (!document.getElementById("siedu-disclaimer-overlay")) {
        document.body.appendChild(overlay);
      }
    };

    if (document.body) {
      mount();
    } else {
      document.addEventListener("DOMContentLoaded", mount);
    }
  });
}

/** Entry point: periksa disclaimer, tampilkan modal jika perlu, lalu panggil callback saat diizinkan */
export async function runWithDisclaimer(callback: () => void): Promise<void> {
  const needs = await needsDisclaimer();
  if (needs) {
    await showDisclaimer();
  }
  callback();
}
