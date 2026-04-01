import {
  SEB_HEADER_DYNAMIC_RULE_ID,
  STORAGE_KEY_SEB_HEADER_PROFILE,
  isValidSebHeaderProfileDraft,
  normalizeSebHeaderProfile,
  type SebHeaderProfile,
  type SebHeaderProfileDraft,
  type SebStatusResponse,
} from "@/lib/seb/shared";

export function isSebHeaderRewriteSupported(): boolean {
  return Boolean(
    chrome.declarativeNetRequest?.updateDynamicRules &&
      chrome.declarativeNetRequest?.getDynamicRules
  );
}

export async function getSebHeaderStatus(): Promise<SebStatusResponse> {
  return {
    ok: true,
    supported: isSebHeaderRewriteSupported(),
    profile: await getStoredSebHeaderProfile(),
  };
}

export async function activateSebHeaderProfile(
  draft: SebHeaderProfileDraft
): Promise<SebHeaderProfile> {
  if (!isSebHeaderRewriteSupported()) {
    throw new Error("SEB header rewriting is only supported in the Chromium build.");
  }

  if (!isValidSebHeaderProfileDraft(draft)) {
    throw new Error("Invalid SEB profile draft.");
  }

  const current = await getStoredSebHeaderProfile();
  const now = new Date().toISOString();
  const nextProfile: SebHeaderProfile = {
    fileName: draft.fileName.trim(),
    startUrl: new URL(draft.startUrl).toString(),
    configKeyHash: draft.configKeyHash.toLowerCase(),
    enabled: true,
    activatedAt: current?.activatedAt ?? now,
    updatedAt: now,
  };

  await applySebHeaderRule(nextProfile);
  await chrome.storage.local.set({
    [STORAGE_KEY_SEB_HEADER_PROFILE]: nextProfile,
  });

  return nextProfile;
}

export async function deactivateSebHeaderProfile(): Promise<SebHeaderProfile | null> {
  const current = await getStoredSebHeaderProfile();
  await removeSebHeaderRule();

  if (!current) {
    return null;
  }

  const nextProfile: SebHeaderProfile = {
    ...current,
    enabled: false,
    updatedAt: new Date().toISOString(),
  };

  await chrome.storage.local.set({
    [STORAGE_KEY_SEB_HEADER_PROFILE]: nextProfile,
  });

  return nextProfile;
}

export async function clearSebHeaderProfile(): Promise<void> {
  await removeSebHeaderRule();
  await chrome.storage.local.remove(STORAGE_KEY_SEB_HEADER_PROFILE);
}

export async function restoreSebHeaderRuleFromStorage(): Promise<void> {
  if (!isSebHeaderRewriteSupported()) {
    return;
  }

  const profile = await getStoredSebHeaderProfile();
  if (!profile?.enabled) {
    await removeSebHeaderRule();
    return;
  }

  await applySebHeaderRule(profile);
}

async function getStoredSebHeaderProfile(): Promise<SebHeaderProfile | null> {
  const result = await chrome.storage.local.get(STORAGE_KEY_SEB_HEADER_PROFILE);
  return normalizeSebHeaderProfile(result[STORAGE_KEY_SEB_HEADER_PROFILE]);
}

async function applySebHeaderRule(profile: SebHeaderProfile): Promise<void> {
  if (!isSebHeaderRewriteSupported()) {
    return;
  }

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [SEB_HEADER_DYNAMIC_RULE_ID],
    addRules: [buildSebHeaderRule(profile)],
  });
}

async function removeSebHeaderRule(): Promise<void> {
  if (!isSebHeaderRewriteSupported()) {
    return;
  }

  const rules = await chrome.declarativeNetRequest.getDynamicRules();
  const hasRule = rules.some((rule) => rule.id === SEB_HEADER_DYNAMIC_RULE_ID);
  if (!hasRule) {
    return;
  }

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [SEB_HEADER_DYNAMIC_RULE_ID],
  });
}

function buildSebHeaderRule(
  profile: SebHeaderProfile
): chrome.declarativeNetRequest.Rule {
  return {
    id: SEB_HEADER_DYNAMIC_RULE_ID,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      requestHeaders: [
        {
          header: "X-SafeExamBrowser-ConfigKeyHash",
          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
          value: profile.configKeyHash,
        },
      ],
    },
    condition: {
      regexFilter: `^${escapeRegex(profile.startUrl)}$`,
      resourceTypes: [
        chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
        chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
        chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
      ],
    },
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
