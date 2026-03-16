import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MoodleAiProvider = "cliproxy" | "gemini" | "openai_compatible";

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
const DEFAULT_CLI_PROXY_TIMEOUT_MS = 30000;
const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
const DEFAULT_OPENAI_COMPAT_API_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_OPENAI_COMPAT_MODEL = "gpt-4o-mini";
const DEFAULT_TEMPERATURE = 0.2;
const DEFAULT_MAX_TOKENS = 1024;

const CUSTOM_MODEL_VALUE = "__custom__";
const GEMINI_MODEL_PRESETS =  [
    "gemini-3.1-pro-preview",
    "gemini-3.1-flash-lite-preview",
    "gemini-3-flash-preview",
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-2.0-pro-exp-02-05",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.0-pro"
  ];
const OPENAI_COMPAT_MODEL_PRESETS = [
  "gpt-4o-mini",
  "gpt-4.1-mini",
  "gpt-4o",
  "llama-3.1-70b-instruct",
  "deepseek-chat",
];

function normalizeTimeout(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_CLI_PROXY_TIMEOUT_MS;
  return Math.min(Math.max(value, 1000), 120000);
}

function normalizeTemperature(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_TEMPERATURE;
  return Math.min(Math.max(value, 0), 2);
}

function normalizeMaxTokens(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_MAX_TOKENS;
  return Math.min(Math.max(value, 1), 32768);
}

function resolveModelState(savedModel: string, presets: string[], fallback: string) {
  const normalized = savedModel.trim() || fallback;
  if (presets.includes(normalized)) {
    return {
      preset: normalized,
      custom: "",
    };
  }

  return {
    preset: CUSTOM_MODEL_VALUE,
    custom: normalized,
  };
}

const SettingMoodle = () => {
  const [provider, setProvider] = useState<MoodleAiProvider>(DEFAULT_PROVIDER);
  const [cliProxyApiUrl, setCliProxyApiUrl] = useState<string>(
    DEFAULT_CLI_PROXY_API_URL
  );
  const [cliProxyModel, setCliProxyModel] = useState<string>(
    DEFAULT_CLI_PROXY_MODEL
  );
  const [cliProxyTimeoutMs, setCliProxyTimeoutMs] = useState<number>(
    DEFAULT_CLI_PROXY_TIMEOUT_MS
  );

  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [geminiModelPreset, setGeminiModelPreset] = useState<string>(
    DEFAULT_GEMINI_MODEL
  );
  const [geminiCustomModel, setGeminiCustomModel] = useState<string>("");
  const [showGeminiApiKey, setShowGeminiApiKey] = useState<boolean>(false);

  const [openAiCompatApiUrl, setOpenAiCompatApiUrl] = useState<string>(
    DEFAULT_OPENAI_COMPAT_API_URL
  );
  const [openAiCompatApiKey, setOpenAiCompatApiKey] = useState<string>("");
  const [openAiCompatModelPreset, setOpenAiCompatModelPreset] =
    useState<string>(DEFAULT_OPENAI_COMPAT_MODEL);
  const [openAiCompatCustomModel, setOpenAiCompatCustomModel] =
    useState<string>("");
  const [showOpenAiCompatApiKey, setShowOpenAiCompatApiKey] =
    useState<boolean>(false);

  const [temperature, setTemperature] = useState<number>(DEFAULT_TEMPERATURE);
  const [maxTokens, setMaxTokens] = useState<number>(DEFAULT_MAX_TOKENS);
  const [systemPromptOverride, setSystemPromptOverride] = useState<string>("");

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const selectedGeminiModel =
    geminiModelPreset === CUSTOM_MODEL_VALUE
      ? geminiCustomModel.trim()
      : geminiModelPreset;
  const selectedOpenAiCompatModel =
    openAiCompatModelPreset === CUSTOM_MODEL_VALUE
      ? openAiCompatCustomModel.trim()
      : openAiCompatModelPreset;

  useEffect(() => {
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
        const loadedProvider: MoodleAiProvider =
          providerRaw === "gemini" || providerRaw === "openai_compatible"
            ? providerRaw
            : DEFAULT_PROVIDER;
        setProvider(loadedProvider);

        const apiUrlRaw = result[STORAGE_KEY_MOODLE_CLIPROXY_API_URL];
        setCliProxyApiUrl(
          typeof apiUrlRaw === "string" && apiUrlRaw.trim()
            ? apiUrlRaw.trim()
            : DEFAULT_CLI_PROXY_API_URL
        );

        const modelRaw = result[STORAGE_KEY_MOODLE_CLIPROXY_MODEL];
        setCliProxyModel(
          typeof modelRaw === "string" && modelRaw.trim()
            ? modelRaw.trim()
            : DEFAULT_CLI_PROXY_MODEL
        );

        const timeoutRaw = result[STORAGE_KEY_MOODLE_CLIPROXY_TIMEOUT_MS];
        const timeoutNum =
          typeof timeoutRaw === "number"
            ? timeoutRaw
            : typeof timeoutRaw === "string"
            ? Number.parseInt(timeoutRaw, 10)
            : DEFAULT_CLI_PROXY_TIMEOUT_MS;
        setCliProxyTimeoutMs(normalizeTimeout(timeoutNum));

        const moodleGeminiKeyRaw = result[STORAGE_KEY_MOODLE_GEMINI_API_KEY];
        const legacyGeminiKeyRaw = result[LEGACY_STORAGE_KEY_GEMINI_API_KEY];
        const moodleGeminiKey =
          typeof moodleGeminiKeyRaw === "string"
            ? moodleGeminiKeyRaw.trim()
            : "";
        const legacyGeminiKey =
          typeof legacyGeminiKeyRaw === "string"
            ? legacyGeminiKeyRaw.trim()
            : "";
        const geminiKey = moodleGeminiKey || legacyGeminiKey || "";
        setGeminiApiKey(geminiKey);

        if (!moodleGeminiKey && legacyGeminiKey) {
          chrome.storage.local.set({
            [STORAGE_KEY_MOODLE_GEMINI_API_KEY]: legacyGeminiKey,
          });
        }

        const geminiModelRaw = result[STORAGE_KEY_MOODLE_GEMINI_MODEL];
        const geminiModel =
          typeof geminiModelRaw === "string" && geminiModelRaw.trim()
            ? geminiModelRaw.trim()
            : DEFAULT_GEMINI_MODEL;
        const geminiModelState = resolveModelState(
          geminiModel,
          GEMINI_MODEL_PRESETS,
          DEFAULT_GEMINI_MODEL
        );
        setGeminiModelPreset(geminiModelState.preset);
        setGeminiCustomModel(geminiModelState.custom);

        const openAiUrlRaw = result[STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_URL];
        setOpenAiCompatApiUrl(
          typeof openAiUrlRaw === "string" && openAiUrlRaw.trim()
            ? openAiUrlRaw.trim()
            : DEFAULT_OPENAI_COMPAT_API_URL
        );

        const openAiKeyRaw = result[STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_KEY];
        setOpenAiCompatApiKey(
          typeof openAiKeyRaw === "string" ? openAiKeyRaw.trim() : ""
        );

        const openAiModelRaw = result[STORAGE_KEY_MOODLE_OPENAI_COMPAT_MODEL];
        const openAiModel =
          typeof openAiModelRaw === "string" && openAiModelRaw.trim()
            ? openAiModelRaw.trim()
            : DEFAULT_OPENAI_COMPAT_MODEL;
        const openAiModelState = resolveModelState(
          openAiModel,
          OPENAI_COMPAT_MODEL_PRESETS,
          DEFAULT_OPENAI_COMPAT_MODEL
        );
        setOpenAiCompatModelPreset(openAiModelState.preset);
        setOpenAiCompatCustomModel(openAiModelState.custom);

        const temperatureRaw = result[STORAGE_KEY_MOODLE_AI_TEMPERATURE];
        const temperatureNum =
          typeof temperatureRaw === "number"
            ? temperatureRaw
            : typeof temperatureRaw === "string"
            ? Number.parseFloat(temperatureRaw)
            : DEFAULT_TEMPERATURE;
        setTemperature(normalizeTemperature(temperatureNum));

        const maxTokensRaw = result[STORAGE_KEY_MOODLE_AI_MAX_TOKENS];
        const maxTokensNum =
          typeof maxTokensRaw === "number"
            ? maxTokensRaw
            : typeof maxTokensRaw === "string"
            ? Number.parseInt(maxTokensRaw, 10)
            : DEFAULT_MAX_TOKENS;
        setMaxTokens(normalizeMaxTokens(maxTokensNum));

        const systemPromptRaw =
          result[STORAGE_KEY_MOODLE_AI_SYSTEM_PROMPT_OVERRIDE];
        setSystemPromptOverride(
          typeof systemPromptRaw === "string" ? systemPromptRaw : ""
        );
      }
    );
  }, []);

  const settingsStatus = useMemo(() => {
    if (provider === "cliproxy") {
      if (cliProxyApiUrl.trim() && cliProxyModel.trim()) {
        return "✅ CLIProxy configured";
      }
      return "⚠️ CLIProxy belum lengkap";
    }

    if (provider === "gemini") {
      if (!geminiApiKey.trim()) return "❌ Gemini API key belum diisi";
      if (!selectedGeminiModel.trim()) return "❌ Gemini model belum diisi";
      return "✅ Gemini configured";
    }

    if (!openAiCompatApiUrl.trim()) return "❌ OpenAI-compatible URL belum diisi";
    if (!openAiCompatApiKey.trim()) return "❌ OpenAI-compatible API key belum diisi";
    if (!selectedOpenAiCompatModel.trim()) return "❌ OpenAI-compatible model belum diisi";
    return "✅ OpenAI-compatible configured";
  }, [
    provider,
    cliProxyApiUrl,
    cliProxyModel,
    geminiApiKey,
    selectedGeminiModel,
    openAiCompatApiUrl,
    openAiCompatApiKey,
    selectedOpenAiCompatModel,
  ]);

  const handleSaveSettings = () => {
    setIsSaving(true);

    const normalizedTimeout = normalizeTimeout(cliProxyTimeoutMs);
    const normalizedTemperature = normalizeTemperature(temperature);
    const normalizedMaxTokens = normalizeMaxTokens(maxTokens);
    const finalGeminiModel = selectedGeminiModel.trim() || DEFAULT_GEMINI_MODEL;
    const finalOpenAiCompatModel =
      selectedOpenAiCompatModel.trim() || DEFAULT_OPENAI_COMPAT_MODEL;

    chrome.storage.local.set(
      {
        [STORAGE_KEY_MOODLE_AI_PROVIDER]: provider,
        [STORAGE_KEY_MOODLE_CLIPROXY_API_URL]: cliProxyApiUrl.trim(),
        [STORAGE_KEY_MOODLE_CLIPROXY_MODEL]: cliProxyModel.trim(),
        [STORAGE_KEY_MOODLE_CLIPROXY_TIMEOUT_MS]: normalizedTimeout,
        [STORAGE_KEY_MOODLE_GEMINI_API_KEY]: geminiApiKey.trim(),
        [STORAGE_KEY_MOODLE_GEMINI_MODEL]: finalGeminiModel,
        [STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_URL]: openAiCompatApiUrl.trim(),
        [STORAGE_KEY_MOODLE_OPENAI_COMPAT_API_KEY]: openAiCompatApiKey.trim(),
        [STORAGE_KEY_MOODLE_OPENAI_COMPAT_MODEL]: finalOpenAiCompatModel,
        [STORAGE_KEY_MOODLE_AI_TEMPERATURE]: normalizedTemperature,
        [STORAGE_KEY_MOODLE_AI_MAX_TOKENS]: normalizedMaxTokens,
        [STORAGE_KEY_MOODLE_AI_SYSTEM_PROMPT_OVERRIDE]:
          systemPromptOverride.trim(),
        // Keep legacy key for compatibility with old code paths.
        [LEGACY_STORAGE_KEY_GEMINI_API_KEY]: geminiApiKey.trim(),
      },
      () => {
        setCliProxyTimeoutMs(normalizedTimeout);
        setTemperature(normalizedTemperature);
        setMaxTokens(normalizedMaxTokens);
        setIsSaving(false);
        toast.success("Moodle AI settings saved");
      }
    );
  };

  const buildOpenAiCompatHeaders = (apiKey: string) => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
  };

  const testCliProxyConnection = async () => {
    if (!cliProxyApiUrl.trim()) throw new Error("CLIProxy API URL masih kosong.");
    if (!cliProxyModel.trim()) throw new Error("CLIProxy model masih kosong.");

    const response = await fetch(cliProxyApiUrl.trim(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: cliProxyModel.trim(),
        temperature: normalizeTemperature(temperature),
        max_tokens: normalizeMaxTokens(maxTokens),
        messages: [{ role: "user", content: "ping" }],
      }),
    });

    if (!response.ok) {
      throw new Error(`CLIProxy test gagal: HTTP ${response.status}`);
    }
  };

  const testGeminiConnection = async () => {
    if (!geminiApiKey.trim()) throw new Error("Gemini API key masih kosong.");
    if (!selectedGeminiModel.trim()) throw new Error("Gemini model masih kosong.");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        selectedGeminiModel.trim()
      )}:generateContent?key=${encodeURIComponent(geminiApiKey.trim())}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: "ping" }],
            },
          ],
          generationConfig: {
            temperature: normalizeTemperature(temperature),
            maxOutputTokens: normalizeMaxTokens(maxTokens),
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini test gagal: HTTP ${response.status}`);
    }
  };

  const testOpenAiCompatConnection = async () => {
    if (!openAiCompatApiUrl.trim()) {
      throw new Error("OpenAI-compatible API URL masih kosong.");
    }
    if (!openAiCompatApiKey.trim()) {
      throw new Error("OpenAI-compatible API key masih kosong.");
    }
    if (!selectedOpenAiCompatModel.trim()) {
      throw new Error("OpenAI-compatible model masih kosong.");
    }

    const response = await fetch(openAiCompatApiUrl.trim(), {
      method: "POST",
      headers: buildOpenAiCompatHeaders(openAiCompatApiKey.trim()),
      body: JSON.stringify({
        model: selectedOpenAiCompatModel.trim(),
        temperature: normalizeTemperature(temperature),
        max_tokens: normalizeMaxTokens(maxTokens),
        messages: [{ role: "user", content: "ping" }],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI-compatible test gagal: HTTP ${response.status}`);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      if (provider === "cliproxy") {
        await testCliProxyConnection();
        toast.success("CLIProxy connection OK");
      } else if (provider === "gemini") {
        await testGeminiConnection();
        toast.success("Gemini connection OK");
      } else {
        await testOpenAiCompatConnection();
        toast.success("OpenAI-compatible connection OK");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Connection test gagal"
      );
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Moodle AI Settings</CardTitle>
        <CardDescription>
          Pilih provider AI + tuning model untuk Moodle helper dan popup AI Chat.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="moodle-ai-provider">Active Provider</Label>
          <Select
            value={provider}
            onValueChange={(value) => setProvider(value as MoodleAiProvider)}
          >
            <SelectTrigger id="moodle-ai-provider" className="w-full">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cliproxy">CLIProxy (Local)</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
              <SelectItem value="openai_compatible">
                OpenAI-Compatible
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {provider === "cliproxy" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="moodle-cliproxy-url">CLIProxy API URL</Label>
              <Input
                id="moodle-cliproxy-url"
                value={cliProxyApiUrl}
                onChange={(e) => setCliProxyApiUrl(e.target.value)}
                placeholder={DEFAULT_CLI_PROXY_API_URL}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moodle-cliproxy-model">CLIProxy Model</Label>
              <Input
                id="moodle-cliproxy-model"
                value={cliProxyModel}
                onChange={(e) => setCliProxyModel(e.target.value)}
                placeholder={DEFAULT_CLI_PROXY_MODEL}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moodle-cliproxy-timeout">
                Request Timeout (ms)
              </Label>
              <Input
                id="moodle-cliproxy-timeout"
                type="number"
                min={1000}
                max={120000}
                value={cliProxyTimeoutMs}
                onChange={(e) =>
                  setCliProxyTimeoutMs(
                    normalizeTimeout(Number.parseInt(e.target.value, 10))
                  )
                }
              />
            </div>
          </>
        ) : null}

        {provider === "gemini" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="moodle-gemini-api-key">Gemini API Key</Label>
              <div className="relative">
                <Input
                  id="moodle-gemini-api-key"
                  type={showGeminiApiKey ? "text" : "password"}
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIza..."
                  autoComplete="off"
                  spellCheck={false}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiApiKey((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showGeminiApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gemini Model</Label>
              <Select
                value={geminiModelPreset}
                onValueChange={(value) => setGeminiModelPreset(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {GEMINI_MODEL_PRESETS.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                  <SelectItem value={CUSTOM_MODEL_VALUE}>Custom...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {geminiModelPreset === CUSTOM_MODEL_VALUE ? (
              <div className="space-y-2">
                <Label htmlFor="moodle-gemini-custom-model">
                  Custom Gemini Model
                </Label>
                <Input
                  id="moodle-gemini-custom-model"
                  value={geminiCustomModel}
                  onChange={(e) => setGeminiCustomModel(e.target.value)}
                  placeholder="gemini-2.5-pro"
                />
              </div>
            ) : null}
          </>
        ) : null}

        {provider === "openai_compatible" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="moodle-openai-api-url">
                OpenAI-Compatible API URL
              </Label>
              <Input
                id="moodle-openai-api-url"
                value={openAiCompatApiUrl}
                onChange={(e) => setOpenAiCompatApiUrl(e.target.value)}
                placeholder={DEFAULT_OPENAI_COMPAT_API_URL}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moodle-openai-api-key">
                OpenAI-Compatible API Key
              </Label>
              <div className="relative">
                <Input
                  id="moodle-openai-api-key"
                  type={showOpenAiCompatApiKey ? "text" : "password"}
                  value={openAiCompatApiKey}
                  onChange={(e) => setOpenAiCompatApiKey(e.target.value)}
                  placeholder="sk-..."
                  autoComplete="off"
                  spellCheck={false}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenAiCompatApiKey((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showOpenAiCompatApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>OpenAI-Compatible Model</Label>
              <Select
                value={openAiCompatModelPreset}
                onValueChange={(value) => setOpenAiCompatModelPreset(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {OPENAI_COMPAT_MODEL_PRESETS.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                  <SelectItem value={CUSTOM_MODEL_VALUE}>Custom...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {openAiCompatModelPreset === CUSTOM_MODEL_VALUE ? (
              <div className="space-y-2">
                <Label htmlFor="moodle-openai-custom-model">
                  Custom OpenAI-Compatible Model
                </Label>
                <Input
                  id="moodle-openai-custom-model"
                  value={openAiCompatCustomModel}
                  onChange={(e) => setOpenAiCompatCustomModel(e.target.value)}
                  placeholder="qwen/qwen3-coder"
                />
              </div>
            ) : null}
          </>
        ) : null}

        <div className="rounded-md border p-3 space-y-3">
          <p className="text-sm font-medium">Advanced Generation Settings</p>
          <div className="space-y-2">
            <Label htmlFor="moodle-ai-temperature">Temperature (0 - 2)</Label>
            <Input
              id="moodle-ai-temperature"
              type="number"
              step="0.1"
              min={0}
              max={2}
              value={temperature}
              onChange={(e) =>
                setTemperature(
                  normalizeTemperature(Number.parseFloat(e.target.value))
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="moodle-ai-max-tokens">Max Tokens</Label>
            <Input
              id="moodle-ai-max-tokens"
              type="number"
              min={1}
              max={32768}
              value={maxTokens}
              onChange={(e) =>
                setMaxTokens(
                  normalizeMaxTokens(Number.parseInt(e.target.value, 10))
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="moodle-ai-system-prompt-override">
              System Prompt Override (Optional)
            </Label>
            <Textarea
              id="moodle-ai-system-prompt-override"
              rows={4}
              value={systemPromptOverride}
              onChange={(e) => setSystemPromptOverride(e.target.value)}
              placeholder="Tambahan instruksi global untuk chat + auto answer..."
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex-1"
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">Status: {settingsStatus}</div>
      </CardContent>
    </Card>
  );
};

export default SettingMoodle;
