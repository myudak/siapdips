// src/helper.ts
// import { BUTTONS } from "./config";
import { Draggable } from "./draggable";

interface ChatMessage {
  role: "user" | "model";
  parts: [{ text: string }];
}

interface CliProxyMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

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

interface ToolAnswerResult {
  answer_letter: string;
  answer_text?: string;
  confidence?: number;
  reasoning_brief?: string;
}

type MoodleAiProvider = "cliproxy" | "gemini" | "openai_compatible";

interface MoodleAiConfig {
  provider: MoodleAiProvider;
  cliProxyApiUrl: string;
  cliProxyModel: string;
  cliProxyTimeoutMs: number;
  geminiApiKey: string;
  geminiModel: string;
  openAiCompatApiUrl: string;
  openAiCompatApiKey: string;
  openAiCompatModel: string;
  temperature: number;
  maxTokens: number;
  systemPromptOverride: string;
}

interface CliProxyResponse {
  choices?: Array<{
    message?: {
      content?: string;
      tool_calls?: Array<{
        function?: {
          name?: string;
          arguments?: string;
        };
      }>;
    };
  }>;
}

const chatHistory: ChatMessage[] = [];
const STORAGE_KEY_MOODLE_AI_PROVIDER = "moodleAiProvider";
const STORAGE_KEY_MOODLE_CLIPROXY_API_URL = "moodleCliProxyApiUrl";
const STORAGE_KEY_MOODLE_CLIPROXY_MODEL = "moodleCliProxyModel";
const STORAGE_KEY_MOODLE_CLIPROXY_TIMEOUT_MS = "moodleCliProxyTimeoutMs";
const STORAGE_KEY_MOODLE_GEMINI_API_KEY = "moodleGeminiApiKey";
const STORAGE_KEY_MOODLE_GEMINI_MODEL = "moodleGeminiModel";
const STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_URL = "moodleOpenAiCompatApiUrl";
const STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_KEY = "moodleOpenAiCompatApiKey";
const STORAGE_KEY_MOODLE_OPENAI_COMPAT_MODEL = "moodleOpenAiCompatModel";
const STORAGE_KEY_MOODLE_AI_TEMPERATURE = "moodleAiTemperature";
const STORAGE_KEY_MOODLE_AI_MAX_TOKENS = "moodleAiMaxTokens";
const STORAGE_KEY_MOODLE_AI_SYSTEM_PROMPT_OVERRIDE =
  "moodleAiSystemPromptOverride";
const LEGACY_STORAGE_KEY_GEMINI_API_KEY = "geminiApiKey";

const DEFAULT_MOODLE_AI_PROVIDER: MoodleAiProvider = "cliproxy";
const DEFAULT_CLI_PROXY_API_URL = "http://localhost:8317/v1/chat/completions";
const DEFAULT_CLI_PROXY_MODEL = "gpt-5.3-codex";
const DEFAULT_CLI_PROXY_TIMEOUT_MS = 30000;
const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
const DEFAULT_OPENAI_COMPAT_API_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_OPENAI_COMPAT_MODEL = "gpt-4o-mini";
const DEFAULT_AI_TEMPERATURE = 0.2;
const DEFAULT_AI_MAX_TOKENS = 1024;
const NEXT_SHORTCUT_KEY = "n";
const NEXT_SHORTCUT_LABEL = "Alt+N";
const NEXT_SHORTCUT_BOUND_KEY = "__siapDipsMoodleNextShortcutBound";
const GEMINI_API_URL_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

// Global reference to marked library
declare global {
  interface Window {
    marked?: {
      parse: (markdown: string) => string;
    };
  }
}

// Function to load marked library
function loadMarkedLibrary(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.marked) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("libs/marked.min.js");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load marked library"));
    document.head.appendChild(script);
  });
}

function normalizeTimeout(value: unknown): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number.parseInt(value, 10)
      : Number.NaN;

  if (Number.isNaN(parsed)) return DEFAULT_CLI_PROXY_TIMEOUT_MS;
  return Math.min(Math.max(parsed, 1000), 120000);
}

function normalizeTemperature(value: unknown): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number.parseFloat(value)
      : Number.NaN;

  if (Number.isNaN(parsed)) return DEFAULT_AI_TEMPERATURE;
  return Math.min(Math.max(parsed, 0), 2);
}

function normalizeMaxTokens(value: unknown): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number.parseInt(value, 10)
      : Number.NaN;

  if (Number.isNaN(parsed)) return DEFAULT_AI_MAX_TOKENS;
  return Math.min(Math.max(parsed, 1), 32768);
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

function getMoodleAiConfig(): Promise<MoodleAiConfig> {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      [
        STORAGE_KEY_MOODLE_AI_PROVIDER,
        STORAGE_KEY_MOODLE_CLIPROXY_API_URL,
        STORAGE_KEY_MOODLE_CLIPROXY_MODEL,
        STORAGE_KEY_MOODLE_CLIPROXY_TIMEOUT_MS,
        STORAGE_KEY_MOODLE_GEMINI_API_KEY,
        STORAGE_KEY_MOODLE_GEMINI_MODEL,
        STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_URL,
        STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_KEY,
        STORAGE_KEY_MOODLE_OPENAI_COMPAT_MODEL,
        STORAGE_KEY_MOODLE_AI_TEMPERATURE,
        STORAGE_KEY_MOODLE_AI_MAX_TOKENS,
        STORAGE_KEY_MOODLE_AI_SYSTEM_PROMPT_OVERRIDE,
        LEGACY_STORAGE_KEY_GEMINI_API_KEY,
      ],
      (result) => {
        const providerRaw = result[STORAGE_KEY_MOODLE_AI_PROVIDER];
        const provider: MoodleAiProvider =
          providerRaw === "gemini" || providerRaw === "openai_compatible"
            ? providerRaw
            : DEFAULT_MOODLE_AI_PROVIDER;

        const cliProxyApiUrl =
          typeof result[STORAGE_KEY_MOODLE_CLIPROXY_API_URL] === "string" &&
          result[STORAGE_KEY_MOODLE_CLIPROXY_API_URL].trim()
            ? result[STORAGE_KEY_MOODLE_CLIPROXY_API_URL].trim()
            : DEFAULT_CLI_PROXY_API_URL;

        const cliProxyModel =
          typeof result[STORAGE_KEY_MOODLE_CLIPROXY_MODEL] === "string" &&
          result[STORAGE_KEY_MOODLE_CLIPROXY_MODEL].trim()
            ? result[STORAGE_KEY_MOODLE_CLIPROXY_MODEL].trim()
            : DEFAULT_CLI_PROXY_MODEL;

        const cliProxyTimeoutMs = normalizeTimeout(
          result[STORAGE_KEY_MOODLE_CLIPROXY_TIMEOUT_MS]
        );

        const moodleGeminiApiKey =
          typeof result[STORAGE_KEY_MOODLE_GEMINI_API_KEY] === "string"
            ? result[STORAGE_KEY_MOODLE_GEMINI_API_KEY].trim()
            : "";
        const legacyGeminiApiKey =
          typeof result[LEGACY_STORAGE_KEY_GEMINI_API_KEY] === "string"
            ? result[LEGACY_STORAGE_KEY_GEMINI_API_KEY].trim()
            : "";

        const geminiApiKey = moodleGeminiApiKey || legacyGeminiApiKey || "";
        const geminiModel =
          typeof result[STORAGE_KEY_MOODLE_GEMINI_MODEL] === "string" &&
          result[STORAGE_KEY_MOODLE_GEMINI_MODEL].trim()
            ? result[STORAGE_KEY_MOODLE_GEMINI_MODEL].trim()
            : DEFAULT_GEMINI_MODEL;

        const openAiCompatApiUrl =
          typeof result[STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_URL] ===
            "string" && result[STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_URL].trim()
            ? result[STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_URL].trim()
            : DEFAULT_OPENAI_COMPAT_API_URL;

        const openAiCompatApiKey =
          typeof result[STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_KEY] === "string"
            ? result[STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_KEY].trim()
            : "";

        const openAiCompatModel =
          typeof result[STORAGE_KEY_MOODLE_OPENAI_COMPAT_MODEL] === "string" &&
          result[STORAGE_KEY_MOODLE_OPENAI_COMPAT_MODEL].trim()
            ? result[STORAGE_KEY_MOODLE_OPENAI_COMPAT_MODEL].trim()
            : DEFAULT_OPENAI_COMPAT_MODEL;

        const temperature = normalizeTemperature(
          result[STORAGE_KEY_MOODLE_AI_TEMPERATURE]
        );
        const maxTokens = normalizeMaxTokens(
          result[STORAGE_KEY_MOODLE_AI_MAX_TOKENS]
        );
        const systemPromptOverride =
          typeof result[STORAGE_KEY_MOODLE_AI_SYSTEM_PROMPT_OVERRIDE] ===
          "string"
            ? result[STORAGE_KEY_MOODLE_AI_SYSTEM_PROMPT_OVERRIDE].trim()
            : "";

        if (!moodleGeminiApiKey && legacyGeminiApiKey) {
          chrome.storage.local.set({
            [STORAGE_KEY_MOODLE_GEMINI_API_KEY]: legacyGeminiApiKey,
          });
        }

        resolve({
          provider,
          cliProxyApiUrl,
          cliProxyModel,
          cliProxyTimeoutMs,
          geminiApiKey,
          geminiModel,
          openAiCompatApiUrl,
          openAiCompatApiKey,
          openAiCompatModel,
          temperature,
          maxTokens,
          systemPromptOverride,
        });
      }
    );
  });
}

// Function to process external questions from content script
async function processExternalQuestion(
  question: MoodleQuestionPayload,
  questionId: string,
  responseEventName: string,
  messagesContainer: HTMLElement
): Promise<void> {
  console.log(
    "Processing external question:",
    question,
    "with ID:",
    questionId
  );

  // Add user message to UI (the question)
  const userMessageElement = createMessageElement(
    formatQuestionPayloadForDisplay(question),
    "user"
  );
  messagesContainer.appendChild(userMessageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Show loading indicator
  const loadingElement = createLoadingElement();
  messagesContainer.appendChild(loadingElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  try {
    const structuredAnswer = await answerMoodleQuestion(question);

    // Remove loading indicator
    messagesContainer.removeChild(loadingElement);

    if (structuredAnswer) {
      // Add AI response to UI
      const aiMessageElement = createMessageElement(
        formatStructuredAnswerForDisplay(structuredAnswer),
        "model"
      );
      messagesContainer.appendChild(aiMessageElement);

      // Dispatch success event with the response to the specific event name
      document.dispatchEvent(
        new CustomEvent(responseEventName, {
          detail: {
            questionId,
            success: true,
            response: JSON.stringify(structuredAnswer),
          },
        })
      );
    } else {
      const errorElement = createMessageElement(
        "Provider AI ngasih jawaban kosong / ga valid. Coba ulang lagi bentar.",
        "model"
      );
      messagesContainer.appendChild(errorElement);

      // Dispatch error event to the specific event name
      document.dispatchEvent(
        new CustomEvent(responseEventName, {
          detail: {
            questionId,
            success: false,
            error: "No response from AI",
          },
        })
      );
    }
  } catch (error) {
    // Remove loading indicator
    if (messagesContainer.contains(loadingElement)) {
      messagesContainer.removeChild(loadingElement);
    }

    const errorElement = createMessageElement(
      error instanceof Error
        ? error.message
        : "Gagal connect ke provider AI. Coba ulang lagi.",
      "model"
    );
    messagesContainer.appendChild(errorElement);

    // Dispatch error event to the specific event name
    document.dispatchEvent(
      new CustomEvent(responseEventName, {
        detail: {
          questionId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      })
    );
  }

  // Auto-scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

export function createHelper(): HTMLElement {
  const helper = document.createElement("div");
  Object.assign(helper.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    width: "320px",
    minHeight: "200px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    padding: "16px",
    zIndex: "9999",
    resize: "both",
    overflow: "auto",
    border: "1px solid rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
    transition: "box-shadow 0.3s ease",
    transform: "translate(0, 0)",
  });

  // Header
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

  // Title container (logos + text) - this will be the drag handle
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

  // Create logo SVGs (split into helper functions)
  const logoSiapDips = createLogoSiapDips();
  const logoMyudak = createLogoMyudak();

  // Title text
  const titleText = document.createElement("span");
  titleText.textContent = "Siap Dipss";
  Object.assign(titleText.style, {
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "default",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });

  // Close button with mobile-friendly touch targets
  const closeButton = document.createElement("button");
  Object.assign(closeButton.style, {
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "6px",
    color: "#666",
    fontSize: "16px",
    transition: "all 0.2s ease",
    minWidth: "44px",
    minHeight: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  closeButton.textContent = "✕";
  closeButton.addEventListener("mouseenter", () => {
    closeButton.style.backgroundColor = "#f5f5f5";
    closeButton.style.color = "#333";
  });
  closeButton.addEventListener("mouseleave", () => {
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.color = "#666";
  });
  closeButton.addEventListener("click", () => helper.remove());

  // Create minimize button with mobile-friendly touch targets
  const minimizeButton = document.createElement("button");
  Object.assign(minimizeButton.style, {
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "6px",
    color: "#666",
    fontSize: "16px",
    transition: "all 0.2s ease",
    marginRight: "8px",
    minWidth: "44px",
    minHeight: "44px",
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

  // Store original styles for restoring later
  const originalStyles = {
    width: helper.style.width,
    minHeight: helper.style.minHeight,
    padding: helper.style.padding,
    borderRadius: helper.style.borderRadius,
    resize: helper.style.resize,
  };

  let isMinimized = false;
  minimizeButton.addEventListener("click", () => {
    isMinimized = !isMinimized;
    if (isMinimized) {
      // Minimize the helper - just hide content, keep header
      content.style.display = "none";
      helper.style.minHeight = "auto";
      helper.style.resize = "none";
      minimizeButton.textContent = "▲";
      minimizeButton.title = "Maximize";
    } else {
      // Restore the helper
      content.style.display = "grid";
      helper.style.minHeight = originalStyles.minHeight;
      helper.style.resize = originalStyles.resize;
      minimizeButton.textContent = "▼";
      minimizeButton.title = "Minimize";
    }
  });

  // Assemble header
  titleContainer.appendChild(logoSiapDips);
  titleContainer.appendChild(logoMyudak);
  titleContainer.appendChild(titleText);
  header.appendChild(titleContainer);
  header.appendChild(minimizeButton);
  header.appendChild(closeButton);
  helper.appendChild(header);

  // Content container for chat
  const content = document.createElement("div");
  Object.assign(content.style, {
    display: "flex",
    flexDirection: "column",
    height: "400px",
    gap: "12px",
  });

  // Create chat interface
  const chatInterface = createChatInterface();
  content.appendChild(chatInterface);
  helper.appendChild(content);

  // Enable dragging for the helper using the title container as the handle.
  new Draggable({ element: helper, handle: titleContainer });

  // Append helper to the document body.
  document.body.appendChild(helper);
  return helper;
}

function createChatInterface(): HTMLElement {
  const chatContainer = document.createElement("div");
  Object.assign(chatContainer.style, {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    gap: "12px",
  });

  // Messages container
  const messagesContainer = document.createElement("div");
  Object.assign(messagesContainer.style, {
    flex: "1",
    overflowY: "auto",
    padding: "8px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #e9ecef",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  });

  // Input container
  const inputContainer = document.createElement("div");
  Object.assign(inputContainer.style, {
    display: "flex",
    gap: "8px",
    alignItems: "flex-end",
  });

  // Message input
  const messageInput = document.createElement("textarea");
  messageInput.placeholder = "Ask me anything...";
  messageInput.classList.add("myudak-ai-input");
  Object.assign(messageInput.style, {
    flex: "1",
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    resize: "none",
    minHeight: "36px",
    maxHeight: "100px",
    outline: "none",
  });

  // Send button
  const sendButton = document.createElement("button");
  sendButton.textContent = "Send";
  sendButton.classList.add("myudak-ai-send-button");
  Object.assign(sendButton.style, {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    minHeight: "36px",
    transition: "background-color 0.2s ease",
  });

  // Clear button
  const clearButton = document.createElement("button");
  clearButton.textContent = "Clear";
  Object.assign(clearButton.style, {
    padding: "8px 12px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    minHeight: "36px",
    transition: "background-color 0.2s ease",
  });

  // Next button
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  Object.assign(nextButton.style, {
    padding: "8px 12px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    minHeight: "36px",
    transition: "background-color 0.2s ease",
  });
  nextButton.title = `Next (${NEXT_SHORTCUT_LABEL})`;
  nextButton.setAttribute("aria-label", `Next (${NEXT_SHORTCUT_LABEL})`);

  // Load marked library and add system message initially
  loadMarkedLibrary().catch(() => {
    console.warn("Failed to load marked library, falling back to plain text");
  });

  if (chatHistory.length === 0) {
    chatHistory.push({
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }],
      // timestamp: new Date(),
    });

    const welcomeMessage = createMessageElement(
      'hola gw DIPS buat jawab" pertanyaan lu ( •̀ ω •́ )✧',
      "model"
    );
    const welcome2Message = createMessageElement(
      "`{BETA masih ad bbrp bug, auto answer only accurate for pilgan}`",
      "model"
    );
    messagesContainer.appendChild(welcomeMessage);
    messagesContainer.appendChild(welcome2Message);
  }

  // Add event listener for external question requests
  document.addEventListener("myudak-ai-question", async (event: Event) => {
    const customEvent = event as CustomEvent;
    const { question, questionId, responseEventName } = customEvent.detail;
    console.log(
      "Helper received question:",
      question,
      "with response event:",
      responseEventName
    );

    try {
      // Process the question through the chat system
      await processExternalQuestion(
        question,
        questionId,
        responseEventName,
        messagesContainer
      );
    } catch (error) {
      console.error("Error processing external question:", error);
      // Dispatch error event to the specific response event name
      document.dispatchEvent(
        new CustomEvent(responseEventName || "myudak-ai-response", {
          detail: {
            questionId,
            success: false,
            error: "Failed to process question",
          },
        })
      );
    }
  });

  // Event handlers
  sendButton.addEventListener("mouseenter", () => {
    sendButton.style.backgroundColor = "#0056b3";
  });
  sendButton.addEventListener("mouseleave", () => {
    sendButton.style.backgroundColor = "#007bff";
  });

  clearButton.addEventListener("mouseenter", () => {
    clearButton.style.backgroundColor = "#545b62";
  });
  clearButton.addEventListener("mouseleave", () => {
    clearButton.style.backgroundColor = "#6c757d";
  });

  nextButton.addEventListener("mouseenter", () => {
    nextButton.style.backgroundColor = "#218838";
  });
  nextButton.addEventListener("mouseleave", () => {
    nextButton.style.backgroundColor = "#28a745";
  });

  const sendMessage = async () => {
    const message = messageInput.value.trim();
    if (!message) return;

    // Disable input while processing
    messageInput.disabled = true;
    sendButton.disabled = true;
    messageInput.value = "";

    // Add user message to UI
    const userMessageElement = createMessageElement(message, "user");
    messagesContainer.appendChild(userMessageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Add user message to history
    chatHistory.push({
      role: "user",
      parts: [{ text: message }],
      // timestamp: new Date(),
    });

    // Show loading indicator
    const loadingElement = createLoadingElement();
    messagesContainer.appendChild(loadingElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const response = await chatWithConfiguredProvider(chatHistory);

      // Remove loading indicator
      messagesContainer.removeChild(loadingElement);

      if (response) {
        // Add AI response to UI
        const aiMessageElement = createMessageElement(response, "model");
        messagesContainer.appendChild(aiMessageElement);

        // Add AI response to history
        chatHistory.push({
          role: "model",
          parts: [{ text: response }],
          // timestamp: new Date(),
        });
      } else {
        const errorElement = createMessageElement(
          "Sorry, I couldn't process your request. Please try again.",
          "model"
        );
        messagesContainer.appendChild(errorElement);
      }
    } catch (error) {
      // Remove loading indicator
      messagesContainer.removeChild(loadingElement);
      const errorElement = createMessageElement(
        error instanceof Error
          ? error.message
          : "Provider AI error. Cek konfigurasi Moodle AI.",
        "model"
      );
      messagesContainer.appendChild(errorElement);
    }

    // Re-enable input
    messageInput.disabled = false;
    sendButton.disabled = false;
    messageInput.focus();
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const clearChat = () => {
    // Clear history (keep system prompt)
    chatHistory.splice(1);

    // Clear UI
    messagesContainer.innerHTML = "";

    // Add welcome message back
    const welcomeMessage = createMessageElement(
      "Chat cleared! Ngapain lagi DIPS (oﾟvﾟ)ノ",
      "model"
    );
    messagesContainer.appendChild(welcomeMessage);
  };

  const triggerNext = () => {
    const nextNav = document.querySelector<HTMLElement>("#mod_quiz-next-nav");
    if (!nextNav) {
      showToast("Tombol next tidak ketemu", "error");
      return;
    }
    nextNav.click();
  };

  sendButton.addEventListener("click", sendMessage);
  clearButton.addEventListener("click", clearChat);
  nextButton.addEventListener("click", triggerNext);

  type WindowWithNextShortcut = Window & {
    [NEXT_SHORTCUT_BOUND_KEY]?: boolean;
  };

  const shortcutWindow = window as WindowWithNextShortcut;
  if (!shortcutWindow[NEXT_SHORTCUT_BOUND_KEY]) {
    shortcutWindow[NEXT_SHORTCUT_BOUND_KEY] = true;
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();
      const isShortcut =
        event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        key === NEXT_SHORTCUT_KEY;

      if (!isShortcut) return;

      event.preventDefault();
      triggerNext();
    });
  }

  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  messageInput.addEventListener("input", () => {
    messageInput.style.height = "auto";
    messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + "px";
  });

  inputContainer.appendChild(messageInput);
  inputContainer.appendChild(sendButton);
  inputContainer.appendChild(clearButton);
  inputContainer.appendChild(nextButton);

  chatContainer.appendChild(messagesContainer);
  chatContainer.appendChild(inputContainer);

  return chatContainer;
}

function createMessageElement(
  text: string,
  role: "user" | "model"
): HTMLElement {
  const messageDiv = document.createElement("div");
  Object.assign(messageDiv.style, {
    display: "flex",
    flexDirection: "column",
    alignItems: role === "user" ? "flex-end" : "flex-start",
    gap: "4px",
  });

  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble");

  // REGEX TEXT TO EXCLUDE this string `XX_CODE_FINAL_ANSWER_XX:`

  text = text.replace("XX_CODE_FINAL_ANSWER_XX:", "").trim();

  // Use markdown parsing if marked is available, otherwise fallback to plain text
  if (window.marked) {
    bubble.innerHTML = window.marked.parse(text);
  } else {
    bubble.textContent = text;
  }

  Object.assign(bubble.style, {
    maxWidth: "80%",
    padding: "8px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    lineHeight: "1.4",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    wordWrap: "break-word",
    backgroundColor: role === "user" ? "#007bff" : "#e9ecef",
    color: role === "user" ? "white" : "#333",
  });

  const timestamp = document.createElement("div");
  timestamp.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  Object.assign(timestamp.style, {
    fontSize: "11px",
    color: "#666",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });

  messageDiv.appendChild(bubble);
  messageDiv.appendChild(timestamp);

  return messageDiv;
}

function createLoadingElement(): HTMLElement {
  const loadingDiv = document.createElement("div");
  Object.assign(loadingDiv.style, {
    display: "flex",
    alignItems: "flex-start",
    gap: "4px",
  });

  const bubble = document.createElement("div");
  Object.assign(bubble.style, {
    maxWidth: "80%",
    padding: "8px 12px",
    borderRadius: "12px",
    backgroundColor: "#e9ecef",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  });

  // Create three dots for loading animation
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    Object.assign(dot.style, {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      backgroundColor: "#666",
      animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
    });
    bubble.appendChild(dot);
  }

  loadingDiv.appendChild(bubble);
  return loadingDiv;
}

// const API_KEY = "AIzaSyByESbyFz1h5W9a_pUJXM3mRfSVxzIosGc"; // Load from secure storage

const SYSTEM_PROMPT = `
<SYSTEM_PROMPT>
You are **DIPS**, a quiz-answering assistant developed by myudakk.

---

## 🎯 Behavior Rules:
- Users may send multiple-choice questions one after another.
- You MUST always answer **only the LAST question** that appears in the most recent user message.
- Completely **ignore earlier questions**, unless the final question includes references to them.
- In message history, process from top to bottom, and **only answer the most recent multiple-choice question**.

---

## 🧠 Answer Format:
1. Start with a **brief explanation** of your reasoning.
2. End with the final answer using **this exact format**, on a new line:

\`\`\`
XX_CODE_FINAL_ANSWER_XX: <choice letter>. <answer text>
\`\`\`

✅ **Example**:
If the chat contains:
\`\`\`
user: "Unlike dogs, cats cannot synthesize which vitamin...?"
user: "Cats require a dietary source of what fatty acid...?"
user: "What essential nutrient must be present in a cat's diet to prevent retinal degeneration?"
\`\`\`
You must answer ONLY:
_"What essential nutrient must be present in a cat's diet..."_

---

## ☑️ Final Check:
Before answering, ask yourself:
> Am I responding to the most recent multiple-choice question only?

If not — fix it.

---

## 💬 Non-Quiz Messages:
If the user isn’t asking a quiz question, act like a friendly and playful assistant. For example:

\`hola gw DIPS buat jawab-jawab pertanyaan lu ( •̀ ω •́ )✧\`

REMEMBER THAT IS JUST AN EXAMPLE, U CAN USE ANYTHING, ANSWER ACCORDING TO USER DONT USE TEMPLATE
</SYSTEM_PROMPT>
`;

const MOODLE_AUTO_ANSWER_SYSTEM_PROMPT = `
You are DIPS, a Moodle multiple-choice quiz solving assistant.

Rules:
- You will receive one question and the exact answer options shown on screen.
- Choose exactly one answer from the provided options.
- Never invent an option.
- Never use a letter that is not present in the provided options.
- Base your answer on the exact provided option texts.

When tools are available:
- Call the tool \`select_moodle_answer\`.

If tools are unavailable:
- Return JSON only:
{"answer_letter":"b","answer_text":"...","confidence":0.88,"reasoning_brief":"..."}

Do not use markdown fences.
`.trim();

const MOODLE_ANSWER_TOOL = {
  type: "function",
  function: {
    name: "select_moodle_answer",
    description: "Select the best answer from the provided Moodle choices.",
    parameters: {
      type: "object",
      properties: {
        answer_letter: {
          type: "string",
          enum: ["a", "b", "c", "d", "e", "f"],
        },
        answer_text: {
          type: "string",
        },
        confidence: {
          type: "number",
        },
        reasoning_brief: {
          type: "string",
        },
      },
      required: ["answer_letter", "answer_text"],
    },
  },
} as const;

function getEffectiveChatSystemPrompt(config: MoodleAiConfig): string {
  const override = config.systemPromptOverride.trim();
  return override || SYSTEM_PROMPT;
}

function getEffectiveMoodleAutoAnswerSystemPrompt(config: MoodleAiConfig): string {
  const override = config.systemPromptOverride.trim();
  if (!override) return MOODLE_AUTO_ANSWER_SYSTEM_PROMPT;
  return `${override}\n\n${MOODLE_AUTO_ANSWER_SYSTEM_PROMPT}`;
}

function buildOpenAiCompatHeaders(apiKey: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
}

function convertChatHistoryToCliProxyMessages(
  history: ChatMessage[],
  systemPrompt: string
): CliProxyMessage[] {
  const messages: CliProxyMessage[] = [];

  for (const entry of history) {
    const text = entry.parts?.[0]?.text?.trim();
    if (!text) continue;

    const isSystemPrompt =
      entry.role === "user" &&
      messages.length === 0 &&
      (text === systemPrompt || text === SYSTEM_PROMPT);

    if (isSystemPrompt) {
      messages.push({
        role: "system",
        content: text,
      });
      continue;
    }

    messages.push({
      role: entry.role === "model" ? "assistant" : "user",
      content: text,
    });
  }

  if (messages.length === 0 || messages[0].role !== "system") {
    messages.unshift({
      role: "system",
      content: systemPrompt,
    });
  }

  return messages;
}

function formatQuestionPayloadForDisplay(
  question: MoodleQuestionPayload
): string {
  const optionsText = question.options
    .map((option) => `${option.key.toUpperCase()}. ${option.text}`)
    .join("\n");

  return `${question.questionLabel}\n\n${question.questionText}\n\n${optionsText}`;
}

function formatStructuredAnswerForDisplay(answer: ToolAnswerResult): string {
  const lines = [
    answer.reasoning_brief || "Udah gw pilih opsi paling masuk akal.",
    `XX_CODE_FINAL_ANSWER_XX: ${answer.answer_letter}. ${answer.answer_text || ""}`.trim(),
  ];
  return lines.join("\n\n");
}

function extractJsonObject(text: string): string | null {
  const match = text.match(/\{[\s\S]*\}/);
  return match?.[0] || null;
}

function parseToolAnswerResult(value: unknown): ToolAnswerResult | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as {
    answer_letter?: unknown;
    answer_text?: unknown;
    confidence?: unknown;
    reasoning_brief?: unknown;
  };

  if (typeof candidate.answer_letter !== "string") return null;

  return {
    answer_letter: candidate.answer_letter.toLowerCase(),
    answer_text:
      typeof candidate.answer_text === "string"
        ? candidate.answer_text
        : undefined,
    confidence:
      typeof candidate.confidence === "number"
        ? candidate.confidence
        : undefined,
    reasoning_brief:
      typeof candidate.reasoning_brief === "string"
        ? candidate.reasoning_brief
        : undefined,
  };
}

function extractToolAnswerFromText(content: string): ToolAnswerResult | null {
  if (!content) return null;

  const jsonText = extractJsonObject(content);
  if (jsonText) {
    try {
      return parseToolAnswerResult(JSON.parse(jsonText));
    } catch (error) {
      console.warn("Failed to parse JSON answer content:", error);
    }
  }

  const markerMatch = content.match(
    /XX_CODE_FINAL_ANSWER_XX:\s*([a-zA-Z])\.\s*(.*)/
  );
  if (!markerMatch) return null;

  return {
    answer_letter: markerMatch[1].toLowerCase(),
    answer_text: markerMatch[2]?.trim() || undefined,
  };
}

function extractToolAnswerFromCliProxyResponse(
  result: CliProxyResponse
): ToolAnswerResult | null {
  const choice = result.choices?.[0];
  const toolCalls = choice?.message?.tool_calls || [];

  for (const toolCall of toolCalls) {
    const fn = toolCall.function;
    if (fn?.name !== "select_moodle_answer" || !fn.arguments) continue;

    try {
      return parseToolAnswerResult(JSON.parse(fn.arguments));
    } catch (error) {
      console.warn("Failed to parse tool call arguments:", error);
    }
  }

  const content = choice?.message?.content;
  return content ? extractToolAnswerFromText(content) : null;
}

function buildMoodleAutoAnswerUserPrompt(
  question: MoodleQuestionPayload
): string {
  const optionsText = question.options
    .map((option) => `${option.key}. ${option.text}`)
    .join("\n");

  return [
    `Question Label: ${question.questionLabel}`,
    `Question Type: ${question.questionType}`,
    "",
    "Question:",
    question.questionText,
    "",
    "Options:",
    optionsText,
    "",
    "Choose exactly one option from the provided list.",
  ].join("\n");
}

function convertChatHistoryToGeminiContents(
  history: ChatMessage[],
  systemPrompt: string
): Array<{
  role: "user" | "model";
  parts: Array<{ text: string }>;
}> {
  return history
    .map((entry) => {
      const text = entry.parts?.[0]?.text?.trim();
      if (!text) return null;
      const isSystemPrompt =
        entry.role === "user" && (text === systemPrompt || text === SYSTEM_PROMPT);
      if (isSystemPrompt) return null;
      return {
        role: entry.role === "model" ? "model" : "user",
        parts: [{ text }],
      };
    })
    .filter(Boolean) as Array<{
    role: "user" | "model";
    parts: Array<{ text: string }>;
  }>;
}

function normalizeStructuredAnswerForQuestion(
  parsed: ToolAnswerResult | null,
  question: MoodleQuestionPayload
): ToolAnswerResult | null {
  if (!parsed) return null;

  const validOptionKeys = new Set(question.options.map((option) => option.key));
  if (!validOptionKeys.has(parsed.answer_letter)) {
    console.warn("Provider returned invalid option key:", parsed.answer_letter);
    return null;
  }

  return parsed;
}

async function answerMoodleQuestion(
  question: MoodleQuestionPayload
): Promise<ToolAnswerResult | null> {
  const config = await getMoodleAiConfig();

  if (config.provider === "gemini") {
    return answerMoodleQuestionWithGemini(question, config);
  }
  if (config.provider === "openai_compatible") {
    return answerMoodleQuestionWithOpenAiCompatible(question, config);
  }

  return answerMoodleQuestionWithCliProxy(question, config);
}

async function chatWithConfiguredProvider(
  history: ChatMessage[]
): Promise<string | undefined> {
  const config = await getMoodleAiConfig();

  if (config.provider === "gemini") {
    return chatWithGemini(history, config);
  }
  if (config.provider === "openai_compatible") {
    return chatWithOpenAiCompatible(history, config);
  }

  return chatWithCliProxy(history, config);
}

async function answerMoodleQuestionWithCliProxy(
  question: MoodleQuestionPayload,
  config: MoodleAiConfig
): Promise<ToolAnswerResult | null> {
  const controller = new AbortController();
  const timeoutMs = config.cliProxyTimeoutMs;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(config.cliProxyApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.cliProxyModel,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        messages: [
          {
            role: "system",
            content: getEffectiveMoodleAutoAnswerSystemPrompt(config),
          },
          {
            role: "user",
            content: buildMoodleAutoAnswerUserPrompt(question),
          },
        ],
        tools: [MOODLE_ANSWER_TOOL],
        tool_choice: {
          type: "function",
          function: {
            name: "select_moodle_answer",
          },
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const result = (await response.json()) as CliProxyResponse;
    return normalizeStructuredAnswerForQuestion(
      extractToolAnswerFromCliProxyResponse(result),
      question
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        `CLIProxy request timeout after ${Math.floor(timeoutMs / 1000)}s`
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function answerMoodleQuestionWithGemini(
  question: MoodleQuestionPayload,
  config: MoodleAiConfig
): Promise<ToolAnswerResult | null> {
  if (!config.geminiApiKey) {
    throw new Error("Gemini API key belum diisi. Cek setting Moodle AI.");
  }
  if (!config.geminiModel) {
    throw new Error("Gemini model belum diisi. Cek setting Moodle AI.");
  }

  const controller = new AbortController();
  const timeoutMs = config.cliProxyTimeoutMs;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `${GEMINI_API_URL_BASE}/${encodeURIComponent(
        config.geminiModel
      )}:generateContent?key=${encodeURIComponent(config.geminiApiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: getEffectiveMoodleAutoAnswerSystemPrompt(config) }],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${buildMoodleAutoAnswerUserPrompt(
                    question
                  )}\n\nReturn JSON only.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.maxTokens,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const result = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const text =
      result.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("\n")
        .trim() || "";

    return normalizeStructuredAnswerForQuestion(
      extractToolAnswerFromText(text),
      question
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        `Gemini request timeout after ${Math.floor(timeoutMs / 1000)}s`
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function answerMoodleQuestionWithOpenAiCompatible(
  question: MoodleQuestionPayload,
  config: MoodleAiConfig
): Promise<ToolAnswerResult | null> {
  if (!config.openAiCompatApiUrl) {
    throw new Error(
      "OpenAI-compatible API URL belum diisi. Cek setting Moodle AI."
    );
  }
  if (!config.openAiCompatApiKey) {
    throw new Error(
      "OpenAI-compatible API key belum diisi. Cek setting Moodle AI."
    );
  }
  if (!config.openAiCompatModel) {
    throw new Error(
      "OpenAI-compatible model belum diisi. Cek setting Moodle AI."
    );
  }

  const controller = new AbortController();
  const timeoutMs = config.cliProxyTimeoutMs;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(config.openAiCompatApiUrl, {
      method: "POST",
      headers: buildOpenAiCompatHeaders(config.openAiCompatApiKey),
      body: JSON.stringify({
        model: config.openAiCompatModel,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        messages: [
          {
            role: "system",
            content: getEffectiveMoodleAutoAnswerSystemPrompt(config),
          },
          {
            role: "user",
            content: buildMoodleAutoAnswerUserPrompt(question),
          },
        ],
        tools: [MOODLE_ANSWER_TOOL],
        tool_choice: {
          type: "function",
          function: {
            name: "select_moodle_answer",
          },
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const result = (await response.json()) as CliProxyResponse;
    return normalizeStructuredAnswerForQuestion(
      extractToolAnswerFromCliProxyResponse(result),
      question
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        `OpenAI-compatible request timeout after ${Math.floor(timeoutMs / 1000)}s`
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function chatWithCliProxy(
  history: ChatMessage[],
  config: MoodleAiConfig
): Promise<string | undefined> {
  const controller = new AbortController();
  const timeoutMs = config.cliProxyTimeoutMs;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(config.cliProxyApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.cliProxyModel,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        messages: convertChatHistoryToCliProxyMessages(
          history,
          getEffectiveChatSystemPrompt(config)
        ),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const result = (await response.json()) as CliProxyResponse;
    return result.choices?.[0]?.message?.content;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        `CLIProxy request timeout after ${Math.floor(timeoutMs / 1000)}s`
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function chatWithGemini(
  history: ChatMessage[],
  config: MoodleAiConfig
): Promise<string | undefined> {
  if (!config.geminiApiKey) {
    throw new Error("Gemini API key belum diisi. Cek setting Moodle AI.");
  }
  if (!config.geminiModel) {
    throw new Error("Gemini model belum diisi. Cek setting Moodle AI.");
  }

  const controller = new AbortController();
  const timeoutMs = config.cliProxyTimeoutMs;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `${GEMINI_API_URL_BASE}/${encodeURIComponent(
        config.geminiModel
      )}:generateContent?key=${encodeURIComponent(config.geminiApiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: getEffectiveChatSystemPrompt(config) }],
          },
          contents: convertChatHistoryToGeminiContents(
            history,
            getEffectiveChatSystemPrompt(config)
          ),
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.maxTokens,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const result = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    return result.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        `Gemini request timeout after ${Math.floor(timeoutMs / 1000)}s`
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function chatWithOpenAiCompatible(
  history: ChatMessage[],
  config: MoodleAiConfig
): Promise<string | undefined> {
  if (!config.openAiCompatApiUrl) {
    throw new Error(
      "OpenAI-compatible API URL belum diisi. Cek setting Moodle AI."
    );
  }
  if (!config.openAiCompatApiKey) {
    throw new Error(
      "OpenAI-compatible API key belum diisi. Cek setting Moodle AI."
    );
  }
  if (!config.openAiCompatModel) {
    throw new Error(
      "OpenAI-compatible model belum diisi. Cek setting Moodle AI."
    );
  }

  const controller = new AbortController();
  const timeoutMs = config.cliProxyTimeoutMs;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(config.openAiCompatApiUrl, {
      method: "POST",
      headers: buildOpenAiCompatHeaders(config.openAiCompatApiKey),
      body: JSON.stringify({
        model: config.openAiCompatModel,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        messages: convertChatHistoryToCliProxyMessages(
          history,
          getEffectiveChatSystemPrompt(config)
        ),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const result = (await response.json()) as CliProxyResponse;
    return result.choices?.[0]?.message?.content;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        `OpenAI-compatible request timeout after ${Math.floor(timeoutMs / 1000)}s`
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
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

export function injectGlobalStyles() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 20% { 
        opacity: 0.2;
        transform: scale(1);
      }
      50% { 
        opacity: 1;
        transform: scale(1.2);
      }
      80%, 100% { 
        opacity: 0.2;
        transform: scale(1);
      }
    }
    .dragging {
      user-select: none;
      cursor: move;
    }
    
    /* Markdown styles for chat bubbles */
    .chat-bubble h1, .chat-bubble h2, .chat-bubble h3, 
    .chat-bubble h4, .chat-bubble h5, .chat-bubble h6 {
      margin: 8px 0 4px 0;
      font-weight: bold;
      line-height: 1.2;
    }
    
    .chat-bubble h1 { font-size: 18px; }
    .chat-bubble h2 { font-size: 16px; }
    .chat-bubble h3 { font-size: 15px; }
    .chat-bubble h4 { font-size: 14px; }
    .chat-bubble h5 { font-size: 13px; }
    .chat-bubble h6 { font-size: 12px; }
    
    .chat-bubble p {
      margin: 4px 0;
      line-height: 1.4;
    }
    
    .chat-bubble code {
      background-color: rgba(0, 0, 0, 0.1);
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 12px;
    }
    
    .chat-bubble pre {
      background-color: rgba(0, 0, 0, 0.05);
      padding: 8px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 8px 0;
      border-left: 3px solid rgba(0, 0, 0, 0.2);
    }
    
    .chat-bubble pre code {
      background: none;
      padding: 0;
      border-radius: 0;
      font-size: 11px;
    }
    
    .chat-bubble blockquote {
      border-left: 3px solid rgba(0, 0, 0, 0.2);
      margin: 8px 0;
      padding-left: 12px;
      color: rgba(0, 0, 0, 0.7);
      font-style: italic;
    }
    
    .chat-bubble ul, .chat-bubble ol {
      margin: 8px 0;
      padding-left: 20px;
    }
    
    .chat-bubble li {
      margin: 2px 0;
      line-height: 1.4;
    }
    
    .chat-bubble a {
      color: inherit;
      text-decoration: underline;
      opacity: 0.8;
    }
    
    .chat-bubble a:hover {
      opacity: 1;
    }
    
    .chat-bubble strong, .chat-bubble b {
      font-weight: bold;
    }
    
    .chat-bubble em, .chat-bubble i {
      font-style: italic;
    }
    
    .chat-bubble hr {
      border: none;
      border-top: 1px solid rgba(0, 0, 0, 0.2);
      margin: 12px 0;
    }
    
    .chat-bubble table {
      border-collapse: collapse;
      width: 100%;
      margin: 8px 0;
      font-size: 12px;
    }
    
    .chat-bubble th, .chat-bubble td {
      border: 1px solid rgba(0, 0, 0, 0.2);
      padding: 4px 8px;
      text-align: left;
    }
    
    .chat-bubble th {
      background-color: rgba(0, 0, 0, 0.05);
      font-weight: bold;
    }
    
    /* Override styles for user messages (blue background) */
    .chat-bubble code {
      background-color: rgba(255, 255, 255, 0.2) !important;
      color: inherit;
    }
    
    .chat-bubble pre {
      background-color: rgba(255, 255, 255, 0.1) !important;
      border-left-color: rgba(255, 255, 255, 0.3) !important;
    }
    
    .chat-bubble blockquote {
      border-left-color: rgba(255, 255, 255, 0.3) !important;
      color: rgba(255, 255, 255, 0.9) !important;
    }
  `;
  document.head.appendChild(style);
}

