console.log("myudak -- content-moodle.ts loaded");

import { createHelperDefault } from "./lib/content_moodle";

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

    const nomorSoalText = nomorSoal.textContent?.trim() || "[No Nomor Soal]";
    const soalText = getVisibleTextContent(formulation);

    const buttonCopySoal = createCopyButton(nomorSoalText, soalText);
    const buttonGoogleSoal = createGoogleButton(soalText);
    const buttonAskAi = createAiButton(soalText, question);

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
    formulation.appendChild(buttonAskAi);
  });

function createBaseButton(text: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = text;
  button.type = "button";
  button.style.marginTop = "10px";
  button.classList.add("btn", "btn-secondary", "btn-myudak");
  return button;
}

function createAiButton(
  soalText: string,
  question: HTMLElement
): HTMLButtonElement {
  const button = createBaseButton("Tany AI");
  addAiLogo(button);

  button.addEventListener("click", async (e: MouseEvent) => {
    e.preventDefault();
    await handleAiButtonClick(button, soalText, question);
  });

  return button;
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
  soalText: string,
  question: HTMLElement
): Promise<void> {
  try {
    // Prevent double clicking while request is in progress

    chrome.storage.local.get(["geminiApiKey"], (result) => {
      if (!result.geminiApiKey) {
        showToast(
          "GEMINI API KEY belum diatur, silakan atur di settings",
          "error"
        );
        return;
      }
    });

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

      if (success && response) {
        console.log("AI Response for question:", questionId, response);

        const answerLetter = extractAnswerFromResponse(response);
        if (!answerLetter) {
          showToast("AI tidak memberikan jawaban yang valid", "error");
          setButtonLoadingState(button, false);
          return;
        }

        const selectSuccess = selectAnswerOption(question, answerLetter);
        if (selectSuccess) {
          showToast(`Done jawaban: ${answerLetter.toUpperCase()}`, "success");
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
          question: soalText,
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
