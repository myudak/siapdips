/**
 * Runtime message event listener
 */

import {
  closeAllSuspendedTabs,
  SuspendAllThoseTabsNow,
  CloseThoseTabsNow,
} from "../utils/tab-suspender";

export function initMessageListener(): void {
  chrome.runtime.onMessage.addListener(handleMessage);
}

type MessageType =
  | "closeAllSuspendedTabsNow"
  | "suspendAllTabsNow"
  | "closeAllTabsNow"
  | "hackerrankSetEditorCode";

interface RuntimeMessage {
  type?: MessageType;
  tabId?: number;
  code?: string;
}

interface EditorInsertResult {
  ok: boolean;
  via: "monaco" | "codemirror" | "textarea" | "none";
}

function handleMessage(
  message: RuntimeMessage,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
): boolean | void {
  if (message.type === "closeAllSuspendedTabsNow") {
    closeAllSuspendedTabs();
  }
  if (message.type === "suspendAllTabsNow") {
    SuspendAllThoseTabsNow();
  }
  if (message.type === "closeAllTabsNow") {
    CloseThoseTabsNow();
  }

  if (message.type === "hackerrankSetEditorCode") {
    if (typeof message.tabId !== "number" || typeof message.code !== "string") {
      sendResponse({ ok: false, via: "none" } satisfies EditorInsertResult);
      return;
    }

    insertCodeInMainWorld(message.tabId, message.code)
      .then((result) => sendResponse(result))
      .catch((error) => {
        console.warn("[SiapDips][AI] MAIN world insert request failed:", error);
        sendResponse({ ok: false, via: "none" } satisfies EditorInsertResult);
      });

    return true;
  }
}

async function insertCodeInMainWorld(
  tabId: number,
  code: string
): Promise<EditorInsertResult> {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      func: setHackerRankEditorCodeInMainWorld,
      args: [code],
    });

    const result = results[0]?.result as EditorInsertResult | undefined;
    if (
      result &&
      typeof result.ok === "boolean" &&
      typeof result.via === "string"
    ) {
      return result;
    }
  } catch (error) {
    console.warn("[SiapDips][AI] executeScript MAIN failed:", error);
  }

  return { ok: false, via: "none" };
}

function setHackerRankEditorCodeInMainWorld(code: string): EditorInsertResult {
  const setMonacoCode = (): EditorInsertResult => {
    try {
      const w = window as unknown as {
        monaco?: {
          editor?: {
            getEditors?: () => Array<{
              getModel?: () => { setValue: (v: string) => void } | null;
              focus?: () => void;
            }>;
            getModels?: () => Array<{ setValue: (v: string) => void }>;
          };
        };
      };

      const monacoApi = w.monaco?.editor;
      const editors = monacoApi?.getEditors?.() || [];
      const firstEditor = editors[0];
      const model = firstEditor?.getModel?.();

      if (model) {
        model.setValue(code);
        firstEditor?.focus?.();
        return { ok: true, via: "monaco" };
      }

      const models = monacoApi?.getModels?.() || [];
      if (models.length > 0) {
        models[0].setValue(code);
        firstEditor?.focus?.();
        return { ok: true, via: "monaco" };
      }
    } catch (error) {
      console.warn("[SiapDips][AI] Monaco insert failed:", error);
    }

    return { ok: false, via: "none" };
  };

  const setCodeMirrorCode = (): EditorInsertResult => {
    try {
      const editors = Array.from(
        document.querySelectorAll(".CodeMirror")
      ) as Array<
        Element & {
          CodeMirror?: {
            setValue: (v: string) => void;
            refresh?: () => void;
            focus?: () => void;
          };
        }
      >;

      for (const editorElement of editors) {
        if (!editorElement?.CodeMirror) continue;
        editorElement.CodeMirror.focus?.();
        editorElement.CodeMirror.setValue(code);
        editorElement.CodeMirror.refresh?.();
        return { ok: true, via: "codemirror" };
      }
    } catch (error) {
      console.warn("[SiapDips][AI] CodeMirror insert failed:", error);
    }

    return { ok: false, via: "none" };
  };

  const setTextareaCode = (): EditorInsertResult => {
    try {
      const textarea = document.querySelector<HTMLTextAreaElement>("#codeview");
      if (!textarea) return { ok: false, via: "none" };

      textarea.value = code;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.dispatchEvent(new Event("change", { bubbles: true }));
      return { ok: true, via: "textarea" };
    } catch (error) {
      console.warn("[SiapDips][AI] Textarea insert failed:", error);
      return { ok: false, via: "none" };
    }
  };

  const monacoResult = setMonacoCode();
  if (monacoResult.ok) return monacoResult;

  const codeMirrorResult = setCodeMirrorCode();
  if (codeMirrorResult.ok) return codeMirrorResult;

  const textareaResult = setTextareaCode();
  if (textareaResult.ok) return textareaResult;

  return { ok: false, via: "none" };
}
