import { useEffect, useMemo, useState } from "react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  Bot,
  GripHorizontal,
  Loader2,
  Send,
  SettingsIcon,
  Trash2,
} from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import HideButton from "../hideButton";

type MoodleAiProvider = "cliproxy" | "gemini" | "openai_compatible";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ProviderConfig = {
  provider: MoodleAiProvider;
  cliProxyApiUrl: string;
  cliProxyModel: string;
  timeoutMs: number;
  geminiApiKey: string;
  geminiModel: string;
  openAiCompatApiUrl: string;
  openAiCompatApiKey: string;
  openAiCompatModel: string;
  temperature: number;
  maxTokens: number;
  systemPromptOverride: string;
};

type CliProxyMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

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

const DEFAULT_PROVIDER: MoodleAiProvider = "cliproxy";
const DEFAULT_CLI_PROXY_API_URL = "http://localhost:8317/v1/chat/completions";
const DEFAULT_CLI_PROXY_MODEL = "gpt-5.3-codex";
const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
const DEFAULT_OPENAI_COMPAT_API_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_OPENAI_COMPAT_MODEL = "gpt-4o-mini";
const DEFAULT_TEMPERATURE = 0.2;
const DEFAULT_MAX_TOKENS = 1024;
const GEMINI_API_URL_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

const BASE_SYSTEM_PROMPT = `
You are a concise and practical assistant.

Rules:
- Answer directly and clearly.
- Keep output useful and actionable.
- If user asks for code, provide runnable code.
`.trim();

function normalizeTimeout(value: unknown): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number.parseInt(value, 10)
      : Number.NaN;

  if (Number.isNaN(parsed)) return DEFAULT_TIMEOUT_MS;
  return Math.min(Math.max(parsed, 1000), 120000);
}

function normalizeTemperature(value: unknown): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number.parseFloat(value)
      : Number.NaN;

  if (Number.isNaN(parsed)) return DEFAULT_TEMPERATURE;
  return Math.min(Math.max(parsed, 0), 2);
}

function normalizeMaxTokens(value: unknown): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number.parseInt(value, 10)
      : Number.NaN;

  if (Number.isNaN(parsed)) return DEFAULT_MAX_TOKENS;
  return Math.min(Math.max(parsed, 1), 32768);
}

function getEffectiveSystemPrompt(config: ProviderConfig): string {
  const override = config.systemPromptOverride.trim();
  return override || BASE_SYSTEM_PROMPT;
}

async function loadProviderConfig(): Promise<ProviderConfig> {
  const result = await chrome.storage.local.get([
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
  ]);

  const providerRaw = result[STORAGE_KEY_MOODLE_AI_PROVIDER];
  const provider: MoodleAiProvider =
    providerRaw === "gemini" || providerRaw === "openai_compatible"
      ? providerRaw
      : DEFAULT_PROVIDER;

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

  const timeoutMs = normalizeTimeout(
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
    typeof result[STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_URL] === "string" &&
    result[STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_URL].trim()
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

  const temperature = normalizeTemperature(result[STORAGE_KEY_MOODLE_AI_TEMPERATURE]);
  const maxTokens = normalizeMaxTokens(result[STORAGE_KEY_MOODLE_AI_MAX_TOKENS]);
  const systemPromptOverride =
    typeof result[STORAGE_KEY_MOODLE_AI_SYSTEM_PROMPT_OVERRIDE] === "string"
      ? result[STORAGE_KEY_MOODLE_AI_SYSTEM_PROMPT_OVERRIDE].trim()
      : "";

  return {
    provider,
    cliProxyApiUrl,
    cliProxyModel,
    timeoutMs,
    geminiApiKey,
    geminiModel,
    openAiCompatApiUrl,
    openAiCompatApiKey,
    openAiCompatModel,
    temperature,
    maxTokens,
    systemPromptOverride,
  };
}

function toCliProxyMessages(
  history: ChatMessage[],
  systemPrompt: string
): CliProxyMessage[] {
  const mapped: CliProxyMessage[] = history.map((entry) => ({
    role: entry.role === "assistant" ? "assistant" : "user",
    content: entry.content,
  }));

  return [{ role: "system", content: systemPrompt }, ...mapped];
}

async function askCliProxy(
  history: ChatMessage[],
  config: ProviderConfig
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), config.timeoutMs);

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
        messages: toCliProxyMessages(history, getEffectiveSystemPrompt(config)),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`CLIProxy HTTP ${response.status}: ${await response.text()}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("CLIProxy returned empty response.");
    return text;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        `CLIProxy request timeout after ${Math.floor(config.timeoutMs / 1000)}s`
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function toGeminiContents(history: ChatMessage[]) {
  return history.map((entry) => ({
    role: entry.role === "assistant" ? "model" : "user",
    parts: [{ text: entry.content }],
  }));
}

async function askGemini(
  history: ChatMessage[],
  config: ProviderConfig
): Promise<string> {
  if (!config.geminiApiKey) {
    throw new Error("Gemini API key belum diisi. Cek Moodle AI settings.");
  }
  if (!config.geminiModel) {
    throw new Error("Gemini model belum diisi. Cek Moodle AI settings.");
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), config.timeoutMs);

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
            parts: [{ text: getEffectiveSystemPrompt(config) }],
          },
          contents: toGeminiContents(history),
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.maxTokens,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini HTTP ${response.status}: ${await response.text()}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("\n")
        .trim() || "";

    if (!text) throw new Error("Gemini returned empty response.");
    return text;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        `Gemini request timeout after ${Math.floor(config.timeoutMs / 1000)}s`
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function askOpenAiCompatible(
  history: ChatMessage[],
  config: ProviderConfig
): Promise<string> {
  if (!config.openAiCompatApiUrl) {
    throw new Error(
      "OpenAI-compatible API URL belum diisi. Cek Moodle AI settings."
    );
  }
  if (!config.openAiCompatApiKey) {
    throw new Error(
      "OpenAI-compatible API key belum diisi. Cek Moodle AI settings."
    );
  }
  if (!config.openAiCompatModel) {
    throw new Error(
      "OpenAI-compatible model belum diisi. Cek Moodle AI settings."
    );
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(config.openAiCompatApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.openAiCompatApiKey}`,
      },
      body: JSON.stringify({
        model: config.openAiCompatModel,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        messages: toCliProxyMessages(history, getEffectiveSystemPrompt(config)),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI-compatible HTTP ${response.status}: ${await response.text()}`
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("OpenAI-compatible returned empty response.");
    return text;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        `OpenAI-compatible request timeout after ${Math.floor(
          config.timeoutMs / 1000
        )}s`
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function askProvider(
  history: ChatMessage[],
  config: ProviderConfig
): Promise<string> {
  if (config.provider === "gemini") return askGemini(history, config);
  if (config.provider === "openai_compatible")
    return askOpenAiCompatible(history, config);
  return askCliProxy(history, config);
}

const AiChatCard = ({
  listeners,
  attributes,
  id,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
  id?: string;
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [config, setConfig] = useState<ProviderConfig | null>(null);
  const [isConfigLoading, setIsConfigLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsConfigLoading(true);
      const nextConfig = await loadProviderConfig();
      if (!isMounted) return;
      setConfig(nextConfig);
      setIsConfigLoading(false);
    };

    load().catch((error) => {
      console.error("[AiChatCard] failed to load config:", error);
      if (!isMounted) return;
      setIsConfigLoading(false);
    });

    const onStorageChanged: Parameters<typeof chrome.storage.onChanged.addListener>[0] =
      (changes, areaName) => {
        if (areaName !== "local") return;
        if (
          changes[STORAGE_KEY_MOODLE_AI_PROVIDER] ||
          changes[STORAGE_KEY_MOODLE_CLIPROXY_API_URL] ||
          changes[STORAGE_KEY_MOODLE_CLIPROXY_MODEL] ||
          changes[STORAGE_KEY_MOODLE_CLIPROXY_TIMEOUT_MS] ||
          changes[STORAGE_KEY_MOODLE_GEMINI_API_KEY] ||
          changes[STORAGE_KEY_MOODLE_GEMINI_MODEL] ||
          changes[STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_URL] ||
          changes[STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_KEY] ||
          changes[STORAGE_KEY_MOODLE_OPENAI_COMPAT_MODEL] ||
          changes[STORAGE_KEY_MOODLE_AI_TEMPERATURE] ||
          changes[STORAGE_KEY_MOODLE_AI_MAX_TOKENS] ||
          changes[STORAGE_KEY_MOODLE_AI_SYSTEM_PROMPT_OVERRIDE] ||
          changes[LEGACY_STORAGE_KEY_GEMINI_API_KEY]
        ) {
          load().catch((error) => {
            console.error("[AiChatCard] failed to refresh config:", error);
          });
        }
      };

    chrome.storage.onChanged.addListener(onStorageChanged);

    return () => {
      isMounted = false;
      chrome.storage.onChanged.removeListener(onStorageChanged);
    };
  }, []);

  const providerLabel = useMemo(() => {
    if (!config) return "Loading...";
    if (config.provider === "gemini") return "Gemini";
    if (config.provider === "openai_compatible") return "OpenAI-Compatible";
    return "CLIProxy";
  }, [config]);

  const sendMessage = async () => {
    const prompt = input.trim();
    if (!prompt || isSending || !config) return;

    const nextHistory: ChatMessage[] = [
      ...messages,
      { role: "user", content: prompt },
    ];
    setMessages(nextHistory);
    setInput("");
    setIsSending(true);

    try {
      const response = await askProvider(nextHistory, config);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to contact AI provider.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${message}` },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full dark:bg-gray-800 dark:border-gray-700 relative group">
      <HideButton
        id={id || "AiChatCard"}
        classNames="group-hover:flex hidden transition-all duration-300"
      />
      <Button
        variant="ghost"
        size="icon"
        className="w-full h-8 rounded-b-none border border-b-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        {...attributes}
        {...listeners}
      >
        <GripHorizontal className="h-4 w-4" />
      </Button>

      <CardHeader className="py-3">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Chat
          </span>
          <Badge
            variant={
              config?.provider === "cliproxy" ? "secondary" : "default"
            }
          >
            {providerLabel}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="border rounded-md p-2 h-56 overflow-y-auto space-y-2 bg-muted/20">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Start chat. Provider mengikuti Moodle AI settings.
            </p>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`text-sm rounded-md px-3 py-2 w-fit max-w-full whitespace-pre-wrap ${
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "mr-auto bg-secondary text-secondary-foreground"
                }`}
              >
                {message.content}
              </div>
            ))
          )}
          {isSending ? (
            <div className="text-sm rounded-md px-3 py-2 w-fit max-w-full bg-secondary text-secondary-foreground mr-auto flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating...
            </div>
          ) : null}
        </div>

        <Textarea
          rows={3}
          placeholder={
            isConfigLoading
              ? "Loading AI config..."
              : "Type your message... (Enter to send, Shift+Enter for newline)"
          }
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={isSending || isConfigLoading || !config}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
        />

        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isSending || isConfigLoading || !config}
            className="col-span-1"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
          <Button
            variant="secondary"
            onClick={() => setMessages([])}
            disabled={messages.length === 0 || isSending}
            className="col-span-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button
            variant="outline"
            className="col-span-1"
            onClick={() => {
              chrome.tabs.create({
                url: chrome.runtime.getURL("option.html#moodleHelper"),
              });
            }}
          >
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiChatCard;
