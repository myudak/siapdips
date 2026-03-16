export function resolveContentScriptPath(scriptHint: string): string | null {
  const manifest = chrome.runtime.getManifest();
  const allContentScriptPaths = manifest.content_scripts
    ?.flatMap((contentScript) => contentScript.js ?? [])
    .filter(Boolean);

  if (!allContentScriptPaths?.length) {
    return null;
  }

  const match = allContentScriptPaths.find((scriptPath) =>
    scriptPath.includes(scriptHint)
  );

  return match ?? null;
}

