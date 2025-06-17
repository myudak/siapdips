// src/helper.ts
// import { BUTTONS } from "./config";
import { Draggable } from "./draggable";

interface ChatMessage {
  role: "user" | "model";
  parts: [{ text: string }];
}

const chatHistory: ChatMessage[] = [];

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

// Function to process external questions from content script
async function processExternalQuestion(
  question: string,
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
  const userMessageElement = createMessageElement(question, "user");
  messagesContainer.appendChild(userMessageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Add user message to history
  chatHistory.push({
    role: "user",
    parts: [{ text: question }],
  });

  // Show loading indicator
  const loadingElement = createLoadingElement();
  messagesContainer.appendChild(loadingElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  try {
    // Get AI response
    const response = await chatWithGemini(chatHistory);

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
      });

      // Dispatch success event with the response to the specific event name
      document.dispatchEvent(
        new CustomEvent(responseEventName, {
          detail: {
            questionId,
            success: true,
            response: response,
          },
        })
      );
    } else {
      const errorElement = createMessageElement(
        "Sorry, I couldn't process your request. Please try again.",
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
      "An error occurred. Please check your connection and try again.",
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
      // Get AI response
      const apiKey = await getGeminiApiKey();
      if (!apiKey) {
        console.error("No Gemini API key found");
        messagesContainer.removeChild(loadingElement);
        const errorElement = createMessageElement(
          "km belum set API key, coba set di menu setting ;)",
          "model"
        );
        messagesContainer.appendChild(errorElement);
        return;
      }
      const response = await chatWithGemini(chatHistory);

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
    } catch {
      // Remove loading indicator
      messagesContainer.removeChild(loadingElement);
      const errorElement = createMessageElement(
        "An error occurred. Please check your connection and try again.",
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

  sendButton.addEventListener("click", sendMessage);
  clearButton.addEventListener("click", clearChat);

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

async function chatWithGemini(
  history: ChatMessage[]
): Promise<string | undefined> {
  const API_KEY = await getGeminiApiKey();
  if (!API_KEY) {
    console.error("No Gemini API key found");
    return;
  }
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: history,
      }),
    }
  );

  const result = await response.json();
  return result.candidates?.[0]?.content?.parts?.[0]?.text;
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

function getGeminiApiKey() {
  return new Promise((resolve) => {
    chrome.storage.local.get("geminiApiKey", (result) => {
      resolve(result.geminiApiKey);
    });
  });
}
