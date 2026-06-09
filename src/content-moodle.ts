console.log("myudak -- content-moodle.ts loaded");

import { createHelperDefault } from "./lib/content_moodle";
import {
  MOODLE_CHATGPT_HOME_URL,
  buildMoodleChatGptPrompt,
  buildMoodleChatGptSearchUrl,
  normalizeMoodlePromptText,
  shouldUseMoodleChatGptClipboardFallback,
  type MoodleChatGptChoiceMode,
} from "./lib/content_moodle/chatgpt";

interface MoodleQuestionOption {
  key: string;
  text: string;
  index: number;
}

interface MoodleQuestionPayload {
  questionLabel: string;
  questionText: string;
  options: MoodleQuestionOption[];
  questionType: "multiple_choice_single" | "unknown";
}

interface MoodleStructuredAnswer {
  answerLetter: string;
  answerText?: string;
}

const ASK_AI_SHORTCUT_KEY = "a";
const ASK_AI_SHORTCUT_LABEL = "Alt+A";
const ASK_AI_SHORTCUT_BOUND_KEY = "__siapDipsMoodleAskAiShortcutBound";
const ASK_AI_BUTTON_SELECTOR = 'button[data-myudak-action="ask-ai"]';
const CHATGPT_BUTTON_ACTION = "answer-chatgpt";

chrome.storage.local.get(["moodleHelper"], (result) => {
  if (result.moodleHelper === undefined) {
    // If setting is not found, set default value
    chrome.storage.local.set({ moodleHelper: false });
  }
  if (result.moodleHelper) {
    createHelperDefault();
  }
});

document
  .querySelectorAll<HTMLElement>('[id^="question-"]')
  .forEach((question) => {
    const formulation = question.querySelector<HTMLElement>(
      ".content .formulation"
    );
    const nomorSoal = question.querySelector<HTMLElement>("div.info > h3");

    if (!formulation || !nomorSoal) return;

    const questionPayload = extractQuestionPayload(question);
    if (!questionPayload) return;

    const buttonCopySoal = createCopyButton(
      questionPayload.questionLabel,
      questionPayload.questionText
    );
    const buttonGoogleSoal = createGoogleButton(questionPayload.questionText);
    const buttonChatGpt = createChatGptButton(question);
    const buttonAskAi = createAiButton(questionPayload, question);

    chrome.storage.local.get(["copySoal", "googleSoal", "askAi"], (result) => {
      if (result.copySoal) {
        buttonCopySoal.style.display = "inline-block";
      } else {
        buttonCopySoal.style.display = "none";
      }

      if (result.googleSoal) {
        buttonGoogleSoal.style.display = "inline-block";
      } else {
        buttonGoogleSoal.style.display = "none";
      }

      if (result.askAi) {
        buttonAskAi.style.display = "inline-block";
      } else {
        buttonAskAi.style.display = "none";
      }
    });
    // Append buttons to the formulation element

    formulation.appendChild(buttonCopySoal);
    formulation.appendChild(buttonGoogleSoal);
    formulation.appendChild(buttonChatGpt);
    formulation.appendChild(buttonAskAi);
  });

bindAskAiShortcut();

function createBaseButton(text: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = text;
  button.type = "button";
  button.style.marginTop = "10px";
  button.classList.add("btn", "btn-secondary", "btn-myudak");
  return button;
}

function getMoodleChatGptChoiceMode(
  question: HTMLElement
): MoodleChatGptChoiceMode {
  if (question.querySelector('.answer input[type="checkbox"]')) {
    return "multiple";
  }
  if (question.querySelector('.answer input[type="radio"]')) {
    return "single";
  }
  return "unknown";
}

function getMoodleChatGptPayload(question: HTMLElement) {
  const questionTextElement = question.querySelector<HTMLElement>(".qtext");
  const questionLabel =
    question.querySelector<HTMLElement>("div.info > h3")?.textContent?.trim() ||
    "Moodle Question";
  const questionText = normalizeMoodlePromptText(
    questionTextElement?.innerText ||
      questionTextElement?.textContent ||
      ""
  );

  const optionInputs = Array.from(
    question.querySelectorAll<HTMLInputElement>(
      '.answer input[type="radio"], .answer input[type="checkbox"]'
    )
  ).filter(
    (input) =>
      input.value !== "-1" &&
      !input.classList.contains("visually-hidden") &&
      input.getAttribute("aria-hidden") !== "true"
  );

  const options = optionInputs
    .map((input, index) => {
      const labelId = input.getAttribute("aria-labelledby");
      const labelElement = labelId
        ? question.querySelector<HTMLElement>(`#${CSS.escape(labelId)}`)
        : input.closest<HTMLElement>(".r0, .r1")?.querySelector<HTMLElement>(
            '[data-region="answer-label"]'
          );
      if (!labelElement) return null;

      const labelClone = labelElement.cloneNode(true) as HTMLElement;
      const answerNumber = labelClone.querySelector<HTMLElement>(".answernumber");
      const key =
        answerNumber?.textContent?.replace(/[^a-z0-9]/gi, "").toLowerCase() ||
        String.fromCharCode(97 + index);
      answerNumber?.remove();

      const text = normalizeMoodlePromptText(
        labelClone.innerText || labelClone.textContent || ""
      ).replace(/\s*\n\s*/g, " ");

      return text ? { key, text } : null;
    })
    .filter((option): option is { key: string; text: string } => Boolean(option));

  if (!questionText || !options.length) return null;

  return {
    questionLabel,
    questionText,
    options,
    mode: getMoodleChatGptChoiceMode(question),
  };
}

function copyMoodleTextWithLegacyFallback(text: string): boolean {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch (error) {
    console.debug("[Moodle ChatGPT] Clipboard fallback failed:", error);
    return false;
  }
}

function copyMoodleText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => copyMoodleTextWithLegacyFallback(text)
    );
  }
  return Promise.resolve(copyMoodleTextWithLegacyFallback(text));
}

function openMoodleExternalTab(url: string): boolean {
  const opened = window.open("about:blank", "_blank");
  if (!opened) return false;

  try {
    opened.opener = null;
    const referrerPolicy = opened.document.createElement("meta");
    referrerPolicy.name = "referrer";
    referrerPolicy.content = "no-referrer";
    opened.document.head.appendChild(referrerPolicy);
    opened.location.replace(url);
    return true;
  } catch (error) {
    console.debug("[Moodle ChatGPT] Failed to open tab:", error);
    opened.close();
    return false;
  }
}

function openMoodleQuestionInChatGpt(question: HTMLElement): boolean {
  const payload = getMoodleChatGptPayload(question);
  if (!payload) {
    showToast("Soal atau pilihan jawaban tidak ditemukan", "error");
    return false;
  }

  const prompt = buildMoodleChatGptPrompt(payload);
  const searchUrl = buildMoodleChatGptSearchUrl(prompt);

  if (!shouldUseMoodleChatGptClipboardFallback(searchUrl)) {
    if (!openMoodleExternalTab(searchUrl)) {
      showToast("Tab ChatGPT diblokir browser", "error");
      return false;
    }
    showToast("Membuka soal di ChatGPT Search", "success");
    return true;
  }

  const opened = openMoodleExternalTab(MOODLE_CHATGPT_HOME_URL);
  void copyMoodleText(prompt).then((copied) => {
    if (opened && copied) {
      showToast("Prompt panjang disalin. Paste di ChatGPT.", "success");
    } else if (copied) {
      showToast("Tab diblokir. Prompt sudah disalin.", "error");
    } else {
      showToast("Gagal membuka ChatGPT dan menyalin prompt", "error");
    }
  });

  return opened;
}

function createChatGptButton(question: HTMLElement): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.myudakAction = CHATGPT_BUTTON_ACTION;
  button.title = "Buka soal dan pilihan jawaban di ChatGPT Search";
  button.setAttribute("aria-label", "Answer ChatGPT");
  button.innerHTML = `
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/1/13/ChatGPT-Logo.png"
      alt=""
      referrerpolicy="no-referrer"
      style="width:18px;height:18px;object-fit:contain;flex-shrink:0"
    />
    <span>Answer ChatGPT</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.4"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      style="margin-left:2px;flex-shrink:0"
    >
      <path d="M7 17L17 7"></path>
      <path d="M7 7h10v10"></path>
    </svg>
  `;

  Object.assign(button.style, {
    padding: "9px 10px",
    border: "1px solid #86efac",
    borderRadius: "9px",
    background:
      "linear-gradient(135deg, rgba(236,253,245,1) 0%, rgba(220,252,231,1) 100%)",
    color: "#166534",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px",
    transition:
      "transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease",
    marginTop: "10px",
    marginRight: "0.5rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    verticalAlign: "middle",
  });

  button.addEventListener("mouseenter", () => {
    button.style.boxShadow = "0 9px 18px rgba(22,101,52,0.15)";
    button.style.transform = "translateY(-1px)";
    button.style.background =
      "linear-gradient(135deg, rgba(220,252,231,1) 0%, rgba(187,247,208,1) 100%)";
  });
  button.addEventListener("mouseleave", () => {
    button.style.boxShadow = "none";
    button.style.transform = "translateY(0)";
    button.style.background =
      "linear-gradient(135deg, rgba(236,253,245,1) 0%, rgba(220,252,231,1) 100%)";
  });
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openMoodleQuestionInChatGpt(question);
  });

  return button;
}

function createAiButton(
  questionPayload: MoodleQuestionPayload,
  question: HTMLElement
): HTMLButtonElement {
  const button = createBaseButton("Tany AI");
  button.dataset.myudakAction = "ask-ai";
  button.title = `Tany AI (${ASK_AI_SHORTCUT_LABEL})`;
  button.setAttribute("aria-label", `Tany AI (${ASK_AI_SHORTCUT_LABEL})`);
  addAiLogo(button);

  button.addEventListener("click", async (e: MouseEvent) => {
    e.preventDefault();
    await handleAiButtonClick(button, questionPayload, question);
  });

  return button;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    target.isContentEditable
  );
}

function isButtonVisibleAndEnabled(button: HTMLButtonElement): boolean {
  if (button.disabled) return false;
  if (button.style.display === "none") return false;
  return button.offsetParent !== null;
}

function resolveAskAiButtonForShortcut(): HTMLButtonElement | null {
  const activeElement = document.activeElement as HTMLElement | null;
  const focusedQuestion = activeElement?.closest<HTMLElement>('[id^="question-"]');
  if (focusedQuestion) {
    const focusedButton = focusedQuestion.querySelector<HTMLButtonElement>(
      ASK_AI_BUTTON_SELECTOR
    );
    if (focusedButton && isButtonVisibleAndEnabled(focusedButton)) {
      return focusedButton;
    }
  }

  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>(ASK_AI_BUTTON_SELECTOR)
  ).filter(isButtonVisibleAndEnabled);

  if (buttons.length === 0) return null;
  if (buttons.length === 1) return buttons[0];

  const viewportCenter = window.innerHeight / 2;
  buttons.sort((a, b) => {
    const distanceA = Math.abs(a.getBoundingClientRect().top - viewportCenter);
    const distanceB = Math.abs(b.getBoundingClientRect().top - viewportCenter);
    return distanceA - distanceB;
  });

  return buttons[0];
}

function bindAskAiShortcut(): void {
  type WindowWithAskAiShortcut = Window & {
    [ASK_AI_SHORTCUT_BOUND_KEY]?: boolean;
  };

  const shortcutWindow = window as WindowWithAskAiShortcut;
  if (shortcutWindow[ASK_AI_SHORTCUT_BOUND_KEY]) return;

  shortcutWindow[ASK_AI_SHORTCUT_BOUND_KEY] = true;

  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.defaultPrevented) return;
    if (isTypingTarget(event.target)) return;

    const key = event.key.toLowerCase();
    const isShortcut =
      event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      key === ASK_AI_SHORTCUT_KEY;

    if (!isShortcut) return;

    const targetButton = resolveAskAiButtonForShortcut();
    if (!targetButton) return;

    event.preventDefault();
    targetButton.click();
  });
}

// Helper function to create and add AI logo to button
function addAiLogo(button: HTMLButtonElement): void {
  const aiLogo = createAiLogoElement();
  button.prepend(aiLogo);
}

// Helper function to create AI logo element
function createAiLogoElement(): HTMLImageElement {
  const aiLogo = document.createElement("img");
  aiLogo.src =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s";
  aiLogo.alt = "AI Logo";
  aiLogo.style.width = "16px";
  aiLogo.style.marginRight = "5px";
  aiLogo.style.verticalAlign = "middle";
  return aiLogo;
}

// Helper function to handle the main AI button click logic
async function handleAiButtonClick(
  button: HTMLButtonElement,
  questionPayload: MoodleQuestionPayload,
  question: HTMLElement
): Promise<void> {
  try {
    // Prevent double clicking while request is in progress

    if (button.disabled) {
      return;
    }

    setButtonLoadingState(button, true);

    // Generate unique question ID with question element identifier
    const questionElementId = question.id || `question-${Date.now()}`;
    const questionId = `${questionElementId}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create unique event name for this specific question
    const responseEventName = `myudak-ai-response-${questionId}`;

    // Set up response listener for this specific question only
    const responseListener = (event: Event) => {
      const customEvent = event as CustomEvent;
      const {
        questionId: responseQuestionId,
        success,
        response,
        error,
      } = customEvent.detail;

      // Double-check this is our response (extra safety)
      if (responseQuestionId !== questionId) {
        console.warn(
          "Response ID mismatch, ignoring:",
          responseQuestionId,
          "expected:",
          questionId
        );
        return;
      }

      // Remove this specific listener
      document.removeEventListener(responseEventName, responseListener);

      const timeoutId = Number(button.dataset.timeoutId);
      if (!Number.isNaN(timeoutId)) {
        window.clearTimeout(timeoutId);
        delete button.dataset.timeoutId;
      }

      if (success && response) {
        console.log("AI Response for question:", questionId, response);

        const structuredAnswer =
          extractStructuredAnswer(response) ??
          (extractAnswerFromResponse(response)
            ? { answerLetter: extractAnswerFromResponse(response) as string }
            : null);

        if (!structuredAnswer) {
          showToast("AI tidak memberikan jawaban yang valid", "error");
          setButtonLoadingState(button, false);
          return;
        }

        const isValidLetter = questionPayload.options.some(
          (option) => option.key === structuredAnswer.answerLetter
        );

        if (!isValidLetter) {
          showToast("AI kasih pilihan yang ga ada di opsi", "error");
          setButtonLoadingState(button, false);
          return;
        }

        const selectSuccess = selectAnswerOption(
          question,
          structuredAnswer.answerLetter
        );
        if (selectSuccess) {
          const selectedOption = questionPayload.options.find(
            (option) => option.key === structuredAnswer.answerLetter
          );

          if (
            selectedOption &&
            structuredAnswer.answerText &&
            !normalizeForCompare(selectedOption.text).includes(
              normalizeForCompare(structuredAnswer.answerText)
            ) &&
            !normalizeForCompare(structuredAnswer.answerText).includes(
              normalizeForCompare(selectedOption.text)
            )
          ) {
            console.warn(
              "AI answer text mismatch:",
              structuredAnswer.answerText,
              selectedOption.text
            );
          }

          showToast(
            `Done jawaban: ${structuredAnswer.answerLetter.toUpperCase()}`,
            "success"
          );
        } else {
          showToast("Gagal memilih jawaban", "error");
        }
      } else {
        console.error("AI Error for question:", questionId, error);
        showToast("Failed to get AI response", "error");
      }

      setButtonLoadingState(button, false);
    };

    // Add response listener with unique event name
    document.addEventListener(responseEventName, responseListener);

    // Dispatch question event to helper with the unique response event name
    document.dispatchEvent(
      new CustomEvent("myudak-ai-question", {
        detail: {
          question: questionPayload,
          questionId: questionId,
          responseEventName: responseEventName, // Tell helper which event to dispatch
        },
      })
    );

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      document.removeEventListener(responseEventName, responseListener);
      if (button.disabled) {
        setButtonLoadingState(button, false);
        showToast("Request timeout - please try again", "error");
      }
      delete button.dataset.timeoutId;
    }, 30000); // 30 seconds timeout

    // Store timeout ID in case we need to clear it early
    button.dataset.timeoutId = timeoutId.toString();
  } catch (error) {
    console.error("Error communicating with AI:", error);
    showToast("Failed to get AI response", "error");
    setButtonLoadingState(button, false);
  }
}

// Helper function to set button loading state
function setButtonLoadingState(
  button: HTMLButtonElement,
  isLoading: boolean
): void {
  if (isLoading) {
    button.textContent = "Loading...";
    button.disabled = true;
  } else {
    button.textContent = "Tany AI";
    button.disabled = false;
    addAiLogo(button);
  }
}

// Helper function to extract answer letter from AI response
function extractAnswerFromResponse(response: string): string | null {
  const match = response.match(/XX_CODE_FINAL_ANSWER_XX:\s*([a-zA-Z])\./);
  return match?.[1]?.toLowerCase() || null;
}

function extractStructuredAnswer(
  response: string
): MoodleStructuredAnswer | null {
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[0]) as {
      answer_letter?: string;
      answer_text?: string;
    };

    if (!parsed.answer_letter) return null;

    return {
      answerLetter: parsed.answer_letter.toLowerCase(),
      answerText: parsed.answer_text,
    };
  } catch (error) {
    console.warn("Failed to parse structured Moodle answer:", error);
    return null;
  }
}

// Helper function to select answer option based on letter
function selectAnswerOption(
  question: HTMLElement,
  answerLetter: string
): boolean {
  const answerContainer = question.querySelector<HTMLElement>(".answer");
  if (!answerContainer) {
    console.warn("Answer container not found");
    return false;
  }

  const answerIndex = getAnswerIndex(answerLetter);
  if (answerIndex === -1) {
    console.warn(`Invalid answer letter: ${answerLetter}`);
    return false;
  }

  const answerOption = answerContainer.children[answerIndex] as HTMLElement;
  if (!answerOption) {
    console.warn(`Answer option ${answerLetter} not found`);
    return false;
  }

  // Highlight the selected answer
  highlightAnswerOption(answerOption);

  // Click the input to select it
  const input = answerOption.querySelector<HTMLInputElement>("input");
  if (input) {
    input.click();
    return true;
  }

  console.warn(`Input element not found for answer ${answerLetter}`);
  return false;
}

// Helper function to convert answer letter to index
function getAnswerIndex(answerLetter: string): number {
  const letterToIndex: Record<string, number> = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
  };

  return letterToIndex[answerLetter.toLowerCase()] ?? -1;
}

// Helper function to highlight selected answer option
function highlightAnswerOption(answerOption: HTMLElement): void {
  // Remove previous highlights
  const allOptions = answerOption.parentElement?.children;
  if (allOptions) {
    Array.from(allOptions).forEach((option) => {
      (option as HTMLElement).style.border = "";
    });
  }

  // Add highlight to selected option
  answerOption.style.border = "2px solid #4CAF50";
  answerOption.style.borderRadius = "4px";
}

// Helper function to show toast notifications
function showToast(
  message: string,
  type: "success" | "error" = "success"
): void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    position: "left",
    style: {
      background: type === "success" ? "#4CAF50" : "#f44336",
    },
  }).showToast();
}

function createCopyButton(
  nomorSoalText: string,
  soalText: string
): HTMLButtonElement {
  const button = createBaseButton("Copy Soal");
  button.style.marginRight = "0.5rem";

  const logo = createLogoSiapDips();
  logo.style.marginRight = "5px";
  logo.style.verticalAlign = "middle";
  button.prepend(logo);

  button.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(`${nomorSoalText}\n\n${soalText}`)
      .then(() => {
        // alert(`Soal ${nomorSoalText} copied!`);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Toastify({
          text: `Soal ${nomorSoalText} copied!`,
          duration: 3000,
          close: true,
          position: "left",
        }).showToast();
      })
      .catch((err) => {
        console.error("Failed to copy soal:", err);
      });
  });

  return button;
}

function extractQuestionPayload(
  question: HTMLElement
): MoodleQuestionPayload | null {
  const formulation = question.querySelector<HTMLElement>(".content .formulation");
  const nomorSoal = question.querySelector<HTMLElement>("div.info > h3");
  const answerContainer = question.querySelector<HTMLElement>(".answer");

  if (!formulation || !nomorSoal || !answerContainer) return null;

  const questionLabel = nomorSoal.textContent?.trim() || "[No Nomor Soal]";
  const questionText = getVisibleTextContent(formulation);
  const optionElements = Array.from(
    answerContainer.children
  ) as HTMLElement[];

  const options = optionElements
    .map((optionElement, index) => {
      const key = String.fromCharCode("a".charCodeAt(0) + index);
      const text = normalizeQuestionText(getVisibleTextContent(optionElement));
      return {
        key,
        text,
        index,
      };
    })
    .filter((option) => option.text.length > 0);

  if (!questionText || options.length === 0) return null;

  return {
    questionLabel,
    questionText,
    options,
    questionType: "multiple_choice_single",
  };
}

function normalizeQuestionText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function normalizeForCompare(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function createGoogleButton(soalText: string): HTMLButtonElement {
  const button = createBaseButton("Google Soal");
  button.style.marginRight = "0.5rem";

  const googleLogo = document.createElement("img");
  googleLogo.src = "https://www.google.com/favicon.ico";
  googleLogo.alt = "Google Logo";
  googleLogo.style.width = "16px";
  googleLogo.style.marginRight = "5px";
  googleLogo.style.verticalAlign = "middle";
  button.prepend(googleLogo);

  button.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    const query = encodeURIComponent(`${soalText}`);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  });

  return button;
}

/*
   HELPER ======?
  >>
    // In programming, a helper (or helper function, helper method, or utility function) is a small function 
    // designed to perform a specific, often repetitive task that supports a larger function or system. 
    // It’s not the main logic itself but is used to simplify, organize, or reuse parts of your code.
*/
function getVisibleTextContent(el: Element): string {
  const HIDDEN_CLASSES = new Set([
    "visually-hidden",
    "accesshide",
    "sr-only",
    "hidden",
  ]);

  function isHidden(node: Element): boolean {
    return [...HIDDEN_CLASSES].some((cls) => node.classList.contains(cls));
  }

  function extractTextRecursively(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      if (isHidden(element)) {
        return "";
      } // ⛔ Skip this entire branch

      // Recurse into all child nodes
      return Array.from(element.childNodes)
        .map(extractTextRecursively)
        .join("");
    }

    return "";
  }

  return extractTextRecursively(el).trim();
}

function createLogoSiapDips(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 283.46 283.46");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("class", "stroke-black dark:stroke-white");

  // First path
  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "m94.86,34.25l1.76,30.39c-8.19-.18-14.5-.15-18.92.09-14.12.82-21.15,6.09-21.11,15.79.05,9.27,7.4,13.87,22.06,13.8,7.22-.04,14.6-1.8,22.13-5.28,4.84-2.29,11.88-6.91,21.12-13.85l22.56-15.31c12.25-8.25,22.41-14.18,30.48-17.78,11.08-4.9,21.96-7.38,32.63-7.43,14.01-.07,25.24,3.65,33.69,11.16,9.42,8.25,14.16,19.55,14.23,33.89.07,14.66-5.16,25.68-15.69,33.06-8.17,5.86-19.04,8.93-32.62,9.21-1.08,0-4.8.02-11.16.05l-3.22-30.22c9.59-.05,16.33-.35,20.21-.91,9.26-1.34,13.88-5.62,13.84-12.84-.04-8.63-6.96-12.9-20.76-12.83-7.76.04-14.92,1.85-21.48,5.44-3.98,2.18-12.52,7.66-25.63,16.46l-22.73,15.63c-21.49,14.87-42.21,22.36-62.15,22.46-11.86.06-21.57-2.43-29.14-7.46-11.25-7.38-16.91-19.75-17-37.11-.08-16.39,5.47-28.7,16.64-36.95,5.91-4.45,12.2-7.28,18.88-8.5,5.38-.89,11.96-1.35,19.72-1.39,3.56-.02,7.44.13,11.65.43Z"
  );
  path1.setAttribute("class", "stroke-black dark:stroke-white top-path");
  path1.setAttribute("style", "stroke-miterlimit: 10; stroke-width: 14px;");

  // Second path
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
