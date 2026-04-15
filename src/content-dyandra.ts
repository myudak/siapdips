import { initDyandraHelper } from "./lib/content_dyandra";

const STORAGE_KEY_DYANDRA_HELPER_ENABLED = "dyandraHelperEnabled";

async function bootstrapDyandraContent(): Promise<void> {
  const stored = await chrome.storage.local.get([STORAGE_KEY_DYANDRA_HELPER_ENABLED]);
  const storedValue = stored[STORAGE_KEY_DYANDRA_HELPER_ENABLED];
  const enabled =
    storedValue === undefined ? true : Boolean(storedValue);

  if (storedValue === undefined) {
    await chrome.storage.local.set({
      [STORAGE_KEY_DYANDRA_HELPER_ENABLED]: true,
    });
  }

  await initDyandraHelper(enabled);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void bootstrapDyandraContent();
  }, { once: true });
} else {
  void bootstrapDyandraContent();
}
