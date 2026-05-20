import { ORACLE_QA_BANK } from "@/constants/oracleAcademyQA";

const HELPER_ID = "oracle-academy-helper";
const AUTO_HELPER_KEY = "oracleAcademyHelperEnabled";
const AUTO_NEXT_KEY = "oracleAcademyAutoNextEnabled";
const CUSTOM_QA_KEY = "oracleAcademyCustomQA";

let autoNextTimer: number | null = null;
let autoNextMissCount = 0;
let customQa: Record<string, string> = {};

/**
 * Normalize text: trim, collapse spaces, lowercase.
 */
function normalizeText(txt: string | null | undefined): string {
  return (
    (txt || "")
      // Convert non-breaking spaces to normal spaces
      .replace(/\u00A0/g, " ")
      // Normalize dashes/quotes to ASCII
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      // Collapse multiple whitespace into a single space
      .replace(/\s+/g, " ")
      // Normalize curly quotes to straight quotes (optional but helpful)
      .replace(/[""]/g, '"')
      .replace(/[']/g, "'")
      .trim()
      .toLowerCase()
  );
}

function getQuestionElement(): HTMLParagraphElement | HTMLElement | null {
  return (
    document.querySelector<HTMLParagraphElement>(
      "#question-Text .t-ContentBlock-body p"
    ) ||
    document.querySelector<HTMLElement>("#question-Text .t-ContentBlock-body")
  );
}

function getQuestionText(): string | null {
  const questionEl = getQuestionElement();
  if (!questionEl) return null;
  const text = questionEl.innerText.trim();
  return text || null;
}

/**
 * Try to find an answer in ORACLE_QA_BANK using:
 * 1) exact match
 * 2) "includes" match on keys
 */
function findAnswerForQuestion(questionRaw: string): string | null {
  const questionNorm = normalizeText(questionRaw);
  if (!questionNorm) return null;

  const entries = Object.entries(ORACLE_QA_BANK)
    .concat(Object.entries(customQa || {}))
    .map(([key, val]) => ({
      keyNorm: normalizeText(key),
      val,
    }));

  // 1) Exact match on normalized key
  for (const { keyNorm, val } of entries) {
    if (keyNorm === questionNorm) return val;
  }

  // 2) Question contains key (choose the longest key to avoid too-short matches)
  const containsMatches = entries
    .filter(({ keyNorm }) => keyNorm && questionNorm.includes(keyNorm))
    .sort((a, b) => b.keyNorm.length - a.keyNorm.length);
  if (containsMatches.length) return containsMatches[0].val;

  // 3) Key contains question (rare, but keeps compatibility with very short questions)
  for (const { keyNorm, val } of entries) {
    if (keyNorm.includes(questionNorm)) return val;
  }

  // 4) Fallback: match on leading part of the question (helps when the page appends long paragraphs)
  const leadingQuestion = questionNorm.slice(0, 160);
  for (const { keyNorm, val } of entries) {
    const leadingKey = keyNorm.slice(0, 160);
    if (
      leadingQuestion.startsWith(leadingKey) ||
      leadingKey.startsWith(leadingQuestion)
    ) {
      return val;
    }
  }

  console.debug("[Oracle Academy] QA lookup miss. Question norm:", questionNorm);
  console.debug(
    "[Oracle Academy] QA keys (sample):",
    entries.slice(0, 5).map((e) => e.keyNorm)
  );

  return null;
}

function showToast(
  message: string,
  type: "info" | "error" | "success" = "info"
) {
  const bg = {
    info: "#4b5563",
    error: "#dc2626",
    success: "#16a34a",
  }[type];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Toastify({
    text: message,
    duration: 2500,
    close: true,
    gravity: "top",
    position: "left",
    style: { background: bg },
  }).showToast();
}

function getAutoHelperEnabled(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Some contexts might not have chrome (e.g., if run in tests).
      if (!chrome?.storage?.local) {
        resolve(true);
        return;
      }
      chrome.storage.local.get(AUTO_HELPER_KEY, (res) => {
        if (chrome.runtime.lastError) {
          console.debug(
            "[Oracle Academy] Failed to read oracleAcademyHelperEnabled:",
            chrome.runtime.lastError.message
          );
          resolve(true);
          return;
        }
        resolve(res[AUTO_HELPER_KEY] ?? true);
      });
    } catch (err) {
      console.debug("[Oracle Academy] Storage read error:", err);
      resolve(true);
    }
  });
}

function getAutoNextEnabled(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      if (!chrome?.storage?.local) {
        resolve(false);
        return;
      }
      chrome.storage.local.get(AUTO_NEXT_KEY, (res) => {
        if (chrome.runtime.lastError) {
          console.debug(
            "[Oracle Academy] Failed to read oracleAcademyAutoNextEnabled:",
            chrome.runtime.lastError.message
          );
          resolve(false);
          return;
        }
        resolve(res[AUTO_NEXT_KEY] ?? false);
      });
    } catch (err) {
      console.debug("[Oracle Academy] Storage read error:", err);
      resolve(false);
    }
  });
}

function setStoredBoolean(key: string, value: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (!chrome?.storage?.local) {
        resolve();
        return;
      }

      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function loadCustomQa(): Promise<void> {
  try {
    if (!chrome?.storage?.local) return;
    const res = await chrome.storage.local.get(CUSTOM_QA_KEY);
    const stored = res[CUSTOM_QA_KEY];
    if (stored && typeof stored === "object") {
      customQa = stored as Record<string, string>;
      console.log(
        "[Oracle Academy] Custom QA loaded. Count:",
        Object.keys(customQa).length
      );
    }
  } catch (err) {
    console.debug("[Oracle Academy] Failed to load custom QA:", err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function saveCustomQaPair(
  question: string,
  answer: string
): Promise<void> {
  const qNorm = normalizeText(question);
  if (!qNorm || !answer.trim()) {
    showToast("Question/answer cannot be empty.", "error");
    return;
  }
  customQa[qNorm] = answer.trim();
  try {
    if (chrome?.storage?.local) {
      await chrome.storage.local.set({ [CUSTOM_QA_KEY]: customQa });
    }
    showToast("Saved to custom QA.", "success");
  } catch (err) {
    console.debug("[Oracle Academy] Failed to save custom QA:", err);
    showToast("Failed to save custom QA.", "error");
  }
}

/**
 * Split a QA answer string into multiple normalized answers (for multi-select questions).
 * - Splits on commas.
 * - Strips leading "and"/"or".
 */
function parseExpectedAnswers(answerRaw: string): string[] {
  const normalized = normalizeText(answerRaw);
  if (!normalized) return [];

  if (normalized.includes("|")) {
    return normalized
      .split("|")
      .map((part) => part.trim().replace(/^(and|or)\s+/, ""))
      .filter(Boolean);
  }

  // Default: treat the whole normalized string as a single expected answer.
  return [normalized];
}

function clickNextButtonOnce(): boolean {
  const btn =
    document.querySelector<HTMLButtonElement>("#nextModButton") ||
    document.querySelector<HTMLButtonElement>('button[data-otel-label="NEXT"]');
  if (!btn) {
    return false;
  }
  btn.click();
  autoNextMissCount = 0;
  console.log("[Oracle Academy] Next button clicked.");
  return true;
}

function startAutoNextLoop(intervalMs = 1500) {
  stopAutoNextLoop();
  autoNextMissCount = 0;
  autoNextTimer = window.setInterval(() => {
    const clicked = clickNextButtonOnce();
    if (clicked) return;

    autoNextMissCount += 1;
    if (autoNextMissCount >= 5) {
      stopAutoNextLoop();
      void setStoredBoolean(AUTO_NEXT_KEY, false);
      showToast("Auto Next stopped. Next button not found.", "info");
    }
  }, intervalMs);
  console.log("[Oracle Academy] Auto-next loop started.");
}

function stopAutoNextLoop() {
  if (autoNextTimer !== null) {
    clearInterval(autoNextTimer);
    autoNextTimer = null;
    autoNextMissCount = 0;
    console.log("[Oracle Academy] Auto-next loop stopped.");
  }
}

function copyQuestionText(): boolean {
  const questionEl = getQuestionElement();
  if (!questionEl) {
    showToast("Question element not found.", "error");
    return false;
  }

  const text = questionEl.innerText.trim();
  if (!text) {
    showToast("Question text is empty.", "error");
    return false;
  }

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(
      () => showToast("Question copied.", "success"),
      () => {
        showToast("Failed to copy question.", "error");
      }
    );
  } else {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Question copied.", "success");
    } catch (err) {
      console.debug("[Oracle Academy] Clipboard fallback failed:", err);
      showToast("Failed to copy question.", "error");
      return false;
    }
  }
  return true;
}

function getSelectedAnswers(): string[] {
  const choiceButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".choice-SelectArea")
  );
  const selected: string[] = [];

  for (const btn of choiceButtons) {
    const ariaChecked = btn.getAttribute("aria-checked") === "true";
    const flagInput = btn.querySelector<HTMLInputElement>('input[name="f01"]');
    const isChecked =
      ariaChecked ||
      btn.classList.contains("is-active") ||
      (flagInput && flagInput.value?.toUpperCase() === "Y");

    if (!isChecked) continue;

    const label =
      btn.querySelector(".choice-Text")?.textContent ||
      btn.getAttribute("aria-label") ||
      "";
    const cleaned = label.replace(/\s+/g, " ").trim();
    if (cleaned) selected.push(cleaned);
  }

  return selected;
}

function copyQaJson(): boolean {
  const question = getQuestionText();
  if (!question) {
    showToast("Question element not found.", "error");
    return false;
  }

  const answers = getSelectedAnswers();
  if (!answers.length) {
    showToast("No selected answers to copy.", "error");
    return false;
  }

  const value = answers.length > 1 ? answers.join(" | ") : answers[0];
  const payload = { [question]: value };
  const json = JSON.stringify(payload, null, 2);

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(json).then(
      () => showToast("Q&A JSON copied.", "success"),
      () => showToast("Failed to copy Q&A JSON.", "error")
    );
  } else {
    try {
      const ta = document.createElement("textarea");
      ta.value = json;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Q&A JSON copied.", "success");
    } catch (err) {
      console.debug("[Oracle Academy] Clipboard fallback failed:", err);
      showToast("Failed to copy Q&A JSON.", "error");
      return false;
    }
  }

  return true;
}

/**
 * Answer the current quiz question and click "Submit Answer".
 */
function answerCurrentQuestion(): boolean {
  const questionRaw = getQuestionText();

  if (!questionRaw) {
    showToast("Question element not found.", "error");
    return false;
  }
  console.log("[Oracle Academy] Detected question:", questionRaw.trim());

  const answerText = findAnswerForQuestion(questionRaw);
  if (!answerText) {
    const preview = normalizeText(questionRaw).slice(0, 160);
    console.debug(
      "[Oracle Academy] No matching answer in QA bank. Question:",
      preview
    );
    showToast("No matching answer in QA bank.", "error");
    return false;
  }
  const answerTextNorm = normalizeText(answerText);
  const expectedAnswers = parseExpectedAnswers(answerText);

  const choiceButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".choice-SelectArea")
  );

  if (!choiceButtons.length) {
    showToast("Choices not found.", "error");
    return false;
  }

  const choiceNorms = choiceButtons.map((btn) =>
    normalizeText(
      (
        btn.querySelector(".choice-Text")?.textContent ||
        btn.getAttribute("aria-label") ||
        ""
      ).trim()
    )
  );

  // Filter expected answers to ones that appear in available choices (helps avoid over-counting).
  const effectiveExpected =
    expectedAnswers.length > 0
      ? expectedAnswers.filter((ans) =>
          choiceNorms.some(
            (c) => c === ans || c.includes(ans) || ans.includes(c)
          )
        )
      : [];

  let clicked = false;
  let matchedCount = 0;
  for (const btn of choiceButtons) {
    const ariaLabel = (btn.getAttribute("aria-label") || "").trim();
    const textSpan = btn.querySelector<HTMLSpanElement>(".choice-Text");
    const btnText = (textSpan?.textContent || "").trim();
    const btnNorm = normalizeText(btnText || ariaLabel);

    const multiMatch =
      effectiveExpected.length > 0
        ? effectiveExpected.some(
            (exp) =>
              exp === btnNorm || exp.includes(btnNorm) || btnNorm.includes(exp)
          )
        : false;
    const singleMatch =
      effectiveExpected.length === 0 &&
      (btnNorm === answerTextNorm ||
        btnNorm.includes(answerTextNorm) ||
        answerTextNorm.includes(btnNorm));

    if (multiMatch || singleMatch) {
      console.log("[Oracle Academy] Clicking choice:", btnText || ariaLabel);
      btn.click();
      clicked = true;
      matchedCount += 1;

      const flagInput = btn.querySelector<HTMLInputElement>(
        'input[name="f01"].qzlab-choice'
      );
      if (flagInput) flagInput.value = "Y";

      const idInput = btn.querySelector<HTMLInputElement>('input[name="f02"]');
      if (idInput) {
        console.log("[Oracle Academy] Choice f02 id:", idInput.value);
      }
      // For multi-select, keep looping to click all matches
    }
  }

  if (!clicked) {
    console.debug(
      "[Oracle Academy] Could not match the answer text:",
      answerText
    );
    const available = choiceButtons.map((btn) =>
      normalizeText(
        (
          btn.querySelector(".choice-Text")?.textContent ||
          btn.getAttribute("aria-label") ||
          ""
        ).trim()
      )
    );
    console.debug("[Oracle Academy] Available normalized choices:", available);
    showToast(`Answer "${answerText}" not found in choices.`, "error");
    return false;
  }

  if (effectiveExpected.length > 0 && matchedCount < effectiveExpected.length) {
    showToast(
      `Selected ${matchedCount}/${effectiveExpected.length} expected choices.`,
      "error"
    );
    console.debug(
      "[Oracle Academy] Not all expected answers were selected.",
      matchedCount,
      effectiveExpected.length
    );
    return false;
  }

  const submitBtn = document.querySelector<HTMLButtonElement>("#quiz-submit");
  if (submitBtn) {
    console.log("[Oracle Academy] Clicking 'Submit Answer' button.");
    submitBtn.click();
    showToast("Answer submitted.", "success");
  } else {
    showToast("Submit button not found.", "error");
    return false;
  }

  console.log("[Oracle Academy] Done for this question.");
  return true;
}

function createHelper(): void {
  if (document.getElementById(HELPER_ID)) return;

  const panel = document.createElement("div");
  panel.id = HELPER_ID;
  Object.assign(panel.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    width: "260px",
    padding: "14px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    zIndex: "9999",
    border: "1px solid rgba(0,0,0,0.08)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });

  const heading = document.createElement("div");
  Object.assign(heading.style, {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "700",
    marginBottom: "10px",
    fontSize: "16px",
    cursor: "move",
  });

  const titleText = document.createElement("span");
  titleText.textContent = "Siap DiPS · Oracle Academy";
  Object.assign(titleText.style, {
    lineHeight: "1.2",
  });

  heading.appendChild(createLogoSiapDips());
  heading.appendChild(createLogoMyudak());
  heading.appendChild(titleText);
  panel.appendChild(heading);

  const note = document.createElement("p");
  note.textContent = "Click below to auto-answer the current quiz.";
  Object.assign(note.style, {
    margin: "0 0 12px 0",
    fontSize: "13px",
    color: "#4b5563",
    lineHeight: "1.4",
  });
  panel.appendChild(note);

  const toggleButtonBaseStyle: Partial<CSSStyleDeclaration> = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px",
    transition:
      "transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease",
    marginBottom: "8px",
  };

  const setToggleButtonState = (
    buttonEl: HTMLButtonElement,
    label: string,
    enabled: boolean
  ) => {
    buttonEl.textContent = `${label}: ${enabled ? "ON" : "OFF"}`;
    buttonEl.style.background = enabled ? "#dcfce7" : "#f9fafb";
    buttonEl.style.color = enabled ? "#166534" : "#374151";
    buttonEl.style.borderColor = enabled ? "#86efac" : "#d1d5db";
  };

  let helperEnabledState = true;
  let autoNextEnabledState = false;

  const autoHelperToggle = document.createElement("button");
  Object.assign(autoHelperToggle.style, toggleButtonBaseStyle);
  setToggleButtonState(autoHelperToggle, "Auto helper on page", true);
  autoHelperToggle.addEventListener("mouseenter", () => {
    autoHelperToggle.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
    autoHelperToggle.style.transform = "translateY(-1px)";
  });
  autoHelperToggle.addEventListener("mouseleave", () => {
    autoHelperToggle.style.boxShadow = "none";
    autoHelperToggle.style.transform = "translateY(0)";
  });
  autoHelperToggle.addEventListener("click", async () => {
    helperEnabledState = !helperEnabledState;
    setToggleButtonState(
      autoHelperToggle,
      "Auto helper on page",
      helperEnabledState
    );

    try {
      await setStoredBoolean(AUTO_HELPER_KEY, helperEnabledState);
      showToast(
        helperEnabledState
          ? "Auto helper enabled."
          : "Auto helper disabled for next page load.",
        "success"
      );
    } catch (err) {
      console.debug("[Oracle Academy] Failed to save auto helper state:", err);
      showToast("Failed to save auto helper state.", "error");
    }
  });
  panel.appendChild(autoHelperToggle);

  const autoNextToggle = document.createElement("button");
  Object.assign(autoNextToggle.style, toggleButtonBaseStyle);
  setToggleButtonState(autoNextToggle, "Auto Next", false);
  autoNextToggle.addEventListener("mouseenter", () => {
    autoNextToggle.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
    autoNextToggle.style.transform = "translateY(-1px)";
  });
  autoNextToggle.addEventListener("mouseleave", () => {
    autoNextToggle.style.boxShadow = "none";
    autoNextToggle.style.transform = "translateY(0)";
  });
  autoNextToggle.addEventListener("click", async () => {
    autoNextEnabledState = !autoNextEnabledState;
    setToggleButtonState(autoNextToggle, "Auto Next", autoNextEnabledState);

    if (autoNextEnabledState) {
      startAutoNextLoop();
    } else {
      stopAutoNextLoop();
    }

    try {
      await setStoredBoolean(AUTO_NEXT_KEY, autoNextEnabledState);
      showToast(
        autoNextEnabledState ? "Auto Next enabled." : "Auto Next disabled.",
        "success"
      );
    } catch (err) {
      console.debug("[Oracle Academy] Failed to save auto next state:", err);
      showToast("Failed to save auto next state.", "error");
    }
  });
  panel.appendChild(autoNextToggle);

  const nextOnceBtn = document.createElement("button");
  nextOnceBtn.textContent = "Next once";
  Object.assign(nextOnceBtn.style, {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px",
    transition:
      "transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease",
    marginBottom: "8px",
  });
  nextOnceBtn.addEventListener("mouseenter", () => {
    nextOnceBtn.style.boxShadow = "0 8px 16px rgba(37,99,235,0.12)";
    nextOnceBtn.style.transform = "translateY(-1px)";
    nextOnceBtn.style.background = "#dbeafe";
  });
  nextOnceBtn.addEventListener("mouseleave", () => {
    nextOnceBtn.style.boxShadow = "none";
    nextOnceBtn.style.transform = "translateY(0)";
    nextOnceBtn.style.background = "#eff6ff";
  });
  nextOnceBtn.addEventListener("click", () => {
    const clicked = clickNextButtonOnce();
    showToast(
      clicked ? "Next clicked." : "Next button not found.",
      clicked ? "success" : "error"
    );
  });
  panel.appendChild(nextOnceBtn);

  const copyBtn = document.createElement("button");
  copyBtn.textContent = "Copy Question";
  Object.assign(copyBtn.style, {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    background: "#f9fafb",
    color: "#111827",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
    transition:
      "transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease",
    marginBottom: "8px",
  });
  copyBtn.addEventListener("mouseenter", () => {
    copyBtn.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
    copyBtn.style.transform = "translateY(-1px)";
    copyBtn.style.background = "#f3f4f6";
  });
  copyBtn.addEventListener("mouseleave", () => {
    copyBtn.style.boxShadow = "none";
    copyBtn.style.transform = "translateY(0)";
    copyBtn.style.background = "#f9fafb";
  });
  copyBtn.addEventListener("click", () => {
    copyQuestionText();
  });
  panel.appendChild(copyBtn);

  const copyQaBtn = document.createElement("button");
  copyQaBtn.textContent = "Copy Q&A JSON";
  Object.assign(copyQaBtn.style, {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    background: "#f9fafb",
    color: "#111827",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
    transition:
      "transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease",
  });
  copyQaBtn.addEventListener("mouseenter", () => {
    copyQaBtn.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
    copyQaBtn.style.transform = "translateY(-1px)";
    copyQaBtn.style.background = "#f3f4f6";
  });
  copyQaBtn.addEventListener("mouseleave", () => {
    copyQaBtn.style.boxShadow = "none";
    copyQaBtn.style.transform = "translateY(0)";
    copyQaBtn.style.background = "#f9fafb";
  });
  copyQaBtn.addEventListener("click", () => {
    copyQaJson();
  });
  panel.appendChild(copyQaBtn);

  const button = document.createElement("button");
  button.textContent = "Answer & Submit";
  Object.assign(button.style, {
    width: "100%",
    padding: "10px 12px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "transform 0.15s ease, box-shadow 0.2s ease",
  });

  button.addEventListener("mouseenter", () => {
    button.style.boxShadow = "0 10px 20px rgba(37, 99, 235, 0.25)";
    button.style.transform = "translateY(-1px)";
  });
  button.addEventListener("mouseleave", () => {
    button.style.boxShadow = "none";
    button.style.transform = "translateY(0)";
  });

  button.addEventListener("click", () => {
    const ok = answerCurrentQuestion();
    if (!ok) return;
  });
  panel.appendChild(button);

  const footer = document.createElement("div");
  footer.textContent = "QA bank lives in src/constants/oracleAcademyQA.ts";
  Object.assign(footer.style, {
    marginTop: "10px",
    fontSize: "11px",
    color: "#6b7280",
  });
  panel.appendChild(footer);

  const close = document.createElement("button");
  close.textContent = "×";
  Object.assign(close.style, {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "transparent",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#6b7280",
  });
  const handleStorageChange = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string
  ) => {
    if (areaName !== "local") return;

    if (AUTO_HELPER_KEY in changes) {
      helperEnabledState = Boolean(changes[AUTO_HELPER_KEY].newValue);
      setToggleButtonState(
        autoHelperToggle,
        "Auto helper on page",
        helperEnabledState
      );
    }

    if (AUTO_NEXT_KEY in changes) {
      autoNextEnabledState = Boolean(changes[AUTO_NEXT_KEY].newValue);
      setToggleButtonState(autoNextToggle, "Auto Next", autoNextEnabledState);
    }
  };

  close.addEventListener("click", () => {
    if (chrome?.storage?.onChanged) {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    }
    panel.remove();
  });
  panel.appendChild(close);

  document.body.appendChild(panel);

  Promise.all([getAutoHelperEnabled(), getAutoNextEnabled()])
    .then(([helperEnabled, nextEnabled]) => {
      helperEnabledState = helperEnabled;
      autoNextEnabledState = nextEnabled;
      setToggleButtonState(
        autoHelperToggle,
        "Auto helper on page",
        helperEnabledState
      );
      setToggleButtonState(autoNextToggle, "Auto Next", autoNextEnabledState);
    })
    .catch((err) => {
      console.debug("[Oracle Academy] Failed to hydrate helper controls:", err);
    });

  if (chrome?.storage?.onChanged) {
    chrome.storage.onChanged.addListener(handleStorageChange);
  }

  // Simple drag handling using the heading as the handle.
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const onMouseMove = (event: MouseEvent) => {
    if (!dragging) return;
    const nextLeft = event.clientX - offsetX;
    const nextTop = event.clientY - offsetY;
    panel.style.left = `${nextLeft}px`;
    panel.style.top = `${nextTop}px`;
    panel.style.right = "auto"; // disable right positioning once moved
  };

  const onMouseUp = () => {
    dragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    panel.classList.remove("dragging");
  };

  heading.addEventListener("mousedown", (event: MouseEvent) => {
    dragging = true;
    const rect = panel.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    panel.classList.add("dragging");
  });
}

function createLogoSiapDips(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 283.46 283.46");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("class", "stroke-black dark:stroke-white");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "m94.86,34.25l1.76,30.39c-8.19-.18-14.5-.15-18.92.09-14.12.82-21.15,6.09-21.11,15.79.05,9.27,7.4,13.87,22.06,13.8,7.22-.04,14.6-1.8,22.13-5.28,4.84-2.29,11.88-6.91,21.12-13.85l22.56-15.31c12.25-8.25,22.41-14.18,30.48-17.78,11.08-4.9,21.96-7.38,32.63-7.43,14.01-.07,25.24,3.65,33.69,11.16,9.42,8.25,14.16,19.55,14.23,33.89.07,14.66-5.16,25.68-15.69,33.06-8.17,5.86-19.04,8.93-32.62,9.21-1.08,0-4.8.02-11.16.05l-3.22-30.22c9.59-.05,16.33-.35,20.21-.91,9.26-1.34,13.88-5.62,13.84-12.84-.04-8.63-6.96-12.9-20.76-12.83-7.76.04-14.92,1.85-21.48,5.44-3.98,2.18-12.52,7.66-25.63,16.46l-22.73,15.63c-21.49,14.87-42.21,22.36-62.15,22.46-11.86.06-21.57-2.43-29.14-7.46-11.25-7.38-16.91-19.75-17-37.11-.08-16.39,5.47-28.7,16.64-36.95,5.91-4.45,12.2-7.28,18.88-8.5,5.38-.89,11.96-1.35,19.72-1.39,3.56-.02,7.44.13,11.65.43Z"
  );
  path1.setAttribute("class", "stroke-black dark:stroke-white top-path");
  path1.setAttribute("style", "stroke-miterlimit: 10; stroke-width: 14px;");

  const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute(
    "d",
    "m252.41,161.34l.16,32.99c1.47,35.68-15.37,53.92-50.51,54.74l-119.17.58c-35.15-.48-52.16-18.56-51.04-54.25l-.16-32.99,220.72-1.07Zm-191.95,31.82l.02,3.88c.04,9.06,2.07,15.14,6.07,18.24,3.03,2.25,8.42,3.41,16.19,3.48l119.17-.58c8.84-.15,14.81-2.01,17.92-5.58,2.68-3.25,4.05-8.7,4.13-16.35l-.02-3.88-163.48.79Z"
  );
  path2.setAttribute("class", "stroke-black dark:stroke-white bottom-path");
  path2.setAttribute("style", "stroke-miterlimit: 10; stroke-width: 14px;");

  svg.appendChild(path1);
  svg.appendChild(path2);

  return svg;
}

function createLogoMyudak(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 595.28 595.28");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  Object.assign(svg.style, { cursor: "pointer" });

  const polygons = [
    "206.43 406.96 297.66 564.99 297.65 565.01 115 565.01 206.32 406.83 206.34 406.8 206.43 406.96",
    "571.62 90.47 480.3 248.65 388.99 406.8 297.75 248.78 297.66 248.63 388.97 90.47 571.62 90.47",
    "297.65 248.65 115 248.65 23.67 90.47 206.32 90.47 297.65 248.65",
  ];

  polygons.forEach((points) => {
    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    polygon.setAttribute("points", points);
    polygon.setAttribute("fill", "currentColor");
    svg.appendChild(polygon);
  });

  return svg;
}

async function initOracleAcademyHelper() {
  console.log("[Oracle Academy] Helper initializing...");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Toastify({
    text: "Siap DiPS ~> Oracle Academy helper loaded",
    duration: 3000,
    close: true,
    position: "left",
  }).showToast();

  await loadCustomQa();

  const autoHelper = await getAutoHelperEnabled();
  if (autoHelper) {
    createHelper();
  } else {
    console.log("[Oracle Academy] Auto helper disabled via settings.");
  }

  const autoNext = await getAutoNextEnabled();
  if (autoNext) {
    startAutoNextLoop();
  }

  // Expose for manual triggers if needed.
  (window as unknown as Record<string, unknown>).answerOracleAcademyQuiz =
    answerCurrentQuestion;
  (window as unknown as Record<string, unknown>).showOracleAcademyHelper =
    createHelper;
  (window as unknown as Record<string, unknown>).clickOracleNext =
    clickNextButtonOnce;
  (window as unknown as Record<string, unknown>).startOracleAutoNext =
    startAutoNextLoop;
  (window as unknown as Record<string, unknown>).stopOracleAutoNext =
    stopAutoNextLoop;
  (window as unknown as Record<string, unknown>).copyOracleQuestion =
    copyQuestionText;
  (window as unknown as Record<string, unknown>).copyOracleQaJson = copyQaJson;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOracleAcademyHelper, {
    once: true,
  });
} else {
  initOracleAcademyHelper();
}
