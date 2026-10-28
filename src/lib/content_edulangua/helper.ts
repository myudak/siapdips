// src/lib/content_edulangua/helper.ts
import { BUTTONS, onNoteToggle } from "./config";
import { Draggable } from "./draggable";

export function createHelper(): HTMLElement {
  const existingHelper = document.getElementById("siedu-helper-widget");
  if (existingHelper) {
    return existingHelper as HTMLElement;
  }
  const helper = document.createElement("div");
  helper.id = "siedu-helper-widget";
  Object.assign(helper.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    width: "300px",
    minHeight: "180px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
    padding: "16px",
    zIndex: "9999",
    resize: "both",
    overflow: "auto",
    border: "1px solid rgba(0,0,0,0.08)",
    backdropFilter: "blur(10px)",
    transition: "box-shadow 0.3s ease",
    transform: "translate(0, 0)",
  });

  // ── Header ──────────────────────────────────────────────────────────────
  const header = document.createElement("div");
  Object.assign(header.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    userSelect: "none",
    padding: "4px 4px 12px 4px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  });

  // Title (juga sebagai drag handle)
  const titleContainer = document.createElement("div");
  Object.assign(titleContainer.style, {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "move",
    padding: "4px 8px",
    borderRadius: "6px",
    transition: "background-color 0.2s ease",
  });

  const logoSiapDips = createLogoSiapDips();

  const titleText = document.createElement("span");
  titleText.textContent = "Siedu";
  Object.assign(titleText.style, {
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "default",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });

  const badge = document.createElement("span");
  badge.textContent = "by Siap Dips";
  Object.assign(badge.style, {
    fontSize: "10px",
    fontWeight: "600",
    color: "#2563eb",
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "4px",
    padding: "1px 6px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });

  titleContainer.appendChild(logoSiapDips);
  titleContainer.appendChild(titleText);
  titleContainer.appendChild(badge);

  // Minimize button
  const minimizeButton = document.createElement("button");
  Object.assign(minimizeButton.style, {
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: "6px",
    color: "#666",
    fontSize: "14px",
    transition: "all 0.2s ease",
    marginRight: "4px",
    minWidth: "36px",
    minHeight: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  minimizeButton.textContent = "▼";
  minimizeButton.title = "Minimize";

  minimizeButton.addEventListener("mouseenter", () => {
    minimizeButton.style.backgroundColor = "#f5f5f5";
    minimizeButton.style.color = "#333";
  });
  minimizeButton.addEventListener("mouseleave", () => {
    minimizeButton.style.backgroundColor = "transparent";
    minimizeButton.style.color = "#666";
  });

  // Close button
  const closeButton = document.createElement("button");
  Object.assign(closeButton.style, {
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: "6px",
    color: "#666",
    fontSize: "14px",
    transition: "all 0.2s ease",
    minWidth: "36px",
    minHeight: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  closeButton.textContent = "✕";

  closeButton.addEventListener("mouseenter", () => {
    closeButton.style.backgroundColor = "#fee2e2";
    closeButton.style.color = "#dc2626";
  });
  closeButton.addEventListener("mouseleave", () => {
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.color = "#666";
  });
  closeButton.addEventListener("click", () => helper.remove());

  // Content area
  const content = document.createElement("div");
  Object.assign(content.style, {
    minHeight: "80px",
    width: "100%",
    display: "grid",
    gap: "8px",
    padding: "4px 0",
  });

  // Minimize/Restore toggle
  const originalStyles = {
    minHeight: helper.style.minHeight,
    resize: helper.style.resize,
  };
  let isMinimized = false;

  minimizeButton.addEventListener("click", () => {
    isMinimized = !isMinimized;
    if (isMinimized) {
      content.style.display = "none";
      helper.style.minHeight = "auto";
      helper.style.resize = "none";
      minimizeButton.textContent = "▲";
      minimizeButton.title = "Expand";
    } else {
      content.style.display = "grid";
      helper.style.minHeight = originalStyles.minHeight;
      helper.style.resize = originalStyles.resize;
      minimizeButton.textContent = "▼";
      minimizeButton.title = "Minimize";
    }
  });

  // Assemble header
  header.appendChild(titleContainer);
  header.appendChild(minimizeButton);
  header.appendChild(closeButton);
  helper.appendChild(header);
  helper.appendChild(content);

  // Draggable via title
  new Draggable({ element: helper, handle: titleContainer });

  // Create buttons
  createButtons(content);

  document.body.appendChild(helper);

  // ── Floating Note Panel (di luar widget, di sebelah kiri) ──────────────
  const notePanel = createFloatingNotePanel();
  document.body.appendChild(notePanel);

  /** Posisikan note panel tepat di kiri widget */
  function positionNotePanel() {
    const rect = helper.getBoundingClientRect();
    const panelW = 170;
    const gap = 8;
    notePanel.style.top  = rect.top + "px";
    notePanel.style.left = (rect.left - panelW - gap) + "px";
  }

  // Ikuti posisi widget saat di-drag (watch transform perubahan)
  const transformObserver = new MutationObserver(positionNotePanel);
  transformObserver.observe(helper, { attributes: true, attributeFilter: ["style"] });

  // Register toggle callback
  let noteOpen = false;
  onNoteToggle(() => {
    noteOpen = !noteOpen;
    if (noteOpen) {
      positionNotePanel();
      notePanel.style.display = "flex";
    } else {
      notePanel.style.display = "none";
    }
  });

  // Hapus note panel saat widget di-close
  closeButton.addEventListener("click", () => {
    notePanel.remove();
    transformObserver.disconnect();
  });

  return helper;
}

// ── Note Panel (floating di kiri widget) ────────────────────────────────

const SIEDU_NOTE_KEY = "siedu_note_inpage";

function createFloatingNotePanel(): HTMLElement {
  const panel = document.createElement("div");
  Object.assign(panel.style, {
    position: "fixed",
    width: "170px",
    display: "none",           // hidden by default
    flexDirection: "column",
    zIndex: "9998",
    borderRadius: "10px",
    border: "1px solid #fde68a",
    overflow: "hidden",
    backgroundColor: "#fffbeb",
    boxShadow: "0 8px 20px rgba(0,0,0,0.10)",
    animation: "siapdips-noteslide 0.18s ease",
  });


  // Header note panel
  const panelHeader = document.createElement("div");
  Object.assign(panelHeader.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 10px",
    backgroundColor: "#fef3c7",
    borderBottom: "1px solid #fde68a",
  });

  const panelTitle = document.createElement("span");
  panelTitle.textContent = "📝 Catatan";
  Object.assign(panelTitle.style, {
    fontSize: "12px",
    fontWeight: "600",
    color: "#92400e",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "🗑️";
  clearBtn.title = "Hapus catatan";
  Object.assign(clearBtn.style, {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "12px",
    padding: "2px 4px",
    borderRadius: "4px",
    lineHeight: "1",
  });
  clearBtn.addEventListener("mouseenter", () => { clearBtn.style.backgroundColor = "#fde68a"; });
  clearBtn.addEventListener("mouseleave", () => { clearBtn.style.backgroundColor = "transparent"; });

  panelHeader.appendChild(panelTitle);
  panelHeader.appendChild(clearBtn);

  // Text area
  const textarea = document.createElement("textarea");
  textarea.placeholder = "Tulis catatan di sini...";
  Object.assign(textarea.style, {
    width: "100%",
    minHeight: "140px",
    maxHeight: "240px",
    padding: "8px 10px",
    border: "none",
    outline: "none",
    resize: "vertical",
    fontSize: "13px",
    lineHeight: "1.5",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: "#fffbeb",
    color: "#1f2937",
    boxSizing: "border-box",
  });

  // Footer: status + char count
  const panelFooter = document.createElement("div");
  Object.assign(panelFooter.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "4px 10px",
    borderTop: "1px solid #fde68a",
    backgroundColor: "#fef9ee",
  });

  const charCount = document.createElement("span");
  charCount.textContent = "0 karakter";
  Object.assign(charCount.style, {
    fontSize: "10px",
    color: "#9ca3af",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });

  const saveStatus = document.createElement("span");
  saveStatus.textContent = "✓ Tersimpan";
  Object.assign(saveStatus.style, {
    fontSize: "10px",
    color: "#16a34a",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });

  panelFooter.appendChild(charCount);
  panelFooter.appendChild(saveStatus);

  // Load saved note
  chrome.storage.local.get(SIEDU_NOTE_KEY, (result) => {
    const saved: string = result[SIEDU_NOTE_KEY] ?? "";
    textarea.value = saved;
    charCount.textContent = `${saved.length} karakter`;
  });

  // Auto-save debounced
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  textarea.addEventListener("input", () => {
    const text = textarea.value;
    charCount.textContent = `${text.length} karakter`;
    saveStatus.textContent = "Menyimpan...";
    saveStatus.style.color = "#d97706";

    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      chrome.storage.local.set({ [SIEDU_NOTE_KEY]: text });
      saveStatus.textContent = "✓ Tersimpan";
      saveStatus.style.color = "#16a34a";
    }, 600);
  });

  // Clear button
  clearBtn.addEventListener("click", () => {
    textarea.value = "";
    charCount.textContent = "0 karakter";
    saveStatus.textContent = "✓ Tersimpan";
    saveStatus.style.color = "#16a34a";
    chrome.storage.local.set({ [SIEDU_NOTE_KEY]: "" });
  });

  panel.appendChild(panelHeader);
  panel.appendChild(textarea);
  panel.appendChild(panelFooter);

  return panel;
}

function createLogoSiapDips(): HTMLImageElement {
  const image = document.createElement("img");
  image.src = chrome.runtime.getURL("icons/icon48.png");
  image.alt = "Siap Dips";
  image.width = 18;
  image.height = 18;
  image.draggable = false;
  image.style.flexShrink = "0";
  return image;
}

function createButtons(container: HTMLElement) {
  BUTTONS.forEach((btn) => {
    const button = document.createElement("button");
    Object.assign(button.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "10px 14px",
      border: btn.primary ? "none" : "1px solid #e5e7eb",
      borderRadius: "8px",
      backgroundColor: btn.primary ? "#2563eb" : "#ffffff",
      color: btn.primary ? "#ffffff" : "#374151",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      width: "100%",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: "relative",
    });

    // Stop button gets red style
    if (btn.icon === "🛑") {
      button.style.backgroundColor = "#fef2f2";
      button.style.color = "#dc2626";
      button.style.border = "1px solid #fecaca";
    }

    const buttonContent = document.createElement("div");
    Object.assign(buttonContent.style, {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "opacity 0.2s",
    });

    const icon = document.createElement("span");
    icon.textContent = btn.icon;
    Object.assign(icon.style, { fontSize: "14px" });

    const text = document.createElement("span");
    text.textContent = btn.text;

    buttonContent.appendChild(icon);
    buttonContent.appendChild(text);
    button.appendChild(buttonContent);

    // Spinner
    const spinner = createSpinner();
    spinner.style.display = "none";
    button.appendChild(spinner);

    // Hover effects
    const bgNormal = button.style.backgroundColor;
    const bgHover = btn.primary
      ? "#1d4ed8"
      : btn.icon === "🛑"
      ? "#fee2e2"
      : "#f9fafb";

    button.addEventListener("mouseenter", () => {
      button.style.backgroundColor = bgHover;
      button.style.transform = "translateY(-1px)";
      button.style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)";
    });
    button.addEventListener("mouseleave", () => {
      button.style.backgroundColor = bgNormal;
      button.style.transform = "translateY(0)";
      button.style.boxShadow = "none";
    });

    // Click handler
    button.addEventListener("click", async () => {
      button.disabled = true;
      buttonContent.style.opacity = "0";
      spinner.style.display = "block";

      if (btn.action) {
        await btn.action();
        await new Promise((resolve) => setTimeout(resolve, 400));
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      button.disabled = false;
      buttonContent.style.opacity = "1";
      spinner.style.display = "none";
    });

    container.appendChild(button);
  });
}

function createSpinner(): SVGSVGElement {
  const spinner = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  spinner.setAttribute("viewBox", "0 0 24 24");
  spinner.setAttribute("width", "16");
  spinner.setAttribute("height", "16");

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "8");
  circle.setAttribute("stroke", "currentColor");
  circle.setAttribute("stroke-width", "2.5");
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke-dasharray", "30");
  circle.setAttribute("stroke-dashoffset", "10");

  spinner.appendChild(circle);
  spinner.style.animation = "siapdips-spin 0.8s linear infinite";
  return spinner;
}

export function injectGlobalStyles() {
  if (document.getElementById("siapdips-edulangua-styles")) return;
  const style = document.createElement("style");
  style.id = "siapdips-edulangua-styles";
  style.textContent = `
    @keyframes siapdips-spin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes siapdips-noteslide {
      from { opacity: 0; transform: translateX(10px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .dragging {
      user-select: none;
      cursor: move;
    }
  `;
  document.head.appendChild(style);
}
