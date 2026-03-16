/**
 * Inject a "Copy Question" button on HackerRank contest challenge pages.
 */

const HACKERRANK_CONTEST_CHALLENGE_REGEX =
  /^https?:\/\/(www\.)?hackerrank\.com\/contests\/[^/]+\/challenges\/[^/?#]+/i;

export function initHackerRankCopyQuestion(tabId: number, url: string): void {
  if (!HACKERRANK_CONTEST_CHALLENGE_REGEX.test(url)) return;

  chrome.scripting.executeScript({
    target: { tabId },
    func: injectHackerRankCopyQuestionButton,
    args: [tabId],
  });
}

function injectHackerRankCopyQuestionButton(tabId: number): void {
  const COPY_BUTTON_ID = "siapdips-copy-question-btn";
  const AI_BUTTON_ID = "siapdips-answer-ai-btn";
  const OBSERVER_KEY = "__siapDipsHackerRankCopyQuestionObserver";
  const EVENTS_KEY = "__siapDipsHackerRankCopyQuestionEventsBound";
  const TARGET_PATH_REGEX = /\/contests\/[^/]+\/challenges\/[^/?#]+/i;
  const COPY_DEFAULT_LABEL = "Copy Question";
  const AI_DEFAULT_LABEL = "Answer in AI";
  const COPY_ICON_SVG =
    '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M3 18.5v-2h2v2zM3 15v-2h2v2zm0-3.5v-2h2v2zM6.5 22v-2h2v2zM9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm1 4v-2h2v2zm-5 0q-.825 0-1.412-.587T3 20h2zm8.5 0v-2h2q0 .825-.587 1.413T13.5 22M3 8q0-.825.588-1.412T5 6v2z"/></svg>';
  const AI_ICON_SVG =
    '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1m-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1"/></svg>';
  const PRIMARY_CONTAINER_SELECTOR =
    "#codeshell-wrapper > div.clearfix.grey-header.fixed-hand0.cap.plL.plR.psT.psB > div.pull-right > div.inline.large.lines.inverse.pull-right.msT.msL";
  const API_URL = "http://localhost:8317/v1/chat/completions";
  const MODEL = "gpt-5.3-codex";
  const PYTHON_SYSTEM_PROMPT = `
You are a coding assistant that solves programming problems in my exact preferred Python style.

Your job is not just to solve correctly, but to write code that looks like how I would write it in class/lab.

Strict style rules:

- Use plain normal Python
- Use input() only
- Do not use sys.stdin
- Do not use main()
- Do not use classes
- Do not use advanced competitive-programming style unless absolutely necessary
- Keep code simple, direct, and beginner-friendly
- Prefer readability over robustness tricks
- Prefer the simplest correct solution that still fits the constraints
- try not to use any library helper example like dont do "from bisect import bisect_left, bisect_right"

Very important coding style preferences:

- Prefer short and familiar variable names like:
  - n, m, q
  - arr
  - i, j
  - ans, best, total
  - left, right
- Prefer direct input like:
  - n = int(input())
  - arr = list(map(int, input().split()))
- Avoid unnecessary input handling like:
  - input().strip()
  - while len(arr) < n
  - reading in chunks unless really necessary
- Avoid verbose variable names like:
  - first_number
  - second_number
  - ticket_numbers
  - frequency_map
- If a manual helper function fits the style, prefer that, for example:
  - maxManual(a, b)
  - minManual(a, b)
  - manualSum(arr)
- Prefer simple sentinel values like:
  - best = -1
  - ans = 0
- Avoid using None if -1 or another simple value is enough
- Avoid over-engineered safe code

Avoid these unless the problem truly requires them:

- bitwise / bitmask
- memoization
- DP
- binary lifting
- segment tree
- advanced math shortcuts
- tricky Python one-liners
- overly compact code
- unnecessary dictionaries or sets if a simple loop solution is acceptable for the constraints

When choosing the solution:
- First prefer the simplest method
- Only use a more optimized method if the simple one would clearly be too slow
- Even when optimization is needed, keep the code as beginner-friendly as possible
- Do not add extra robustness that is not needed by the problem statement

Output rules:
- Give me code only
- No explanation
- No headings
- No comments unless I explicitly ask
- No text before or after the code
- No markdown code fences

Match this style as closely as possible:

def maxManual(a, b):
    if a > b:
        return a
    return b


n = int(input())
target = int(input())
arr = list(map(int, input().split()))

best = -1

for i in range(n):
    for j in range(i + 1, n):
        if arr[i] + arr[j] == target:
            product = arr[i] * arr[j]
            best = maxManual(best, product)

print(best)

Important:
- The example above is a style reference, not always the exact algorithm to use
- Copy the writing style, naming style, and simplicity level
- If constraints require a faster approach, still write it in this same simple style
- MAKE IT BAHASA INDONESIA santai gaul anak santai
`.trim();
  const GENERIC_SYSTEM_PROMPT = `
You are a competitive programming coding assistant.

Solve the given problem and return code only.

Rules:
- Follow the requested target language exactly.
- Use clear, correct, contest-appropriate code for that language.
- Use only standard library unless explicitly required.
- Do not include explanations, headings, comments, or markdown fences.
- Do not include any text before or after the code.
`.trim();

  type WindowWithState = Window & {
    [OBSERVER_KEY]?: MutationObserver;
    [EVENTS_KEY]?: boolean;
  };

  const stateWindow = window as WindowWithState;

  const mountSelectors = [
    PRIMARY_CONTAINER_SELECTOR,
    "#codeshell-wrapper .grey-header .pull-right .inline.large.lines.inverse.pull-right.msT.msL",
    "#codeshell-wrapper .grey-header .pull-right .inline.large.lines.inverse.pull-right",
    "#codeshell-wrapper .grey-header .pull-right",
    "#codeshell-wrapper .grey-header",
  ];

  const questionSelectors = [
    "#problem-statement",
    ".challenge-body-html",
    ".problem-statement",
    ".challenge_problem_statement",
    "[data-analytics='ProblemStatement']",
    ".challenge-view-body",
    ".challenge-statement",
    ".challenge-body",
  ];

  const isTargetPath = () => TARGET_PATH_REGEX.test(window.location.pathname);

  const normalizeText = (value: string): string =>
    value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();

  const cleanText = (text: string): string =>
    text
      .replace(/\r/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();

  const findMountContainer = (): HTMLElement | null => {
    for (const selector of mountSelectors) {
      const element = document.querySelector<HTMLElement>(selector);
      if (element) return element;
    }
    return null;
  };

  const getQuestionText = (): string => {
    for (const selector of questionSelectors) {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) continue;

      const text = normalizeText(element.innerText || element.textContent || "");
      if (text.length > 20) return text;
    }
    return "";
  };

  const getSelectedLanguage = (): { value: string; label: string } => {
    const select = document.querySelector<HTMLSelectElement>("#select-lang");
    if (select) {
      const value = (select.value || "").trim();
      const label =
        select.selectedOptions?.[0]?.textContent?.trim() || value || "unknown";
      return { value, label };
    }

    const raw = document.querySelector<HTMLElement>("#select-lang") as
      | (HTMLElement & { value?: string })
      | null;
    const value = (raw?.value || "").trim();
    return { value, label: value || "unknown" };
  };

  const buildSystemPrompt = (languageLabel: string): string => {
    const normalized = languageLabel.toLowerCase();
    if (normalized.includes("python") || normalized.startsWith("py")) {
      return PYTHON_SYSTEM_PROMPT;
    }

    return [
      GENERIC_SYSTEM_PROMPT,
      "",
      `Target language: ${languageLabel}`,
      "Return solution strictly in this target language.",
    ].join("\n");
  };

  const extractProblemText = (): string => {
    const rootSelectors = [
      "#content > div > div > section > div > div.challenge-body-elements-problem.challenge-container-element > div.challenge-content > div > div > div",
      ".problem-statement",
      ".challenge-content",
    ];

    const root =
      rootSelectors
        .map((selector) => document.querySelector<HTMLElement>(selector))
        .find(Boolean) || null;

    if (!root) return "";

    const clone = root.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("style, script, svg, defs").forEach((el) => el.remove());

    const sections: Array<[string, string]> = [
      ["Problem Statement", ".challenge_problem_statement"],
      ["Input Format", ".challenge_input_format"],
      ["Constraints", ".challenge_constraints"],
      ["Output Format", ".challenge_output_format"],
      ["Sample Input", ".challenge_sample_input"],
      ["Sample Output", ".challenge_sample_output"],
      ["Explanation", ".challenge_explanation"],
    ];

    const parts: string[] = [];

    for (const [title, selector] of sections) {
      const sectionElement = clone.querySelector<HTMLElement>(selector);
      if (!sectionElement) continue;

      const temp = sectionElement.cloneNode(true) as HTMLElement;
      temp.querySelectorAll("style, script, svg, defs").forEach((el) => el.remove());

      const preTexts = Array.from(temp.querySelectorAll("pre"))
        .map((pre) => (pre.innerText || pre.textContent || "").trim())
        .filter(Boolean);

      temp.querySelectorAll("pre").forEach((pre) => pre.remove());

      const normalText = cleanText(temp.innerText || temp.textContent || "");
      const sectionText = cleanText(
        [normalText, ...preTexts].filter(Boolean).join("\n\n")
      );

      if (sectionText) {
        parts.push(`${title}\n${sectionText}`);
      }
    }

    if (parts.length > 0) {
      return cleanText(parts.join("\n\n"));
    }

    return cleanText(clone.innerText || clone.textContent || "");
  };

  const extractCodeOnly = (text: string): string => {
    if (!text) return "";
    const fenced = text.match(/```(?:[\w#+.-]+)?\s*([\s\S]*?)```/i);
    if (fenced && fenced[1]) {
      return fenced[1].trim();
    }
    return text.trim();
  };

  const setButtonLabelTemporarily = (
    button: HTMLButtonElement,
    label: string,
    defaultLabel: string,
    durationMs = 1500
  ) => {
    const labelLower = label.toLowerCase();
    button.title = `${defaultLabel} (${label})`;
    button.setAttribute("aria-label", `${defaultLabel} (${label})`);

    if (labelLower.includes("fail")) {
      button.style.color = "#fca5a5";
    } else if (
      labelLower.includes("copied") ||
      labelLower.includes("inserted")
    ) {
      button.style.color = "#86efac";
    } else {
      button.style.color = "inherit";
    }

    window.setTimeout(() => {
      if (button.dataset.busy === "1") return;
      button.title = defaultLabel;
      button.setAttribute("aria-label", defaultLabel);
      button.style.color = "inherit";
    }, durationMs);
  };

  const copyViaTextareaFallback = (text: string): boolean => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.setAttribute("readonly", "true");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      textArea.style.pointerEvents = "none";
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textArea);
      return copied;
    } catch (error) {
      console.warn("[SiapDips] HackerRank copy fallback failed:", error);
      return false;
    }
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.warn("[SiapDips] Clipboard API copy failed:", error);
      }
    }

    return copyViaTextareaFallback(text);
  };

  const requestEditorCodeInsert = (
    code: string
  ): Promise<{ ok: boolean; via: "monaco" | "codemirror" | "textarea" | "none" }> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          type: "hackerrankSetEditorCode",
          tabId,
          code,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.warn(
              "[SiapDips][AI] Insert request failed:",
              chrome.runtime.lastError.message
            );
            resolve({ ok: false, via: "none" });
            return;
          }

          const result = response as
            | { ok?: boolean; via?: "monaco" | "codemirror" | "textarea" | "none" }
            | undefined;

          resolve({
            ok: Boolean(result?.ok),
            via: result?.via ?? "none",
          });
        }
      );
    });
  };

  const askModel = async (
    problemText: string,
    languageLabel: string
  ): Promise<string> => {
    const systemPrompt = buildSystemPrompt(languageLabel);
    const userPrompt = `
Solve this programming problem.

${problemText}

Target language: ${languageLabel}

Return code only.
`.trim();

    const controller = new AbortController();
    const timeoutMs = 45000;
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.2,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      return data?.choices?.[0]?.message?.content || "";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(
          `Request timeout after ${Math.floor(timeoutMs / 1000)}s`
        );
      }
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const applyBaseButtonStyles = (button: HTMLButtonElement): void => {
    button.style.marginLeft = "8px";
    button.style.padding = "4px";
    button.style.width = "32px";
    button.style.height = "32px";
    button.style.display = "inline-flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.border = "1px solid rgba(255,255,255,0.35)";
    button.style.borderRadius = "6px";
    button.style.background = "transparent";
    button.style.color = "inherit";
    button.style.cursor = "pointer";
    button.style.lineHeight = "1";
    button.style.transition = "opacity 0.2s ease";

    button.addEventListener("mouseenter", () => {
      button.style.opacity = "0.85";
    });
    button.addEventListener("mouseleave", () => {
      button.style.opacity = "1";
    });
  };

  const setButtonIcon = (
    button: HTMLButtonElement,
    svgMarkup: string,
    label: string
  ): void => {
    button.innerHTML = svgMarkup;
    button.title = label;
    button.setAttribute("aria-label", label);

    const svg = button.querySelector<SVGElement>("svg");
    if (svg) {
      svg.style.width = "18px";
      svg.style.height = "18px";
      svg.style.display = "block";
      svg.style.pointerEvents = "none";
    }
  };

  const createCopyButton = (): HTMLButtonElement => {
    const button = document.createElement("button");
    button.id = COPY_BUTTON_ID;
    button.type = "button";
    setButtonIcon(button, COPY_ICON_SVG, COPY_DEFAULT_LABEL);
    applyBaseButtonStyles(button);

    button.addEventListener("click", async () => {
      const questionText = getQuestionText();
      if (!questionText) {
        setButtonLabelTemporarily(button, "Failed", COPY_DEFAULT_LABEL);
        return;
      }

      const copied = await copyToClipboard(questionText);
      setButtonLabelTemporarily(
        button,
        copied ? "Copied!" : "Failed",
        COPY_DEFAULT_LABEL
      );
    });

    return button;
  };

  const createAiAnswerButton = (): HTMLButtonElement => {
    const button = document.createElement("button");
    button.id = AI_BUTTON_ID;
    button.type = "button";
    setButtonIcon(button, AI_ICON_SVG, AI_DEFAULT_LABEL);
    applyBaseButtonStyles(button);

    button.addEventListener("click", async () => {
      if (button.dataset.busy === "1") return;

      button.dataset.busy = "1";
      button.title = `${AI_DEFAULT_LABEL} (Generating...)`;
      button.setAttribute("aria-label", `${AI_DEFAULT_LABEL} (Generating...)`);
      button.style.color = "#93c5fd";
      button.style.opacity = "0.8";

      try {
        const problemText = extractProblemText();
        if (!problemText) {
          setButtonLabelTemporarily(button, "Failed", AI_DEFAULT_LABEL);
          return;
        }

        const selectedLanguage = getSelectedLanguage();
        const languageLabel = selectedLanguage.label || selectedLanguage.value || "unknown";

        const rawAnswer = await askModel(problemText, languageLabel);
        if (!rawAnswer) {
          setButtonLabelTemporarily(button, "Failed", AI_DEFAULT_LABEL);
          return;
        }
        console.log("[SiapDips][AI] model response received.");

        const code = extractCodeOnly(rawAnswer);
        if (!code) {
          setButtonLabelTemporarily(button, "Failed", AI_DEFAULT_LABEL);
          return;
        }

        const insertResult = await requestEditorCodeInsert(code);
        if (insertResult.ok) {
          console.log("[SiapDips][AI] insert result:", insertResult.via);
          setButtonLabelTemporarily(button, "Inserted!", AI_DEFAULT_LABEL);
          return;
        }

        console.warn("[SiapDips][AI] insert failed, using clipboard fallback.");
        const copied = await copyToClipboard(code);
        setButtonLabelTemporarily(
          button,
          copied ? "Copied" : "Failed",
          AI_DEFAULT_LABEL
        );
      } catch (error) {
        console.error("[SiapDips] Answer in AI error:", error);
        setButtonLabelTemporarily(button, "Failed", AI_DEFAULT_LABEL);
      } finally {
        button.style.opacity = "1";
        button.style.color = "inherit";
        delete button.dataset.busy;
      }
    });

    return button;
  };

  const ensureButtons = (): void => {
    if (!isTargetPath()) return;

    const mountPoint = findMountContainer();
    if (!mountPoint) return;

    const existingCopyButton = document.getElementById(COPY_BUTTON_ID) as
      | HTMLButtonElement
      | null;
    if (existingCopyButton) {
      if (existingCopyButton.parentElement !== mountPoint) {
        mountPoint.appendChild(existingCopyButton);
      }
    } else {
      mountPoint.appendChild(createCopyButton());
    }

    const existingAiButton = document.getElementById(AI_BUTTON_ID) as
      | HTMLButtonElement
      | null;
    if (existingAiButton) {
      if (existingAiButton.parentElement !== mountPoint) {
        mountPoint.appendChild(existingAiButton);
      }
      return;
    }

    mountPoint.appendChild(createAiAnswerButton());
  };

  const removeButtonsIfOutOfScope = (): void => {
    if (isTargetPath()) return;
    const existingCopyButton = document.getElementById(COPY_BUTTON_ID);
    if (existingCopyButton) existingCopyButton.remove();
    const existingAiButton = document.getElementById(AI_BUTTON_ID);
    if (existingAiButton) existingAiButton.remove();
  };

  const onDomMutated = () => {
    removeButtonsIfOutOfScope();
    ensureButtons();
  };

  ensureButtons();

  if (!stateWindow[OBSERVER_KEY] && document.body) {
    stateWindow[OBSERVER_KEY] = new MutationObserver(onDomMutated);
    stateWindow[OBSERVER_KEY]?.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (!stateWindow[EVENTS_KEY]) {
    stateWindow[EVENTS_KEY] = true;
    window.addEventListener("popstate", onDomMutated);
    window.addEventListener("hashchange", onDomMutated);
  }
}
