export const STORAGE_KEY_SEB_HEADER_PROFILE = "sebHeaderProfile";
export const SEB_HEADER_DYNAMIC_RULE_ID = 47021;

export interface SebHeaderProfileDraft {
  fileName: string;
  startUrl: string;
  configKeyHash: string;
}

export interface SebHeaderProfile extends SebHeaderProfileDraft {
  enabled: boolean;
  activatedAt?: string;
  updatedAt?: string;
}

export interface SebGetStatusMessage {
  type: "sebGetStatus";
}

export interface SebActivateProfileMessage {
  type: "sebActivateProfile";
  profile: SebHeaderProfileDraft;
}

export interface SebDeactivateProfileMessage {
  type: "sebDeactivateProfile";
}

export interface SebClearProfileMessage {
  type: "sebClearProfile";
}

export type SebRuntimeMessage =
  | SebGetStatusMessage
  | SebActivateProfileMessage
  | SebDeactivateProfileMessage
  | SebClearProfileMessage;

export interface SebStatusResponse {
  ok: boolean;
  supported: boolean;
  profile?: SebHeaderProfile | null;
  error?: string;
}

export interface ParsedSebConfig {
  startUrl: string;
  configHash: string;
  configKeyHash: string;
  normalizedJson: string;
  data: Record<string, string | number | boolean | []>;
}

export async function parseSebConfigXml(xmlText: string): Promise<ParsedSebConfig> {
  const data = sortSebConfigData(parseSebXmlToRecord(xmlText));
  const startUrl = data.startURL;

  if (typeof startUrl !== "string" || startUrl.trim().length === 0) {
    throw new Error("SEB config is missing a valid startURL.");
  }

  let normalizedStartUrl: string;
  try {
    normalizedStartUrl = new URL(startUrl).toString();
  } catch {
    throw new Error("SEB config startURL is not a valid URL.");
  }

  const normalizedJson = jsonDumpsWithoutWhitespaces(data);
  const configHash = await sha256Hex(normalizedJson);
  const configKeyHash = await sha256Hex(`${normalizedStartUrl}${configHash}`);

  return {
    startUrl: normalizedStartUrl,
    configHash,
    configKeyHash,
    normalizedJson,
    data,
  };
}

export async function createSebHeaderProfileDraft(
  fileName: string,
  xmlText: string
): Promise<SebHeaderProfileDraft> {
  const parsed = await parseSebConfigXml(xmlText);

  return {
    fileName: fileName.trim() || "config.seb",
    startUrl: parsed.startUrl,
    configKeyHash: parsed.configKeyHash,
  };
}

export function isValidSebHeaderProfileDraft(
  value: unknown
): value is SebHeaderProfileDraft {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Partial<SebHeaderProfileDraft>;
  return (
    typeof candidate.fileName === "string" &&
    candidate.fileName.trim().length > 0 &&
    typeof candidate.startUrl === "string" &&
    isValidUrl(candidate.startUrl) &&
    typeof candidate.configKeyHash === "string" &&
    /^[a-f0-9]{64}$/i.test(candidate.configKeyHash)
  );
}

export function normalizeSebHeaderProfile(value: unknown): SebHeaderProfile | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const candidate = value as Partial<SebHeaderProfile>;
  if (!isValidSebHeaderProfileDraft(candidate)) {
    return null;
  }

  return {
    fileName: candidate.fileName.trim(),
    startUrl: new URL(candidate.startUrl).toString(),
    configKeyHash: candidate.configKeyHash.toLowerCase(),
    enabled: Boolean(candidate.enabled),
    activatedAt:
      typeof candidate.activatedAt === "string" ? candidate.activatedAt : undefined,
    updatedAt:
      typeof candidate.updatedAt === "string" ? candidate.updatedAt : undefined,
  };
}

type SebRecordValue = string | number | boolean | [];

type Token =
  | { type: "key"; value: string }
  | { type: "string"; value: string }
  | { type: "integer"; value: number }
  | { type: "true" }
  | { type: "false" }
  | { type: "array" };

function parseSebXmlToRecord(xmlText: string): Record<string, SebRecordValue> {
  const dictContentMatch = xmlText.match(/<dict>([\s\S]*?)<\/dict>/i);
  if (!dictContentMatch) {
    throw new Error("Unsupported SEB config format. Expected a plain XML plist dict.");
  }

  const tokens = tokenizeSebDict(dictContentMatch[1]);
  const data: Record<string, SebRecordValue> = {};
  let pendingKey: string | null = null;

  for (const token of tokens) {
    if (token.type === "key") {
      pendingKey = token.value;
      continue;
    }

    if (!pendingKey) {
      throw new Error("Invalid SEB config structure. Value found before key.");
    }

    switch (token.type) {
      case "true":
        data[pendingKey] = true;
        break;
      case "false":
        data[pendingKey] = false;
        break;
      case "array":
        data[pendingKey] = [];
        break;
      case "string":
        data[pendingKey] = token.value;
        break;
      case "integer":
        data[pendingKey] = token.value;
        break;
    }

    pendingKey = null;
  }

  if (pendingKey) {
    throw new Error(`Invalid SEB config structure. Missing value for key "${pendingKey}".`);
  }

  if (!Object.keys(data).length) {
    throw new Error("SEB config did not contain any supported key/value pairs.");
  }

  return data;
}

function tokenizeSebDict(dictContent: string): Token[] {
  const tokenRegex = /<key>([\s\S]*?)<\/key>|<string>([\s\S]*?)<\/string>|<integer>([\s\S]*?)<\/integer>|<(true|false)\s*\/?>|<array\s*\/?>|<array>\s*<\/array>/gi;
  const tokens: Token[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(dictContent))) {
    const leadingChunk = dictContent.slice(cursor, match.index);
    if (leadingChunk.replace(/\s+/g, "").length > 0) {
      throw new Error("Unsupported SEB config value type detected. Only key, string, integer, boolean, and empty array are supported.");
    }

    cursor = tokenRegex.lastIndex;

    if (match[1] !== undefined) {
      tokens.push({ type: "key", value: decodeXmlEntities(match[1]) });
      continue;
    }

    if (match[2] !== undefined) {
      tokens.push({ type: "string", value: decodeXmlEntities(match[2]) });
      continue;
    }

    if (match[3] !== undefined) {
      const value = Number.parseInt(match[3].trim(), 10);
      if (Number.isNaN(value)) {
        throw new Error("Invalid integer value in SEB config.");
      }
      tokens.push({ type: "integer", value });
      continue;
    }

    if (match[4] === "true") {
      tokens.push({ type: "true" });
      continue;
    }

    if (match[4] === "false") {
      tokens.push({ type: "false" });
      continue;
    }

    tokens.push({ type: "array" });
  }

  const trailingChunk = dictContent.slice(cursor);
  if (trailingChunk.replace(/\s+/g, "").length > 0) {
    throw new Error("Unsupported SEB config content detected. Encrypted or binary .seb files are not supported in v1.");
  }

  return tokens;
}

function sortSebConfigData(data: Record<string, SebRecordValue>): Record<string, SebRecordValue> {
  const ordered: Record<string, SebRecordValue> = {};
  const sortedKeys = Object.keys(data).sort((a, b) => {
    const lowerA = a.toLowerCase();
    const lowerB = b.toLowerCase();
    if (lowerA < lowerB) return -1;
    if (lowerA > lowerB) return 1;
    return 0;
  });

  for (const key of sortedKeys) {
    ordered[key] = data[key];
  }

  return ordered;
}

function jsonDumpsWithoutWhitespaces(data: Record<string, SebRecordValue>): string {
  return JSON.stringify(data).replace(/ /g, "").replace(/\n/g, "");
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, num: string) =>
      String.fromCodePoint(Number.parseInt(num, 10))
    )
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

async function sha256Hex(input: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("Web Crypto API is not available.");
  }

  const digest = await subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
